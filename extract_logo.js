const fs = require('fs');
const content = fs.readFileSync('c:/Users/games/Downloads/quiz em/2b2a17b4-39bb-4c85-a406-0788b289e5c3.htm', 'utf8');
const match = content.match(/<img[^>]*width=200[^>]*src=[\"\']?(data:image\/[^\"\'>\s]+)[\"\']?/i);
if (match) {
    fs.writeFileSync('c:/Users/games/Downloads/quiz em/logo_base64.txt', match[1]);
    console.log('Logo saved!');
} else {
    console.log('Logo not found.');
}
