const fs = require('fs');
const files = fs.readdirSync('c:/Users/games/Downloads/quiz em').filter(f => f.endsWith('.htm'));
files.forEach(f => {
  const content = fs.readFileSync('c:/Users/games/Downloads/quiz em/' + f, 'utf8');
  // Match the inner text of the percentage label if it's a progress screen
  const isOriginalLoading = content.includes('rounded-full') && content.includes('animateProgressThenGo');
  if (isOriginalLoading) {
    const match = content.match(/<div[^>]*>(\d+)%<\/div>/);
    const pct = match ? match[1] : '?';
    console.log(f + ' -> ' + pct + '%');
  }
});
