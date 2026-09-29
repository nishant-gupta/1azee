# MyAstraZeneca.ch Martech Integrations and EDS Migration

**Scope:** Publicly observable Adobe Analytics, Tealium, and Digital Control Room (DCR) cookie-consent integration on `myastrazeneca.ch`, plus an implementation approach for this EDS project.

**Evidence note:** Findings below come from locale homepage HTML, linked DCR panel/policy assets, and the public Tealium production container inspected on 2026-09-29. The site returned locale homepages with HTTP 200 using a browser user agent; the root URL returned a CloudFront 403 to a plain request. This was static inspection: the consent UI was not clicked, browser storage was not reset, and analytics network requests were not validated in a live browser. Treat observed implementation details as evidence, but confirm production identifiers, legal behavior, tag mappings, and runtime firing with AstraZeneca's owners before shipping.

## Executive summary

The legacy page does not directly include an Adobe Analytics or Adobe Launch bootstrap. It defines a page data object, then loads AstraZeneca's Tealium Universal Tag (utag) container. Tealium contains Adobe Analytics (Adobe Experience Platform Web SDK-based sender) and Adobe Target integrations, plus other tags and event mappings.

Digital Control Room supplies the consent UI and preference storage. The live page loads a locale-specific DCR panel from `policy.cookiereports.com`; the DCR panel exposes consent state and dispatches `wscr.consent` events. The Tealium container uses these values to gate at least its Adobe Analytics sender and to re-send consent state to Tealium when the preference changes.

For EDS, preserve the *data contract, consent-before-tracking order, and required event semantics*, not the old AEM client library. Confirm the target consent policy and Tealium profile with the responsible teams before using production values.

## What the live pages load

The four public locale homepages examined use the same Tealium profile and environment:

| Locale | Tealium profile / environment | DCR panel | Linked DCR policy |
|---|---|---|---|
| German (`de`) | `ch-weseportal` / `prod` | `b50c8635_panel-de-ch.js` | `b50c8635-de-ch.html` |
| English (`en`) | `ch-weseportal` / `prod` | `b50c8635_panel-en-gb.js` | `b50c8635-en-gb.html` |
| French (`fr`) | `ch-weseportal` / `prod` | `b50c8635_panel-en-gb.js` | `b50c8635-fr-ch.html` |
| Italian (`it`) | `ch-weseportal` / `prod` | `b50c8635_panel-en-gb.js` | `b50c8635-it-ch.html` |

The French and Italian panel scripts use the English (UK) locale while the policy links are French and Italian. This could be intentional fallback behavior; confirm the intended banner language with the privacy/DCR owner.

Relevant markup and bootstrap observed on the German homepage (values simplified only where noted):

```html
<script src="//policy.cookiereports.com/b50c8635_panel-de-ch.js"
        type="text/javascript"></script>

<body
  data-tealium-profilename="ch-weseportal"
  data-tealium-env="prod"
  data-enable-delayed-tealium="false">
  <script>
    var utag_data = {
      "page_name": "Startseite",
      "page_section": "",
      "page_subsection": "",
      "page_path": "/content/intelligentcontent/portals/hcp/ch/de/startseite",
      "page_content_type": "public",
      "visitor_auth_status": "anonymous",
      "core_target_country": "ch",
      "core_language": "de",
      "page_brand": "",
      "visitor_azid": "",
      "page_therapy_area": "",
      "core_target_audience": "",
      "savings_card_number": "",
      "visitor_login_event": "",
      "visitor_register_event": "",
      "specialty": "",
      "page_uniqueid": "1453c106-8b95-4ebe-a2d1-3af155fd9d40"
    };
  </script>

  <script>
    (function () {
      var script = document.createElement('script');
      script.src = '//tags.tiqcdn.com/utag/astrazeneca/ch-weseportal/prod/utag.js';
      script.type = 'text/javascript';
      script.async = true;
      var firstScript = document.getElementsByTagName('script')[0];
      firstScript.parentNode.insertBefore(script, firstScript);
    }());
  </script>
</body>
```

