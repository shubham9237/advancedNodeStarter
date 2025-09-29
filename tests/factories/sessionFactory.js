const bf = require('safe-buffer').Buffer;
const Keygrip = require('keygrip');
const keys = require("../../config/keys");
const kg = new Keygrip([keys.cookieKey]);

module.exports = function (user) {
    const sessionObj = {
        passport: {
            user: user._id
        }
    }
    console.log(user);
    const session = Buffer.from(JSON.stringify(sessionObj)).toString('base64');
    const sig = kg.sign('session=' + session);

    return {
        session,
        sig
    };
}