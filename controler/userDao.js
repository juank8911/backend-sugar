const conection = require('../controler/connection');
const userModel = require('../schemas/UserSchema');
const MemModel = require('../schemas/memberSchema');
const email = require('../controler/email')
const config = require('../config')
const jwt = require('jsonwebtoken');




let UserDao = {};

UserDao.registroMember = (register, callback) => {

    const newUser = new userModel(register.newUsr);
    const newMemb = new MemModel(register.newMemb);
    console.log('dentro de register dao')
    try {
        newMemb.save(function(err) {
            if (err) throw err;

            console.log('usuario registrado con exito.');
            newUser.save(function(err) {
                if (err) throw err;

                console.log(' member registrado con exito.');
                console.log(newUser.salt);
                var usu = {
                    to: newUser.correo,
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

UserDao.login = (login, callback) => {

    userModel.findOne({ 'correo': login.email, 'password': login.pssw }, function(err, user) {

        if (err) { return handleError(err) } else {
            console.log(user);
            console.log('%s %s is a %s.', user);
            var token = jwt.sign(user.correo, user.nam_usum, user.member, config.jwt_secreto);
            callback(null, token)
        }

    })
}

module.exports = UserDao;