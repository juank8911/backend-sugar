const config = require("../config");
const jwt = require("jsonwebtoken");
const settDao = require("../controler/settingsDao");
const userDao = require("../controler/userDao");
const perfDao = require("../controler/perfilDao");
const memberModel = require("../schemas/memberSchema");
const perfilModel = require("../schemas/perfilSchema");

let jwtDao = {};

jwtDao.generateTokenUser = (data, callback) => {
    var lock = true;
    console.log(data);
    let usuar = data.usr;
    console.log("//////////////////////////////////USuario de perfil");
    console.log(usuar);
    memberModel.findById(usuar.member, (err, memb) => {
        console.log("//////////////////////////////////Member de perfil");
        console.log(memb);
        if (err) {
            throw err;
        } else {
            settDao.getSettings(memb, (errst, setting) => {
                console.log("//////////////////////////////////Settings de perfil");
                console.log(setting);
                if (errst) {
                    throw errst;
                } else {
                    perfilModel.findOne({ user: usuar._id }, (errpr, perfs) => {
                        console.log("//////////////////////////////////perfil de perfil");
                        console.log(perfs);
                        if (errpr) {
                            throw errpr;
                        } else {
                            if (perfs == null) {
                                perds = "null";
                            }
                            var user = {
                                usu: usuar.email,
                                user: usuar,
                                usernam: usuar.namUsu,
                                name: memb.name,
                                last: memb.last,
                                member: memb,
                                loked: lock,
                                settings: setting,
                                perfil: perfs,
                            };
                            var jwtToken = jwt.sign(user, config.jwt_secreto);
                            console.log(jwtToken);
                            callback(null, jwtToken);
                        }
                    });
                }
            });
        }
    });
    // if (err) throw err;
    // else {
    // console.log("member " + memb);
    // settDao.getSettings(memb, (errst, setting) => {
    // if (errst) throw errst;
    // else {
    // console.log("settings " + setting);
    // if (usuar.valSession == 1) {
    // lock = false;
    // }
    // userDao.verPefil(usuar, (errPer, vPerfil) => {
    //     if (errPer) {
    //         throw errPer;
    //     } else {
    //         console.log("usuario en ver perfil de usuario");
    //     }
    // });
    // userDao.darPerfil(usuar, (err, retpre) => {
    // perfDao.getPerfil(usuar, (err, retpre) => {
    // if (err) throw err;
    // else {
    // console.log("perfil " + retpre);

    // console.log(user);

    // console.log("token");
    // console.log(jwtToken);
    // callback(null, jwtToken);
    // }
    // });
    // }
    // });
    // }
    // });
};

jwtDao.validaAdmin = (req, res, next) => {
    var token =
        req.body.token || req.query.token || req.headers["x-access-token"];
    console.log("valida Admin");
    console.log(token);
    if (token) {
        jwt.verify(token, config.jwt_secreto, (err, decoded) => {
            if (err) {
                return res.status(403).send({
                    mensaje: "error al validar usuario, inicie sesion de nuevo",
                });
            }

            req.decoded = decoded;
            console.log(decoded);
            next();
        });
    }
};

module.exports = jwtDao;