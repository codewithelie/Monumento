const { MonumentModel } = require('../db/sequelize.js');
const { Op } = require('sequelize');

module.exports = (app) => {
  app.get('/monuments', (req, res) => {
    if(req.query.name) {
      const { name, limit, orderBy } = req.query;

      MonumentModel.findAll({ 
        where: {
          name: {
            [Op.like]: `%${name}%`
          }
        },
        limit: limit ? parseInt(limit) : undefined,
        order: orderBy ? [[orderBy, 'ASC']] : undefined
      })
        .then(monuments => {
          if (monuments.length > 0) {
            const message = `Les monuments avec le nom ${name} ont bien été trouvés.`;
            res.json({ message, data: monuments });
          } else {
            const message = `Aucun monument trouvé avec le nom ${name}.`;
            res.status(404).json({ message, data: null });
          }
        });
    }else{
      MonumentModel.findAll()
        .then(monuments => {
          const message = 'La liste des monuments a bien été récupérée.';
          res.json({message, data: monuments});
        })
        .catch(error => {
          const message = 'La liste des monuments n\'a pas pu être récupérée. Réessayez dans quelques instants.';
          res.status(500).json({ message: message, data: error });
        });
    }
  });
}