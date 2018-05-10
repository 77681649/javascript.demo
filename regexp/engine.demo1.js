/**
 * 匹配tonight
 */
const str = 'tonight'
const RE1 = /to(ni(ght|te)|knight)/
const RE2 = /tonite|toknight|tonight/
const RE3 = /to(k?night|nite)/

//
// NFA:
//

// 匹配'to' , 控制权交由(ni(ght|te)|knight)
// 匹配'ni' , 控制权交由(ght|te)
// 匹配'g' , 控制权交由ght
// 匹配'tonight'
console.log(str.match(RE1))

//
// 匹配't' , 控制权交由tonite
// 匹配'o' , ...
// 一轮匹配失败 , 向前转动 , 继续下轮
// ... 
// 匹配完成 , 匹配失败
// 
// 控制权交由/toknight/
// ...(过程与tonigte类似)
// 匹配完成 , 匹配失败
//
// 控制权交由/tonight/
// ...
// 匹配成功 
//
console.log(str.match(RE2))


// NFA引擎下最优
// 匹配'to' , 控制权交由(k?night|nite)
// 匹配'n' , 控制权交由 night
// 匹配余下的表达式 , 匹配成功
console.log(str.match(RE3))