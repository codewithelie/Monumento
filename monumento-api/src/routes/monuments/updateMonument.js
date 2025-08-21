const { MonumentModel } = require('../../db/sequelize.js');
const auth = require('../../auth/auth.js');
const { handleError } = require('../../../helper.js');

module.exports = (app) => {
  app.put('/monuments/:id', auth, async (req, res) => {
    const id = parseInt(req.params.id);
    const monumentData = req.body;

    try {
      const monument = await MonumentModel.findByPk(id);
      if (!monument) {
        const message = `Aucun monument trouvé avec l'ID ${id}.`;
        return res.status(404).json({ message, data: null });
      }

      await MonumentModel.update(monumentData, { where: { id } });

      const message = `Le monument avec l'ID ${id} a bien été mis à jour.`;
      const monumentUpdated = { ...monument.toJSON(), ...monumentData };
      return res.json({ message, data: monumentUpdated });

    } catch (error) {
      const msgValidation = 'Le monument n\'a pas pu être mis à jour. Réessayez dans quelques instants.';
      return handleError(res, error, msgValidation);
    }
  });
};