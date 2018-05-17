const buildinTypes = [
  null,
  undefined,
  {},
  1,
  "haha",
  true,
  /ttest/,
  new Date(),
  [12, 34],
  function () { },
  Symbol.iterator,
  new Map(),
  new WeakMap(),
  new Set(),
  new WeakSet(),
  (function* gen() { })(),
  new Promise(() => void 0),
  new Error('haha')
]

buildinTypes.forEach(t => {
  console.log(`${t ? t.toString() : t} -- ${Object.prototype.toString.call(t)}`)
})