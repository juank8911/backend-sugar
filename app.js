let express = require("express");
let morgan = require("morgan");
let bodyparser = require("body-parser");
let jwt = require("jsonwebtoken");
let formidable = require("express-form-data");
var moment = require("moment");

//configuracion de la aplicacion
let config = require("./config");

var app = express();
//middleawares

app.use(morgan("dev"));
// app.use(express.static('src/public' ));
app.use(bodyparser.json({ limit: "50mb" }));
// app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyparser.urlencoded({ limit: "50mb", extended: true }));
// app.use(cors());
app.use(formidable.parse({ keepExtensions: true }));
app.set("port", config.puerto);
console.log("configurando");

// cron.schedule('* */1 * * *', () => {
// //   horas.citaHistorial((err,res)=>{
// //     horas.citaHistorialM((err,resp)=>{
// //       console.log(res+' ok '+resp);
// //     });
// //
//     // });
//     horas.citaHistorial((err,res)=>{
//       horas.citaHistorialM((err,resp)=>{
//         console.log(res+' ok '+resp);
//       });
//
//      });
//    });

//Permisos CORS para acceso a la Api
app.all("*", function (req, res, next) {
  /**
                 * Response settings
                // //  * @type {Object}
                //  */
  var responseSettings = {
    AccessControlAllowOrigin: req.headers.origin,
    AccessControlAllowHeaders:
      "Content-Type,X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name",
    AccessControlAllowMethods: "POST, GET, PUT, DELETE, OPTIONS",
    AccessControlAllowCredentials: true,
  };

  /**
   * Headers
   */
  res.header(
    "Access-Control-Allow-Credentials",
    responseSettings.AccessControlAllowCredentials
  );
  res.header(
    "Access-Control-Allow-Origin",
    responseSettings.AccessControlAllowOrigin
  );
  res.header(
    "Access-Control-Allow-Headers",
    req.headers["access-control-request-headers"]
      ? req.headers["access-control-request-headers"]
      : "x-requested-with"
  );
  res.header(
    "Access-Control-Allow-Methods",
    req.headers["access-control-request-method"]
      ? req.headers["access-control-request-method"]
      : responseSettings.AccessControlAllowMethods
  );
  if ("OPTIONS" == req.method) {
    res.send(200);
  } else {
    next();
  }
});

let rutas = express.Router();
//rutas de el servidor
//rutas.route('/login').post(ses.login);
require("./routes/userRoutes")(app);
// require('./routes/pruebasRoutes')(app);
// require('./routes/comentRoutes')(app);
// require('./routes/medicoRoutes')(app);
// require('./routes/citasIn')(app);
// require('./routes/topiscRoutes')(app);
// require('./routes/historialRoutes')(app);
// require('./routes/pushRoutes')(app);
// require('./routes/userRoutes')(app);
// require('./routes/jwtRoutes')(app);
// require('./routes/imgRoutes')(app);
// require('./routes/servRoutes')(app);
// require('./routes/depaRoutes')(app);
// require('./routes/muniRoutes')(app);
// require('./routes/cateRoutes')(app);
// require('./routes/parenntRoutes')(app);
// require('./routes/provedorRoutes')(app);
// require('./routes/eventsRoutes')(app);
// require('./routes/horarioRoutes')(app);
// require('./routes/fotosRoutes')(app);
// require('./routes/emailRoutes')(app);
// require('./routes/benefRoutes')(app);
// require('./routes/parenntRoutes')(app);
// require('./routes/eMascRoutes')(app);
// require('./routes/mascRoutes')(app);
// require('./routes/opticaRoutes')(app);
// require('./routes/sucurRoutes')(app);
// require('./routes/consultRoutes')(app);
// require('./routes/historiascRoutes')(app);
// require('./routes/smsRoutes')(app);
// // require('./route/pruebasRoutes')(app);

// require('./routes/eventsMascRoutes')(apps);
//app.use(rutas);

const server = app.listen(app.get("port"), () => {
  console.log("cofigurano puerto");
  console.log("server on port", config.puerto);
});

const io = require("socket.io")(server);

io.on("connection", (socket) => {
  console.log("new User Connected");

  socket.username = "anonimo"; //cargar nonbe de usuario;

  socket.on("new_message", (data) => {
    io.soket.emit("new message", {
      message: data.massage,
      username: socket.username,
    });
  });

  socket.on("typing", (data) => {
    socket.broadcast.emit("typing", { username: socket.username });
  });
});
