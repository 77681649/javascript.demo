
const ip = [
  '127.0.0.1',
  '192.168.1.1'
]

// 0~255.0~255.0~255.0~255
const RE = [
  /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/
]

RE.forEach(re => {
  console.log(re+' match:')
  ip.forEach(ip => {
    console.log(ip, re.test(ip))
  })
})