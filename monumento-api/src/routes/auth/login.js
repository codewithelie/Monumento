const { UserModel } = require('../../db/sequelize.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const privateKey =  fs.readFileSync('./src/auth/jwtRS256.key');
const { handleError } = require('../../../helper.js');

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Connexion utilisateur
 *     description: Authentifie un utilisateur et retourne un accessToken et un refreshToken.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 example: monmotdepasse
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Connexion réussie.
 *                 data:
 *                   type: object
 *                   properties:
 *                     userName:
 *                       type: string
 *                       example: John Doe
 *                     accessToken:
 *                       type: string
 *                       example: eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     refreshToken:
 *                       type: string
 *                       example: eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Mot de passe manquant
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Le mot de passe est obligatoir.
 *                 data:
 *                   type: "null"
 *       401:
 *         description: Identifiants invalides ou mot de passe incorrect
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Aucun utilisateur trouvé avec ce nom d'utilisateur.
 *                 data:
 *                   type: "null"
 */
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

      const accesstToken = jwt.sign(
        { userName: user.username },
        privateKey,
        { algorithm: 'RS256', expiresIn: '1m' }
      );
      const refreshToken = jwt.sign(
        { userName: user.username },
        privateKey,
        { algorithm: 'RS256', expiresIn: '7d' }
      );

      const decodedRefreshToken = jwt.decode(refreshToken);
      const refreshTokenExpiry = new Date(decodedRefreshToken.exp * 1000);

      user.refreshToken = refreshToken;
      user.refreshTokenExpiry = refreshTokenExpiry;
      await user.save();

      return res.json({
        message: 'Connexion réussie.',
        data: { userName: user.name, accessToken: accesstToken, refreshToken: refreshToken }
      });

    } catch (error) {
      return handleError(res, error);
    }
  });
};