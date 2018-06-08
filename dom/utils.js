function getAncestor(obj) {
  let ancestors = [];

  while (obj) {
    let name = obj.name ? obj.name : obj.constructor.name;
    ancestors.unshift(name);
    obj = obj.__proto__;
  }

  return ancestors;
}

function getProperty(obj, filter, match) {
  let properties = [];

  if (obj) {
    properties = Object.getOwnPropertyNames(obj).map(name => {
      try {
        let value = eval(`obj.${name}`);
        return [name, typeof value === "function" ? "method" : "attr"];
      } catch (err) {
        return [name, "attr"];
      }
    });
  }

  return properties
    .filter(it => it && (!filter || it[1] === filter))
    .filter(it => !match || match.test(it))
    .map(it => it.join(": "))
    .join("\r\n");
}
