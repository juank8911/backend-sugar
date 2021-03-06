const conection = require("../controler/connection");
const userModel = require("../schemas/UserSchema");
const MemModel = require("../schemas/memberSchema");
const perfModel = require("../schemas/perfilSchema");
const settDao = require("../controler/settingsDao");
const perfDao = require("../controler/perfilDao");
const jwtDao = require("../controler/jwtDao");
const email = require("../controler/email");
const config = require("../config");
const jwt = require("jsonwebtoken");

let UserDao = {};

UserDao.registroMember = (register, callback) => {
    const newUser = new userModel(register.newUsr);
    const newMemb = new MemModel(register.newMemb);
    console.log("registrMember Dao");
    console.log("dentro de register dao");
    try {
        newMemb.save(function(err, memRes) {
            if (err) {
                console.log("Error save");
                callback(null, { err: err, res: "false" });
            }
            newUser.member = newMemb._id;
            console.log("usuario registrado con exito.");
            newUser.save(function(err, usuRes) {
                if (err) {
                    console.log(err);
                    MemModel.findOneAndDelete({ identification: newMemb.identification },
                        (errfn, data) => {
                            if (errfn) callback(null, { err: err, res: "false" });
                            if (data) throw err;
                        }
                    );
                } else {
                    console.log(" member registrado con exito.");
                    console.log(newUser.salt);
                    var usu = {
                        to: newUser.email,
                        salt: newUser.salt,
                        texto: "Bienvenidos",
                    };
                    email.sendMail(usu, (err, ressp) => {
                        console.log("correo enciado" + err);
                        console.log("correo enciado" + ressp);
                        if (err) {
                            console.log("send mail fail");
                            throw err;
                        } else if (ressp) {
                            console.log("send mail ok");
                            // var token = jwt.sign(newUser, config.jwt_secreto);
                            // console.log(token);
                            settDao.startSettings(newMemb, (err, resSet) => {
                                if (err) callback(null, err);
                                else {
                                    console.log("respuesta de busqueda");
                                    console.log(resSet);
                                    callback(null, ressp);
                                }
                            });
                        }
                    });
                }
            });
        });
    } catch (error) {
        console.log(error);
        console.log("return false");
        callback(null, { res: "false" });
    }
};

UserDao.userUp = async(updt, callback) => {
    console.log("actualiza usuario");
    console.log(updt);
    var usuaup = updt.usuup;
    var membeup = updt.membup;
    $set = {
        phone: usuaup.phone,
    };
    $setMem = {
        name: membeup.name,
        lastName: membeup.last,
    };
    console.log($set);
    console.log($setMem);
    var filter = { member: usuaup.id };

    userModel.updateOne(
        filter, // <-- find stage

        ($set = {
            phone: usuaup.phone,
        }),
        (err, resul) => {
            console.log(err);
            console.log(resul);
            MemModel.updateOne({ identification: membeup.identification },
                ($setm = {
                    name: membeup.name,
                    lastName: membeup.last,
                })
            ).then((result) => {
                callback(null, { res: true, result: result });
            });
        }
    );
};

UserDao.activa = (act, callback) => {
    console.log("activa perfil");
    console.log(act);
    userModel.findOne({ email: act.email, salt: act.salt }, function(err, usua) {
        console.log(usua);
        if (err) {
            console.log("error");
            throw err;
        } else {
            if (usua == null || usua == "null") {
                console.log("usuario no encontrado");
                callback(null, { usuario: null, activate: false });
            }
            usua.valSession = 1;
            $set = { valSession: 1 };
            userModel
                .updateOne({ id: usua.id }, // <-- find stage
                    {
                        $set,
                    }
                )
                .then((result) => {
                    console.log("usuario actualizado");
                    var lock = false;
                    console.log(usua);
                    var data = { usr: usua };
                    jwtDao.generateTokenUser(data, (errtk, token) => {
                        if (errtk) {
                            callback(null, errtk);
                        } else {
                            var ans = { res: true, token: token };
                            callback(null, ans);
                        }
                    });
                    // MemModel.findOne({ identification: usua.member }, (err, memb) => {
                    //     console.log("memModel find");
                    //     console.log(memb);
                    //     if (err) {
                    //         throw err;
                    //     }
                    //     if (memb) {
                    //         var user = {
                    //             usu: usua.email,
                    //             usernam: usua.namUsu,
                    //             name: memb.name,
                    //             last: memb.last,
                    //             member: usua.member,
                    //             loked: lock,
                    //         };
                    //         var token = jwt.sign(user, config.jwt_secreto);
                    //         callback(null, { res: true, token: token });
                    //     }
                    // });
                });
        }
    });
};

