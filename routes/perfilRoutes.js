const perfilDao = require("../controler/perfilDao");
const userDao = require("../controler/userDao");
const jwtDao = require("../controler/jwtDao");
const { ObjectId } = require("mongodb");
const activityDao = require("../controler/activityDao");

module.exports = function(app) {
    app.post("/createperfil", jwtDao.validaAdmin, (req, resp) => {
        var perf = req.body;
        console.log(perf);
        perfilDao.creaPerfil(perf, (err, ret) => {
            if (err) throw err;
            else {
                //Agregar actividad
                resp.status(200).send(ret);
            }
        });
    });

    app.put("/perfil", jwtDao.validaAdmin, (req, resp) => {
        var perfil = {
            id: new ObjectId(req.body.id),
            job: req.body.job,
            business: req.body.business,
            school: req.body.school,
            height: req.body.height,
            eyes: req.body.eyes,
            contex: req.body.contex,
            gender: req.body.gender,
            about: req.body.about,
        };
        // console.log(perfil);
        perfilDao.update(perfil, (err, perf) => {
            if (err) {
                resp.status(200).send(err);
            } else {
                //agregar registro de actividad
                resp.status(200).send(perf);
            }
        });
    });
};