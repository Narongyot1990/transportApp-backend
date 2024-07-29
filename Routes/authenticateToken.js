const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) return res.status(401).json({ authenticated: false });

    try {
        const authenticated = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = authenticated;
        next();   
    } catch (error) {
        res.status(400).send("Invalid Token.");
    }
};

module.exports = authenticateToken;
