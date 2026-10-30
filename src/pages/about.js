import { start } from '../inner/common.js';
import { $, scrubWords } from '../lib/shell.js';
import { metalBlob } from '../lib/blob.js';

start(() => {
  scrubWords($('.story__text'), { start: 'top 80%', end: 'bottom 50%' });
  metalBlob($('.impact__gl'), { trigger: $('.impact'), radius: 1.25, distance: 7.5, x: 2.5 });
});
