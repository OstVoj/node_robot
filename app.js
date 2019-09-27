// Move the mouse across the screen as a sine wave.
const robot = require('robotjs');
const ImageJS = require('imagejs');
const schedule = require('node-schedule');
const fs = require('fs');
const ioHook = require('iohook');
const homeDir = require('os').homedir();

const homePath = `${homeDir}/screenCapture`;
if (!fs.existsSync(homePath)) {
  fs.mkdirSync(homePath);
}

let mouseCount = 0;
let keyCount = 0;

ioHook.on('mousedown', event => {
  mouseCount += 1;
});
ioHook.on('mousedrag', event => {
  mouseCount += 1;
});
ioHook.on('mousewheel', event => {
  mouseCount += 1;
});
ioHook.on('mousemove', event => {
  mouseCount += 1;
});
ioHook.on('keydown', event => {
  keyCount += 1;
});

ioHook.start();

schedule.scheduleJob('*/10 * * * * *', () => {
  console.log('Capturing...', `Mouse: ${mouseCount}, Key: ${keyCount}`);
  const capture = robot.screen.capture();
  const {
    image,
    width,
    height
  } = capture;

  const bitmap = new ImageJS.Bitmap({
    width,
    height,
    data: image
  });

  bitmap.writeFile(`${homePath}/${new Date()}.jpg`, {
    quality: 100
  });

  mouseCount = 0;
  keyCount = 0;
});
