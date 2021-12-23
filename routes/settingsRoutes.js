const userDao = require("../controler/userDao");
const newUs = require("../schemas/UserSchema");
const newMem = require("../schemas/memberSchema");
const ciclo = require("../controler/ciclos");
const mongoose = require("mongoose");
const { callbackPromise } = require("nodemailer/lib/shared");

module.exports = function(app) {

    app.post('/setings', userDao.validaAdmin, (require, response) => {

        userDao.userData(require, (err, resUs) => {
            if (err) {
                response.status(400).send(err);
            }
        });
    })
}