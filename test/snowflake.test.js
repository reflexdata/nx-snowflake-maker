import test from 'node:test'
import assert from 'node:assert/strict'
import {snowflakeModel,normalize,randomSeed,createSnowflake,box} from '../lib/snowflake.js'
import plugin from '../plugins/snowflakeMakerPlugin.js'

test('seeds reproduce exact geometry through a JSON round trip',()=>{
  const p=createSnowflake(200,300,{seed:'winter-2026'}).properties
  assert.deepEqual(snowflakeModel(p),snowflakeModel(JSON.parse(JSON.stringify(p))))
  const paths=new Set(Array.from({length:50},(_,i)=>snowflakeModel({...p,seed:String(i)}).armPath))
  assert.equal(paths.size,50)
})
test('all styles mirror branches and stay within the arm sector and padded bounds',()=>{
  for(const style of ['stellar','fern','simple','random'])for(let detail=1;detail<=8;detail++)for(let seed=0;seed<100;seed++){
    const m=snowflakeModel({style,detail,seed:String(seed),spread:1})
    assert.equal(m.segments.length,1+detail*(m.style==='fern'?6:m.style==='stellar'?4:2))
    for(const s of m.segments){
      assert.ok(s.every(Number.isFinite))
      for(const [x,y]of [[s[0],s[1]],[s[2],s[3]]]){
        assert.ok(Math.hypot(x,y)<=100.001,JSON.stringify(s))
        assert.ok(Math.abs(x)<=-y*Math.tan(Math.PI/6)+.001,'stays inside 60-degree sector')
      }
      assert.ok(m.segments.some(t=>Math.abs(t[0]+s[0])<1e-9&&t[1]===s[1]&&Math.abs(t[2]+s[2])<1e-9&&t[3]===s[3]),'every segment has its reflection')
    }
  }
})
test('invalid saved inputs normalize to bounded finite geometry',()=>{
  const m=snowflakeModel({detail:Infinity,spread:-50,'stroke-width':'NaN',rotation:'garbage',style:'bad',center:'bad',seed:'x'.repeat(500)})
  assert.equal(m.spec.detail,5);assert.equal(m.spec.spread,.2);assert.equal(m.spec.strokeWidth,1.6);assert.equal(m.spec.rotation,0);assert.equal(m.spec.seed.length,128)
  assert.ok(!/NaN|Infinity/.test(m.armPath+m.centerPath))
  assert.equal(normalize({detail:999}).detail,8)
  assert.equal(normalize({detail:-999}).detail,1)
})
test('fresh inserts receive fresh seeds and are centred on the insertion point',()=>{
  const a=createSnowflake(200,300),b=createSnowflake(200,300)
  assert.notEqual(a.properties.seed,b.properties.seed)
  assert.notEqual(randomSeed(a.properties.seed),a.properties.seed)
  assert.deepEqual(box(a.properties),{x:60,y:160,w:280,h:280})
})
test('plugin registers a vector element with movement and resize support',()=>{
  const tools=[],types=[];plugin().setup({registerTool:t=>tools.push(t),registerElementType:t=>types.push(t)})
  assert.equal(tools.length,1);assert.equal(types.length,1);assert.equal(types[0].exportAs,'svg')
  const p=tools[0].createElement(100,100).properties
  assert.deepEqual(types[0].applyDrag(p,10,-20),{x:'-30',y:'-60'})
  assert.deepEqual(types[0].applyResize(p,box(p),{x:5,y:6,w:50,h:80}),{x:'5',y:'6',width:'50',height:'80'})
})
