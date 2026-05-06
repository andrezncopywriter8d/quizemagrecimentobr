const fs = require('fs');
const files = fs.readdirSync('c:/Users/games/Downloads/quiz em').filter(f => f.endsWith('.htm'));

files.forEach(file => {
  const filepath = 'c:/Users/games/Downloads/quiz em/' + file;
  let content = fs.readFileSync(filepath, 'utf8');
  
  if (content.includes('})();\n</script>')) {
    const exposure = `
  window.enhanceCards = typeof enhanceCards !== 'undefined' ? enhanceCards : null;
  window.enhanceBodyMap = typeof enhanceBodyMap !== 'undefined' ? enhanceBodyMap : null;
  window.enhanceRuler = typeof enhanceRuler !== 'undefined' ? enhanceRuler : null;
  window.decorateComparisonChoice = typeof decorateComparisonChoice !== 'undefined' ? decorateComparisonChoice : null;
  window.animateBmiCircle = typeof animateBmiCircle !== 'undefined' ? animateBmiCircle : null;
  window.installAmandaVideo = typeof installAmandaVideo !== 'undefined' ? installAmandaVideo : null;
  window.installFinalVideo = typeof installFinalVideo !== 'undefined' ? installFinalVideo : null;
`;
    if (!content.includes('window.enhanceCards =')) {
      content = content.replace('})();\n</script>', exposure + '\n})();\n</script>');
      fs.writeFileSync(filepath, content);
      console.log('Exposed functions in ' + file);
    }
  }
});
