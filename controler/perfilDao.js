const { ObjectId } = require("mongodb");
const perfilModel = require("../schemas/perfilSchema");
const userModel = require("../schemas/UserSchema");
const jwtDao = require("./jwtDao");

let perfilDao = {};

perfilDao.creaPerfil = (perf, callback) => {
    // console.log("dentro de crear perfil");
    // console.log(perf);
    let newPerf = new perfilModel({
        job: perf.job,
        business: perf.business,
        school: perf.school,
        height: perf.height + '"',
        eyes: perf.eyes,
        contex: perf.contex,
        gender: perf.gender,
        user: new ObjectId(perf.user),
        about: perf.about,
    });
    // console.log(newPerf);
    newPerf.save((err, rest) => {
        if (err) throw err;
        else {
            userModel.findById(newPerf.user, (err, usr) => {
                jwtDao.generateTokenUser({ usr: usr, perfil: newPerf },
                    (errtk, token) => {
                        // console.log("error de token");
                        // console.log(errtk);
                        // console.log(token);
                        if (err) throw errtk;
                        else {
                            callback(null, token);
                        }
                    }
                );
            });
        }
    });
};

perfilDao.update = (perfil, callback) => {
    // console.log("/////////////////////// update perfil");
    // console.log(perfil.id);

    perfilModel.findByIdAndUpdate(perfil.id, perfil, (err, updt) => {
        if (err) {
            throw err;
        } else {
            console.log(updt);
            userModel.findById(updt.user, (err, usr) => {
                jwtDao.generateTokenUser({ usr: usr }, (errtk, token) => {
                    // console.log("error de token");
                    // console.log(errtk);
                    // console.log(token);
                    if (err) throw errtk;
                    else {
                        callback(null, token);
                    }
                });
            });
        }
    });
};

module.exports = perfilDao;