// Move the mouse across the screen as a sine wave.
const robot = require('robotjs');
const ioHook = require('iohook');
const schedule = require('node-schedule');
const fs = require('fs');
const lzwCompress = require('lzwcompress');

const play = actions => {
  actions.map((action, index) => {
    const {
      type,
      rawcode,
      code,
      x,
      y,
      button,
      clicks,
      direction,
      rotation,
      amount,
      delay
    } = action;

    robot.setMouseDelay(delay);
    robot.setKeyboardDelay(delay);

    if (type === 'mousedown') {
      robot.mouseClick();
    } else if (type === 'mousemove') {
      robot.moveMouse(x, y);
    } else if (type === 'mousewheel') {
      robot.scrollMouse(0, rotation * amount);
    } else if (type === 'mousedrag') {
      if (actions[index - 1].type !== 'mousedrag') {
        robot.mouseToggle('down');
      }
      if (index === actions.length - 1) {
        robot.mouseToggle('up');
      } else {
        if (actions[index + 1].type !== 'mousedrag') {
          robot.mouseToggle('up');
        }
      }

      robot.dragMouse(x, y);
    } else if (type === 'keydown') {
      if (rawcode === 126) {
        robot.keyTap('up');
      } else if (rawcode === 125) {
        robot.keyTap('down');
      } else if (rawcode === 123) {
        robot.keyTap('left');
      } else if (rawcode === 124) {
        robot.keyTap('right');
      } else if (rawcode === 116) {
        robot.keyTap('pageup');
      } else if (rawcode === 121) {
        robot.keyTap('pagedown');
      }
    }

    return true;
  });
};

// ioHook.on('keyup', event => {
//   if (event.ctrlKey && event.keycode === 30) { // Ctrl + A
//     process.exit();
//   }
// });

// ioHook.useRawcode(true);
// ioHook.start();

ioHook.registerShortcut([29, 65], (keys) => { // Ctrl + F7
  console.log('Shortcut called with keys:', keys);
  process.exit();
});

ioHook.start();

let timeOut = 0;
const args = process.argv.slice(2);
if (args.length > 0) {
  timeOut = args[0];
}

const records = fs.readFileSync('records.txt');
const actions = lzwCompress.unpack(JSON.parse(records));
// const actions = JSON.parse(records);
let total = 0;
actions.map(action => {
  const {
    delay
  } = action;
  total += delay;
});
total /= 1000;
total = Math.ceil(total);
console.log(total);

const startTime = new Date(Date.now());
let endTime = new Date(startTime.getTime() + timeOut * 1000);

// schedule.scheduleJob('*/10 * * * * *', () => {
schedule.scheduleJob({
  start: startTime,
  end: endTime,
  rule: `*/${total + 10} * * * * *`
}, () => {
  play(actions);
});

play(actions);
