const express = require ("express");
const router = express.Router();

const {body} = require('express-validator');

const postsController = require("../controllers/posts");

// POST /posts
router.post('/',
body("content").isString().notEmpty().isLength({min:10}),
postsController.store);

// GET /posts
router.get('/all', postsController.index);

// GET /posts/:slug
router.get('/:slug', postsController.show);

router.get('/', postsController.showByFilter);

// PUT /posts/:slug
router.put('/:slug', postsController.update);

// DELETE /posts/:slug
router.delete('/:slug', postsController.destroy);

module.exports = router;