The AEM client library also contains a delayed-loader variant. It reads the same body data attributes and, when `data-enable-delayed-tealium="true"`, waits `data-delayed-tealium-timeout` milliseconds (100 ms default) before loading the profile. The inspected homepages set delayed loading to `false` and instead use the inline asynchronous bootstrap.

## Tealium data and integrations

### Page data contract

The observed `utag_data` includes:

| Field | Observed purpose / example | EDS migration consideration |
|---|---|---|
| `page_name` | Human-readable page title, e.g. `Startseite` | Derive from approved page metadata; confirm naming rules and language handling. |
| `page_section`, `page_subsection` | Page taxonomy | Define a stable EDS mapping rather than assuming URL segments are the final taxonomy. |
| `page_path` | Internal AEM content path, e.g. `/content/intelligentcontent/portals/hcp/ch/de/startseite` | EDS has no equivalent AEM repository path. Agree on a replacement, such as canonical public path, and update downstream reports. |
| `page_content_type` | `public` on the homepage | Map from an explicit page-type metadata field. |
| `visitor_auth_status` | `anonymous` on the homepage | Populate only if authenticated states exist in the EDS experience and are approved. |
| `core_target_country`, `core_language` | `ch`, `de` on the German homepage | Derive from the locale/market route and normalize values per the analytics contract. |
| `page_brand`, `page_therapy_area`, `core_target_audience` | Blank on the inspected homepage | Populate from governed metadata only where relevant. |
| `visitor_azid`, `savings_card_number` | Blank on the inspected anonymous homepage | Do not recreate or send these identifiers without explicit identity, privacy, and security approval. |
| `visitor_login_event`, `visitor_register_event`, `specialty` | Blank on the inspected homepage | Populate only in relevant authenticated flows and only with approved values. |
| `page_uniqueid` | UUID-like page identifier | Determine whether reporting depends on it; define a stable EDS replacement or omit it. |
| `visitor_time`, `server_time` | Client/server time strings also present in source | Confirm whether these are used; prefer standard timestamps/analytics dimensions over locale-formatted strings. |

Suggested EDS initialization shape (illustrative contract only; use approved values and data mappings):

```js
function buildUtagData({
  title,
  section,
  subsection,
  pathname,
  locale,
  pageType,
  therapyArea = '',
  brand = '',
}) {
  const [language, country] = locale.toLowerCase().split('-');

  return {
    page_name: title,
    page_section: section,
    page_subsection: subsection,
    // New public URL convention; not the old AEM /content path.
    page_path: pathname,
    page_content_type: pageType,
    visitor_auth_status: 'anonymous',
    core_target_country: country,
    core_language: language,
    page_brand: brand,
    page_therapy_area: therapyArea,
    core_target_audience: '',
  };
}

window.utag_data = buildUtagData({
  title: document.title,
  section: 'therapy-areas',
  subsection: 'diabetes',
  pathname: window.location.pathname,
  locale: document.documentElement.lang || 'de-ch',
  pageType: 'public',
});
```

### Adobe Analytics through Tealium

The public Tealium container contains an Adobe sender configured with:

- Adobe organization ID: `F8AB34FA53CE7E830A490D44@AdobeOrg`
- Tracking server: `astrazenecaeurope.d3.sc.omtrdc.net`
- Adobe Analytics sender ID in this Tealium container: `11`
- Adobe Target-related sender ID: `20`

Sender `11` uses Adobe Experience Platform Web SDK internals (it calls `alloy`/Web SDK APIs via the Tealium adapter). This is not a standalone `s.t()` call, and no Adobe Launch script was seen in the homepage source. The sender has a Tealium extension that returns without sending unless level `3` consent is present in DCR's consent string or `utag_data.wscrConsentString`. It also sets `disableThirdPartyCalls` based on levels `3` and `4`. Confirm the exact semantics with the Tealium/Analytics owners before reproducing them: the container contains customized logic, and tag behavior must be validated from actual network requests.

Do not add a second direct Adobe Analytics implementation to EDS while this Tealium tag remains active. That would risk duplicate page views and inconsistent consent gating.

### Events observed in the Tealium bundle

