const { MonumentModel } = require('../db/sequelize.js');
const auth = require('../auth/auth.js');

module.exports = (app) => {
  app.delete('/monuments/:id', auth, (req, res) => {
    const id = parseInt(req.params.id);

    MonumentModel.findByPk(id)
      .then(monument => {
        if (monument) {
          return MonumentModel.destroy({ where: { id: id } })
            .then(() => {
              const message = `Le monument avec l'ID ${id} a bien été supprimé.`;
              res.json({ message, data: monument });
            });
        } else {
          const message = `Aucun monument trouvé avec l'ID ${id}.`;
          res.status(404).json({ message, data: null });
        }
      })
      .catch(error => {
        const message = 'Le monument n\'a pas pu être supprimé. Réessayez dans quelques instants.';
        res.status(500).json({ message, data: error });
      });
  });
}