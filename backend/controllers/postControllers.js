const fs = require('fs');
const {validationResult} = require('express-validator');
const Post = require('../models/post');

exports.getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find();
        const populatedPosts = await Promise.all(posts.map(post => post.populate('creator')));
        return res.status(200).json({posts: populatedPosts.map(post => post.toObject({getters: true}))});
    } catch (err) {
        return res.status(500).json({ message: 'Getting posts failed.' });
    }
};

exports.getPostById = async(req, res, next) => {
    const postId = req.params.postId;
    
    try {
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({message: 'Post being edited not found.'});
        }

        return res.status(200).json({post: post.toObject({getters: true})});
    } catch(err) {
        return res.status(500).json({message: 'Getting post failed.'});
    }
};

exports.createPost = async(req, res, next) => {
    const errors = validationResult(req);
    const file = req.file.path;
    const {title, description, createdAt} = req.body;
    
    if (!errors.isEmpty()) {
        fs.unlink(file, err => console.log(err));
        return res.status(422).json({message: 'Invalid inputs passed, please check your data.'});
    }

    try {
        const post = new Post({title, description, createdAt, creator: req.userData.userId, image: file, supernovas: [], blackholes: []});
        await post.save();
        return res.status(201).json({message: 'Post successfully created.'});
    } catch(err) {
        fs.unlink(file, err => console.log(err));
        return res.status(500).json({message: 'Creating post failed.'});
    }
};

exports.updatePost = async(req, res, next) => {
    const errors = validationResult(req);
    const postId = req.params.postId;
    const {title, description} = req.body;

    if (!errors.isEmpty()) {
        return res.status(422).json({message: 'Invalid inputs passed, please check your data.'});
    }

    try {
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({message: 'No post found to edit.'});
        }
        if (req.userData.userId.toString() !== post.creator.toString()) {
            return res.status(401).json({message: 'User is unauthorized to edit post.'});
        }

        post.title = title;
        post.description = description;
        await post.save();
        return res.status(200).json({message: 'Updated post successfully.'});
    } catch(err) {
        return res.status(500).json({message: 'Updating post failed.'});
    }
};

exports.deletePost = async(req, res, next) => {
    const postId = req.params.postId;

    try {
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({message: 'No post found to edit.'});
        }
        if (req.userData.userId.toString() !== post.creator.toString()) {
            return res.status(401).json({message: 'User is unauthorized to edit post.'});
        }

        await Post.findByIdAndDelete(postId);
        fs.unlink(post.image, err => console.log(err));
        return res.status(200).json({message: 'Post deleted successfully.'});
    } catch(err) {
        return res.status(500).json({message: 'Deleting post failed.'});
    }
};

exports.supernovaPost = async(req, res, next) => {
    const postId = req.params.postId;

    try {
        const post = await Post.findById(postId);
        post.supernovas = [...post.supernovas, req.userData.userId];
        await post.save();
        return res.status(200).json({message: 'Supernova vote succeeded.'});
    } catch(err) {
        return res.status(500).json({message: 'Supernova vote failed.'});
    }
};

exports.blackholePost = async(req, res, next) => {
    const postId = req.params.postId;

    try {
        const post = await Post.findById(postId);
        post.blackholes = [...post.blackholes, req.userData.userId];
        await post.save();
        return res.status(200).json({message: 'Black hole vote succeeded.'});
    } catch(err) {
        return res.status(500).json({message: 'Black hole vote failed.'});
    }
};

exports.unSupernovaPost = async(req, res, next) => {
    const postId = req.params.postId;
    
    try {
        const post = await Post.findById(postId);
        post.supernovas = post.supernovas.filter(supernova => supernova.toString() !== req.userData.userId.toString());
        await post.save();
        return res.status(200).json({message: 'Supernova removal succeeded.'});
    } catch(err) {
        return res.status(500).json({message: 'Supernova removal failed.'});
    }
};

exports.unBlackholePost = async(req, res, next) => {
    const postId = req.params.postId;

    try {
        const post = await Post.findById(postId);
        post.blackholes = post.blackholes.filter(blackhole => blackhole.toString() !== req.userData.userId.toString());
        await post.save();
        return res.status(200).json({message: 'Black hole removal succeeded.'});
    } catch(err) {
        return res.status(500).json({message: 'Black hole removal failed.'});
    }
};