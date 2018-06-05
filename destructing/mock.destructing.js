// 创建一个类数组
var likeArray = Object.create(null, {
  a: {
    enumerable: true,
    value: 1
  },
  b: {
    enumerable: true,
    value: 2
  },
  c: {
    enumerable: true,
    value: 3
  },
  length: {
    enumerable: true,
    valuer: 3
  }
});

// 默认情况下, 是不可以数组解构的;
try {
  let [a, b, c] = likeArray;
} catch (err) {
  console.error("Array Destructing:", err.message);
}

// 定义一个迭代器
likeArray[Symbol.iterator] = function() {
  let that = this;
  let keys = Object.getOwnPropertyNames(that);
  let index = 0;
  let length = keys.length;

  // 返回一个迭代器对象
  return {
    next() {
      let result = { value: that[keys[index]], done: index >= length };
      index++;

      return result;
    }
  };
};

// 定义了迭代器,就能进行数组解构
let [a, b, c] = likeArray;
console.log("Array Destructing:", a, b, c);