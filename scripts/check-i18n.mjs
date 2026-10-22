import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import instance from '../src/i18n/instance.ts';
import { catalogText, completeTranslations } from '../src/i18n/catalog.ts';
import { formatDate, currentLocale } from '../src/i18n/formatters.ts';
import { formatMoney } from '../src/Modules/Explore/utils/money.ts';
import { message, resolveMessage, LocalizedError, LocalizedHttpError } from '../src/i18n/messages.ts';
import ts from 'typescript';
import { asLanguage, detectLanguage, LANGUAGE_STORAGE_KEY } from '../src/i18n/languages.ts';

const root = path.resolve(import.meta.dirname, '..');
const languages = ['es', 'en', 'fr', 'pt'];
const namespaces = readdirSync(path.join(root, 'src/i18n/locales/es')).map(file => file.replace('.json', ''));
const resources = {};
const audit = JSON.parse(execFileSync(process.execPath, [path.join(root, 'scripts/audit-i18n.mjs')], { encoding: 'utf8' }));
assert.equal(audit.count, 0, `Untranslated UI candidates:\n${JSON.stringify(audit.candidates, null, 2)}`);
const tokens = value => [...value.matchAll(/{{\s*([^}]+)\s*}}|<\/?([a-z]+)>/g)].map(match => match[0]).sort();
for (const language of languages) {
  resources[language] = {};
  for (const ns of namespaces) {
    const dictionary = JSON.parse(readFileSync(path.join(root, `src/i18n/locales/${language}/${ns}.json`), 'utf8'));
    resources[language][ns] = dictionary;
    const original = resources.es[ns];
    assert.deepEqual(Object.keys(dictionary).sort(), Object.keys(original).sort(), `${language}/${ns}: keys differ`);
    for (const [key, value] of Object.entries(dictionary)) {
      assert.equal(typeof value, 'string');
      assert.ok(value.trim(), `${language}/${ns}:${key}: empty translation`);
      assert.deepEqual(tokens(value), tokens(original[key]), `${language}/${ns}:${key}: placeholders/tags differ`);
    }
  }
}

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const name = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(name) : /\.tsx?$/.test(name) ? [name] : [];
  });
}
let references = 0;
for (const filename of walk(path.join(root, 'src'))) {
  const source = ts.createSourceFile(filename, readFileSync(filename, 'utf8'), ts.ScriptTarget.Latest, true);
  function visit(node) {
    if (ts.isStringLiteral(node) && namespaces.some(ns => node.text.startsWith(ns + ':') && node.text.length > ns.length + 1)) {
      const [ns, key] = node.text.split(':');
      assert.ok(resources.es[ns]?.[key] || resources.es[ns]?.[`${key}_other`], `${filename}: unknown key ${node.text}`);
      references++;
      if ((ts.isCallExpression(node.parent) || ts.isNewExpression(node.parent)) && node.parent.arguments?.[0] === node && ['t', 'i18n.t', 'message', 'LocalizedError'].includes(node.parent.expression.getText(source))) {
        const original = resources.es[ns][key] ?? resources.es[ns][`${key}_other`];
        const required = [...original.matchAll(/{{\s*([^}]+?)\s*}}/g)].map(match => match[1]);
        const options = node.parent.arguments[1];
        if (required.length && (!options || ts.isObjectLiteralExpression(options))) {
          const supplied = options ? options.properties.map(prop => prop.name?.getText(source).replace(/["']/g, '')) : [];
          for (const name of required) assert.ok(supplied.includes(name), `${filename}:${source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1}: missing ${name} in ${node.text}`);
        }
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
}

await instance.init({ resources, lng: 'es', fallbackLng: 'es', defaultNS: 'common', keySeparator: false, interpolation: { escapeValue: false } });
const cachedError = new LocalizedError('errors:network');
const cachedMessage = message('catalog:created', { name: 'Example <&>' });
const httpError = new LocalizedHttpError(404, { code: 'API_PROPIEDAD_NO_DISPONIBLE' });
for (const language of languages) {
  await instance.changeLanguage(language);
  assert.equal(instance.t('settings:title'), resources[language].settings.title);
  assert.equal(cachedError.message, resources[language].errors.network);
  assert.equal(httpError.message, resources[language].api.API_PROPIEDAD_NO_DISPONIBLE);
  assert.ok(resolveMessage(cachedMessage).includes('Example <&>'));
  assert.equal(catalogText({ name: 'Renamed source', catalogCode: 'service_hot_water' }), resources[language].catalog.service_hot_water);
  assert.equal(catalogText({ name: 'Custom', translations: { [language]: { name: 'Custom override' } } }), 'Custom override');
  assert.equal(formatDate('2004-10-04', { day: '2-digit' }), '04');
  assert.equal(formatDate('invalid'), '—');
  const amount = formatMoney('999999999999999.99', 'USD');
  const expected = new Intl.NumberFormat(currentLocale(), { style: 'currency', currency: 'USD', currencyDisplay: 'code' }).formatToParts(999999999999999n).map(part => part.type === 'fraction' ? '99' : part.value).join('');
  assert.equal(amount, expected);
  assert.ok(instance.t('navigation:accountMenu', { name: 'José <&>' }).includes('José <&>'));
  for (const count of [0, 1, 2, 1000000]) {
    const value = instance.t('navigation:accountMenuUnread', { name: 'José', count });
    assert.ok(value.includes(String(count)) && value.includes('José'));
    assert.ok(!value.includes('{{') && !value.includes('accountMenuUnread'));
  }
  instance.addResource('es', 'common', 'fallbackProbe', 'respaldo');
  assert.equal(instance.t('fallbackProbe'), 'respaldo');
}
assert.equal(completeTranslations({ en: { name: 'A' }, fr: { name: 'B' }, pt: { name: 'C' } }, ''), true);
assert.equal(completeTranslations({ en: { name: 'A' } }, ''), false);
for (const language of languages) {
  const mail = JSON.parse(readFileSync(path.join(root, `../safeRent-backend/src/mail/locales/${language}.json`), 'utf8'));
  const source = JSON.parse(readFileSync(path.join(root, '../safeRent-backend/src/mail/locales/es.json'), 'utf8'));
  assert.deepEqual(Object.keys(mail).sort(), Object.keys(source).sort());
  for (const key of Object.keys(source)) assert.deepEqual(tokens(mail[key]), tokens(source[key]));
}
assert.equal(asLanguage('pt-BR'), 'pt');
assert.equal(asLanguage('fr-CA'), 'fr');
assert.equal(asLanguage('de'), undefined);
Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { languages: ['de-DE', 'fr-CA'] } });
Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { getItem: key => key === LANGUAGE_STORAGE_KEY ? 'pt' : null } });
assert.equal(detectLanguage(), 'pt');
globalThis.localStorage.getItem = () => null;
assert.equal(detectLanguage(), 'fr');
globalThis.localStorage.getItem = () => { throw new Error('Storage blocked'); };
assert.equal(detectLanguage(), 'fr');
globalThis.navigator.languages = ['de'];
assert.equal(detectLanguage(), 'es');
console.log(`i18n: ${namespaces.length} namespaces, ${Object.values(resources.es).reduce((sum, dict) => sum + Object.keys(dict).length, 0)} keys × 4 languages; ${references} source references checked. Interpolation, plurals, fallback and detection passed.`);
