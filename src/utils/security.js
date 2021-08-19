

const bcrypt = require('bcrypt');
exports.hashPassword = async(password) => {
    const salt = await bcrypt.genSalt(6);
    const hashed = await bcrypt.hash(password, salt);
    return hashed
};

exports.comparePassword = async(password) => {
    
    const validPassword = await bcrypt.compare(password, hashedPassword);
    return validPassword
};
