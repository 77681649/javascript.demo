/**
 * 将纯text转换为HTML
 * 
 */

let text = `Demo:
function demo(count){
  const api = 'http://www.baidu.com'
  const email = 'test@ctrip.com'
  const shouldFetch = false
  const shouldSendEmail = false

  if( !shouldFetch && !shouldSendEmail ){
    return ;
  }

  shouldFetch && fetch()
  shouldSendEmail && sendEmail()

  if( count > 10 ){
    throw new Error('xxxx')
  }
}
`
function textToHtml(text) {
  let html = ''

  // 1. 处理特殊字符
  let specialChars = {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;'
  }

  html = text.replace(/([<>&])/g, function ($0, $1) {
    return specialChars[$1] || ''
  })

  // 2. 将换行转换为<p>
  html = html.replace(/^(.*)$/mg, '<p>$1</p>')

  // 3. 将网站或邮件转换为超级链接
  html = html.replace(/(http[s]?:\/\/[\w.]+)/g,'<a href="$1">$1</a>')
  html = html.replace(/(\w+@\w+(\.\w+)+)/g,'<a href="mailto:$1">$1</a>')

  return html
}

console.log(textToHtml(text))