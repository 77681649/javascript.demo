const test = (re, str) => console.log(str, re.test(str))

var RE = /^<hr(\s+size=\d+)?\s*>$/i
var boundTest = test.bind(null, RE)

boundTest('<hr  size=14 >')
boundTest('<hr  size=14>')
boundTest('<hr size=14 >')
boundTest('<hr size=14>')
boundTest('<hr  >')
boundTest('<hr>')
