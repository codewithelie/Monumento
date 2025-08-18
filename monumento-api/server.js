// Paqkage: monumento-api
const express = require('express');
let monuments = require('./mock-monument.js');
const morgan = require('morgan');
const favicon = require('serve-favicon');
const { success } = require('./helper.js');
const { Sequelize, DataTypes } = require('sequelize');

// Création de l'application Express
const app = express(); 
const port = 3000;

//setup de la connexion à la base de données
const sequelize = new Sequelize(
  'monumento',
  'root',
  'root',
  {
    host: 'localhost',
    port: 8889,
    dialect: 'mysql',
    dialectOptions: {
      timezone: 'Etc/GMT+2',
    },
    logging: true,
  } 
)

// Test de la connexion à la base de données
sequelize
  .authenticate()
  .then(() => {  console.log('La connexion à la base de données a été établie avec succès.'); })
  .catch(err => { console.error('Impossible de se connecter à la BDD:', err); });

// Importation des models
const MonumentModel = require('./src/models/monument.js')(sequelize, DataTypes);

// Synchronisation des modèles avec la base de données
sequelize.sync({alter: true})
  .then(() => { 
    
    // console.log('Les modèles ont été synchronisés avec la base de données.'); 
    // monuments.forEach(monument => {
    //   MonumentModel.create({
    //     id: monument.id,
    //     title: monument.name,
    //     country: monument.country,
    //     city: monument.city,
    //     buildYear: monument.buildYear,
    //     picture: monument.picture,
    //     description: monument.description,
    //     created: monument.created
    //   });
    // });
    // console.log('Les monuments ont été insérés dans la base de données.');

  })
  .catch(err => { console.error('Erreur lors de la synchronisation des modèles:', err); });

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
