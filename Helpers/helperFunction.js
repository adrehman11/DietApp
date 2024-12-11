const bcrypt = require('bcryptjs');
const crypto = require("crypto");

function otp_code() {
    return new Promise(async (resolve) => {
        var result = '';
        var characters = '0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < 6; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        resolve(result);
    })
}
function hash(password) {
    return bcrypt.hashSync(password, 10);
}
module.exports = {
    otp_code,
    hash
}