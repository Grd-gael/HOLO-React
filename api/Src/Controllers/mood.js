const express = require('express');
const router = express.Router();


const MoodObject = require("../Models/mood");

const config = require("../config");

router.post("/add", async (req, res) => {
    let { id_user, date, humor, comment } = req.body;

    if (!humor)
        return res.status(400).send({
            ok: false,
            code: "REQUIRED_FIELDS_MISSING",
            message: "L'humeur est requise",
        });

    try {
        const mood = new MoodObject({ id_user, date, humor, comment: comment ? comment.trimEnd() : undefined });
        await mood.save();

        return res.status(200).send({ ok: true, data: mood });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ ok: false, code: "SERVER_ERROR" });
    }
});

router.get("/list/:id_user", async (req, res) => {
    const { id_user } = req.params;

    try {
        const moods = await MoodObject.find({ id_user });
        console.log(moods);
        return res.status(200).send({ ok: true, data: moods });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ ok: false, code: "SERVER_ERROR" });
    }
});


router.get("/today/:id_user", async (req, res) => {
    const { id_user } = req.params;
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    try {
        const mood = await MoodObject.findOne({
            id_user,
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        return res.status(200).send({ ok: true, data: mood });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ ok: false, code: "SERVER_ERROR" });
    }
});

module.exports = router;