/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroMinimalDarkWithimgParser from './parsers/hero-minimal-dark-withimg.js';
import cardsLightWithimgParser from './parsers/cards-light-withimg.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/myastrazeneca-cleanup.js';
import sectionsTransformer from './transformers/myastrazeneca-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'content-landing',
  description: 'General landing/overview layout: header, hero region and stacked content sections, footer.',
  urls: [
    'https://www.myastrazeneca.ch/en/startseite.html',
  ],
  blocks: [
    {
      name: 'hero-minimal-dark-withimg',
      instances: ['.teaser--home-hero'],
    },
    {
      name: 'cards-light-withimg',
      instances: ['.container--3-column-wrap'],
    },
  ],
  sections: [
    {
      id: '1', name: 'Hero banner', selector: ['.teaser--home-hero'], style: 'dark', blocks: ['hero-minimal-dark-withimg'], defaultContent: [],
    },
    {
      id: '2', name: 'Introduction text', selector: ['.container--fixed.aem-GridColumn:nth-of-type(4) .container--tb-space-md:nth-of-type(1)'], style: null, blocks: [], defaultContent: ['.text'],
    },
    {
      id: '3', name: 'Our therapy areas', selector: ['.container--3-column-wrap'], style: null, blocks: ['cards-light-withimg'], defaultContent: [],
    },
    {
      id: '4', name: 'Useful product information', selector: ['.container--fixed.container--tb-space-md'], style: null, blocks: [], defaultContent: ['.text', '.button'],
    },
  ],
};

// PARSER REGISTRY
const parsers = {
  'hero-minimal-dark-withimg': heroMinimalDarkWithimgParser,
  'cards-light-withimg': cardsLightWithimgParser,
};

// TRANSFORMER REGISTRY - cleanup runs first; section transformer after (adds breaks/metadata)
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook.
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration.
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. beforeTransform (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block (skip elements already replaced by an earlier parser)
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path (map root URL to /index to avoid the empty-path crash)
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
