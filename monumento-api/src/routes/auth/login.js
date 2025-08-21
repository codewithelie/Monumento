const { UserModel } = require('../../db/sequelize.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const privateKey =  fs.readFileSync('./src/auth/jwtRS256.key');
const { handleError } = require('../../../helper.js');

module.exports = (app) => {
  app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "Le mot de passe est obligatoir.",
        data: null
      });
    }

    try {
      const user = await UserModel.findOne({ where: { username } });

      if (!user) {
        return res.status(401).json({
          message: `Aucun utilisateur trouvé avec ce nom d'utilisateur.`,
          data: null
        });
      }

      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        return res.status(401).json({
          message: 'Le mot de passe est incorrect.',
          data: null
        });
      }

      const token = jwt.sign(
        { userName: user.username },
        privateKey,
        { algorithm: 'RS256', expiresIn: '1h' }
      );

      return res.json({
        message: 'Connexion réussie.',
        data: { userName: user.name, token }
      });

    } catch (error) {
      return handleError(res, error);
    }
  });
};