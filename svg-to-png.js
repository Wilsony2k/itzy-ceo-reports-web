const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function svgToPng() {
  const svgPath = path.join(__dirname, 'progressreport', 'yuna_manga_coordination.svg');
  const pngPath = path.join(__dirname, 'progressreport', 'yuna_manga_coordination.png');

  if (!fs.existsSync(svgPath)) {
    console.error('SVG file not found:', svgPath);
    process.exit(1);
  }

  const svgContent = fs.readFileSync(svgPath, 'utf-8');

  console.log('Starting Puppeteer...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // 获取 SVG 尺寸（从 viewBox 或 width/height 属性）
  const widthMatch = svgContent.match(/viewBox="[^"]*"/);
  const width = widthMatch ? parseInt(widthMatch[0].split(' ')[2]) : 1200;
  const height = widthMatch ? parseInt(widthMatch[0].split(' ')[3]) : 900;

  console.log(`SVG dimensions: ${width}x${height}`);
  console.log(`Rendering to PNG: ${pngPath}`);

  // 设置视口大小
  await page.setViewport({ width, height });

  // 创建 HTML 页面渲染 SVG
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { margin: 0; padding: 0; }
        svg { display: block; }
      </style>
    </head>
    <body>
      ${svgContent}
    </body>
    </html>
  `;

  await page.setContent(html, { waitUntil: 'networkidle0' });

  // 截图为 PNG
  await page.screenshot({
    path: pngPath,
    type: 'png',
    fullPage: false,
    clip: { x: 0, y: 0, width, height }
  });

  await browser.close();

  const stats = fs.statSync(pngPath);
  console.log(`✓ PNG created successfully!`);
  console.log(`  Size: ${(stats.size / 1024).toFixed(2)} KB`);
  console.log(`  Path: ${pngPath}`);
}

svgToPng().catch(console.error);
