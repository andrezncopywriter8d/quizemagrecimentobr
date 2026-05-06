const fs = require('fs');
const path = require('path');

const root = process.cwd();
const sourceFile = path.join(root, 'quiz-progress-54.htm');
const sharedCssPath = path.join(root, 'shared.css');

function extractRouterStyle(text) {
  const match = text.match(/<!-- quiz-step-router:start -->\s*<style>([\s\S]*?)<\/style>\s*<script>/i);
  if (!match) {
    throw new Error('Nao achei o bloco de style do quiz-step-router no arquivo base.');
  }
  return match[1].trim() + '\n';
}

function replaceRouterStyleWithLink(text) {
  return text.replace(
    /<!-- quiz-step-router:start -->\s*<style>[\s\S]*?<\/style>\s*<script>/i,
    '<!-- quiz-step-router:start -->\n<link rel="stylesheet" href="shared.css">\n<script>',
  );
}

function main() {
  const baseText = fs.readFileSync(sourceFile, 'utf8');
  const sharedCss = extractRouterStyle(baseText);
  fs.writeFileSync(sharedCssPath, sharedCss, 'utf8');

  const htmlFiles = fs.readdirSync(root).filter((file) => file.endsWith('.htm'));
  for (const file of htmlFiles) {
    const fullPath = path.join(root, file);
    const text = fs.readFileSync(fullPath, 'utf8');
    const next = replaceRouterStyleWithLink(text);
    if (next !== text) {
      fs.writeFileSync(fullPath, next, 'utf8');
    }
  }

  console.log(`shared.css gerado e ${htmlFiles.length} HTMLs processados.`);
}

main();
