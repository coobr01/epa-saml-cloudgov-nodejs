var express = require("express");
const passport = require("passport");
var SamlStrategy = require("passport-saml").Strategy;
var fs = require("fs");
var app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
let port = process.env.PORT || 9090;

passport.use(
  new SamlStrategy(
    {
      entryPoint: "https://wamssostg.epa.gov/oamfed/idp/samlv20",
      callbackUrl: "https://saml-test-proto.app.cloud.gov/assert",
      issuer: "PROTOAPP-SP",
      providerName: "PROTOAPP-SP",
      certificates: [fs.readFileSync("epa-gov.cer").toString()],
    },
    function (profile, done) {
      console.log("finally here.");
    }
  )
);

app.get("/", function (req, res, next) {
  console.log("Home.");
  res.json({ status: "UP" });
});

app.get(
  "/login",
  passport.authenticate("saml", { failureRedirect: "/", failureFlash: true }),
  function (req, res) {
    res.redirect("/");
  }
);

app.post("/assert", function (req, res) {
  console.log("Assert");
  //console.log("Got body:", req.body);
  console.log("SAMLResponse : ", req.body.SAMLResponse);
  /*
  passport.authenticate("saml", {
    successRedirect: "/",
    failureRedirect: "/login",
  });
*/
});

app.listen(port, function () {
  console.log(`Application listening on port ${port}`);
});
