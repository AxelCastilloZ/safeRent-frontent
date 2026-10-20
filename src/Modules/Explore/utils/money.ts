/** Format decimal strings without converting monetary values to Number. */
export function formatMoney(amount: string | number, currency: string) {
  try {
    const formatter = new Intl.NumberFormat('es-CR', { style: 'currency', currency, currencyDisplay: 'code' })
    const digits = formatter.resolvedOptions().maximumFractionDigits ?? 2
    const match = /^(\d+)(?:\.(\d+))?$/.exec(String(amount))
    if (!match) return `${currency} ${amount}`
    const fraction = match[2] ?? ''
    const factor = 10n ** BigInt(digits)
    let scaled = BigInt(match[1]) * factor + BigInt(fraction.padEnd(digits, '0').slice(0, digits) || '0')
    if (Number(fraction[digits] ?? '0') >= 5) scaled += 1n
    const decimals = (scaled % factor).toString().padStart(digits, '0')
    return formatter.formatToParts(scaled / factor).map(part => part.type === 'fraction' ? decimals : part.value).join('')
  } catch {
    return `${currency} ${amount}`
  }
}