The container and AEM client library emit `utag.link()` events to selected Tealium tag IDs:

| Interaction | Observed event fields (examples) |
|---|---|
| Internal navigation, breadcrumb, teaser, social share | `event_name: "special_interaction"`, `link_name`, `special_interaction_name`, `link_type` |
| Site search | `event_name: "site_search"`, `search_string`, `link_text: "Search|<term>"`, `search_trigger` |
| Accordion | `event_name: "special_interaction"`, `link_name: "Accordion|<heading>"` |
| Video milestones | `event_name: "video_played"`, `video_title`, `video_id`, `video_pos`, `video_length`; also `video_played_25`, `_50`, `_75`, `_100` |
| Form field / completion | `form_field_name`, `link_text`, and completion events such as `survey_event: "complete"` |
| Consent update | `consent_flag`, `wscrConsentString`, `consent_type`; sends a Tealium view when consent changes |

Example event shape extracted from the production bundle (use names approved by the Analytics owner):

```js
function trackSearch(term, trigger) {
  if (!window.utag || typeof window.utag.link !== 'function') return;

  window.utag.link({
    event_name: 'site_search',
    search_string: term,
    link_text: `Search|${term}`,
    search_trigger: trigger,
  }, null, [12]);
}

function trackAccordion(heading, expanded) {
  if (!window.utag || typeof window.utag.link !== 'function') return;

  window.utag.link({
    event_name: 'special_interaction',
    link_name: `Accordion|${heading}`,
    special_interaction_name: `Accordion|${heading}`,
    accordion_state: expanded ? 'open' : 'closed',
    link_type: 'internal link',
  }, null, [12]);
}
```

The tag IDs and payloads above are observations, not a recommendation to copy the full legacy implementation. Re-map them against the production Tealium profile and current EDS interactions, especially event delegation for EDS blocks and video players. Verify that a page view is sent once per navigation and that event data is not accidentally copied from user-entered form values.

## Digital Control Room consent

### Observed configuration

The DCR panel script is served from `policy.cookiereports.com` with storage key `b50c8635`. The German panel's public configuration identifies:

| Setting | Observed value |
|---|---|
| Consent cookie | `wscrCookieConsent` |
| Cookie persistence | Cookie (not local storage), `SameSite=Lax`, default cookie domain |
| Configured cookie lifetime | 30 days |
| Banner behavior | `autoShow: "banner-nopref"` |
| Consent required | `userConsent: true` |
| Consent logging | `logConsent: true` |
| Google Consent Mode/dataLayer | Enabled in DCR configuration |
| DCR policy version observed | `20260923-001` |
| DCR storage key | `b50c8635` |

The linked policy says the `wscrCookieConsent` cookie expires in one year, while the panel configuration specifies 30 days. This mismatch must be resolved with the privacy/DCR owner; do not choose one value during migration by assumption.

The five consent levels configured by DCR are:

| Level | German UI label | Default | User-toggleable |
|---|---|---:|---:|
| `1` | Notwendig (necessary) | `true` | No |
| `2` | Site-Routine (site routine) | `false` | Yes |
| `3` | Leistung und Betrieb (performance and operations) | `false` | Yes |
| `4` | Marketing, anonymes Cross-Site-Tracking | `false` | Yes |
| `5` | Marketing, gezielte Werbung (targeted advertising) | `false` | Yes |

The policy page lists 12 necessary cookies, 0 site-routine cookies, 35 performance/operations cookies, and 3 marketing/cross-site cookies. Its performance list includes Adobe Analytics cookies and other products, so level `3` must not be interpreted as “Adobe Analytics only.”

### Consent hand-off behavior observed

DCR exposes `window._cookiereports.loadConsent()` and emits `wscr.consent` events. The Tealium container listens to the event, updates `utag_data` with the consent string, and can call `utag.view(utag_data)` after consent changes. The container separately checks the consent string before its Adobe Analytics tag sends.

Conceptual sequence:

```text
DCR panel loads
    ↓
Consent defaults/preferences are read and banner is shown as needed
    ↓
Tealium container loads with page data
    ↓
Tealium evaluates each tag's consent conditions
    ↓
User changes preferences → DCR emits wscr.consent
    ↓
Tealium updates consent fields and re-evaluates eligible tags
```

