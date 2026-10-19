import { TYPE, DEFAULTS, STYLES, snowflakeModel, normalize, randomSeed, createSnowflake, box, number, round } from '../lib/snowflake.js'
export { createSnowflake } from '../lib/snowflake.js'
const SVG = 'http://www.w3.org/2000/svg'
export const ICON = '<path d="M12 2v20M3.34 7l17.32 10M3.34 17L20.66 7M8 4l4 4 4-4M8 20l4-4 4 4M3 11l5-1-1-5M21 13l-5 1 1 5M7 19l1-5-5-1M17 5l-1 5 5 1" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>'
const svg = (tag, attrs) => { const n = document.createElementNS(SVG, tag); for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v); return n }
export function renderSnowflake(el) {
  const p = el.properties || {}, b = box(p), m = snowflakeModel(p), scale = Math.min(b.w, b.h) / 212
  const root = svg('g', { class: 'nx-snowflake', role: 'img', 'aria-label': 'Sixfold snowflake' })
  const g = svg('g', { transform: `translate(${round(b.x + b.w / 2)} ${round(b.y + b.h / 2)}) scale(${scale}) rotate(${m.spec.rotation})`, fill: 'none', stroke: m.spec.color, 'stroke-width': m.spec.strokeWidth, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })
  for (let i = 0; i < 6; i++) g.append(svg('path', { class: 'nx-snowflake-arm', d: m.armPath, transform: `rotate(${i * 60})` }))
  if (m.centerPath) g.append(svg('path', { class: 'nx-snowflake-center', d: m.centerPath }))
  root.append(g)
  return root
}
export function snowflakeForm(el, update) {
  let p = { ...DEFAULTS, ...el.properties }
  const wrap = document.createElement('div'); wrap.className = 'inspector-section nx-snowflake-form'
  const controls = new Map()
  const set = patch => { p = { ...p, ...patch }; update({ properties: patch }); for (const [key, input] of controls) input.value = p[key] }
  const button = document.createElement('button'); button.type = 'button'; button.className = 'nx-snowflake-randomize'; button.textContent = 'New snowflake'
  button.addEventListener('click', () => set({ seed: randomSeed(p.seed) })); wrap.append(button)
  const row = (label, input) => { const r = document.createElement('label'); r.className = 'prop-row'; const span = document.createElement('span'); span.className = 'prop-label'; span.textContent = label; r.append(span, input); wrap.append(r) }
  for (const [key, label, type, options] of [
    ['seed', 'Seed', 'text'], ['style', 'Shape', 'select', STYLES], ['detail', 'Branch levels', 'number', [1, 8, 1]],
    ['spread', 'Branch spread', 'number', [.2, 1, .05]], ['stroke-width', 'Line width', 'number', [.4, 5, .1]],
    ['color', 'Colour', 'color'], ['center', 'Centre', 'select', [['hexagon', 'Hexagon'], ['star', 'Star'], ['none', 'None']]],
    ['rotation', 'Angle (°)', 'number', [-360, 360, 1]],
  ]) {
    const input = document.createElement(type === 'select' ? 'select' : 'input')
    if (type === 'select') for (const [value, label] of options) { const o = document.createElement('option'); o.value = value; o.textContent = label; input.append(o) }
    else { input.type = type; if (type === 'number') [input.min, input.max, input.step] = options; if (key === 'seed') input.maxLength = 128 }
    input.className = 'nx-snowflake-' + key; input.value = p[key]; controls.set(key, input)
    input.addEventListener('change', () => {
      let value = input.value
      if (type === 'number') { const spec = normalize({ ...p, [key]: value }); value = String(spec[key === 'stroke-width' ? 'strokeWidth' : key]) }
      set({ [key]: value })
    }); row(label, input)
  }
  const note = document.createElement('small'); note.style.cssText = 'display:block;color:var(--wb-muted,#616161);margin-top:8px'; note.textContent = 'The seed keeps this snowflake the same when saved or exported. New snowflake changes its pattern; shape and colour stay as chosen.'; wrap.append(note)
  return wrap
}
export function snowflakeMakerPlugin() {
  return { id: 'snowflake-maker', apiVersion: 1, permissions: {}, label: 'Snowflake Maker', title: 'Snowflake Maker', area: 'Illustration', description: 'Random sixfold snowflakes with a saved seed and editable vector branches.', setup(ctx) {
    ctx.registerTool({ id: 'snowflake-maker:add', kind: 'add', label: 'Random snowflake', group: 'Snowflakes', icon: ICON, createElement: createSnowflake })
    ctx.registerElementType({ id: TYPE, label: 'Snowflake', exportAs: 'svg', convert: { path: false }, render: renderSnowflake, getBBox: box,
      applyDrag: (p, dx, dy) => ({ x: round(number(p.x, 0) + dx), y: round(number(p.y, 0) + dy) }),
      applyResize: (p, before, after) => ({ x: round(after.x), y: round(after.y), width: round(Math.max(1, after.w)), height: round(Math.max(1, after.h)) }),
      inspector: snowflakeForm, editDialog: { title: 'Edit snowflake', hint: 'Try new seeds, branches and colours in the preview. Apply saves one edit; Cancel keeps the original snowflake.' } })
  } }
}
export default snowflakeMakerPlugin
