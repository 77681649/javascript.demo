/**
 * 实现对象的遍历
 */
class Map {
  constructor() {
    this._entries = {}
  }

  entries() {
    return this._entries
  }

  keys() {
    return Object.keys(this._entries)
  }

  values() {
    return this.keys().map(k => this._entries[k])
  }

  size() {
    return this.keys().length
  }

  has(k) {
    return !!this._entries[k]
  }

  set(k, v) {
    this._entries[k] = v
  }

  get(k) {
    return this._entries[k]
  }

  delete(k) {
    return delete this._entries[k]
  }

  [Symbol.iterator]() {
    let current = 0
    let keys = this.keys()
    let values = this.values()
    let length = keys.length

    return {
      next() {
        let value = { key: keys[current], value: values[current] }
        let done = current >= length

        current++

        return { value, done }
      }
    }
  }
}

const map = new Map()

map.set('a', 1)
map.set('b', '2')
map.set('c', '3')
map.set('d', '4')
map.set('e', '5')

for (const { value } of map) {
  console.log(value)
}