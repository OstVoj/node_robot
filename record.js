const fs = require('fs');
const ioHook = require('iohook');
const lzwCompress = require('lzwcompress');

const getMiliSeconds = () => {
  const date = new Date();
  return date.getTime();
};

let now = getMiliSeconds();
let current = 0;

const records = [];

ioHook.on('mousedown', event => {
  current = getMiliSeconds();
  event.delay = current - now;
  now = current;
  records.push(event);
});

ioHook.on('mousedrag', event => {
  current = getMiliSeconds();
  event.delay = current - now;
  now = current;
  records.push(event);
});

ioHook.on('mousewheel', event => {
  current = getMiliSeconds();
  event.delay = current - now;
  now = current;
  records.push(event);
});

ioHook.on('mousemove', event => {
  current = getMiliSeconds();
  event.delay = current - now;
  now = current;
  records.push(event);
});

ioHook.on('keydown', event => {
  current = getMiliSeconds();
  event.delay = current - now;
  now = current;
  records.push(event);
});

ioHook.on('keyup', event => {
  if (event.ctrlKey && event.keycode === 30) { // Ctrl + A
    fs.writeFileSync('records1.txt', JSON.stringify(records));
    const compressed = lzwCompress.pack(records);
    fs.writeFileSync('records.txt', JSON.stringify(compressed));
    process.exit();
  }
});

ioHook.useRawcode(true);
ioHook.start();
