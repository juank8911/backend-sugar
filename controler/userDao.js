const conection = require('../controler/connection');
const userModel = require('../schemas/UserSchema');
const MemModel = require('../schemas/memberSchema');
const perfModel = require('../schemas/perfilSchema');
const email = require('../controler/email');
const config = require('../config');
const jwt = require('jsonwebtoken');




let UserDao = {};

UserDao.registroMember = (register, callback) => {

    const newUser = new userModel(register.newUsr);
    const newMemb = new MemModel(register.newMemb);
    console.log('dentro de register dao')
    try {
        newMemb.save(function(err) {
            if (err) callback(null, { 'err': err, 'res': 'false' });

            console.log('usuario registrado con exito.');
            newUser.save(function(err) {
                if (err) {
                    MemModel.findOneAndDelete({ 'cedula': newMemb.cedula }, (errfn, data) => {
                        if (errfn) throw errfn;
                        callback(null, { 'err': err, 'res': 'false' })
                    });

                }

                console.log(' member registrado con exito.');
                console.log(newUser.salt);
                var usu = {
                    to: newUser.email,
                    salt: newUser.salt,
                    texto: 'Bienvenidos'
                }
                email.sendMail(usu, (err, ressp) => {
                    if (err) { throw err } else if (ressp) { callback(null, { newUser, 'res': 'true' }); }
                });

            });
        });
    } catch (error) {
        console.log(error)
        console.log('return false')
        callback(null, { 'res': 'false' })
    }

}

UserDao.validateRegistro = (valide, callback) => {
    var resp = { 'email': false, 'phone': false, 'namUsu': false, 'identification': false };
    userModel.findOne({ 'email': valide.email }, function(err, user) {

        console.log(user);
        if (err) throw err;
        else if (user == null) {
            resp.email = true;
        }
        userModel.findOne({ 'phone': valide.phone }, function(err, userMov) {
            console.log(userMov);
            if (err) throw err;
            else if (userMov == null) resp.phone = true;
            userModel.findOne({ 'namUsu': valide.namUsu }, function(err, userNam) {
                console.log(userNam);
                if (err) throw err;
                else if (userNam == null) resp.namUsu = true;
                MemModel.findOne({ 'identification': valide.identification }, (err, memCed) => {
                    if (err) throw err;
                    else if (memCed == null) resp.identification = true;
                    callback(null, resp);
                })

            });

        })


    });
};

UserDao.login = (login, callback) => {

    userModel.findOne({ 'email': login.email, 'password': login.pssw }, function(err, user) {

        if (err) { return handleError(err) } else {
            console.log(user);
            console.log('%s %s is a %s.', user);
<<<<<<< HEAD
            if (user == null || user == 'null') {
                console.log('usuario null')
                callback(null, { 'res': false, 'token': null })
            } else {
                console.log('usuario find')
                var member = { correo: user.correo, member: user.member, val_session: user.val_session };
                var token = jwt.sign(member, config.jwt_secreto);
                callback(null, { 'res': true, 'token': token })
            }
=======
            var token = jwt.sign(user.email, user.namUsum, user.member, config.jwt_secreto);
            callback(null, token)
>>>>>>> b8a20287fe6a24dccca315a9cda2be38b6ea0267
        }

    })
}

UserDao.updatePerfil = (perfil, callback) => {
    console.log('metoo de update perfil');
    callback(null, perfil);
    updtPerf = new perfModel(register.updtPerf);
    if (updtPerf.findOne({ 'cedula': perfil.cedula })) {

    } else {
        updtPerf.save();
    }
};


UserDao.validaAdmin = (req, res, next) => {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    console.log('valida Admin');
    console.log(token);
    if (token) {
        jwt.verify(token, config.jwt_secreto, (err, decoded) => {
            if (err) {
                // console.log(err);
                return res.status(403).send({ 'mensaje': 'error al validar usuario, inicie sesion de nuevo' });
            }
            req.decoded = decoded;
            console.log(decoded)
            next();
        });
    }
}



module.exports = UserDao