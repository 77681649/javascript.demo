//
// 处理
//
const test = (re, str) => console.log(str, re.test(str))
const RE = /^[-+]?\d*\.?\d+$/
const boundTest = test.bind(null, RE)

//
// 是浮点的
//
boundTest('12.12')
boundTest('.12')
boundTest('1.0')
boundTest('1')

boundTest('+12.12')
boundTest('+.12')
boundTest('+1.0')
boundTest('+1')

boundTest('-12.12')
boundTest('-.12')
boundTest('-122.0')
boundTest('-122')

boundTest('12.')
boundTest('1/2')