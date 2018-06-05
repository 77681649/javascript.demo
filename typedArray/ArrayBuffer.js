// 创建一个字节序列
var buffer = new ArrayBuffer(2);

// 创建字节序列对应的视图
var view8 = new Uint8Array(buffer);
var view16 = new Uint16Array(buffer);

view16[0] = 3085;


console.log(view8[0].toString(2));
console.log(view8[1].toString(2));

console.log(view16[0].toString(2));