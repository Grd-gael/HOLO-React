const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const passport = require('passport');


const UserObject = require("../Models/user");

const config = require("../config");

const JWT_MAX_AGE = "6m";

router.post("/connexion", async (req, res) => {
  let { username, password } = req.body;
  username = (username || "").trim().toLowerCase();


  if (!username || !password)
    return res.status(400).send({
      ok: false,
      code: "username_AND_PASSWORD_REQUIRED",
      message: "Nom d'utilisateur et mot de passe sont requis",
    });

  try {
    const user = await UserObject.findOne({ username });

    if (!user)
      return res.status(401).send({
        ok: false,
        code: "INVALID_USER",
        message: "Nom d'utilisateur ou mot de passe invalide",
      });

    const match = user.password === password;
    if (!match)
      return res.status(401).send({
        ok: false,
        code: "PASSWORD_INVALID",
        message: "Nom d'utilisateur ou mot de passe invalide",
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

  let { username, password } = req.body;
  username = (username || "").trim().toLowerCase();

  if (!username || !password) {
    return res.status(400).send({
      ok: false,
      code: "username_AND_PASSWORD_REQUIRED",
      message: "Nom d'utilisateur et mot de passe sont requis",
    });
  }

  try {
    const existingUser = await UserObject.findOne({ username });
    if (existingUser) {
      return res.status(409).send({
        ok: false,
        code: "USER_ALREADY_EXISTS",
        message: "Un utilisateur avec cet nom d'utilisateur existe déjà",
      });
    }

    const newUser = new UserObject({ username, name: "", password });
    await newUser.save();

    return res.status(201).send({ ok: true, data: newUser });
  } catch (error) {
    console.log("Erreur serveur lors de l'inscription :", error);
    return res.status(500).send({ ok: false, code: "SERVER_ERROR" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (id.length < 24) {
    return res.status(400).send({
      ok: false,
      code: "INVALID_ID",
      message: "ID non valide"
    });
  }

  try {
    const user = await UserObject.findById(id);

    if (!user) {
      return res.status(404).send({
        ok: false,
        code: "USER_NOT_FOUND",
        message: "Utilisateur non trouvé"
      });
    }

    await UserObject.deleteOne({ _id: id });

    return res.status(200).send({ ok: true });

  } catch (error) {
    console.log(error);
    return res.status(500).send({
      ok: false,
      code: "SERVER_ERROR"
    });
  }
});

router.put("/:id/avatar", async (req, res) => {
  const { id } = req.params;
  const { avatar } = req.body;

  console.log("ID reçu :", id);
  console.log("Avatar reçu :", avatar);

  if (id.length < 24) {
    return res.status(400).send({
      ok: false,
      code: "INVALID_ID",
      message: "ID non valide"
    });
  }

  try {
    const user = await UserObject.findById(id);

    if (!user) {
      return res.status(404).send({
        ok: false,
        code: "USER_NOT_FOUND",
        message: "Utilisateur non trouvé"
      });
    }

    user.avatar = avatar;
    await user.save();

    return res.status(200).send({ ok: true, data: user.avatar });

  } catch (error) {
    console.log(error);
    return res.status(500).send({
      ok: false,
      code: "SERVER_ERROR"
    });
  }
})

router.put("/:id/username", async (req, res) => {
  const { id } = req.params;
  const { username } = req.body;

  if (id.length < 24) {
    return res.status(400).send({
      ok: false,
      code: "INVALID_ID",
      message: "ID non valide"
    });
  }

  try {
    const user = await UserObject.findById(id);

    if (!user) {
      return res.status(404).send({
        ok: false,
        code: "USER_NOT_FOUND",
        message: "Utilisateur non trouvé"
      });
    }

    const anotherUser = await UserObject.findOne({ username });
    if (anotherUser && anotherUser._id.toString() !== id) {
      return res.status(409).send({
        ok: false,
        code: "USERNAME_ALREADY_TAKEN",
        message: "Ce nom d'utilisateur est déjà pris"
      });
    }

    user.username = username;
    await user.save();

    return res.status(200).send({ ok: true, data: user.username });

  } catch (error) {
    console.log(error);
    return res.status(500).send({
      ok: false,
      code: "SERVER_ERROR"
    });
  }
});

module.exports = router;