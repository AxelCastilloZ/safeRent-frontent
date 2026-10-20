import assert from 'node:assert/strict'
import { formatMoney } from '../src/Modules/Explore/utils/money.ts'

for (const [amount, currency, expected] of [
  ['999999999999999.99', 'USD', '999999999999999,99'],
  ['1.005', 'USD', '1,01'],
  ['0.1', 'USD', '0,10'],
  ['150.75', 'JPY', '151'],
  ['0.50', 'JPY', '1'],
  ['3.070', 'KWD', '3,070'],
  ['250000', 'CRC', '250000,00'],
]) {
  const formatted = formatMoney(amount, currency)
  assert.ok(formatted.includes(currency))
  assert.equal(formatted.replace(/[^\d,.-]/g, ''), expected)
}
console.log('7 comprobaciones de formato: importes grandes exactos, redondeo y decimales por moneda: correcto.')
