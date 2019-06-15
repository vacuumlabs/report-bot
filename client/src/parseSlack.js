import he from 'he'

function last(a) {
  return a[a.length - 1]
}

export default function parse(message) {
  const newSection = (quote) => ({type: 'section', quote, children: []})
  const sections = []
  for (const block of parseBlocks(message)) {
    if (sections.length === 0 || block.quote !== last(sections).quote) {
      sections.push(newSection(block.quote))
    }

    last(sections).children.push(
      block.type === 'line' ? {
        type: 'line',
        children: parseLine(block.text),
      } : {...block, quote: undefined}
    )
  }

  return sections
}

function parseLine(text) {
  // This regexp matches:
  // 1. inline code block
  // 2. emoji
  // 3. user link
  // 4. channel link
  // 5. url
  const r = /(?:`([^`]*)`)|(?::([a-zA-Z0-9_+-]+):)|(?:<@([A-Z0-9]+)>)|(?:<#([A-Z0-9]+|[^<>]+)>)|(?:<([^<>@#][^<>]+)>)/ug

  const parts = text.split(r)

  const parseLink = (t) => {
    const id = t.split('|')[0]
    const name = t.substring(id.length + 1) || id
    return {id, name}
  }

  const converters = [
    (t) => [{type: 'code', text: he.decode(t)}],
    (t) => [{type: 'emoji', id: t}],
    (t) => [{type: 'user', id: t}],
    (t) => [{type: 'channel', ...parseLink(t)}],
    (t) => [{type: 'url', ...parseLink(t)}],
    (t) => he.decode(t),
  ]
  const line = [...converters[5](parts[0])]
  for (let i = 1; i < parts.length; i += 6) {
    for (let k = 0; k < converters.length; k++) {
      if (parts[i + k] === undefined) continue
      line.push(...converters[k](parts[i + k]))
    }
  }

  return parseStyle(line)
}


function parseStyle(line) {
  const markers = Object.assign(Object.create(null), {
    '*': null,
    '_': null,
    '~': null,
  })

  for (const [i, ch] of line.entries()) {
    if (typeof ch !== 'string' || !(ch in markers)) continue
    if (markers[ch] != null) {
      line[markers[ch]] = [ch, true]
      line[i] = [ch]
      markers[ch] = null
    } else markers[ch] = i
  }

  const newSpan = (style) => ({type: 'span', children: [], style})

  let spans = [newSpan({})]
  for (const ch of line) {
    if (!Array.isArray(ch)) last(spans).children.push(ch)
    else spans.push(newSpan({...last(spans).style, [ch[0]]: ch[1]}))
  }

  spans = spans.filter((s) => s.children.length > 0)

  for (const s of spans) {
    let a = null
    s.children.push({})
    let chunks = []
    for (const [b, ch] of s.children.entries()) {
      if (typeof ch === 'object') {
        if (a != null) chunks.push(s.children.slice(a, b).join(''))
        a = null
        chunks.push(ch)
      } else if (a == null) a = b
    }
    chunks.pop()
    s.children = chunks
  }

  return spans
}

function parseBlocks(message) {

// Parse pre blocks and newlines.
  const parts = message.split(/`{3}(`*(?:`{0,2}[^`])*`*)`{3}/gu)

  const converters = [
    (t) => [{type: 'pre', text: he.decode(t).replace(/^\n|\n$/gu, '')}],
    (t) => t.split('\n').map((t) => ({type: 'line', text: t.trim()})),
  ]
  let blocks = [...converters[1](parts[0])]

  for (let i = 1; i < parts.length; i += 2) {
    for (let k = 0; k < converters.length; k++) {
      blocks.push(...converters[k](parts[i + k]))
    }
  }
  
  // Mark Quotes
  let allQuote = false
  for (const [i, block] of blocks.entries()) {
    if (block.type === 'line' && block.text.startsWith('&gt;&gt;&gt;')) {
      allQuote = true
      block.text = block.text.substring(12 + (block.text[12] === ' '))
    }
    if (allQuote) {
      block.quote = true
      continue
    }
    if (block.type === 'line' && block.text.startsWith('&gt;')) {
      block.text = block.text.substring(4 + (block.text[4] === ' '))
      block.quote = true
      if (i < blocks.length - 1 && blocks[i + 1].type === 'pre') {
        blocks[i + 1].quote = true
        blocks[i + 2].quote = true
      }
    }
  }

  blocks = blocks.map((block) => (block.type === 'line' && block.text === '') ? {type: 'vspace', quote: block.quote} : block)
  blocks = blocks.filter((block, i) => !(block.type === 'vspace' && (
    (blocks[i - 1] && blocks[i - 1].type === 'pre') ||
    (blocks[i + 1] && blocks[i + 1].type === 'pre')
  )))

  return blocks
}
