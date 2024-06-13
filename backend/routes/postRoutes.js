const express = require('express');
const {check} = require('express-validator');
const postControllers = require('../controllers/postControllers');
const fileUpload = require('../middleware/fileUpload');
const checkAuth = require('../middleware/checkAuth');

const router = express.Router();

router.get('/', postControllers.getPosts);
router.get('/:postId', postControllers.getPostById);
router.use(checkAuth);
router.post('/', fileUpload.single('image'), [check('title').isLength({min: 1, max: 20}), check('description').isLength({min: 1, max: 300}, check('createdAt').not().isEmpty())], postControllers.createPost);
router.patch('/:postId', [check('title').isLength({min: 1, max: 20}), check('description').isLength({min: 1, max: 300})], postControllers.updatePost);
router.delete('/:postId', postControllers.deletePost);
router.patch('/supernova/:postId', postControllers.supernovaPost);
router.patch('/blackhole/:postId', postControllers.blackholePost);
router.patch('/unsupernova/:postId', postControllers.unSupernovaPost);
router.patch('/unblackhole/:postId', postControllers.unBlackholePost);

module.exports = router;