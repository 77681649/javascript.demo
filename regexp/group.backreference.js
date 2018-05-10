const test = (re, str) => console.log(str, re.test(str))
const RE = /id:\d{6}(\d{8})\d{4}\s+birthday:(\1)/


test(RE, 'id:430701199001090022 birthday:19900109')

var match = 'id:430701199001090022 birthday:19900109'.match(RE)
console.log(match)