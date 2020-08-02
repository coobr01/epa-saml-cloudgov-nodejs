var http = require("http");
var fs = require("fs");
var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var passport = require("passport");
var saml = require("passport-saml");

let port = process.env.PORT || 9090;

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

var samlStrategy = new saml.Strategy(
  {
    entryPoint: "https://wamssostg.epa.gov/oamfed/idp/samlv20",
    callbackUrl: "https://saml-test-proto.app.cloud.gov/assert",
    issuer: "PROTOAPP-SP",
    providerName: "PROTOAPP-SP",
    certificates: [fs.readFileSync("epa-gov.cer").toString()],
  },
  function (profile, done) {
    return done(null, profile);
  }
);

passport.use(samlStrategy);

var app = express();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: "myDirtyLittleSecret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  else return res.redirect("/login");
}

app.get("/", ensureAuthenticated, function (req, res) {
  res.send(JSON.stringify(req.session));
  //res.send("Authenticated");
});

app.get(
  "/login",
  passport.authenticate("saml", { failureRedirect: "/login/fail" }),
  function (req, res) {
    res.redirect("/");
  }
);

app.post(
  "/assert",
  passport.authenticate("saml", { failureRedirect: "/login/fail" }),
  function (req, res) {
    res.redirect("/");
  }
);

app.get("/login/fail", function (req, res) {
  res.status(401).send("Login failed");
});

app.get("/Metadata", function (req, res) {
  res.type("application/xml");
  res
    .status(200)
    .send(
      samlStrategy.generateServiceProviderMetadata(
        fs.readFileSync("saml_cert.cer", "utf8")
      )
    );
});

//general error handler
app.use(function (err, req, res, next) {
  console.log("Fatal error: " + JSON.stringify(err));
  next(err);
});

var server = app.listen(port, function () {
  console.log(`Application listening on port ${port}`);
});
