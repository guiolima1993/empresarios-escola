const sharp = require('sharp');
const path = require('path');

const src = path.join(__dirname, 'img', 'graos-cafe.jpg');
const out = path.join(__dirname, 'img', 'graos-cafe.png');

(async () => {
  const { data, info } = await sharp(src)
    .resize({ width: 1100 })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const px = data;
  const outBuf = Buffer.alloc(info.width * info.height * 4);

  for (let i = 0; i < info.width * info.height; i++) {
    const r = px[i * 3], g = px[i * 3 + 1], b = px[i * 3 + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;

    // opaco abaixo de 170, rampa de transparencia 170->248, transparente acima
    let a = 255;
    if (lum > 248) a = 0;
    else if (lum > 170) a = Math.round(255 * (248 - lum) / (248 - 170));

    outBuf[i * 4] = r;
    outBuf[i * 4 + 1] = g;
    outBuf[i * 4 + 2] = b;
    outBuf[i * 4 + 3] = a;
  }

  await sharp(outBuf, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(out);

  const stat = require('fs').statSync(out);
  console.log(`OK: ${info.width}x${info.height}, ${(stat.size / 1024).toFixed(0)}KB`);
})();
