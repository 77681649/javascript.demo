const emptyFormatter = {
  /**
   * 拦截[[GET]]
   * 如果属性值为null,undefined时,返回空字符串""
   */
  get(target, properyName, receiver) {
    let value = Reflect.get(target, properyName, receiver);
    return value == null ? "" : value;
  }
};

const wrapEmptyFormmater = o => {
  return new Proxy(o, emptyFormatter);
};

var obj = wrapEmptyFormmater({
  id: 1
});

console.log("id", obj.id);
console.log("name", obj.name);
