// 将非Thenable转换为 status="fulfilled"的Promise
Promise.resolve(4).then(v => console.log('fulfilled', v))
Promise.resolve(null).then(v => console.log('fulfilled', v))
Promise.resolve(undefined).then(v => console.log('fulfilled', v))

// 将Thenable转换为Promise对象,状态不变
const thenableObj = Promise.reject(4)
Promise.resolve(thenableObj)
  .then(v => console.log('fulfilled', v))
  .catch(v => console.log('rejected', v))