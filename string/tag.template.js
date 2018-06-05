function tag(strings, ...values) {
  console.log(strings);
  console.log(strings.raw);
  console.log(values);
}

var name = "name";
var desc = "awesome";

tag`Everything ${name} is ${desc}`;
