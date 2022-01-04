const config = require("../config");
const jwt = require("jsonwebtoken");
const settDao = require("../controler/settingsDao");
const perfDao = require("../controler/perfilDao");
const memberModel = require("../schemas/memberSchema");

let jwtDao = {};

jwtDao.generateTokenUser = (usuar, callback) => {
    var lock = true;
    memberModel.findById(usuar.member, (err, memb) => {
        if (err) throw err;
        else {
            // console.log("member " + memb);
            settDao.getSettings(memb, (errst, setting) => {
                if (errst) throw errst;
                else {
                    // console.log("settings " + setting);
                    if (usuar.valSession == 1) lock = false;
                    perfDao.getPerfil(usuar, (err, retpre) => {
                        if (err) throw err;
                        else {
                            // console.log("perfil " + retpre);
                            var user = {
                                usu: usuar.email,
                                user: usuar,
                                usernam: usuar.namUsu,
                                name: memb.name,
                                last: memb.last,
                                member: memb,
                                loked: lock,
                                settings: setting,
                                perfil: retpre,
                            };
                            // console.log(user);
                            var jwtToken = jwt.sign(user, config.clientSecret);
                            // console.log("token");
                            // console.log(jwtToken);
                            callback(null, jwtToken);
                        }
                    });
                }
            });
        }
    });
};

module.exports = jwtDao;