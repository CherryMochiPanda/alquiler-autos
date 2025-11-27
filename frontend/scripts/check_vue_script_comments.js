const fs = require('fs')
const path = require('path')

function walk(dir) {
  const files = []
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name)
    const stat = fs.statSync(full)
    if (stat.isDirectory()) files.push(...walk(full))
    else if (name.endsWith('.vue')) files.push(full)
  }
  return files
}

function report() {
  const root = path.join(__dirname, '..', 'src')
  const vueFiles = walk(root)
  const results = []
  for (const file of vueFiles) {
    const raw = fs.readFileSync(file, 'utf8')
    const scriptBlocks = []
    const regex = /<script(?:(?:\s|\S)*?)>([\s\S]*?)<\/script>/gi
    let m
    while ((m = regex.exec(raw))) {
      scriptBlocks.push(m[1])
    }
    scriptBlocks.forEach((blk, idx) => {
      const opens = (blk.match(/\/\*/g) || []).length
      const closes = (blk.match(/\*\//g) || []).length
      if (opens !== closes) {
        // find line numbers
        const pre = raw.substring(0, raw.indexOf(blk))
        const startLine = pre.split('\n').length
        results.push({ file, blockIndex: idx, opens, closes, startLine })
      }
    })
  }

  if (results.length === 0) {
    console.log('OK: no unmatched /* found inside <script> blocks in any .vue files.')
    return
  }

  console.log('Found mismatches in the following files:')
  for (const r of results) {
    console.log(`- ${r.file} (script block #${r.blockIndex}) start line ~${r.startLine} opens=${r.opens} closes=${r.closes}`)
  }
  process.exitCode = 2
}

report()
