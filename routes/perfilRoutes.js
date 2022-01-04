const perfilDao = require("../controler/perfilDao");
const userDao = require("../controler/userDao");
const jwtDao = require("../controler/jwtDao");

module.exports = function(app) {
    app.post("/createperfil", jwtDao.validaAdmin, (req, resp) => {
        var perf = req.body;
        console.log(perf);
        perfilDao.creaPerfil(perf, (err, ret) => {
            if (err) throw err;
            else {
                resp.status(200).send(ret);
            }
        });
    });

    app.put("/perfil", (req, resp) => {
        var perfil = req.body;
        console.log(perfil);
    });
};