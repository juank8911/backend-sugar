const perfilDao = require("../controler/perfilDao");

module.exports = function(app) {
    app.post("/createperfil", (req, resp) => {
        var perf = req.body;
        console.log(perf);
        perfilDao.creaPerfil(perf, (err, ret) => {
            if (err) throw err;
            else {}
        });
    });
};