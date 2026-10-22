// Candidate inventory, not a claim of exhaustive coverage: dynamic text and API data require review.
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
const root = path.resolve(import.meta.dirname, '../src');
const candidates = [];
function scan(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) { if (entry.name !== 'i18n') scan(filename); continue; }
    if (!/\.tsx?$/.test(filename)) continue;
    const source = ts.createSourceFile(filename, readFileSync(filename, 'utf8'), ts.ScriptTarget.Latest, true);
    function visit(node) {
      if (ts.isTypeNode(node) || ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) return;
      const jsxText = ts.isJsxText(node) && /[\p{L}]/u.test(node.text) && node.text.trim() !== 'SafeRent';
      const attribute = ts.isStringLiteral(node) && ts.isJsxAttribute(node.parent) && ['title', 'description', 'label', 'aria-label', 'placeholder', 'hint', 'alt'].includes(node.parent.name.getText(source));
      const literal = ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isTemplateExpression(node);
      let text = ts.isTemplateExpression(node) ? node.head.text + node.templateSpans.map(span => span.literal.text).join('') : node.text;
      let owner = node.parent;
      let insideExpression = false;
      let ignored = false;
      while (owner && !ts.isFunctionLike(owner)) {
        if (ts.isJsxExpression(owner)) insideExpression = true;
        if (ts.isJsxAttribute(owner) && !['title', 'description', 'label', 'aria-label', 'placeholder', 'hint', 'alt'].includes(owner.name.getText(source))) ignored = true;
        if (ts.isPropertyAssignment(owner) && ['category', 'keywords'].includes(owner.name.getText(source))) ignored = true;
        owner = owner.parent;
      }
      const property = node.parent && ts.isPropertyAssignment(node.parent) && node.parent.initializer === node && ['title', 'description', 'label', 'hint', 'message', 'question', 'answer', 'paragraphs'].includes(node.parent.name.getText(source));
      const technical = /^(?:[a-z]+:|Bearer|SafeRent$|Authorization$|Escape$|Enter$|Arrow\w+$|Tab$|Home$|End$|\/|#|\.|<|&|[A-Z_]+$)|(?:\b(?:rounded|flex|grid|text|bg|border|hover|focus|items|justify|gap|space|ring|opacity|shadow|overflow|transition|duration|min|max|sm|md|lg|xl)[-:\[])/;
      const prose = literal && typeof text === 'string' && /[\p{L}]/u.test(text) && !technical.test(text) && (/\s/.test(text.trim()) || /[áéíóúñ¿¡…]/i.test(text) || /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+$/.test(text));
      const expression = !ignored && prose && (insideExpression || property);
      if (jsxText || attribute || expression) {
        text = text.trim().replace(/\s+/g, ' ');
        if (/[\p{L}]/u.test(text) && text !== 'SafeRent') candidates.push({ file: path.relative(root, filename).replaceAll('\\', '/'), line: source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1, text });
      }
      ts.forEachChild(node, visit);
    }
    visit(source);
  }
}
scan(root);
console.log(JSON.stringify({ note: 'AST candidates: JSX, visible attributes, UI configuration and expressions. Stable category IDs, search aliases, brands, symbols and technical values are excluded. API/catalog/email contracts require separate checks.', count: candidates.length, candidates }, null, 2));
