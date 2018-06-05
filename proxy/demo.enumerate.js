var arr = new Proxy([1, 2, 3], {
  enumerate() {
    console.log(arguments);
  }
});

for (var it in arr) {
  console.log(it);
}
