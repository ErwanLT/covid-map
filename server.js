const express = require('express');

const app = express();

app.use(express.static('./dist/covid-map'));

app.get('/*', (req, res) =>
  res.sendFile('index.html', {root: 'dist/covid-map/'}),
);

app.listen(process.env.PORT || 8080);
