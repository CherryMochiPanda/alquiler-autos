const fs = require('fs')
const path = require('path')
const file = path.resolve(__dirname, '../src/views/Reserva.vue')
const text = fs.readFileSync(file, 'utf8')
const lines = text.split(/\r?\n/)

function find(pattern) {
  return lines.map((l,i)=> ({i:i+1,line:l})).filter(x=> x.line.includes(pattern))
}

const opens = find('/*')
const closes = find('*/')
console.log('Found /* count:', opens.length)
opens.forEach(o=> console.log(o.i, o.line))
console.log('Found */ count:', closes.length)
closes.forEach(c=> console.log(c.i, c.line))

// dump surrounding context for each open
if (opens.length) {
  console.log('\nContext around first open:')
  const idx = opens[0].i
  const start = Math.max(1, idx-4)
  const end = Math.min(lines.length, idx+8)
  for (let j=start;j<=end;j++) console.log(j, lines[j-1])
}

// Print script block bounds
const scriptStart = lines.findIndex(l => l.includes('<script'))
const scriptEnd = lines.findIndex(l => l.includes('</script>'))
console.log('\n<script> start line:', scriptStart+1, 'end line:', scriptEnd+1)
if (scriptStart>=0 && scriptEnd>=0) {
  const scriptLines = lines.slice(scriptStart, scriptEnd+1)
  const scriptText = scriptLines.join('\n')
  const openCount = (scriptText.match(/\/\*/g) || []).length
  const closeCount = (scriptText.match(/\*\//g) || []).length
  console.log('In <script>: open /*:', openCount, 'close */:', closeCount)
}
