/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: myAstraZeneca (AEM Sites / responsivegrid + cmp-container) site-wide cleanup.
 * All selectors verified against migration-work/cleaned.html.
 *
 * beforeTransform: cookie consent banner/modal + mobile menu overlay (block matching).
 * afterTransform : non-authorable global chrome (language nav, header/megamenu/login,
 *                  search box, breadcrumb, footer) + leftover clientlib links/attributes.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    WebImporter.DOMUtils.remove(element, [
      '#CookieReportsPanel',   // cookie consent banner/preferences modal (cleaned.html L966)
      '.megamenu-overlay',     // mobile hamburger menu overlay (cleaned.html L565)
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    WebImporter.DOMUtils.remove(element, [
      '.languagenavigation',                             // DE/EN/FR/IT switcher (L8)
      '.experiencefragment.cmp-experiencefragment--customMenu', // header: logo, megamenu, login (L30)
      '.searchbox',                                      // site search (L596)
      '.breadcrumb',                                     // breadcrumb nav (L635)
      '.experiencefragment.cmp-experiencefragment--footerSocial', // footer + social + footer links (L905)
      'link',                                            // AEM clientlib <link> tags scattered inline
      'noscript',
      'input',                                           // stray shell inputs (e.g. L3)
    ]);

    // Strip AEM authoring/tracking attributes left on remaining authorable nodes.
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-cmp-data-layer');
      el.removeAttribute('data-cmp-hook-image');
      el.removeAttribute('data-cmp-hook-teaser');
      el.removeAttribute('data-asset-id');
      el.removeAttribute('onclick');
    });
  }
}
