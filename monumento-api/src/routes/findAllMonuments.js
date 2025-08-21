const { MonumentModel } = require('../db/sequelize.js');
const { Op } = require('sequelize');
const auth = require('../auth/auth.js');
const { handleError } = require('../../helper.js');

module.exports = (app) => {
  app.get('/monuments', auth, async (req, res) => {
    const { name, limit, orderBy } = req.query;

    const options = {};

    if (name && name.length >= 2) {
      options.where = {
        name: {
          [Op.like]: `%${name}%`
        }
      };
    } else if (name && name.length < 2) {
      return res.status(400).json({
        message: 'Le terme de recherche est trop court. Veuillez fournir au moins 2 caractères.',
        data: null
      });
    }

    if (limit) {
      const parsedLimit = parseInt(limit, 10);
      if (!isNaN(parsedLimit) && parsedLimit > 0) {
        options.limit = parsedLimit;
      }
    }

    if (orderBy) {
      options.order = [[orderBy, 'ASC']];
    }

    try {
      const monuments = await MonumentModel.findAll(options);
      
      if (name && monuments.length === 0) {
        return res.status(404).json({
          message: `Aucun monument trouvé avec le nom "${name}".`,
          data: null
        });
      }

      const message = name
        ? `Les monuments contenant "${name}" ont bien été trouvés.`
        : `La liste des monuments a bien été récupérée.`;

      res.json({ message, data: monuments });

    } catch (error) {
      return handleError(res, error);
    }
  });
};
