const { UserModel } = require('../../db/sequelize.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const publicKey =  fs.readFileSync('./src/auth/jwtRS256.key.pub');
const privateKey =  fs.readFileSync('./src/auth/jwtRS256.key');
const { handleError } = require('../../../helper.js');
const { Op } = require('sequelize');

/**
 * @openapi
 * /refresh-token:
 *   post:
 *     tags: [Auth]
 *     summary: Rafraîchir le token d'accès
 *     description: Vérifie le refresh token et renvoie un nouvel access token.
 *     # Si tu as défini la sécurité JWT au niveau global, on la désactive ici :
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshRequest'
 *           examples:
 *             exemple:
 *               value:
 *                 refreshToken: "<jwt_refresh_token>"
 *     responses:
 *       200:
 *         description: Rafraîchissement réussi.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token de rafraîchissement réussi.
 *                 data:
 *                   $ref: '#/components/schemas/RefreshResponse'
 *       400:
 *         description: Refresh token manquant.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Refresh token invalide ou expiré.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
module.exports = (app) => {
    app.post('/refresh-token', async (req, res) => {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                message: 'Le token de rafraîchissement est obligatoire.',
                data: null
            });
        }

        try {
            const decoded = jwt.verify(refreshToken, publicKey, { algorithms: ['RS256'] });
            const user = await UserModel.findOne({ 
                where: { 
                    username: decoded.userName,
                    refreshTokenExpiry: {
                        [Op.gt]: new Date()
                    }
                } 
            });
            if (!user) {
                return res.status(401).json({
                    message: 'Token de rafraîchissement invalide ou expiré.',
                    data: null
                });
            }
            const newAccessToken = jwt.sign(
                { userName: user.username },
                privateKey,
                { algorithm: 'RS256', expiresIn: '1m' }
            );
            
            res.json({
                message: 'Token de rafraîchissement réussi.',
                data: { accessToken: newAccessToken }
            });

        } catch (error) {
            console.error('Erreur lors du rafraîchissement du token:', error);
            return handleError(res, error);
        }
    });
}