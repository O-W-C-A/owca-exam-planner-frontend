const fs = require('fs');
const https = require('https');
const next = require('next');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  https.createServer(
    {
      key: fs.readFileSync(path.resolve(__dirname, 'private.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'certificate.crt')),
    },
    (req, res) => {
      handle(req, res);
    }
  ).listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on https://localhost:3000');
  });
});
