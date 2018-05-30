/**
 * 创建自增ID生成器
 */
const createUniqueIdGen = function*(inital = 0) {
  let id = inital;

  while (true) {
    yield id++;
  }
};

const uniqueId = createUniqueIdGen();

for (x = 0; x < 100; x++) {
  console.log(uniqueId.next());
}
