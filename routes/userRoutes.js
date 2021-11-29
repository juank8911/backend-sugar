const userDao = require('../controler/userDao');
const newUs = require('../schemas/UserSchema');
const newMem = require('../schemas/memberSchema');
const ciclo = require('../controler/ciclos')
const mongoose = require('mongoose');
const { callbackPromise } = require('nodemailer/lib/shared');

module.exports = function(app) {


    app.post('/register', (req, response) => {
        console.log('dentro de register')
        var cod;
        newUs.init();
        newMem.init();
        newMemb = new newMem({
            _id: req.body.cc,
            cedula: req.body.cc,
            nombre: req.body.nombres,
            apellidos: req.body.apellidos,
            f_nacimiento: req.body.f_naci,
        })
        console.log(newMemb);
        ciclo.generaSalt((err, gen) => {
            cod = gen;
        });
        newUsr = new newUs({
                correo: req.body.email,
                password: req.body.pssw,
                movil: req.body.movil,
                face: req.body.face,
                salt: cod,
                nam_usu: req.body.nam_usu,
                val_session: 0,
                id_facebook: "abc",
                id_gmail: "def",
                member: newMemb.cedula
            }),
            console.log(newUsr);




        userDao.registroMember({ newUsr, newMemb }, (err, data) => {
            console.log('respuesta del servidor')
            console.log(data);
            console.log('respuesta res')
            console.log(data.res);
            if (data.res == true || data.res == 'true') response.status(200).send(data);
            if (data.res == false || data.res == 'false') response.status(400).send(data);
            if (err) response.status(500).send(err);
        })

    });


    app.post('/validatereg', async(req, resp) => {
        var valide = {
            correo: req.body.email,
            movil: req.body.movil,
            nam_usu: req.body.nam_usu,
            cedula: req.body.cc,
        }
        userDao.validateRegistro(valide, async(err, data) => {
            if (data) resp.status(200).send(data);
            else if (err) resp.status(500).send(err);

        })
    })

    app.post('/login', (req, resp) => {
        var login = {
            email: req.body.email,
            pssw: req.body.pssw
        };

        userDao.login(login, (err, data) => {
            if (data) resp.status(200).send(data);
            else if (err) resp.status(500).send(err);
        });
    })

    app.post('/perfilup', userDao.validaAdmin, (req, resp) => {
        var perfil = {
            cedula: req.body.cc,
            altura: req.body.altura,
        }
        console.log('dentro de perfil')
        userDao.updatePerfil(perfil, (err, repUp) => {
            resp.status(200).send('ok')
        })


    });
}