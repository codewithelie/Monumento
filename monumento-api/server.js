// Paqkage: monumento-api
const express = require('express');
const morgan = require('morgan');
const favicon = require('serve-favicon');
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

// Swagger documentation
require('./src/docs/swagger.js')(app);

// Routes
app.get('/', (req, res) => {
  res.send('Bienvenue sur l\'API Monumento ! Utilisez les routes pour interagir avec les monuments.');
});

//monuments routes
require('./src/routes/monuments/searchMonuments.js')(app);
require('./src/routes/monuments/findAllMonuments')(app);
require('./src/routes/monuments/findMonumentByPK')(app);
require('./src/routes/monuments/createMonument')(app);
require('./src/routes/monuments/updateMonument')(app);
require('./src/routes/monuments/deleteMonument')(app);

//auth routes
require('./src/routes/auth/login')(app);
require('./src/routes/auth/register')(app);
require('./src/routes/auth/refreshToken')(app);

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
