import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { start } from '../inner/common.js';
import { $ } from '../lib/shell.js';
import StickerPeel from '../components/reactbits/StickerPeel.jsx';

start(() => {
  createRoot($('#nf-sticker')).render(createElement(StickerPeel, {
    imageSrc: 'assets/stickers/gavel.png', width: 220, rotate: -10, finish: 'holo', peelBackHoverPct: 35, peelBackActivePct: 60,
  }));
});
