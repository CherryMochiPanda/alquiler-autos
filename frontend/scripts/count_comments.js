const fs = require('fs')
const path = require('path')
const file = path.resolve(__dirname, '../src/views/Reserva.vue')
const text = fs.readFileSync(file, 'utf8')
const openMatches = text.match(/\/\*/g) || []
const closeMatches = text.match(/\*\//g) || []
const out = `open /* count: ${openMatches.length}\nclose */ count: ${closeMatches.length}\n` + '\nLines with /*:\n' + text.split(/\r?\n/).map((l,i)=>({i:i+1,line:l})).filter(x=>x.line.includes('/*')).map(x=>`${x.i}: ${x.line}`).join('\n') + '\n\nLines with */:\n' + text.split(/\r?\n/).map((l,i)=>({i:i+1,line:l})).filter(x=>x.line.includes('*/')).map(x=>`${x.i}: ${x.line}`).join('\n')
fs.writeFileSync(path.resolve(__dirname,'../out_comments.txt'), out)
console.log('Wrote out_comments.txt')
