document.addEventListener("DOMContentLoaded", function() {
  const $message = document.getElementById("message");
  const worker = new Worker("worker.js");

  worker.addEventListener("message", function(message) {
    console.log(message)
    $message.innerText = message.data;
  });

  worker.addEventListener("error", function(error) {
    console.error(error);
  });
});
