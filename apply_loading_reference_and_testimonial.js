const fs = require('fs');

const loadingTargets = [
  '2d7c8f18-1aa6-4663-9f96-3445e569704f.htm',
  '4ea79758-2add-447b-bdee-ce097146fb59.htm',
  'a91df132-ae80-4d80-836d-a28034a098a0.htm',
  'quiz-progress-54.htm',
  'quiz-progress-60.htm',
  'quiz-progress-96.htm',
  'quiz-progress-99-final.htm',
];

const testimonialPng = 'c:/Users/games/Downloads/ChatGPT Image 6 de mai. de 2026, 14_13_33.png';
const testimonialData = `data:image/png;base64,${fs.readFileSync(testimonialPng).toString('base64')}`;

function patchLoading(file) {
  let text = fs.readFileSync(file, 'utf8');
  const start = text.indexOf('  function renderLoadingExperience(target) {');
  if (start === -1) throw new Error(`renderLoadingExperience not found in ${file}`);
  const end = text.indexOf('\n  function findPercentNode()', start);
  if (end === -1) throw new Error(`findPercentNode not found after renderLoadingExperience in ${file}`);

  const replacement = `  function renderLoadingExperience(target) {
    if (!autoAdvance) return null;
    target = target || 100;
    document.body.innerHTML = '<main class="quiz-loading-shell" aria-live="polite"><section class="quiz-loading-card"><div style="position:relative;z-index:1;display:inline-flex;align-items:center;gap:8px;padding:10px 18px;border-radius:999px;background:rgba(143,189,49,.14);color:#4b7922;font-size:14px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;">Analise personalizada</div><h1 class="quiz-loading-title" style="margin-top:24px;">Mounjaro<br>Bariatrico</h1><div class="quiz-loading-divider"><span class="quiz-loading-leaf"></span></div><p class="quiz-loading-copy">Estamos analisando suas respostas...</p><div class="quiz-loading-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 14.5 19 19"></path><path d="M6.75 4.75h6.5a2 2 0 0 1 2 2v6.5a2 2 0 0 1-2 2h-6.5a2 2 0 0 1-2-2v-6.5a2 2 0 0 1 2-2Z"></path><path d="M8.75 8.25h3.5"></path><path d="M8.75 11.25h3.5"></path></svg></div><div class="quiz-loading-percent" data-quiz-progress-label>' + target + '%</div><div class="quiz-loading-bar"><div class="quiz-loading-fill quiz-progress-fill" data-quiz-progress-fill style="width:0%"></div></div><div class="quiz-loading-safe"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 6 5.25v5.1c0 4.08 2.56 7.88 6 9.15 3.44-1.27 6-5.07 6-9.15v-5.1L12 3Z"></path><path d="m9.5 11.75 1.75 1.75 3.25-3.5"></path></svg><span>Seus dados estao seguros conosco.</span></div></section></main>';
    return {
      label: document.querySelector('[data-quiz-progress-label]'),
      fill: document.querySelector('[data-quiz-progress-fill]')
    };
  }
`;

  text = text.slice(0, start) + replacement + text.slice(end + 1);
  fs.writeFileSync(file, text);
}

function patchTestimonial(file) {
  let text = fs.readFileSync(file, 'utf8');
  const marker = '<!-- testimonial-carousel-patch -->';
  if (text.includes(marker)) return;
  const injection = `${marker}
<style>
  html, body { overflow-x: hidden; }
  #bottomBar { left: 0 !important; transform: none !important; }
  .testimonial-carousel-patch { position: relative; width: min(353px, calc(100vw - 40px)); max-width: 100%; aspect-ratio: 9 / 16; margin: 18px auto 24px; overflow: hidden; border-radius: 18px; box-shadow: 0 14px 34px rgba(2,6,23,.14); background: #111; contain: layout paint; }
  .testimonial-carousel-track { position: relative; width: 100%; height: 100%; }
  .testimonial-carousel-track img { position: absolute; inset: 0; width: 100%; height: 100%; display: block; object-fit: contain; background: #111; opacity: 0; animation: testimonialFade 8s ease-in-out infinite; }
  .testimonial-carousel-track img:nth-child(1) { animation-delay: 0s; }
  .testimonial-carousel-track img:nth-child(2) { animation-delay: 4s; }
  .testimonial-carousel-dots { display: flex; justify-content: center; gap: 7px; margin: 10px 0 0; }
  .testimonial-carousel-dots span { width: 7px; height: 7px; border-radius: 999px; background: #cbd5e1; animation: testimonialDot 8s ease-in-out infinite; }
  .testimonial-carousel-dots span:nth-child(2) { animation-delay: 4s; }
  @keyframes testimonialFade { 0%, 43% { opacity: 1; } 50%, 100% { opacity: 0; } }
  @keyframes testimonialDot { 0%, 43% { background: #159447; transform: scale(1.25); } 50%, 100% { background: #cbd5e1; transform: scale(1); } }
</style>
<script>
(function () {
  function installTestimonialCarousel() {
    if (document.querySelector('.testimonial-carousel-patch')) return;
    var imgs = Array.prototype.slice.call(document.images).filter(function (img) {
      return img.naturalWidth > 500 && img.naturalHeight > 450;
    });
    var anchor = imgs[0];
    if (!anchor) return;
    var first = anchor.currentSrc || anchor.src;
    var carousel = document.createElement('div');
    carousel.className = 'testimonial-carousel-patch';
    carousel.innerHTML = '<div class="testimonial-carousel-track"><img src="' + first + '" alt="Depoimento Claudia"><img src="${testimonialData}" alt="Depoimento Renata"></div><div class="testimonial-carousel-dots"><span></span><span></span></div>';
    anchor.insertAdjacentElement('afterend', carousel);
    anchor.style.display = 'none';
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', installTestimonialCarousel);
  else installTestimonialCarousel();
})();
</script>
`;
  text = text.replace('<!-- quiz-step-router:start -->', injection + '<!-- quiz-step-router:start -->');
  fs.writeFileSync(file, text);
}

function removeBlockedRouterScript(file) {
  let text = fs.readFileSync(file, 'utf8');
  const next = text.replace(/<script\s+src=["']router\.js["']\s*><\/script>\s*/gi, '');
  if (next !== text) fs.writeFileSync(file, next);
}

for (const file of loadingTargets) patchLoading(file);
patchTestimonial('58ebfcef-dd4c-46a3-a53d-fcfeb3767da1.htm');
patchTestimonial('29efc28c-63c3-41b6-b43b-89cddf68ed06.htm');
for (const file of fs.readdirSync('.').filter((f) => f.endsWith('.htm'))) removeBlockedRouterScript(file);
console.log('patched loading experience, testimonial carousel, and blocked router script tags');
