const { MonumentModel } = require('../db/sequelize.js');

module.exports = (app) => {
  app.put('/monuments/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const monumentData = req.body;

    MonumentModel.update(monumentData, {
      where: { id: id }
    })
      .then(isUpdated => {
        if (isUpdated[0] === 0) {
          const message = `Aucun monument trouvé avec l'ID ${id} ou aucune donnée à mettre à jour.`;
          res.status(404).json({ message, data: null });
        }
        const message = `Le monument avec l'ID ${id} a bien été mis à jour.`;
        const monumentUpdated = { ...monumentData, id: id };
        res.json({ message, data: monumentUpdated });
      })
      .catch(error => {
        if(error.name === 'SequelizeValidationError') {
          const validationErrors = error.errors.map(e => e.message);
          const message = 'Le monument n\'a pas pu être créé. Vérifiez les données envoyées.';
          return res.status(400).json({ message, data: validationErrors });
        }
        
        const message = 'Le monument n\'a pas pu être mis à jour. Réessayez dans quelques instants.';
        res.status(500).json({ message, data: error });
      });
  });
}