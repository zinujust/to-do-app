// Import the jsonwebtoken library
const jwt = require('jsonwebtoken');

// Export the middleware function
module.exports = function (req, res, next) {
    // Get the Authorization header from the request
    const authHeader = req.header('Authorization');
    
    // Check if the Authorization header is missing or does not start with 'Bearer '
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        // If the header is invalid, return a 401 Unauthorized response
        return res.status(401).json({message: 'Unauthorized'});
    }

    // Extract the token from the Authorization header
    const token = authHeader.split(' ')[1];
    
    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach the decoded userId to the request object
        req.user = decoded.userId;
        
        // Call the next middleware function
        next();
    }
    catch (error){
        // If the token is invalid, return a 401 Unauthorized response
        res.status(401).json({message: 'Token is not valid'});
    }
}