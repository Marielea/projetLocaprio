const express = require('express');
const authRouter  = express.Router();
const myUser = require('../models/user') // va chercher le modele de données pour pouvoir les enregistrer en bdd
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

/* GET home page */
authRouter.get('/', (req, res, next) => {
  res.render('index');
});

authRouter.get('/connexion', (req, res, next) => {
  res.render('connexion');
});

authRouter.get('/creacompte', (req, res, next) => { // prendre le cours au sujet de passport
  res.render('creacompte');
});

//page profil uniquement accessible pour un user ayant crée son compte.
authRouter.get('/profil', (req, res, next) => {
  res.render('profil');
});

// création d'un user en bdd
authRouter.post('/creacompte', (req, res, next) => {
  console.log(req.body);
  const { firstName, lastName, email, password, role } = req.body; // ne pas oublier les paramères 'name="firstName"' dans les input des forms pour le req.body.
  const newUser = new myUser({firstName, lastName, email, password, role}) // cour mongoose express create - update document + penser aux id dans les forms

  if (firstName === "" || lastName==="" || email==="" || password === "") {
    res.render("creacompte", { message: "Remplissez toutes les informations pour créer votre profil" });
    return;
  }

  myUser.findOne({ email }, "email", (err, email) => {
    if (email !== null) {
      res.render("creacompte", { message: "Cette adresse email existe déjà !!!" });
      return;
    }
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const newUser = new myUser({
      email, firstName, lastName, role, // pourquoi mon email est null en bdd
      password: hashPass
    });
    newUser.save((err) =>{
      if (err) {
        res.render("creacompte", {message: "big problem"});
      }
      else {
        res.redirect("profil");
      }
    });
  });
});












module.exports=authRouter;


/*module.exports = router;

router.get('/categorie', (req, res, next) => {
res.render('categorie');
});

/*
router.get('/categorie/location', (req, res, next) => {
res.render('categorie/locatio');
});
*/
