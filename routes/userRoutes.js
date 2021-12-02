const userDao = require('../controler/userDao');
const newUs = require('../schemas/UserSchema');
const newMem = require('../schemas/memberSchema');
const ciclo = require('../controler/ciclos');
const mongoose = require('mongoose');

module.exports = function(app) {

    app.post('/register', (req, response) => {
        console.log('dentro de register');
        var cod;
        newUs.init();
        newMem.init();
        newMemb = new newMem({
            _id: req.body.identification,
            identification: req.body.identification,
            name: req.body.name,
            lastName: req.body.lastName,
            bornDate: req.body.bornDate,
        })
        console.log(newMemb);
        ciclo.generaSalt((err, gen) => {
            cod = gen;
        });
        newUsr = new newUs({
                email: req.body.email,
                password: req.body.pssw,
                phone: req.body.phone,
                face: req.body.face,
                salt: cod,
                namUsu: req.body.namUsu,
                valSession: 0,
                idFacebook: "abc",
                idGmail: "def",
                member: newMemb.identification
            }),
            console.log(newUsr);

        userDao.registroMember({ newUsr, newMemb }, (err, data) => {
            console.log('respuesta del servidor');
            console.log(data);
            console.log('respuesta res');
            console.log(data.res);
            if (data.res == 'true' || data.res == true) {
                response.status(200).send(data);
            } else {
                response.status(500).send(err);
            }
        });

    });

    app.post('/validatereg', async(req, resp) => {
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

    app.post('/login', (req, resp) => {
        var login = {
            email: req.body.email,
            pssw: req.body.pssw
        };

        userDao.login(login, (err, data) => {
            if (data) resp.status(200).send(data);
            else if (err) resp.status(500).send(err);
        });
    });

};