const { UserModel } = require('../db/sequelize.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const privateKey =  fs.readFileSync('./src/auth/jwtRS256.key');
const publicKey = fs.readFileSync('./src/auth/jwtRS256.key.pub');

module.exports = (app) => {
    app.post('/register', (req, res) => {
        const { username, password } = req.body;
        if (!password) {
            const message = 'Le mot de passe est obligatoire.';
            return res.status(400).json({ message, data: null });
        }
        bcrypt.hash(password, 10)
            .then(hash => {
                UserModel.create({ username, password: hash })
                    .then(newUser => {
                        const token = jwt.sign(
                            { userName: newUser.username },
                            privateKey,
                            { algorithm: 'RS256', expiresIn: '1h' }
                        );

                        res.status(201).json({
                            message: 'L\'utilisateur a été créé avec succès.',
                            data: { userName: newUser.username, token },
                        });
                    })
                    .catch(error => {
                        if(error.name === 'SequelizeUniqueConstraintError') {
                            const message = `L'utilisateur avec le nom d'utilisateur "${username}" existe déjà.`;
                            return res.status(409).json({ message, data: null });
                        }
                        if(error.name === 'SequelizeValidationError') {
                            const validationErrors = error.errors.map(e => e.message);
                            const message = 'L\'utilisateur n\'a pas pu être enregistré. Vérifiez les données envoyées.';
                            return res.status(400).json({ message, data: validationErrors });
                        }
                        const message = `L'utilisateur n'a pas pu être enregistré. Réessayez dans quelques instants.`;
                        res.status(500).json({ message, data: error });
                    });
            })
            .catch(error => {
                const message = `L'utilisateur n'a pas pu être enregistré. Réessayez dans quelques instants.`;
                res.status(500).json({ message, data: error });
            });
    });
}