//
// 匹配变量标志符
// 必须以字母,_开头
// 只能包含字母,数字,_
// 1~32位
// 
const test = (re, str) => console.log(str, re.test(str))
const RE = /^[A-Za-z_]\w{0,31}/

test(RE, 'a123')  // ok
test(RE, '_123')  // ok
test(RE, '123A')  // fail