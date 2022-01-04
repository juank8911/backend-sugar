const config = require("../config");
const jwt = require("jsonwebtoken");
const activyDao = require("../controler/activityDao");
const settModel = require("../schemas/settingsSchema");
const privModel = require("../schemas/privacySchema");
const { models } = require("mongoose");

let settingsDao = {};

settingsDao.startSettings = (mem, callback) => {
    console.log("setings mem");
    console.log(mem);
    const newPriavcy = new privModel({
        show_search: true,
        status_conn: true,
        view: true,
        call_block: true,
        call_matchuq: true,
    });
    newPriavcy.save((err, ret) => {
        if (err) callback(null, err);
        else {
            console.log("neva configuracion privacidad");
            console.log(ret.ObjectId);
            var act = {
                privacy: ret.ObjectId,
                accion: "crate account",
            };
            activyDao.startActivity(act, (errAc, respAc) => {
                if (errAc) callback(null, errAc);
                else {
                    console.log("neva actividad");
                    console.log(respAc.ObjectId);
                    const newSetting = settModel({
                        mod_dark: false,
                        privacy: ret._id,
                        actvity: respAc._id,
                        member: mem._id,
                    });
                    console.log(newSetting);
                    newSetting.save((err, resSet) => {
                        if (err) callback(null, err);
                        if (resSet) {
                            console.log("nevas configuraciones");
                            console.log(resSet);
                            callback(null, resSet);
                        }
                    });
                }
            });
        }
    });
};

settingsDao.getSettings = (mem, callback) => {
    console.log("inicaindo settings id");
    console.log(mem._id);
    settModel.findOne({ member: mem._id }, (err, setr) => {
        console.log("resultado ");
        console.log(setr);
        var res;
        if (err) {
            throw err;
        } else {
            if (setr == null || setr == "null") {
                res = { res: false, settings: null };
                console.log("settings null " + setr);
            } else {
                console.log("setings de privacidad");
                console.log(setr.privacy);
                privModel.findById({ _id: setr.privacy }, (err, priv) => {
                    console.log("err " + err);
                    console.log("prv" + priv);
                    setr.privacy = priv;

                    console.log("settings true " + setr);
                    res = { res: true, settings: setr };
                    callback(null, res);
                });
            }
        }
    });
};

module.exports = settingsDao;