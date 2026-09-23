/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-content-landing.js
  var import_content_landing_exports = {};
  __export(import_content_landing_exports, {
    default: () => import_content_landing_default
  });

  // tools/importer/parsers/hero-minimal-dark-withimg.js
  function parse(element, { document: document2 }) {
    const bgImage = element.querySelector(".cmp-teaser__image-desktop img") || element.querySelector(".cmp-teaser__image img") || element.querySelector('img[class*="background"], img[class*="hero-bg"]') || element.querySelector("img");
    const title = element.querySelector('.cmp-teaser__title, h1, h2, [class*="title"]');
    const description = element.querySelector('.cmp-teaser__description, p.hero-description, [class*="description"], [class*="subtitle"]');
    const ctaLinks = Array.from(element.querySelectorAll(".cmp-teaser__action-link, a.cta, a.button, .cmp-teaser__content a"));
    if (!title && !description && !bgImage) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (bgImage) cells.push([bgImage]);
    const contentCell = [];
    if (title) contentCell.push(title);
    if (description) contentCell.push(description);
    contentCell.push(...ctaLinks);
    if (contentCell.length) cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-minimal-dark-withimg", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-light-withimg.js
  function parse2(element, { document: document2 }) {
    const cardEls = Array.from(element.querySelectorAll(":scope > .cmp-container > .teaser, :scope .teaser")).filter((el, _i, arr) => !arr.some((other) => other !== el && other.contains(el)));
    const cells = [];
    cardEls.forEach((card) => {
      const image = card.querySelector(".cmp-teaser__image-desktop img") || card.querySelector(".cmp-teaser__image img") || card.querySelector("img");
      const contentCell = [];
      const title = card.querySelector('.cmp-teaser__title, h1, h2, h3, h4, h5, h6, [class*="title"]');
      if (title) contentCell.push(title);
      const description = card.querySelector('.cmp-teaser__description, [class*="description"]');
      if (description) {
        contentCell.push(description);
      } else {
        const contentWrap = card.querySelector(".cmp-teaser__content") || card;
        Array.from(contentWrap.querySelectorAll(":scope > p, :scope > a")).forEach((n) => contentCell.push(n));
      }
      if (image || contentCell.length) {
        cells.push([image || "", contentCell.length ? contentCell : ""]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-light-withimg", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/myastrazeneca-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#CookieReportsPanel",
        // cookie consent banner/preferences modal (cleaned.html L966)
        ".megamenu-overlay"
        // mobile hamburger menu overlay (cleaned.html L565)
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".languagenavigation",
        // DE/EN/FR/IT switcher (L8)
        ".experiencefragment.cmp-experiencefragment--customMenu",
        // header: logo, megamenu, login (L30)
        ".searchbox",
        // site search (L596)
        ".breadcrumb",
        // breadcrumb nav (L635)
        ".experiencefragment.cmp-experiencefragment--footerSocial",
        // footer + social + footer links (L905)
        "link",
        // AEM clientlib <link> tags scattered inline
        "noscript",
        "input"
        // stray shell inputs (e.g. L3)
      ]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("data-cmp-data-layer");
        el.removeAttribute("data-cmp-hook-image");
        el.removeAttribute("data-cmp-hook-teaser");
        el.removeAttribute("data-asset-id");
        el.removeAttribute("onclick");
      });
      element.querySelectorAll("a.cmp-teaser__action-link, a.cmp-button__link").forEach((a) => {
        if (a.closest("strong, em")) return;
        const strong = element.ownerDocument.createElement("strong");
        a.replaceWith(strong);
        strong.appendChild(a);
      });
    }
  }

  // tools/importer/transformers/myastrazeneca-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function querySection(root, selectors) {
    for (const sel of selectors) {
      const el = root.querySelector(sel);
      if (el) return el;
    }
    return null;
  }
  function transform2(hookName, element, payload) {
    const sections = payload.template && payload.template.sections || [];
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = querySection(element, section.selector);
        if (!sectionEl) continue;
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || querySection(element, section.selector);
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/import-content-landing.js
  var PAGE_TEMPLATE = {
    name: "content-landing",
    description: "General landing/overview layout: header, hero region and stacked content sections, footer.",
    urls: [
      "https://www.myastrazeneca.ch/en/startseite.html"
    ],
    blocks: [
      {
        name: "hero-minimal-dark-withimg",
        instances: [".teaser--home-hero"]
      },
      {
        name: "cards-light-withimg",
        instances: [".container--3-column-wrap"]
      }
    ],
    sections: [
      {
        id: "1",
        name: "Hero banner",
        selector: [".teaser--home-hero"],
        style: "dark",
        blocks: ["hero-minimal-dark-withimg"],
        defaultContent: []
      },
      {
        id: "2",
        name: "Introduction text",
        selector: [".container--fixed.aem-GridColumn:nth-of-type(4) .container--tb-space-md:nth-of-type(1)"],
        style: null,
        blocks: [],
        defaultContent: [".text"]
      },
      {
        id: "3",
        name: "Our therapy areas",
        selector: [".container--3-column-wrap"],
        style: null,
        blocks: ["cards-light-withimg"],
        defaultContent: []
      },
      {
        id: "4",
        name: "Useful product information",
        selector: [".container--fixed.container--tb-space-md"],
        style: null,
        blocks: [],
        defaultContent: [".text", ".button"]
      }
    ]
  };
  var parsers = {
    "hero-minimal-dark-withimg": parse,
    "cards-light-withimg": parse2
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_content_landing_default = {
    transform: (payload) => {
      const {
        document: document2,
        url,
        html,
        params
      } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_content_landing_exports);
})();