UserDao.validateRegistro = (valide, callback) => {
    console.log("valida");
    var resp = {
        email: false,
        phone: false,
        namUsu: false,
        identification: false,
    };
    userModel.findOne({ email: valide.email }, function(err, user) {
        console.log(user);
        if (err) throw err;
        else if (user == null) {
            resp.email = true;
        }

        userModel.findOne({ phone: valide.phone }, function(err, userMov) {
            console.log(userMov);
            if (err) throw err;
            else if (userMov == null) resp.phone = true;
            userModel.findOne({ namUsu: valide.namUsu }, function(err, userNam) {
                console.log(userNam);
                if (err) throw err;
                else if (userNam == null) resp.namUsu = true;
                MemModel.findOne({ identification: valide.identification },
                    (err, memCed) => {
                        if (err) throw err;
                        else if (memCed == null) resp.identification = true;
                        callback(null, resp);
                    }
                );
            });
        });
    });
};

UserDao.login = (login, callback) => {
    console.log("login");
    console.log(login);
    var setting;
    userModel.findOne({ email: login.email, password: login.pssw },
        function(err, usuar) {
            console.log("error " + err);
            console.log("user " + usuar);
            if (err) {
                console.log(err);
                callback(null, err);
            } else {
                // console.log(err);
                console.log("%s %s is a %s.", usuar);

                if (usuar == null || usuar == "null") {
                    console.log("usuario null");
                    callback(null, { res: false, token: null });
                } else {
                    if (usuar.valSession == 1 || usuar.valSession == "1") {
                        console.log("usuario find");
                        console.log(usuar);
                        var id = usuar.member;
                        var lock = false;
                        MemModel.findById(id, (err, memb) => {
                            console.log("member para settinsg");
                            console.log(memb);
                            if (err) {
                                throw err;
                            }
                            if (memb) {
                                console.log("member para settinsg");
                                console.log(memb);
                                settDao.getSettings(memb, (errset, sett) => {
                                    if (errset) {
                                        throw err;
                                    } else {
                                        var data = { usr: usuar };
                                        jwtDao.generateTokenUser(data, (errtk, token) => {
                                            if (errtk) throw errtk;
                                            else {
                                                var ans = { res: true, token: token };
                                                callback(null, ans);
                                                // if (retpre == null || retpre == "null") {
                                                //     setting = sett;
                                                //     var user = {
                                                //         usu: usuar.email,
                                                //         user: usuar,
                                                //         usernam: usuar.namUsu,
                                                //         name: memb.name,
                                                //         last: memb.last,
                                                //         member: memb,
                                                //         loked: lock,
                                                //         settings: setting,
                                                //         perfil: "null",
                                                //     };
                                                // } else {
                                                //     setting = sett;
                                                //     var user = {
                                                //         usu: usuar.email,
                                                //         user: usuar,
                                                //         usernam: usuar.namUsu,
                                                //         name: memb.name,
                                                //         last: memb.last,
                                                //         member: memb,
                                                //         loked: lock,
                                                //         settings: setting,
                                                //         perfil: retpre,
                                                //     };
                                                // }

                                                // var token = jwt.sign(user, config.jwt_secreto);
                                                // callback(null, { res: true, token: token });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    } else {
                        lock = true;
                        var usu = {
                            user: usuar.email,
                            usernam: usuar.namUsu,
                            member: usuar.member,
                            loked: lock,
                        };
                        var token = jwt.sign(usu, config.jwt_secreto);
                        callback(null, { res: false, token: token });
                    }
                }
            }
        }
    );
};

UserDao.updatePerfil = (perfil, callback) => {
    console.log("metoo de update perfil");
    callback(null, perfil);
    updtPerf = new perfModel(register.updtPerf);
    if (updtPerf.findOne({ identficacion: perfil.identification })) {} else {
        updtPerf.save();
    }
};

UserDao.verPefil = async(usu, callback) => {
    console.log("var perfil de usuario");
    console.log("var perfil de usuario");
    callback(null, usu);
};

UserDao.darPerfil = (usu, callback) => {
    perfModel.findOne({ user: usu._id }, (err, perfil) => {
        if (err) throw err;
        else {
            console.log("perfil/////////////////////////////////////");
            console.log(perfil);
            callback(null, perfil);
        }
    });
};

module.exports = UserDao;