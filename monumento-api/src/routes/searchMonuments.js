const { MonumentModel } = require('../db/sequelize.js');
const { Op, json } = require('sequelize');

module.exports = (app) => {

  //GET /monuments/search?q=totolimit=3&offset=6&order=asc&orderBy=city

  app.get('/monuments/search', (req, res) => {
    const { q, limit = 10, offset = 0, order = 'desc' } = req.query;

    if(!q || q.trim().length < 2) {
      const message = 'La requête de recherche doit contenir au moins 2 caractères.';
      return res.status(400).json({ message, data: null });
    }

    const sortOrder = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    MonumentModel.findAndCountAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${q}%` } },
          { description: { [Op.like]: `%${q}%` } }
        ]
      },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['name', sortOrder]]
    })
    .then((monuments) => {
      if (monuments.count > 0) {
        const message = `Recherche réussie pour "${q}". ${monuments.count} monuments trouvés.`;
        res.json({ message, data: monuments.rows, total: monuments.count });
      } else {
        const message = `Aucun monument trouvé pour la recherche "${q}".`;
        res.status(404).json({ message, data: null });
      }
    })
    .catch(error => {
      const message = 'La recherche des monuments a échoué. Veuillez réessayer plus tard.';
      res.status(500).json({ message, data: error });
    } );
  });
}