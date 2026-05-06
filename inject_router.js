const fs = require('fs');

const files = fs.readdirSync('c:/Users/games/Downloads/quiz em').filter(f => f.endsWith('.htm'));
files.forEach(file => {
  const filepath = 'c:/Users/games/Downloads/quiz em/' + file;
  let content = fs.readFileSync(filepath, 'utf8');
  if (!content.includes('src="router.js"')) {
    content = content.replace('<!-- quiz-step-router:end -->', '<script src="router.js"></script>\n<!-- quiz-step-router:end -->');
    fs.writeFileSync(filepath, content);
    console.log('Injected router.js into ' + file);
  }
});
