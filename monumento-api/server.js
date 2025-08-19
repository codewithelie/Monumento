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

// Middlewares
app
  .use(favicon(__dirname + '/favicon.ico'))
  .use(morgan('dev'))
  .use(express.json()); 

sequelize.initializeDatabase();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Routes
require('./src/routes/findAllMonuments')(app);
require('./src/routes/findMonumentByPK')(app);
require('./src/routes/createMonument')(app);
require('./src/routes/updateMonument')(app);
require('./src/routes/deleteMonument')(app);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
