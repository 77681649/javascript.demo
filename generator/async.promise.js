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
      resolve("tyo");
    }, 2000);
  });
}

function* fetchUser() {
  // 串行
  var userId = yield fetchUserId();
  var userName = yield fetchUserName();

  return { userId, userName };
}

function* fetchUserParallel1() {
  // 并发
  var p1 = fetchUserId();
  var p2 = fetchUserName();

  var userId = yield p1;
  var userName = yield p2;

  return { userId, userName };
}

function* fetchUserParallel2() {
  var [userId, userName] = yield Promise.all([fetchUserId(), fetchUserName()]);

  return { userId, userName };
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

co(fetchUser)().then(user => console.log("serie", user));
co(fetchUserParallel1)().then(user => console.log("parallel", user));
co(fetchUserParallel2)().then(user => console.log("parallel", user));
co(getUser)().then(user => console.log("sync", user));
