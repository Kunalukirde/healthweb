const jwt  = require('jsonwebtoken');

module.exports = function(req, res, next) {
    const authHeader = req.header('Authorization');
    // Log the header to verify it's being received
    // console.log('Authorization Header:', authHeader);

    if (!authHeader) {
        return res.status(401).send({ message: 'No token, authorization denied' });
    }

    try {
        const token = authHeader.split(' ')[1]; // Extract the token from "Bearer <token>"
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.userId;
        next();
    } catch (error) {
        res.status(401).send({ message: 'Invalid token' });
    }
}
