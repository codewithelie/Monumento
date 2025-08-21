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

const api = express.Router();
app.use('/api', api);

// Routes
app.get('/', (req, res) => {
  res.send('Bienvenue sur l\'API Monumento ! Utilisez les routes pour interagir avec les monuments.');
});

//monuments routes
require('./src/routes/monuments/searchMonuments.js')(api);
require('./src/routes/monuments/findAllMonuments')(api);
require('./src/routes/monuments/findMonumentByPK')(api);
require('./src/routes/monuments/createMonument')(api);
require('./src/routes/monuments/updateMonument')(api);
require('./src/routes/monuments/deleteMonument')(api);

//auth routes
require('./src/routes/auth/login')(api);
require('./src/routes/auth/register')(api);
require('./src/routes/auth/refreshToken')(api);

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
