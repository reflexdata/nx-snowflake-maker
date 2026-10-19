// Geometry is generated once in a mirrored 60-degree sector, then rotated six times.
// A saved seed is the only source of randomness: redraws, exports and reloads agree.
export const TYPE = 'nx-snowflake'
export const DEFAULTS = Object.freeze({ seed: 'winter', style: 'random', detail: '5', spread: '0.8', 'stroke-width': '1.6', color: '#287ca6', center: 'hexagon', rotation: '0' })
export const STYLES = [['random', 'Surprise me'], ['stellar', 'Stellar'], ['fern', 'Fern'], ['simple', 'Simple']]
export const number = (v, fallback) => v == null || v === '' || !Number.isFinite(Number(v)) ? fallback : Number(v)
export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))
export const round = v => String(Math.round(v * 1000) / 1000 || 0)
export function normalize(p = {}) {
  return { seed: String(p.seed ?? DEFAULTS.seed).slice(0, 128), style: STYLES.some(([id]) => id === p.style) ? p.style : DEFAULTS.style,
    detail: Math.round(clamp(number(p.detail, 5), 1, 8)), spread: clamp(number(p.spread, .8), .2, 1),
    strokeWidth: clamp(number(p['stroke-width'], 1.6), .4, 5), color: p.color || DEFAULTS.color,
    center: ['none', 'hexagon', 'star'].includes(p.center) ? p.center : DEFAULTS.center,
    rotation: number(p.rotation, 0) % 360 }
}
export function randomSeed(previous = '') {
  const bytes = new Uint32Array(2)
  if (globalThis.crypto?.getRandomValues) globalThis.crypto.getRandomValues(bytes)
  else { bytes[0] = Math.random() * 4294967296; bytes[1] = Math.random() * 4294967296 }
  const seed = [...bytes].map(n => n.toString(36)).join('-')
  return seed === previous ? seed + '-new' : seed
}
function generator(seed) {
  let state = 2166136261
  for (const ch of seed) state = Math.imul(state ^ ch.codePointAt(0), 16777619)
  return () => { state += 0x6D2B79F5; let t = Math.imul(state ^ state >>> 15, 1 | state); t ^= t + Math.imul(t ^ t >>> 7, 61 | t); return ((t ^ t >>> 14) >>> 0) / 4294967296 }
}
export function snowflakeModel(p = {}) {
  const spec = normalize(p), rand = generator(spec.seed)
  const style = spec.style === 'random' ? ['stellar', 'fern', 'simple'][Math.floor(rand() * 3)] : spec.style
  const segments = [[0, 0, 0, -100]], core = 9 + rand() * 10
  for (let i = 0; i < spec.detail; i++) {
    const y = 24 + (i + .2 + rand() * .5) / spec.detail * 63
    const reach = Math.min(y * .49, (100 - y) * .65) * spec.spread * (.6 + rand() * .4)
    const rise = reach * (.65 + rand() * .45)
    for (const sign of [-1, 1]) {
      segments.push([0, -y, sign * reach, -y - rise])
      if (style === 'fern') {
        for (const f of [.42, .72]) {
          const x = reach * f, by = y + rise * f, twig = reach * .25
          segments.push([sign * x, -by, sign * (x + twig), -by - twig * .85])
        }
      } else if (style === 'stellar') {
        segments.push([sign * reach * .55, -y - rise * .55, sign * reach * .55, -y - rise * .55 - reach * .4])
      }
    }
  }
  const armPath = segments.map(s => `M${round(s[0])} ${round(s[1])}L${round(s[2])} ${round(s[3])}`).join('')
  const points = spec.center === 'none' ? [] : Array.from({ length: spec.center === 'star' ? 12 : 6 }, (_, i) => {
    const a = i * Math.PI / (spec.center === 'star' ? 6 : 3) - Math.PI / 2
    const r = spec.center === 'star' && i % 2 ? core * .55 : core
    return [r * Math.cos(a), r * Math.sin(a)]
  })
  const centerPath = points.length ? points.map(([x, y], i) => `${i ? 'L' : 'M'}${round(x)} ${round(y)}`).join('') + 'Z' : ''
  return { spec, style, segments, armPath, centerPath }
}
export function box(p = {}) {
  return { x: number(p.x, 0), y: number(p.y, 0), w: clamp(number(p.width, 280), 1, 1e6), h: clamp(number(p.height, 280), 1, 1e6) }
}
export function createSnowflake(x, y, props = {}) {
  return { tagName: TYPE, properties: { ...DEFAULTS, seed: randomSeed(), x: round(x - 140), y: round(y - 140), width: '280', height: '280', ...props }, children: [] }
}