Illustrative event wiring for integration exploration only:

```js
document.addEventListener('wscr.consent', (event) => {
  const { consent_string: consentString, reason, trigger } = event.detail || {};
  if (!window.utag || !window.utag_data || !consentString) return;

  window.utag_data.wscrConsentString = consentString;
  window.utag_data.consent_type = trigger === 'auto' ? 'implied' : 'explicit';
  window.utag_data.consent_flag = true;

  // Confirm with Tealium that this is the correct re-evaluation call for the
  // target container; preserve the consent conditions configured per tag.
  window.utag.view(window.utag_data);
  window.utag_data.consent_flag = false;
});
```

Use the vendor-supported integration path and target container logic rather than copying this listener blindly. The observed production container also handles initial/implied consent differently from explicit preference changes, and has additional DCR checks around Adobe third-party calls.

### Policy links

The legacy footer has:

```html
<a href="//policy.cookiereports.com/b50c8635-de-ch.html"
   class="CookieReportsLink">Cookie Regelung</a>
```

DCR's `onPageButtonSelector` includes links to `policy.cookiereports.com` and `.CookieReportsLink`, allowing the link to open the consent preferences panel instead of simply navigating away. Keep the correct localized policy target and interaction when recreating the EDS footer.

## Recommended EDS implementation

### 1. Confirm the deployment contract

Before production code is wired, confirm with the Analytics/Tealium and privacy/DCR owners:

- Whether the EDS host should use `astrazeneca/ch-weseportal/prod` or receive a separate profile and non-production environment for preview/stage.
- Whether the DCR storage key, policy/version, consent categories, cookie lifetime, domain, banner language, and locale-to-panel mapping are still correct.
- Whether existing Adobe Analytics and Adobe Target destinations remain required, and which DCR levels each tag requires.
- Which old AEM data fields and event mappings are consumed in reporting; specifically decide replacements for the AEM `page_path` and `page_uniqueid`.
- How authentication, AZID, specialty, forms, and user-specific dimensions are handled. Do not migrate identifiers or form values without privacy/security approval.

### 2. Establish script order in EDS

Consent initialization must not race with Tealium. Load the approved DCR asset early and ensure its configuration is available before the Tealium bootstrap. Do not put consent-dependent analytics only in `delayed.js`, which EDS loads after the initial page experience. Conversely, do not load Tealium first and hope the DCR panel catches up.

A safe implementation shape is:

1. Select the correct DCR panel by normalized locale.
2. Load and initialize DCR.
3. Build `window.utag_data`.
4. Load the environment-appropriate Tealium profile once.
5. Allow the Tealium container's consent rules to decide which tags may send.
6. Forward consent changes using the owner-approved adapter.

Example loader skeleton (values deliberately supplied via configuration; this is not ready for production):

```js
const martechConfig = {
  tealium: {
    account: 'astrazeneca',
    profile: 'ch-weseportal',
    environment: 'dev', // select by deployment host; never hard-code prod for previews
  },
  dcrPanels: {
    'de-ch': 'b50c8635_panel-de-ch.js',
    'en-gb': 'b50c8635_panel-en-gb.js',
    // Confirm DCR/privacy-owner intent for fr-ch and it-ch panel languages.
    'fr-ch': 'b50c8635_panel-en-gb.js',
    'it-ch': 'b50c8635_panel-en-gb.js',
  },
};

function loadClassicScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Unable to load ${src}`));
    document.head.append(script);
  });
}

function normalizeLocale(locale) {
  return (locale || 'de-ch').toLowerCase().replace('_', '-');
}

