const { chromium } = require('playwright');
const fs = require('fs');
const dir = 'original-captures';
const url = 'https://suareceitinha.receitinhaplenanatural.online/?utm_source=FB&utm_campaign=x';

function norm(s) {
  return String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

(async () => {
  fs.mkdirSync(dir, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe'
  });
  const page = await browser.newPage({
    viewport: { width: 430, height: 932 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true
  });
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(1400);
  const seen = [];
  for (let i = 0; i < 70; i += 1) {
    const info = await page.evaluate(() => {
      const text = document.body.innerText.replace(/\s+/g, ' ').trim();
      const buttons = [...document.querySelectorAll('button')]
        .filter((b) => {
          const r = b.getBoundingClientRect();
          return r.width > 10 && r.height > 10 && !b.disabled;
        })
        .map((b, idx) => ({
          idx,
          text: b.innerText.replace(/\s+/g, ' ').trim(),
          aria: b.getAttribute('aria-label'),
          x: b.getBoundingClientRect().x,
          y: b.getBoundingClientRect().y,
          w: b.getBoundingClientRect().width,
          h: b.getBoundingClientRect().height
        }));
      const inputs = [...document.querySelectorAll('input,textarea')]
        .filter((inp) => {
          const r = inp.getBoundingClientRect();
          return r.width > 10 && r.height > 10 && !inp.disabled;
        })
        .map((inp, idx) => ({ idx, placeholder: inp.placeholder, type: inp.type }));
      return { text: text.slice(0, 360), buttons, inputs, url: location.href };
    });
    const t = norm(info.text);
    seen.push({ i, ...info });
    const interesting = [
      'peso atual',
      'altura abaixo',
      'peso desejado',
      'analisando suas respostas',
      'audio urgente',
      'indice de massa corporal'
    ].some((x) => t.includes(x));
    if (interesting) {
      await page.screenshot({ path: `${dir}/original-interest-${i}.png`, fullPage: false });
      const payload = await page.evaluate(() => {
        const main = document.querySelector('main') || document.body;
        return {
          body: document.body.innerText,
          html: main.outerHTML.slice(0, 80000),
          elems: [...main.querySelectorAll('*')].slice(0, 500).map((el) => {
            const r = el.getBoundingClientRect();
            const s = getComputedStyle(el);
            return {
              tag: el.tagName,
              cls: String(el.className).slice(0, 120),
              text: (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 120),
              x: r.x,
              y: r.y,
              w: r.width,
              h: r.height,
              bg: s.backgroundColor,
              color: s.color,
              transform: s.transform,
              fontSize: s.fontSize,
              fontWeight: s.fontWeight,
              border: s.border,
              borderRadius: s.borderRadius
            };
          })
        };
      });
      fs.writeFileSync(`${dir}/original-interest-${i}.json`, JSON.stringify({ info, payload }, null, 2));
    }
    if (t.includes('audio urgente')) break;
    const clicked = await page.evaluate(() => {
      const input = [...document.querySelectorAll('input,textarea')].find((inp) => {
        const r = inp.getBoundingClientRect();
        return r.width > 10 && r.height > 10 && !inp.disabled;
      });
      if (input && !input.value) {
        input.focus();
        input.value = 'Maria';
        input.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: 'Maria' }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
      const buttons = [...document.querySelectorAll('button')].filter((b) => {
        const r = b.getBoundingClientRect();
        return r.width > 10 && r.height > 10 && !b.disabled;
      });
      const cont = buttons.find((b) => /continuar|pegar minha receita|sim, quero|enviar/i.test(b.innerText));
      const b = cont || buttons[0];
      if (!b) return null;
      const text = (b.innerText || b.getAttribute('aria-label') || '#blank').trim() || '#blank';
      b.click();
      return text;
    });
    if (clicked === null) break;
    await page.waitForTimeout(1000);
  }
  fs.writeFileSync(`${dir}/original-run-summary-2.json`, JSON.stringify(seen, null, 2));
  await browser.close();
  console.log(JSON.stringify(seen.map((s) => ({
    i: s.i,
    text: s.text,
    buttons: s.buttons.map((b) => b.text || b.aria || '#blank'),
    inputs: (s.inputs || []).length
  })), null, 2));
})();
