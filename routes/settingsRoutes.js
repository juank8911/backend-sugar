const userDao = require("../controler/userDao");
const newUs = require("../schemas/UserSchema");
const newMem = require("../schemas/memberSchema");
const ciclo = require("../controler/ciclos");
const jwtDao = require("../controler/jwtDao");
const mongoose = require("mongoose");

module.exports = function(app) {
    app.post("/setings", jwtDao.validaAdmin, (require, response) => {
        userDao.userData(require, (err, resUs) => {
            if (err) {
                response.status(400).send(err);
            }
        });
    });
};