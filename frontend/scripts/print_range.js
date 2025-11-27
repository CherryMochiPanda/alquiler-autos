const fs = require('fs')
const path = require('path')
const file = path.resolve(__dirname, '../src/views/Reserva.vue')
const text = fs.readFileSync(file, 'utf8')
const lines = text.split(/\r?\n/)
const start = 110, end = 240
for (let i = start; i <= Math.min(end, lines.length); i++) {
  const ln = (i).toString().padStart(4,' ')
  console.log(ln + ': ' + (lines[i-1]||''))
}
