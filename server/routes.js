const db = require('./model');
const express = require('express');

// to be used as app.use()
function routes() {
    const router = express.Router();
    router.get('/problems', async (req, res) => {
        const problems = await db.getProblems();
        res.json(problems);
    });

    router.post('/problems', async (req, res) => {
        const { issueType, subType } = req.body;
        await db.updateProblem(issueType, subType);
        const problems = await db.getProblems();
        res.json(problems);
    });

    router.delete('/problems', async (req, res) => {
        const { issueType, subType } = req.body;
        await db.decrementProblem(issueType, subType);
        const problems = await db.getProblems();
        console.log(problems);
        res.json(problems);
    });

    return router;
}

module.exports = routes;
