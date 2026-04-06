import DOMPurify from 'dompurify';
import { marked } from 'marked';
import type { Config } from 'dompurify';

marked.setOptions({ gfm: true, breaks: true });

const SANITIZE: Config = {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'del', 'a', 'ul', 'ol', 'li', 'code', 'pre', 'blockquote'],
  ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
};

let linkHook = false;
function ensureLinkHook() {
  if (linkHook) return;
  linkHook = true;
  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName !== 'A') return;
    if (node.getAttribute('target') === '_blank') {
      node.setAttribute('rel', 'noopener noreferrer');
    }
  });
}

/** Renders Markdown + limited inline HTML to sanitized HTML (browser only). */
export function renderRichText(text: string): string {
  if (!text?.trim()) return '';
  ensureLinkHook();
  const raw = marked.parse(text, { async: false }) as string;
  return DOMPurify.sanitize(raw, SANITIZE);
}

/** Plain-text preview length for admin list rows (strips formatting). */
export function richTextPreviewPlain(text: string, maxLen: number): string {
  if (!text?.trim()) return '';
  const html = renderRichText(text);
  const div = document.createElement('div');
  div.innerHTML = html;
  const plain = (div.textContent || '').replace(/\s+/g, ' ').trim();
  if (plain.length <= maxLen) return plain;
  return plain.slice(0, maxLen).trimEnd() + '…';
}

const WRAP: Record<string, readonly [string, string]> = {
  bold: ['**', '**'],
  italic: ['*', '*'],
  underline: ['<u>', '</u>'],
  strike: ['~~', '~~'],
  code: ['`', '`'],
};

export function wrapSelection(textarea: HTMLTextAreaElement, before: string, after: string) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const v = textarea.value;
  const selected = v.slice(start, end);
  const replacement = before + selected + after;
  textarea.value = v.slice(0, start) + replacement + v.slice(end);
  const selStart = start + before.length;
  const selEnd = selStart + selected.length;
  textarea.setSelectionRange(selStart, selEnd);
  textarea.focus();
  textarea.dispatchEvent(new Event('input', { bubbles: true }));
}

/** Wire `[data-fmt]` buttons inside `toolbarEl` to wrap the textarea selection. */
export function attachRichTextToolbar(toolbarEl: HTMLElement, textarea: HTMLTextAreaElement) {
  toolbarEl.querySelectorAll<HTMLButtonElement>('[data-fmt]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const key = btn.dataset.fmt;
      const pair = key && WRAP[key];
      if (pair) wrapSelection(textarea, pair[0], pair[1]);
    });
  });
}
