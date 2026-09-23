// media query match that indicates desktop width
const isDesktop = window.matchMedia('(min-width: 900px)');

/**
 * Close any open desktop dropdowns.
 */
function closeAllDropdowns(navSections) {
  navSections.querySelectorAll('.nav-drop[aria-expanded="true"]').forEach((d) => {
    d.setAttribute('aria-expanded', 'false');
  });
}

function closeOnEscape(e) {
  if (e.code !== 'Escape') return;
  const nav = document.getElementById('nav');
  const navSections = nav.querySelector('.nav-sections');
  if (navSections) closeAllDropdowns(navSections);
  if (!isDesktop.matches && nav.getAttribute('aria-expanded') === 'true') {
    // eslint-disable-next-line no-use-before-define
    toggleMenu(nav, navSections, false);
  }
}

/**
 * Toggles the whole mobile nav drawer.
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null
    ? !forceExpanded
    : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  if (button) button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  if (!expanded || isDesktop.matches) {
    window.addEventListener('keydown', closeOnEscape);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
  }
}

/**
 * Wire dropdown toggling on each nav item that has a sub-list.
 */
function decorateDropdowns(navSections) {
  navSections.querySelectorAll(':scope > ul > li').forEach((navSection) => {
    if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
    navSection.setAttribute('aria-expanded', 'false');

    // The top-level label: toggle on the label only, so nested links stay clickable.
    const label = navSection.querySelector(':scope > a');
    if (label) {
      label.addEventListener('click', (e) => {
        // Only intercept when the label is a non-navigating toggle (href="#").
        if (label.getAttribute('href') === '#') {
          e.preventDefault();
          const open = navSection.getAttribute('aria-expanded') === 'true';
          if (isDesktop.matches) closeAllDropdowns(navSections);
          navSection.setAttribute('aria-expanded', open ? 'false' : 'true');
        }
      });
    }

    // Nested category toggles (mobile accordion / desktop fly-out columns).
    navSection.querySelectorAll('li').forEach((li) => {
      const childList = li.querySelector(':scope > ul');
      const childLabel = li.querySelector(':scope > a');
      if (childList && childLabel && childLabel.getAttribute('href') === '#') {
        li.classList.add('nav-subdrop');
        li.setAttribute('aria-expanded', 'false');
        childLabel.addEventListener('click', (e) => {
          e.preventDefault();
          const open = li.getAttribute('aria-expanded') === 'true';
          li.setAttribute('aria-expanded', open ? 'false' : 'true');
        });
      }
    });
  });

  // Close desktop dropdowns on outside click.
  document.addEventListener('click', (e) => {
    if (isDesktop.matches && !navSections.contains(e.target)) closeAllDropdowns(navSections);
  });
}

/**
 * Build the search control (form is created in JS, not the fragment).
 */
function buildSearch() {
  const search = document.createElement('div');
  search.className = 'nav-search';
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'nav-search-toggle';
  toggle.setAttribute('aria-label', 'Search');
  toggle.setAttribute('aria-expanded', 'false');
  const form = document.createElement('form');
  form.className = 'nav-search-form';
  form.setAttribute('role', 'search');
  form.action = '/en/startseite/search.html';
  const input = document.createElement('input');
  input.type = 'search';
  input.name = 'q';
  input.placeholder = 'Enter Search Term';
  input.setAttribute('aria-label', 'Enter Search Term');
  form.append(input);
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', open ? 'false' : 'true');
    search.classList.toggle('nav-search-open', !open);
    if (!open) input.focus();
  });
  search.append(toggle, form);
  return search;
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // metadata-independent dual-fetch: /content first (localhost), then root (DA/EDS prod)
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) resp = await fetch('/nav.plain.html');
  if (!resp.ok) return;
  const html = await resp.text();
  const fragment = document.createElement('div');
  fragment.innerHTML = html;

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) decorateDropdowns(navSections);

  // Build the search control and place it in the tools area.
  const navTools = nav.querySelector('.nav-tools');
  if (navTools) {
    const loginWrapper = navTools.querySelector('p');
    if (loginWrapper) loginWrapper.classList.add('nav-login');
    navTools.prepend(buildSearch());
  }

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');

  // reset to a clean state per breakpoint
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => {
    // close mobile menu + dropdowns when crossing the breakpoint
    toggleMenu(nav, navSections, isDesktop.matches);
    if (navSections) closeAllDropdowns(navSections);
  });

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
