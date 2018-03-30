// Copyright 2016 CHEN Xianren. All rights reserved.

const MaxCount = 20
const _entries = new Map()

function getCacheEntries(ids) {
  let a = []
  for (let id of ids) {
    a.push(_entries.get(id))
  }
  return a
}

let calls = []
let timer

function load(ids) {
  return request.get('entry', ids).then(res => {
    const data = res.take() || []
    data.forEach(e => _entries.set(e.Id, e))
    return data.length
  })
}

function loads(ids, seq = true) {
  let a = []
  let f, p
  if (seq) {
    p = Promise.resolve(seq)
    f = v => {
      p = p.then(() => load(v))
      a.push(p)
    }
  } else {
    f = v => a.push(load(v))
  }

  const n = ids.length
  for (let i = 0; i < n; i += MaxCount) {
    let j = i + MaxCount
    if (j > n) j = n
    f(ids.slice(i, j))
  }

  return Promise.all(a)
}

export function getEntries(ids) {
  if (_entries.size > 250) _entries.clear()
  let a = []
  for (let id of ids) {
    if (!_entries.has(id) && a.indexOf(id) === -1) a.push(id)
  }
  if (a.length > 0) {
    return new Promise((resolve, reject) => {
      calls.push({ resolve, reject, ids, a })
      a = calls.slice()
      if (timer) {
        clearTimeout(timer)
        timer = undefined
      }
      timer = setTimeout(() => {
        timer = undefined
        const b = []
        a.forEach(o => {
          o.a.forEach(id => {
            if (!_entries.has(id) && b.indexOf(id) === -1) b.push(id)
          })
        })
        const f = k => {
          a.forEach(o => {
            let i = calls.indexOf(o)
            if (i >= 0) calls.splice(i, 1)
            o[k](getCacheEntries(o.ids))
          })
        }
        loads(b).then(a => {
          f('resolve')
        }, () => {
          f('reject')
        })
      }, 10)
    })
  }
  return Promise.resolve(getCacheEntries(ids))
}
