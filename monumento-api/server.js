const express = require('express');
let monuments = require('./mock-monument.js');
const morgan = require('morgan');
const favicon = require('serve-favicon');
const { success } = require('./helper.js');

const app = express(); 
const port = 3000;

app
  .use(favicon(__dirname + '/favicon.ico'))
  .use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

//app.METHOD(CHEMIN, GESTIONNAIRE(req, res))

app.get('/monuments', (req, res) => {
    const message = 'La liste des monuments a bien été récupérée.';
    res.json(success(message, monuments));
});

app.get('/monuments/:id', (req, res) => {
    const id = req.params.id;
    const monument = monuments.find(m => m.id === parseInt(id));
    const message = `Le monument avec l'ID ${id} a bien été trouvé.`;
    res.json(success(message, monument));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
