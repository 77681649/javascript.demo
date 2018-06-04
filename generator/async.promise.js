const co = require("./co");

function fetchUserId() {
  return new Promise((resolve, reject) => {
    setTimeout(function() {
      resolve("1");
    }, 1000);
  });
}

function fetchUserName() {
  return new Promise((resolve, reject) => {
    setTimeout(function() {
      reject("tyo");
    }, 2000);
  });
}

function* fetchUser() {
  try {
    var userId = yield fetchUserId();
    var userName = yield fetchUserName();
    return { userId, userName };
  } catch (err) {
    return {};
  }
}

function* getUser() {
  var userId = yield getUserId();
  var userName = yield getUserName();

  return { userId, userName };
}

function getUserId() {
  return "1";
}

function getUserName() {
  return "tyo";
}

co(fetchUser)()
  .then(user => console.log(user))
  .catch(err => {
    console.log("error", err);
  });
co(getUser)().then(user => console.log(user));
