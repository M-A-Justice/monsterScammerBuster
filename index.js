const { exec } = require('child_process');
const fs = require('fs');
const { Worker } = require('worker_threads');
const path = './fakeData.csv';

try {
  if (!fs.existsSync(path)) {
    exec('touch fakeData.csv');
  }
} catch (err) {
  console.error(err);
}

let interval = () => {
  const threadCount = 1;
  const threads = new Set();
  console.log(`Running with ${threadCount} threads...`);

  for (let i = 0; i < threadCount; i += 1) {
    threads.add(new Worker('./script.js'));
  }

  for (let worker of threads) {
    worker.on('error', (err) => {
      throw err;
    });

    worker.on('exit', () => {
      threads.delete(worker);
      console.log(`Thread exiting, ${threads.size} running...`);
      if (threads.size === 0) {
        console.log('Process finished');
        clearInterval(this);
      }
    });

    worker.on('message', (msg) => {
      console.log(msg);
    });
  }  
};

setInterval(interval, 3000);
