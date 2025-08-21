const { MonumentModel } = require('../db/sequelize.js');
const auth = require('../auth/auth.js');
const { handleError } = require('../../helper.js');


module.exports = (app) => {
  app.post('/monuments', auth, async (req, res) => {
    const monument = req.body;
    try {
      const createdMonument = await MonumentModel.create(monument);
      const message = 'Le monument a bien été créé.';
      return res.status(201).json({ message, data: createdMonument });
    } catch (error) {
      const msgValidation = 'Le monument n\'a pas pu être créé. Réessayez dans quelques instants.';
      return handleError(res, error, msgValidation);
    }
  })
}