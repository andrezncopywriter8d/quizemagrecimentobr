const fs = require('fs');

const filesToFix = [
  'quiz-progress-54.htm',
  'quiz-progress-60.htm',
  'quiz-progress-96.htm',
  'quiz-progress-99-final.htm'
];

const logoBase64 = fs.readFileSync('c:/Users/games/Downloads/quiz em/logo_base64.txt', 'utf8');

filesToFix.forEach(file => {
  const filepath = 'c:/Users/games/Downloads/quiz em/' + file;
  let content = fs.readFileSync(filepath, 'utf8');
  
  // Find the percentage
  const match = file.match(/quiz-progress-(\d+)/);
  const percent = match ? match[1] : 100;
  
  // The new main content
  const newMain = `<main class="flex w-full min-w-80 max-w-lg flex-auto flex-col items-center justify-center p-4">
<div class="flex flex-col items-center w-full bg-white p-6 rounded-2xl border-2 border-dashed border-gray-300" style="box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);">
  <img alt="Logo" width="100" height="100" src="${logoBase64}" style="width:100px; height:auto; margin-bottom:1rem;">
  <h1 class="text-xl font-bold text-gray-800" style="margin-bottom:0.5rem; text-align:center;">Mounjaro Bariátrico</h1>
  <p class="text-sm text-gray-500" style="margin-bottom:1.5rem; text-align:center;">Estamos analisando suas respostas...</p>
  
  <div class="w-full relative flex items-center rounded-full p-1" style="background-color:rgb(229,231,235);">
    <div class="h-6 rounded-full" style="width:${percent}%; background-color:rgb(22, 163, 74); background-image:linear-gradient(to right,rgba(22,163,74,0.7),rgb(22,163,74));"></div>
    <div class="absolute w-full text-center text-xs font-bold text-white" style="text-shadow: 0px 1px 2px rgba(0,0,0,0.6);">${percent}%</div>
  </div>
</div>
</main>`;

  // Replace the old <main> tag and its contents
  const replacedContent = content.replace(/<main[^>]*>([\s\S]*?)<\/main>/i, newMain);
  
  if (replacedContent !== content) {
    fs.writeFileSync(filepath, replacedContent);
    console.log('Fixed ' + file);
  } else {
    console.log('Could not find <main> in ' + file);
  }
});
