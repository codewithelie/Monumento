const { UserModel } = require('../../db/sequelize.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const publicKey =  fs.readFileSync('./src/auth/jwtRS256.key.pub');
const privateKey =  fs.readFileSync('./src/auth/jwtRS256.key');
const { handleError } = require('../../../helper.js');
const { Op } = require('sequelize');

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