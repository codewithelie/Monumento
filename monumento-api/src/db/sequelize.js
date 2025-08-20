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
  try { 
    await sequelize.sync({ alter: true });
    console.log('Les modèles ont été synchronisés avec la base de données.');

    // await createUser('admin', 'admin');
    // await createMonuments();

  } catch (err) {
    console.error('Erreur lors de la synchronisation des modèles:', err);
  }
}

const createUser = async (username, password) => {
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      username,
      password: hash,
    });
    console.log(`Utilisateur ${username} créé avec succès.`);
    return user;
  } catch (err) {
    console.error(`Erreur lors de la création de l'utilisateur ${username}:`, err);
  }
};

const createMonuments = async () => {
  try {
    for (const monument of monuments) {
      await MonumentModel.create({
        id: monument.id,
        title: monument.name,
        country: monument.country,
        city: monument.city,
        buildYear: monument.buildYear,
        picture: monument.picture,
        description: monument.description,
        created: monument.created,
      });
    }
    console.log('Tous les monuments ont été créés avec succès.');
  } catch (err) {
    console.error('Erreur lors de la création des monuments:', err);
  }
};

module.exports = { initializeDatabase, MonumentModel, UserModel };