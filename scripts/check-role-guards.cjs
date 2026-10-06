const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const ts = require('typescript')
let token = 'test-token'
const cache = new Map()

function load(file) {
  const absolute = path.resolve(__dirname, '..', file)
  if (cache.has(absolute)) return cache.get(absolute)
  const result = { exports: {} }
  const source = ts.transpileModule(fs.readFileSync(absolute, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText
  const requireModule = (name) => {
    if (name === '@tanstack/react-router') return { redirect: (options) => ({ options }) }
    if (name.endsWith('/hooks/authQueries')) return { authUserQueryOptions: (value) => ({ queryKey: ['auth', value] }) }
    if (name.endsWith('/utils/sessionToken')) return { getStoredToken: () => token }
    if (name === 'lucide-react') return {}
    return load(path.relative(path.resolve(__dirname, '..'), path.resolve(path.dirname(absolute), name + '.ts')))
  }
  vm.runInNewContext(source, { require: requireModule, module: result, exports: result.exports })
  cache.set(absolute, result.exports)
  return result.exports
}

async function main() {
  const guards = load('src/Modules/Auth/routes/guards.ts')
  const homes = { CLIENT: '/dashboard', OWNER: '/dashboard/owner', ADMIN: '/dashboard/admin' }
  for (const role of Object.keys(homes)) {
    for (const [areaRole, href] of Object.entries(homes)) {
      const args = { location: { href }, context: { queryClient: { fetchQuery: async (options) => {
        assert.equal(options.staleTime, 0)
        return { roles: [role] }
      } } } }
      if (role === areaRole) await guards.requireDashboard(args)
      else await assert.rejects(guards.requireDashboard(args), (redirect) => redirect.options.to === homes[role])
    }
  }
  const multi = { location: { href: '/dashboard/owner/messages/1' }, context: { queryClient: { fetchQuery: async () => ({ roles: ['CLIENT', 'OWNER', 'ADMIN'] }) } } }
  await guards.requireDashboard(multi)
  await guards.requireRole('OWNER')(multi)
  await guards.requireRole('ADMIN')(multi)
  token = null
  await assert.rejects(guards.requireAuth(multi), (redirect) => redirect.options.to === '/login')
  console.log('Rutas por rol, cuenta con varios roles, comprobación fresca y redirección a login verificadas.')
}
main().catch((error) => { console.error(error); process.exitCode = 1 })
