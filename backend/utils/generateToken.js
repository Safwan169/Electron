const JWT = require('jsonwebtoken');
const genrateToken = (user) => JWT.sign({userId: user._id,isAdmin:user.isAdmin}, 'this is screat', {expiresIn: '1d'});
module.exports = genrateToken