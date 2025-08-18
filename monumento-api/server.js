// Paqkage: monumento-api
const express = require('express');
let monuments = require('./src/db/mock-monument.js');
const morgan = require('morgan');
const favicon = require('serve-favicon');
const { success } = require('./helper.js');
const sequelize = require('./src/db/sequelize.js');

// Création de l'application Express
const app = express(); 
const port = 3000;

sequelize.initializeDatabase();

// Middlewares
app
  .use(favicon(__dirname + '/favicon.ico'))
  .use(morgan('dev'))
  .use(express.json()); 

app.get('/', (req, res) => {
  res.send('Hello World!');
});

//app.METHOD(CHEMIN, GESTIONNAIRE(req, res))
// Routes
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

app.post('/monuments', (req, res) => {
  const id = 123;
  const monumentCreated = { ...req.body, ...{id: id, created: new Date()} };
  monuments.push(monumentCreated);
  const message = `Le monument avec l'ID ${id} a bien été créé.`;
  res.json(success(message, monumentCreated));
});

app.put('/monuments/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const monumentUpdated = { ...req.body, id: id};
  monuments = monuments.map(m => m.id === id ? monumentUpdated : m);
  const message = `Le monument avec l'ID ${id} a bien été mis à jour.`;
  res.json(success(message, monumentUpdated));
});

app.delete('/monuments/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const monumentDeleted = monuments.filter(m => m.id === id);
  monuments = monuments.filter(m => m.id !== id);
  const message = `Le monument avec l'ID ${id} a bien été supprimé.`;
  res.json(success(message, monumentDeleted)); 
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
