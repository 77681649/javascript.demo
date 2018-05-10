
// 匹配汉语日期格式 :
// yyyy-MM-dd 
// yyyy/MM/dd
// yyyy年MM月dd日
//
// yy-MM-dd 
// yy/MM/dd
// yy年MM月dd日
//
// yyyy-M-d 
// yyyy/M/d
// yyyy年M月d日
//
// yy-M-d 
// yy/M/d
// yy年M月d日
const RE = /^(\d{4}|\d{2})[-/年](\d{2}|\d)[-/月](\d{2}|\d)日?$/
const testData = [
  '1990-01-01',
  '1990/01/01',
  '1990年01月01日',
  
  '90-01-01',
  '90/01/01',
  '90年01月01日',

  '1990-1-1',
  '1990/1/1',
  '1990年1月1日',

  '90-1-1',
  '90/1/1',
  '90年1月1日',
]

testData.forEach(d => console.log(d, RE.test(d)))