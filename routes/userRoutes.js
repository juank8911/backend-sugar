const userDao = require("../controler/userDao");
const newUs = require("../schemas/UserSchema");
const newMem = require("../schemas/memberSchema");
const ciclo = require("../controler/ciclos");
const mongoose = require("mongoose");
const { callbackPromise } = require("nodemailer/lib/shared");

module.exports = function(app) {
    app.post("/register", (req, response) => {
        console.log("dentro de register");
        var cod;
        newUs.init();
        newMem.init();
        newMemb = new newMem({
            _id: req.body.identification,
            identification: req.body.identification,
            name: req.body.name,
            lastName: req.body.lastName,
            bornDate: req.body.bornDate,
        });
        console.log(newMemb);
        ciclo.generaSalt((err, gen) => {
            cod = gen;
        });
        (newUsr = new newUs({
            email: req.body.email,
            password: req.body.pssw,
            phone: req.body.phone,
            face: req.body.face,
            salt: cod,
            namUsu: req.body.namUsu,
            valSession: 0,
            idFacebook: "abc",
            idGmail: "def",
            member: newMemb.identification,
        })),
        console.log(newUsr);
        console.log("registr");
        userDao.registroMember({ newUsr, newMemb }, (err, data) => {
            if (err) response.status(400).send(err);
            if (data) response.status(200).send(data);
        });
    });

    app.post("/validatereg", async(req, resp) => {
        var valide = {
            email: req.body.email,
            phone: req.body.phone,
            namUsu: req.body.namUsu,
            identification: req.body.identification,
        };
        userDao.validateRegistro(valide, async(err, data) => {
            if (data) resp.status(200).send(data);
            else if (err) resp.status(500).send(err);
        });
    });

    app.post("/login", async(req, resp) => {
        var login = {
            email: req.body.email,
            pssw: req.body.pssw,
        };

        userDao.login(login, (err, data) => {
            if (data) resp.status(200).send(data);
            else if (err) resp.status(500).send(err);
        });
    });

    app.get("/userdata", userDao.validaAdmin, (req, res) => {
        userDao.userData((err, usu) => {
            if (err) res.status(400).send(err);
            if (usu) res.status(200).send(usu);
        });
    });

    app.put("/userup", userDao.validaAdmin, async(req, resp) => {
        var usuup = {
            id: req.body.id,
            namUsu: req.body.namUsu,
            email: req.body.email,
            phone: req.body.phone,
        };
        var membup = {
            identification: req.body.id,
            name: req.body.name,
            last: req.body.last,
            bornDate: req.body.date,
        };
        var updt = { usuup: usuup, membup: membup };
        await userDao.userUp(updt, (err, res) => {
            if (err) {
                resp.status(400).send(err);
            }
            if (res) {
                resp.status(200).send(res);
            }
        });
    });

    app.post("/activaperf", (req, resp) => {
        var act = {
            email: req.body.email,
            salt: req.body.salt,
        };
        userDao.activa(act, (err, res) => {
            if (err) {
                resp.status(500).send(error);
            }
            if (res) {
                resp.status(200).send(res);
            }
        });
    });

    app.post("/perfilup", userDao.validaAdmin, (req, resp) => {
        var perfil = {
            identification: req.body.id,
            altura: req.body.altura,
        };
        console.log("dentro de perfil");
        userDao.updatePerfil(perfil, (err, repUp) => {
            resp.status(200).send("ok");
        });
    });
};