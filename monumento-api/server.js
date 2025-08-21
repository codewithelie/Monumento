// Paqkage: monumento-api
const express = require('express');
const morgan = require('morgan');
const favicon = require('serve-favicon');
const { success } = require('./helper.js');
const sequelize = require('./src/db/sequelize.js');

// Création de l'application Express
const app = express(); 
const port = 3000;

// Middlewares
app
  .use(favicon(__dirname + '/favicon.ico'))
  .use(morgan('dev'))
  .use(express.json()); 

// Initialisation de la base de données
sequelize.initializeDatabase();

// Routes
app.get('/', (req, res) => {
  res.send('Bienvenue sur l\'API Monumento ! Utilisez les routes pour interagir avec les monuments.');
});

require('./src/routes/searchMonuments')(app);
require('./src/routes/findAllMonuments')(app);
require('./src/routes/findMonumentByPK')(app);
require('./src/routes/createMonument')(app);
require('./src/routes/updateMonument')(app);
require('./src/routes/deleteMonument')(app);
require('./src/routes/login')(app);
require('./src/routes/register')(app);

app.use((req, res) => {
  const url = req.originalUrl;
  const method = req.method;
  const message = `La ressource demandée : "${method} ${url}" n'existe pas. Réessayez avec une autre URL.`;
  res.status(404).json({ message });
});

// Lancement du serveur
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
