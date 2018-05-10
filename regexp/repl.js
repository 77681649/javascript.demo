const repl = require('repl')

function reEval(cmd, context, filename, callback) {
  let [c, reStr, str, replacement] = cmd.split(/\s+/)
  let re = eval(reStr)
  let ret

  c = c || 't'

  switch (c) {
    case 't':
      ret = re.test(str)
      break
    case 'm':
      ret = str.match(re)
    case 'r':
      ret = str.replace(re, replacement)
  }

  console.log(ret)
}

console.log('format :[<RegExp> <String>]')

repl.start({ prompt: '> ', eval: reEval })