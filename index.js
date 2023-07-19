import dns from 'dns';
import express from 'express';
import cors from 'cors';
const app = express();
import Urls from './repositories/urls.js';
let urlsRepo = new Urls();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.post('/api/shorturl', function(req, res) {
  try {
    let url = new URL(req.body.url);
    dns.lookup(url.hostname, (err, address, family) => {
      if(err) {
        res.json({ error: "Invalid URL" })
      } else {
        urlsRepo.findOneByUrl(url.href).then(result => {
          if(result != undefined) {
            res.json({original_url: result.href, short_url: result._id });
          } else {
            urlsRepo.createAndSaveUrl(url.href).then(result => {
              res.json({original_url: result.href, short_url: result._id });
            });
          }
        });
      }
    })
  } catch {
    res.json({ error: "Invalid URL" })
  }
});

app.get('/api/shorturl/:id?', function(req, res) {
  let urlId = req.params.id;
  urlsRepo.findUrlById(urlId).then(result => {
    if(result != undefined) {
      res.redirect(result.href);
    } else {
      res.json({"error": "No short URL found for the given input"});
    }
  });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
