const { UserModel } = require('../db/sequelize.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const privateKey =  fs.readFileSync('./src/auth/jwtRS256.key');
const publicKey = fs.readFileSync('./src/auth/jwtRS256.key.pub');

module.exports = (app) => {
    app.post('/login', (req, res) => {
        const { username, password } = req.body

        UserModel.findOne({ where: { username } })
            .then(user => {
                if (!user) {
                    const message = `L'utilisateur demandé n'existe pas.`;
                    res.status(401).json({ message, data: null });
                }

                bcrypt.compare(password, user.password)
                    .then(isValid => {
                        if (!isValid) {
                            const message = `Le mot de passe est incorrect.`;
                            res.status(401).json({ message, data: null });
                        }else{
                            const token = jwt.sign(
                                { userName: user.username },
                                privateKey,
                                { algorithm: 'RS256', expiresIn: '1h' }
                            );

                            res.json({
                                message: 'L\'utilisateur a été connecté avec succès.',
                                data: { userName: user.name, token },
                            });
                        }
                    })
            })
            .catch(err => {
                const message = `L'utilisateur n'as pas pu être connecté. Réessayez dans quelques instants.`;
                res.status(500).json({ message, data: err });
            });
    });
}