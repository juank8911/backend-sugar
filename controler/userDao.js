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
    console.log("registrMember Dao");
    console.log('dentro de register dao')
    try {
        newMemb.save(function(err) {

            if (err) {
                console.log("Error save");
                callback(null, { 'err': err, 'res': 'false' });
            }

            console.log('usuario registrado con exito.');
            newUser.save(function(err) {
                if (err) {
                    MemModel.findOneAndDelete({ 'identification': newMemb.identification }, (errfn, data) => {
                        if (errfn) callback(null, { 'err': err, 'res': 'false' });
                        if (data) callback(null, { 'data': data, 'res': 'true' });
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
                    console.log('correo enciado' + err)
                    console.log('correo enciado' + ressp)
                    if (err) {
                        console.log('send mail fail')
                        throw err
                    } else if (ressp) {
                        console.log('send mail ok');
                        // var token = jwt.sign(newUser, config.jwt_secreto);
                        // console.log(token);
                        callback(null, ressp)
                    }
                });

            });
        });
    } catch (error) {
        console.log(error)
        console.log('return false')
        callback(null, { 'res': 'false' })
    }

}

UserDao.activa = (act, callback) => {
    userModel.findOne({ 'email': act.email, 'password': act.pssw, 'salt': act.salt }, function(err, usu) {
        if (err) { throw err }
        if (usu) {
            usu.valSession = 1;
            userModel.updateOne(usu, (err, respo) => {
                if (err) { throw err }
                if (respo) {
                    callback(null, respo)
                }
            })
        }
    })
}

UserDao.validateRegistro = (valide, callback) => {
    console.log('valida')
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
    console.log('login')
    console.log(login);
    userModel.findOne({ 'email': login.email, 'password': login.pssw }, function(err, user) {

        if (err) { return handleError(err) } else {
            console.log(user);
            console.log('%s %s is a %s.', user);

            if (user == null || user == 'null') {
                console.log('usuario null')
                callback(null, { 'res': false, 'token': null })
            } else {
                if (user.valSession == 1 || user.valSession == 0) {
                    console.log('usuario find')
                    var token = jwt.sign(user.email, user.namUsu, user.member, 'unlocked', config.jwt_secreto);
                    callback(null, token)
                } else {

                    var token = jwt.sign(user.email, user.namUsum, 'locked', config.jwt_secreto);
                }
            }
        }

    })
}

UserDao.updatePerfil = (perfil, callback) => {

    console.log('metoo de update perfil');
    callback(null, perfil);
    updtPerf = new perfModel(register.updtPerf);
    if (updtPerf.findOne({ 'identficacion': perfil.identification })) {

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