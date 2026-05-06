const fs = require('fs');

const files = fs.readdirSync('c:/Users/games/Downloads/quiz em').filter(f => f.endsWith('.htm'));
files.forEach(file => {
  const filepath = 'c:/Users/games/Downloads/quiz em/' + file;
  let content = fs.readFileSync(filepath, 'utf8');
  let changed = false;
  
  if (content.includes('setTimeout(function () { window.location.href = nextStep; }, 150);')) {
    content = content.replace(
      'setTimeout(function () { window.location.href = nextStep; }, 150);',
      'setTimeout(function () { if(window.spaGoToNext) { window.spaGoToNext(nextStep); } else { window.location.href = nextStep; } }, 150);'
    );
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(filepath, content);
    console.log('Fixed goToNext in ' + file);
  } else {
    console.log('No change needed in ' + file);
  }
});
