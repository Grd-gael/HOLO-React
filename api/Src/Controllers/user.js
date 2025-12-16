const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const passport = require('passport');


const UserObject = require("../Models/user");

const config = require("../config");

const JWT_MAX_AGE = "6m";

router.post("/connexion", async (req, res) => {
  let { email, password } = req.body;
  email = (email || "").trim().toLowerCase();


  if (!email || !password)
    return res.status(400).send({
      ok: false,
      code: "EMAIL_AND_PASSWORD_REQUIRED",
      message: "Email et mot de passe sont requis",
    });

  try {
    const user = await UserObject.findOne({ email });

    if (!user)
      return res.status(401).send({
        ok: false,
        code: "INVALID_USER",
        message: "Email ou mot de passe invalide",
      });

    const match = user.password === password;
    if (!match)
      return res.status(401).send({
        ok: false,
        code: "PASSWORD_INVALID",
        message: "Email ou mot de passe invalide",
      });

    user.set({ last_login_at: Date.now() });
    await user.save();

    return res.status(200).send({ ok: true, data: user });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ ok: false, code: "SERVER_ERROR" });
  }
});

router.post("/inscription", async (req, res) => {
  console.log("Corps reçu :", req.body);

  let { email, password } = req.body;
  email = (email || "").trim().toLowerCase();

  if (!email || !password) {
    return res.status(400).send({
      ok: false,
      code: "EMAIL_AND_PASSWORD_REQUIRED",
      message: "Email et mot de passe sont requis",
    });
  }

  try {
    const existingUser = await UserObject.findOne({ email });
    if (existingUser) {
      return res.status(409).send({
        ok: false,
        code: "USER_ALREADY_EXISTS",
        message: "Un utilisateur avec cet email existe déjà",
      });
    }

    const newUser = new UserObject({ email, name: "", password });
    await newUser.save();

    return res.status(201).send({ ok: true, data: newUser });
  } catch (error) {
    console.log("Erreur serveur lors de l'inscription :", error);
    return res.status(500).send({ ok: false, code: "SERVER_ERROR" });
  }


});

module.exports = router;