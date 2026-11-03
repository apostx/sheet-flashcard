/**
 * Keeps the formatting a card uses (text styles, lists, links, images, tables) and drops
 * everything that could run code: scripts, styles, frames, forms, event handlers and
 * `javascript:` links. Used for decks received from other apps, which are stored in this
 * browser and shown again later, so their content must not be able to act on this site.
 */

const ALLOWED_TAGS = new Set([
  'A', 'ABBR', 'B', 'BLOCKQUOTE', 'BR', 'CODE', 'DEL', 'DIV', 'EM', 'H1', 'H2', 'H3', 'H4',
  'H5', 'H6', 'HR', 'I', 'IMG', 'INS', 'KBD', 'LI', 'MARK', 'OL', 'P', 'PRE', 'Q', 'S',
  'SMALL', 'SPAN', 'STRONG', 'SUB', 'SUP', 'TABLE', 'TBODY', 'TD', 'TFOOT', 'TH', 'THEAD',
  'TR', 'U', 'UL',
]);

/** Elements removed together with their content; any other unknown element keeps its text. */
const DROPPED_TAGS = new Set([
  'SCRIPT', 'STYLE', 'IFRAME', 'FRAME', 'FRAMESET', 'OBJECT', 'EMBED', 'APPLET', 'TEMPLATE',
  'NOSCRIPT', 'FORM', 'INPUT', 'BUTTON', 'SELECT', 'TEXTAREA', 'LINK', 'META', 'BASE', 'SVG',
  'MATH',
]);

const ALLOWED_ATTRIBUTES: Record<string, readonly string[]> = {
  A: ['href', 'title'],
  IMG: ['src', 'alt', 'title', 'width', 'height'],
  TD: ['colspan', 'rowspan'],
  TH: ['colspan', 'rowspan'],
};
const COMMON_ATTRIBUTES = ['title'];

const SAFE_LINK = /^(https?:|mailto:|#|\/)/i;
const SAFE_IMAGE = /^(https?:|data:image\/(png|gif|jpeg|webp);)/i;

export function sanitizeHtml(html: string): string {
  // Plain text needs no parsing, which keeps large decks fast.
  if (!/[<&]/.test(html)) return html;

  const document = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html');
  cleanChildren(document.body);
  return document.body.innerHTML;
}

function cleanChildren(parent: Element) {
  for (const node of Array.from(parent.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE) continue;
    if (node.nodeType !== Node.ELEMENT_NODE) {
      node.remove(); // comments and processing instructions
      continue;
    }
    const element = node as Element;
    const tag = element.tagName.toUpperCase();
    if (DROPPED_TAGS.has(tag)) {
      element.remove();
      continue;
    }
    cleanChildren(element);
    if (!ALLOWED_TAGS.has(tag)) {
      element.replaceWith(...Array.from(element.childNodes));
      continue;
    }
    cleanAttributes(element, tag);
  }
}

function cleanAttributes(element: Element, tag: string) {
  const allowed = [...COMMON_ATTRIBUTES, ...(ALLOWED_ATTRIBUTES[tag] ?? [])];
  for (const { name, value } of Array.from(element.attributes)) {
    const lower = name.toLowerCase();
    const keep =
      allowed.includes(lower) &&
      (lower !== 'href' || SAFE_LINK.test(value.trim())) &&
      (lower !== 'src' || SAFE_IMAGE.test(value.trim()));
    if (!keep) element.removeAttribute(name);
  }
  if (tag === 'A' && element.hasAttribute('href')) {
    element.setAttribute('target', '_blank');
    element.setAttribute('rel', 'noopener noreferrer');
  }
}
