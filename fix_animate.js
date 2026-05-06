const fs = require('fs');

const files = fs.readdirSync('c:/Users/games/Downloads/quiz em').filter(f => f.endsWith('.htm'));
files.forEach(file => {
  const filepath = 'c:/Users/games/Downloads/quiz em/' + file;
  let content = fs.readFileSync(filepath, 'utf8');
  let changed = false;
  
  if (content.includes('setTimeout(function () { goToNext(null); }, 550);')) {
    content = content.replace(
      'setTimeout(function () { goToNext(null); }, 550);',
      'setTimeout(function () { if(window.spaGoToNext) { window.spaGoToNext(nextStep); } else { goToNext(null); } }, 550);'
    );
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(filepath, content);
    console.log('Fixed animateProgressThenGo in ' + file);
  }
});
