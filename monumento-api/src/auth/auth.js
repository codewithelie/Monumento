const jwt = require('jsonwebtoken');
const fs = require('fs');
const publicKey = fs.readFileSync('./src/auth/jwtRS256.key.pub');   

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token manquant ou invalide.', data: null });
    }
    
    const token = authHeader.split(' ')[1];
    
    jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token invalide ou expiré.', data: null });
        }
        
        req.user = decoded;
        next();
    });
}