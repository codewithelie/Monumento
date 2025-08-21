const { UserModel } = require('../../db/sequelize.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const privateKey =  fs.readFileSync('./src/auth/jwtRS256.key');
const { handleError } = require('../../../helper.js');

/**
 * @openapi
 * /register:
 *   post:
 *     tags: [Auth]
 *     summary: Inscription d'un utilisateur
 *     description: Crée un nouvel utilisateur et renvoie un access token.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *           examples:
 *             exemple:
 *               value:
 *                 username: "admin"
 *                 password: "Admin#2025"
 *     responses:
 *       201:
 *         description: Utilisateur créé.
 *         headers:
 *           Cache-Control:
 *             schema:
 *               type: string
 *             description: no-store pour éviter la mise en cache des réponses d'auth.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: L'utilisateur a été créé avec succès.
 *                 data:
 *                   $ref: '#/components/schemas/RegisterResponse'
 *       400:
 *         description: Données manquantes ou invalides.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
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