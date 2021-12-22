const config = require("../config");
const jwt = require("jsonwebtoken");
const settModel = require("../schemas/settingsSchema");
const actiModel = require("../schemas/activitySchema");

let activityDao = {};

activityDao.startActivity = (act, callback) => {
  const newActivity = new actiModel({
    accion: act.accion,
  });

  newActivity.save((err, ret) => {
    if (err) callback(null, err);
    else {
      console.log(ret);
      callback(null, ret);
    }
  });
};

module.exports = activityDao;
