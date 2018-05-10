/**
 * 使用Promise,Generator,async/await分别实现异步读取两个文件的功能
 */
const readFile = fileName =>
  new Promise((resolve, reject) => {
    setTimeout(() => resolve(`read ${fileName}`), 1000)
  })



// Promise
!(function () {
  readFile('file1')
    .then(file1 => {
      return readFile('file2').then(file2 => Promise.resolve([file1, file2]))
    })
    .then(([file1, fiel2]) => {
      console.log('using promise')
      console.log(file1)
      console.log(fiel2)
    })
    .catch(err => {
      console.error(err)
    })
})()



// Generator
!(function () {
  function* gen() {
    let file1 = yield readFile('file1')
    let file2 = yield readFile('file2')

    console.log('using generator')
    console.log(file1)
    console.log(file2)
  }

  function co(gen) {
    function exec(genobj, ...args) {
      let ret = genobj.next(...args)

      if (ret.value) {
        ret.value.then(data => exec(genobj, data)).catch(err => genobj.throw(err))
      }
    }

    exec(gen())
  }

  co(gen)
})()



// async/await
!(function () {
  async function read() {
    let file1 = await readFile('file1')
    let file2 = await readFile('file2')

    console.log('using async/await')
    console.log(file1)
    console.log(file2)
  }

  read()
})()