const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const src = path.join(__dirname, 'img', 'graos-cafe-ok.png');
const out = path.join(__dirname, 'img', 'graos-faixa.png');
const H = 640;   // altura da faixa
const OL = 90;   // largura do crossfade entre recortes diferentes

// aplica rampa de alpha nas primeiras OL colunas (crossfade ao sobrepor)
async function leftRamp(buf) {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let y = 0; y < info.height; y++)
    for (let x = 0; x < OL; x++) {
      const i = (y * info.width + x) * info.channels;
      data[i + 3] = Math.round(data[i + 3] * (x / OL));
    }
  return sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } }).png().toBuffer();
}

async function crop(left, top, w, h, outW) {
  return sharp(src).extract({ left, top, width: w, height: h }).resize({ width: outW, height: H }).png().toBuffer();
}

(async () => {
  // seis recortes diferentes da parede de graos -> faixa unica ~5000px, sem repeticao
  const crops = [
    await crop(80,   900, 1900, 1900, 640),
    await crop(300, 3200, 1600, 1900, 540),
    await crop(500, 2050, 1400, 1900, 470),
    await crop(60,  2400, 1900, 1900, 620),
    await crop(400, 1200, 1500, 1900, 500),
    await crop(200, 3700, 1700, 1900, 560)
  ];

  const inputs = [];
  let x = 0;
  for (let i = 0; i < crops.length; i++) {
    const m = await sharp(crops[i]).metadata();
    const flop = await sharp(crops[i]).flop().png().toBuffer();
    const pos = i === 0 ? 0 : x - OL;
    // par espelhado: emenda perfeita no meio, crossfade na junção com o anterior
    inputs.push({ input: i === 0 ? crops[i] : await leftRamp(crops[i]), left: pos, top: 0 });
    inputs.push({ input: flop, left: pos + m.width, top: 0 });
    x = pos + m.width * 2;
  }

  await sharp({
    create: { width: x, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } }
  })
    .composite(inputs)
    .png({ compressionLevel: 9, palette: true, colors: 200 })
    .toFile(out);

  console.log(`OK: ${x}x${H}, ${(fs.statSync(out).size / 1024).toFixed(0)}KB`);
})();
