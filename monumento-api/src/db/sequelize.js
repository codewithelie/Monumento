const { Sequelize, DataTypes } = require('sequelize');
let monuments = require('./mock-monument.js');
const bcrypt = require('bcrypt');

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
const UserModel = require('../models/user.js')(sequelize, DataTypes);

// Synchronisation des modèles avec la base de données
const initializeDatabase = async () => {
    return sequelize.sync({alter: true})
  .then(() => { 
    console.log('Les modèles ont été synchronisés avec la base de données.'); 
    // bcrypt.hash('admin', 10)
    //   .then(hash => {
    //     return UserModel.create({
    //       username: 'admin',
    //       password: hash,
    //     });
    //   })
    //   .then(() => {
    //     console.log('Utilisateur admin créé avec succès.');
    //   })
    //   .catch(err => {
    //     console.error('Erreur lors de la création de l\'utilisateur admin:', err);
    //   });
  })
  .catch(err => { console.error('Erreur lors de la synchronisation des modèles:', err); });
}

module.exports = { initializeDatabase, MonumentModel, UserModel };