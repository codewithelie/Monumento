const { MonumentModel } = require('../db/sequelize.js');

module.exports = (app) => {
  app.get('/monuments/:id', (req, res) => {
    const id = req.params.id; 
    MonumentModel.findByPk(id)
      .then(monument => {
        if (monument) {
          const message = `Le monument avec l'ID ${id} a bien été trouvé.`;
          res.json({ message, data: monument });
        } else {
          const message = `Aucun monument trouvé avec l'ID ${id}.`;
          res.status(404).json({ message, data: null });
        }
      })
      .catch(error => {
        const message = 'Le monument n\'a pas pu être récupéré. Réessayez dans quelques instants.';
        res.status(500).json({ message, data: error });
      });
  });
}