const { MonumentModel } = require('../../db/sequelize.js');
const auth = require('../../auth/auth.js');
const { handleError } = require('../../../helper.js');

module.exports = (app) => {
  app.delete('/monuments/:id', auth, async (req, res) => {
    const id = parseInt(req.params.id, 10);

    try {
      const monument = await MonumentModel.findByPk(id);

      if (!monument) {
        return res.status(404).json({
          message: `Aucun monument trouvé avec l'ID ${id}.`,
          data: null
        });
      }

      await MonumentModel.destroy({ where: { id } });

      return res.json({
        message: `Le monument avec l'ID ${id} a bien été supprimé.`,
        data: monument
      });

    } catch (error) {
      return handleError(res, error);
    }
  });
};
