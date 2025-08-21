const { MonumentModel } = require('../db/sequelize.js');
const { Op, json } = require('sequelize');
const auth = require('../auth/auth.js');
const { handleError } = require('../../helper.js');

module.exports = (app) => {
  app.get('/monuments/search', auth, async (req, res) => {
    const { q, limit = 10, offset = 0, order = 'desc', orderBy = 'name' } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        message: 'La requête de recherche doit contenir au moins 2 caractères.',
        data: null,
      });
    }

    const sortOrder = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    try {
      const monuments = await MonumentModel.findAndCountAll({
        where: {
          [Op.or]: [
            { name: { [Op.like]: `%${q}%` } },
            { description: { [Op.like]: `%${q}%` } },
          ],
        },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [[orderBy, sortOrder]],
      });

      if (monuments.count > 0) {
        const message = `Recherche réussie pour "${q}". ${monuments.count} monument(s) trouvé(s).`;
        return res.json({ message, data: monuments.rows, total: monuments.count });
      } else {
        const message = `Aucun monument trouvé pour la recherche "${q}".`;
        return res.status(404).json({ message, data: null });
      }
    } catch (error) {
      return handleError(res, error);
    }
  });
};