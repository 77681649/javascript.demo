function timeoutPromise(timeout = 0) {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error("timeout")), timeout);
  });
}

function request() {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve("ok");
    }, 1000);
  });
}

Promise.race([timeoutPromise(2000), request()])
  .then(data => {
    console.log("ok", data);
  })
  .catch(err => {
    console.error("error", err);
  });
