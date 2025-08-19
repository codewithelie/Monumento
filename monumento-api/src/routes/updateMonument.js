const { MonumentModel } = require('../db/sequelize.js');

module.exports = (app) => {
  app.put('/monuments/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const monumentData = req.body;

    MonumentModel.update(monumentData, {
      where: { id: id }
    })
      .then(isUpdated => {
        const message = `Le monument avec l'ID ${id} a bien été mis à jour.`;
        const monumentUpdated = { ...monumentData, id: id };
        res.json({ message, data: monumentUpdated });
      })
      .catch(error => {
        const message = 'Le monument n\'a pas pu être mis à jour. Réessayez dans quelques instants.';
        res.status(500).json({ message, data: error });
      });
  });
}