import { start } from '../inner/common.js';
import { $ } from '../lib/shell.js';

start(() => {
  const el = $('#dxb-time');
  const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Dubai', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const tick = () => { el.textContent = `${fmt.format(new Date())} GST`; };
  tick();
  setInterval(tick, 1000);
});
