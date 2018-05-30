class Coroutine {
  constructor(producer,consumer){
    this.producer = producer
    this.consumer = consumer

    this.gen = (function* (){
      const that = this

      while (true) {
        const value = yield that.producer.produce()
        yield that.consumer.consume(value)
      }
    })()
  }

  start(){
    
  }

  produce() {
    
  }

  consume(value) {
    this.consumer.consume(value)
  }
}

class Producer {
  producer() {
    whi;
  }
}

class Consumer {}
