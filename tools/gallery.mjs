import fs from 'node:fs'
import {snowflakeModel} from '../lib/snowflake.js'
import {ICON} from '../plugins/snowflakeMakerPlugin.js'
const examples = [
  ['First frost', {seed:'first-frost',style:'stellar',detail:5,color:'#287ca6'}],
  ['Fern crystal', {seed:'winter-forest',style:'fern',detail:7,color:'#458e92'}],
  ['Quiet winter', {seed:'quiet-winter',style:'simple',detail:3,color:'#6a78b6'}],
  ['Starlight', {seed:'starlight',style:'stellar',detail:8,spread:1,center:'star',color:'#736099'}],
  ['Ice needles', {seed:'needles',style:'simple',detail:6,spread:.45,center:'none',color:'#4386ae'}],
  ['Snow garden', {seed:'snow-garden',style:'fern',detail:5,spread:1,color:'#4f9190'}],
]
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="820" viewBox="0 0 1200 820"><rect width="1200" height="820" fill="#f4f8fb"/><g font-family="Arial,Helvetica,sans-serif" fill="#254457"><text x="60" y="65" font-size="30" font-weight="bold">Snowflake Maker</text><text x="60" y="99" font-size="17">A new crystal with every seed. Six mirrored arms, always.</text>${examples.map(([label,p],i)=>{const x=220+(i%3)*380,y=285+Math.floor(i/3)*330,m=snowflakeModel(p);return `<g transform="translate(${x} ${y})" stroke="${p.color}" stroke-width="${m.spec.strokeWidth}" stroke-linecap="round" stroke-linejoin="round" fill="none">${Array.from({length:6},(_,a)=>`<path transform="rotate(${a*60})" d="${m.armPath}"/>`).join('')}<path d="${m.centerPath}"/></g><text x="${x}" y="${y+137}" text-anchor="middle" font-size="18">${label}</text><text x="${x}" y="${y+164}" text-anchor="middle" font-size="13" fill="#668093">seed: ${p.seed}</text>`}).join('')}</g></svg>`
fs.writeFileSync(new URL('../screenshots/gallery.svg',import.meta.url),svg+'\n')
fs.writeFileSync(new URL('../icons/snowflake-maker.svg',import.meta.url),`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" color="#287ca6">${ICON}</svg>\n`)
