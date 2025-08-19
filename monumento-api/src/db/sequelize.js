const { Sequelize, DataTypes } = require('sequelize');
let monuments = require('./mock-monument.js');

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

// Importation des models
const MonumentModel = require('../models/monument.js')(sequelize, DataTypes);

// Synchronisation des modèles avec la base de données
const initializeDatabase = async () => {
    return sequelize.sync()
  .then(() => { 
    console.log('Les modèles ont été synchronisés avec la base de données.'); 
  })
  .catch(err => { console.error('Erreur lors de la synchronisation des modèles:', err); });
}

module.exports = { initializeDatabase, MonumentModel };