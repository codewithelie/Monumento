const { UserModel } = require('../../db/sequelize.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const privateKey =  fs.readFileSync('./src/auth/jwtRS256.key');
const { handleError } = require('../../../helper.js');

module.exports = (app) => {
  app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: 'Le mot de passe est obligatoire.',
        data: null,
      });
    }

    try {
      const hash = await bcrypt.hash(password, 10);

      const newUser = await UserModel.create({
        username,
        password: hash,
      });

      const token = jwt.sign(
        { userName: newUser.username },
        privateKey,
        { algorithm: 'RS256', expiresIn: '1h' }
      );

      return res.status(201).json({
        message: 'L\'utilisateur a été créé avec succès.',
        data: { userName: newUser.username, token },
      });

    } catch (error) {
      return handleError(res, error);
    }
  });
}