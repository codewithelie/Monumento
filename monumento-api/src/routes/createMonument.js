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
        if(error.name === 'SequelizeValidationError') {
          const validationErrors = error.errors.map(e => e.message);
          const message = 'Le monument n\'a pas pu être créé. Vérifiez les données envoyées.';
          return res.status(400).json({ message, data: validationErrors });
        }

        const message = 'Le monument n\'a pas pu être créé. Réessayez dans quelques instants.';
        res.status(500).json({ message, data: error });
      });
  });
}