async function initializeMartech(pageData) {
  const locale = normalizeLocale(document.documentElement.lang);
  const panel = martechConfig.dcrPanels[locale];
  if (!panel) throw new Error(`No DCR panel configured for locale ${locale}`);

  await loadClassicScript(`https://policy.cookiereports.com/${panel}`);
  window.utag_data = buildUtagData(pageData);

  const { account, profile, environment } = martechConfig.tealium;
  await loadClassicScript(
    `https://tags.tiqcdn.com/utag/${account}/${profile}/${environment}/utag.js`,
  );

  // Attach the owner-approved wscr.consent integration and guard against
  // duplicate initialization on soft navigation.
}
```

This skeleton does not itself define Tealium's consent manager behavior; the Tealium profile is authoritative for which tags load and send. Confirm that the DCR bundle exposes its consent API by the script `load` event in the target deployment. If not, wait for the DCR `wscr.init` event using an event listener registered before the panel script loads. Do not infer permission from a missing cookie or from a default value.

### 3. Implement one shared EDS module

Keep the vendor-specific work isolated, for example:

```text
scripts/
  martech.js       # locale config, DCR initialization, data layer, Tealium loader
  delayed.js       # only non-consent-sensitive work; not the consent gate
```

Import/invoke the martech module from the EDS eager page lifecycle at a deliberate point after reading metadata but before any event tracking can run. Add guards for missing consent configuration and script-load failures; never report a successful analytics initialization if loading failed. Avoid multiple loader insertions during block decoration or any client-side navigation.

### 4. Track EDS interactions, not legacy AEM selectors

Use EDS block names and semantic elements (links, buttons, forms) rather than selectors tied to `cmp-*` AEM markup. At minimum, agree whether the migration should preserve:

- Page views and page taxonomy.
- Navigation and outbound-link events.
- Search submissions and result interactions.
- Accordion open/close.
- Form start, field interaction, validation, and completion (without raw field values).
- Video start and progress milestones.
- Consent choice/update events.

### 5. Verify before enabling production

Use a clean browser profile and test every locale and preference transition:

1. First visit with no DCR preference.
2. Reject optional categories.
3. Accept only performance/operations (`3`).
4. Accept performance plus anonymous cross-site tracking (`3` and `4`).
5. Accept targeted advertising (`5`) and separately verify any tag tied to that category.
6. Reopen preferences, revoke consent, and reload.
7. Test existing preference cookie and expired/old-policy-version states.
8. Test preview/stage hosts to ensure they do not send to production analytics.

For every case, inspect browser network requests, cookies, and Tealium debug output. Verify that no disallowed tag fires, allowed tags fire after the correct transition, page views are not duplicated, and preference updates propagate to Adobe Analytics/Target consistently with the approved policy.

## Key migration risks

- **Consent race:** Tealium or another tag loads before DCR has initialized, causing tags to fire without the intended preference state.
- **Consent category mismatch:** the live Adobe sender depends on level `3`, while third-party calls depend on levels `3` and `4`; this must be confirmed against current policy and all active tags.
- **Duplicate analytics:** combining the Tealium Adobe sender with a new direct Adobe/Launch implementation.
- **Lost dimensions:** EDS has no old AEM internal content path or inherent page UUID.
- **PII/identity leakage:** authenticated fields and form interactions from the old implementation may include sensitive data if copied without review.
- **Locale/policy mismatch:** French and Italian panel assets currently appear to use English while the policy pages are locale-specific.
- **Consent retention inconsistency:** 30 days in panel config versus one year on the linked cookie-policy page.
- **Production traffic from previews:** the legacy pages identify Tealium as production; EDS preview and branch deployments need explicit environment routing.

## Sources

- [German homepage](https://www.myastrazeneca.ch/de/startseite.html)
- [English homepage](https://www.myastrazeneca.ch/en/startseite.html)
- [French homepage](https://www.myastrazeneca.ch/fr/startseite.html)
- [Italian homepage](https://www.myastrazeneca.ch/it/startseite.html)
- [Tealium production container](https://tags.tiqcdn.com/utag/astrazeneca/ch-weseportal/prod/utag.js)
- [DCR German panel](https://policy.cookiereports.com/b50c8635_panel-de-ch.js)
- [DCR English panel](https://policy.cookiereports.com/b50c8635_panel-en-gb.js)
- [DCR German policy page](https://policy.cookiereports.com/b50c8635-de-ch.html)
- [DCR English policy page](https://policy.cookiereports.com/b50c8635-en-gb.html)
