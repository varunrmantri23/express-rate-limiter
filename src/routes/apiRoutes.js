const {getHome, getTest, notFound} = require("../controllers/apiController");
const express = require('express');

const router = express.Router();

router.get('/', getHome);
router.get('/test', getTest);
router.use(notFound);

module.exports = router;