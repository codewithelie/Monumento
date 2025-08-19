const { MonumentModel } = require('../db/sequelize.js');

module.exports = (app) => {
  app.post('/monuments', (req, res) => {
    const monument = req.body;
    MonumentModel.create(monument)
      .then(createdMonument => {
        const message = 'Le monument a bien été créé.';
        res.status(201).json({ message, data: createdMonument });
      })
      .catch(error => {
        const message = 'Le monument n\'a pas pu être créé. Réessayez dans quelques instants.';
        res.status(500).json({ message, data: error });
      });
  });
}