/**
 * 匹配 0 ~ 255
 */
const excepts = [
  ['0', true],
  ['1', true],
  ['9', true],
  ['01', false],
  ['10', true],
  ['55', true],
  ['99', true],
  ['010', false],
  ['002', false],
  ['100', true],
  ['101', true],
  ['102', true],
  ['200', true],
  ['201', true],
  ['210', true],
  ['249', true],
  ['240', true],
  ['250', true],
  ['251', true],
  ['255', true],
  ['256', true],
  ['259', true],
]

const RE = /^(0|(?=[1-9])1?[1-9]?\d|2[0-4]\d|25[0-5])$/

console.log('01'.match(RE))
console.log('010'.match(RE))
console.log('002'.match(RE))

excepts.forEach(([text, except]) => {
  console.log(text, RE.test(text) === except ? 'ok' : 'err')
})