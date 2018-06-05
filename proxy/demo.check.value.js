const requiredValidator = {
  /**
   * 拦截 [[SET]]
   * 检查值是否null,undefined,如果是抛出异常
   */
  set(target, propertyName, value, receiver) {
    if (value == null) {
      throw new TypeError("value can not be null or undefined");
    }

    return Reflect.set(target, propertyName, value, receiver);
  }
};

const wrapRequiredValidator = o => {
  return new Proxy(o, requiredValidator);
};

var obj = wrapRequiredValidator({
  id: 1
});

obj.id = 2;
obj.id = null;
