(function () {
  window.nextStep = window.nextStep || null;
  window.isNavigating = false;

  function ensureLoadingStyles() {
    if (document.querySelector('link[href$="shared.css"]') || document.getElementById('quiz-shared-loading-style')) return;
    const style = document.createElement('style');
    style.id = 'quiz-shared-loading-style';
    style.textContent = `
      .quiz-loading-shell { min-height: 100vh; width: 100%; display: flex; align-items: flex-start; justify-content: center; padding: clamp(34px, 7vh, 74px) 18px 48px; background: radial-gradient(circle at 12% 88%, rgba(126, 181, 49, .24), transparent 26%), radial-gradient(circle at 100% 50%, rgba(137, 190, 54, .16), transparent 34%), linear-gradient(180deg, #ffffff 0%, #f8fbf4 100%); overflow: hidden; }
      .quiz-loading-card { position: relative; width: min(560px, calc(100vw - 36px)); min-height: min(700px, calc(100vh - 76px)); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: clamp(34px, 5.5vw, 60px) clamp(28px, 6vw, 72px); text-align: center; color: #082a12; border-radius: 42px; background: rgba(255,255,255,.94); box-shadow: 0 24px 70px rgba(20,59,24,.12); overflow: hidden; }
      .quiz-loading-card:before { content: ""; position: absolute; inset: 0; border-top: 8px solid #8fbd31; border-radius: inherit; pointer-events: none; box-shadow: inset 0 1px 0 rgba(9,79,25,.28); }
      .quiz-loading-card:after { content: ""; position: absolute; left: -8%; right: -8%; bottom: -8%; height: 22%; border-radius: 50% 50% 0 0; background: rgba(143,189,49,.10); transform: rotate(-5deg); pointer-events: none; }
      .quiz-loading-title { position: relative; z-index: 1; margin: 0; font-size: clamp(44px, 9.2vw, 96px); line-height: .98; font-weight: 900; letter-spacing: 0; color: #06350f; text-shadow: 0 7px 22px rgba(11,73,24,.12); }
      .quiz-loading-divider { position: relative; z-index: 1; display: flex; align-items: center; justify-content: center; gap: 18px; width: min(330px, 80%); margin: clamp(20px, 3vw, 30px) auto 20px; color: #92bd33; }
      .quiz-loading-divider:before, .quiz-loading-divider:after { content: ""; flex: 1; height: 2px; background: currentColor; opacity: .65; }
      .quiz-loading-leaf { width: 28px; height: 18px; border-radius: 18px 0 18px 0; background: currentColor; transform: rotate(-26deg); }
      .quiz-loading-copy { position: relative; z-index: 1; margin: 0; max-width: 520px; font-size: clamp(22px, 4vw, 34px); line-height: 1.32; font-weight: 500; color: #303841; }
      .quiz-loading-icon { position: relative; z-index: 1; width: clamp(66px, 9vw, 84px); height: clamp(66px, 9vw, 84px); margin: clamp(20px, 3vw, 28px) auto 18px; border-radius: 50%; background: #eef5df; display: flex; align-items: center; justify-content: center; color: #557b22; animation: quizLoadingPulse 1.45s ease-in-out infinite; }
      .quiz-loading-icon svg { width: 58%; height: 58%; stroke: currentColor; fill: none; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; }
      .quiz-loading-percent { position: relative; z-index: 1; margin: 0 0 22px; font-size: clamp(34px, 6vw, 52px); line-height: 1; font-weight: 900; color: #4b7922; }
      .quiz-loading-bar { position: relative; z-index: 1; width: min(520px, 100%); height: 26px; border-radius: 999px; background: #edf2df; overflow: hidden; box-shadow: inset 0 1px 2px rgba(4,44,12,.06); }
      .quiz-loading-fill { width: 0%; height: 100%; border-radius: inherit; background: linear-gradient(90deg, #4a9e24 0%, #9bd629 100%); box-shadow: 0 0 22px rgba(119,183,35,.35); transition: width .08s linear; }
      .quiz-loading-safe { position: relative; z-index: 1; display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: clamp(28px, 5vw, 48px); color: #66706d; font-size: clamp(16px, 3vw, 22px); }
      .quiz-loading-safe svg { width: 30px; height: 30px; stroke: #557b22; fill: none; stroke-width: 2; }
      @keyframes quizLoadingPulse { 0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(143,189,49,.18); } 50% { transform: scale(1.04); box-shadow: 0 0 0 18px rgba(143,189,49,0); } }
      @media (max-width: 520px) {
        .quiz-loading-shell { padding: 30px 12px 34px; }
        .quiz-loading-card { min-height: calc(100vh - 64px); border-radius: 28px; padding: 42px 24px; }
        .quiz-loading-card:before { border-top-width: 6px; }
        .quiz-loading-title { font-size: clamp(42px, 14vw, 62px); }
        .quiz-loading-copy { font-size: 22px; }
        .quiz-loading-bar { height: 26px; }
      }
    `;
    document.head.appendChild(style);
  }

  function createLoadingMarkup(percent) {
    return `
<main class="quiz-loading-shell" aria-live="polite">
  <section class="quiz-loading-card">
    <div style="position:relative;z-index:1;display:inline-flex;align-items:center;gap:8px;padding:10px 18px;border-radius:999px;background:rgba(143,189,49,.14);color:#4b7922;font-size:14px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;">Analise personalizada</div>
    <h1 class="quiz-loading-title" style="margin-top:24px;">Mounjaro<br>Bariatrico</h1>
    <div class="quiz-loading-divider"><span class="quiz-loading-leaf"></span></div>
    <p class="quiz-loading-copy">Estamos analisando suas respostas...</p>
    <div class="quiz-loading-icon">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14.5 14.5 19 19"></path>
        <path d="M6.75 4.75h6.5a2 2 0 0 1 2 2v6.5a2 2 0 0 1-2 2h-6.5a2 2 0 0 1-2-2v-6.5a2 2 0 0 1 2-2Z"></path>
        <path d="M8.75 8.25h3.5"></path>
        <path d="M8.75 11.25h3.5"></path>
      </svg>
    </div>
    <div id="dynamic-progress-text" class="quiz-loading-percent">${percent}%</div>
    <div class="quiz-loading-bar">
      <div id="dynamic-progress-fill" class="quiz-loading-fill" style="width:0%"></div>
    </div>
    <div class="quiz-loading-safe">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3 6 5.25v5.1c0 4.08 2.56 7.88 6 9.15 3.44-1.27 6-5.07 6-9.15v-5.1L12 3Z"></path>
        <path d="m9.5 11.75 1.75 1.75 3.25-3.5"></path>
      </svg>
      <span>Seus dados estao seguros conosco.</span>
    </div>
  </section>
</main>`;
  }

  window.spaGoToNext = async function(targetStep) {
    targetStep = targetStep || window.nextStep;
    if (window.isNavigating || !targetStep) return;
    window.nextStep = targetStep;

    window.isNavigating = true;
    document.documentElement.classList.add('quiz-step-exiting');

    try {
      const res = await fetch(targetStep);
      const html = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const newMain = doc.querySelector('main');
      if (newMain) {
        const progressNum = doc.querySelector('#quiz-progress-number');
        const isFixedLoading = newMain.innerHTML.includes('Estamos analisando suas respostas...');

        if (progressNum || isFixedLoading) {
          let pct = 50;
          if (progressNum) {
            pct = parseInt(progressNum.textContent) || 50;
          } else {
            const match = newMain.innerHTML.match(/(\d+)%/);
            if (match) pct = parseInt(match[1]);
          }

          ensureLoadingStyles();
          document.querySelector('main').outerHTML = createLoadingMarkup(pct);

          const scripts = doc.querySelectorAll('script');
          let foundNext = false;
          for (const script of scripts) {
            const match = script.textContent.match(/var nextStep = ['"]([^'"]+)['"]/);
            if (match) {
              window.nextStep = match[1];
              foundNext = true;
              break;
            }
          }

          document.documentElement.classList.remove('quiz-step-exiting');

          let currentPct = 0;
          const targetPct = pct;
          const fill = document.getElementById('dynamic-progress-fill');
          const txt = document.getElementById('dynamic-progress-text');
          const interval = setInterval(() => {
            currentPct += Math.random() * 15;
            if (currentPct > targetPct) currentPct = targetPct;
            if (fill) fill.style.width = currentPct + '%';
            if (txt) txt.textContent = Math.floor(currentPct) + '%';
            if (currentPct >= targetPct) {
              clearInterval(interval);
              setTimeout(() => {
                window.isNavigating = false;
                window.spaGoToNext(window.nextStep);
              }, 400);
            }
          }, 250);
          return;
        }

        document.querySelector('main').replaceWith(newMain);
      }

      const scripts = doc.querySelectorAll('script');
      let foundNext = false;
      for (const script of scripts) {
        const match = script.textContent.match(/var nextStep = ['"]([^'"]+)['"]/);
        if (match) {
          window.nextStep = match[1];
          foundNext = true;
          break;
        }
      }
      if (!foundNext) window.nextStep = null;

      if (typeof window.enhanceCards === 'function') window.enhanceCards();
      if (typeof window.enhanceBodyMap === 'function') window.enhanceBodyMap();
      if (typeof window.enhanceRuler === 'function') window.enhanceRuler();
      if (typeof window.decorateComparisonChoice === 'function') window.decorateComparisonChoice();
      if (typeof window.animateBmiCircle === 'function') window.animateBmiCircle();

      history.pushState(null, '', '/' + window.nextStep);
      window.scrollTo(0, 0);
      window.isNavigating = false;
      document.documentElement.classList.remove('quiz-step-exiting');
    } catch (e) {
      console.error('Navigation error:', e);
      window.location.href = window.nextStep;
    }
  };

  console.log('SPA Router Initialized.');
})();
