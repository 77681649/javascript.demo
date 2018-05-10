// 将非Thenable转换为 status="fulfilled"的Promise
Promise.reject(4).catch(v => console.log('rejected', v))
Promise.reject(null).catch(v => console.log('rejected', v))
Promise.reject(undefined).catch(v => console.log('rejected', v))

// 无法将thenableObj 转换为 Promise
const thenableObj = Promise.resolve(4)
Promise.reject(thenableObj)
  .then(v => console.log('fulfilled', v))
  .catch(v => console.log('rejected', v))

