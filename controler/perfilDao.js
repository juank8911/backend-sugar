const { ObjectId } = require("mongodb");
const perfilModel = require("../schemas/perfilSchema");
const userModel = require("../schemas/UserSchema");
const jwtDao = require("./jwtDao");

let perfilDao = {};

perfilDao.creaPerfil = (perf, callback) => {
    console.log("dentro de crear perfil");
    console.log(perf);
    let newPerf = new perfilModel({
        height: perf.height + '"',
        eyes: perf.eyes,
        contex: perf.contex,
        gender: perf.gender,
        user: new ObjectId(perf.user),
        about: perf.about,
    });
    console.log(newPerf);
    newPerf.save((err, rest) => {
        if (err) throw err;
        else {
            userModel.findById(newPerf.user, (err, usr) => {
                console.log(usr);
                jwtDao.generateTokenUser(usr, (errtk, token) => {
                    if (err) throw errtk;
                    else {
                        callback(null, token);
                    }
                });
            });
        }
    });
};

perfilDao.getPerfil = (idUs, callback) => {
    console.log(idUs);
    perfilModel.findOne({ user: idUs._id }, (err, perfil) => {
        if (err) throw err;
        else {
            console.log("perfil/////////////////////////////////////");
            console.log(perfil);
            callback(null, perfil);
        }
    });
};

module.exports = perfilDao;