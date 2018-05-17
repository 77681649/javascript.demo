function queue(arr, handle) {
  let index = 0
  let length = arr.length

  return new Promise((resolve, reject) => {
    !(function next() {
      try {
        handle(arr[index])
          .then(function () {
            ++index < length
              ? next()
              : resolve()
          })
          .catch(reject)
      } catch (err) {
        reject(err)
      }
    })()
  })
}

function upload(file) {
  return new Promise((resolve, reject) => {
    // 上传文件
    setTimeout(function () {
      console.log(`upload ${file}`)
      resolve()
    }, file * 1000 )
  })
}

queue(['3', '2', '1'], upload).then(data => {
  console.log('ok');
}).catch(err => {
  console.log('error', err)
})

// function queue(files, handle) {
//   let promise = Promise.resolve();

//   files.forEach(file => {
//     promise = promise.then(() => handle(file));
//   });

//   return promise;
// }

