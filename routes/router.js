import { Router } from 'express';
import express from 'express';

// Import the schemas
import { User } from '../models/schemas.js';
import { Post } from '../models/schemas.js';
import { Comment } from '../models/schemas.js';

const router = Router();

// This route renders the home page.
router.get("/", async (req, res) => {
    try {
        const posts = await Post.find().populate('author').populate('comments').populate('upvotedBy').populate('downvotedBy').populate('savedBy');
        const users = await User.find().populate('postsMade');

        const upvoteStatusArray = posts.map(post => ({
            post: post,
            upvoteStatus: post.upvotedBy.some(user => user._id.equals(req.session.user._id)) ? 1 : 0
        }));

        const downvoteStatusArray = posts.map(post => ({
            post: post,
            downvoteStatus: post.downvotedBy.some(user => user._id.equals(req.session.user._id)) ? 1 : 0
        }));

        const saveStatusArray = posts.map(post => ({
            post: post,
            saveStatus: post.savedBy.some(user => user._id.equals(req.session.user._id)) ? 1 : 0
        }));

        upvoteStatusArray.sort((post1, post2) => post2.post.voteCtr - post1.post.voteCtr);
        downvoteStatusArray.sort((post1, post2) => post2.post.voteCtr - post1.post.voteCtr);
        saveStatusArray.sort((post1, post2) => post2.post.voteCtr - post1.post.voteCtr);
        posts.sort((post1, post2) => post2.voteCtr - post1.voteCtr);

        
        res.render("index", {
            title: 'Home',
            posts: posts,
            toppost: posts[0],
            currentUser: req.session.user,
            upvoteStatusArray: upvoteStatusArray,
            downvoteStatusArray: downvoteStatusArray,
            saveStatusArray: saveStatusArray
        });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// This route renders the view page.
router.get("/view/:post_id", async (req, res) => {
    try {
        const post_id = req.params.post_id;
        const posts = await Post.find()
            .populate('author')
            .populate({
                path: 'comments',
                populate: {
                    path: 'author',
                    model: 'User',
                    select: 'username profile_pic' // Only populate the 'username' field of the User document
                }
            });
        const comments = await Comment.find().populate('author').populate('parentPost').populate('parentComment').populate('upvotedBy').populate('downvotedBy').populate('reply').lean();

        const upvoteStatus = posts[post_id].upvotedBy.some(user => user._id.equals(req.session.user._id)) ? 1 : 0;
        const downvoteStatus = posts[post_id].downvotedBy.some(user => user._id.equals(req.session.user._id)) ? 1 : 0;
        const saveStatus = posts[post_id].savedBy.some(user => user._id.equals(req.session.user._id)) ? 1 : 0;

        const upvoteStatusCom = posts[post_id].upvotedBy.some(user => user._id.equals(req.session.user._id)) ? 1 : 0;
        const downvoteStatusCom = posts[post_id].downvotedBy.some(user => user._id.equals(req.session.user._id)) ? 1 : 0;
        const saveStatusCom = posts[post_id].savedBy.some(user => user._id.equals(req.session.user._id)) ? 1 : 0;


        res.render("view", {
            title: posts[post_id].title,
            post: posts[post_id],
            currentUser: req.session.user,
            upvoteStatus: upvoteStatus,
            downvoteStatus: downvoteStatus,
            saveStatus: saveStatus,
            upvoteStatusCom: upvoteStatusCom,
            downvoteStatusCom: downvoteStatusCom,
            saveStatusCom: saveStatusCom,
        });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// This route renders the main-profile page.
router.get("/main-profile", async (req, res) => {
    try {

        const filters = ['Posts', 'Comments', 'Upvoted', 'Downvoted', 'Saved'];
        const posts = await Post.find().populate('author').populate('comments').populate('upvotedBy').populate('downvotedBy').populate('savedBy').lean();
        const user = await User.findOne({ username: req.session.user.username })
            .populate('postsMade');

        const comments = await Comment.find()
            .populate('author')
            .populate({
                path: 'parentPost',
                populate: {
                    path: 'author',
                    model: 'User',
                    select: 'username title',
                }
            });

        const filtered_postMade = [];
        const filtered_comments = [];
        var filtered_upvoted = [];
        var filtered_downvoted = [];
        var filtered_saved = [];

        for (var i = 0; i < user.commentsMade.length; i++) {
            const found_comment = comments.find(comment => comment._id.toString() === user.commentsMade[i]._id.toString());
            if (found_comment) {
                filtered_comments.push(found_comment);
            }
        }
        for (var i = 0; i < user.postsMade.length; i++) {
            const found_post = posts.find(post => post._id.toString() === user.postsMade[i]._id.toString());
            if (found_post) {
                filtered_postMade.push(found_post);
            }
        }

        for (var i = 0; i < user.postsMade.length; i++) {
            const found_post = posts.find(post => post._id.toString() === user.postsMade[i]._id.toString());
            if (found_post) {
                filtered_postMade.push(found_post);
            }
        }

        for (var i = 0; i < user.upvotedPosts.length; i++) {
            const found_post = posts.find(post => post._id.toString() === user.upvotedPosts[i].toString());
            if (found_post) {
                filtered_upvoted.push(found_post);
            }
        }
        for (var i = 0; i < user.downvotedPosts.length; i++) {
            const found_post = posts.find(post => post._id.toString() === user.downvotedPosts[i].toString());
            if (found_post) {
                filtered_downvoted.push(found_post);
            }
        }
        for (var i = 0; i < user.savedPosts.length; i++) {
            const found_post = posts.find(post => post._id.toString() === user.savedPosts[i].toString());
            if (found_post) {
                filtered_saved.push(found_post);
            }
        }

        const upvoteStatPostMade = filtered_postMade.map(post => ({
            post: post,
            upvoteStatus: post.upvotedBy.some(users => users._id.equals(user._id)) ? 1 : 0
        }));

        const downvoteStatPostMade = filtered_postMade.map(post => ({
            post: post,
            downvoteStatus: post.downvotedBy.some(users => users._id.equals(user._id)) ? 1 : 0
        }));

        const saveStatPostMade = filtered_postMade.map(post => ({
            post: post,
            saveStatus: post.savedBy.some(users => users._id.equals(user._id)) ? 1 : 0
        }));

        const saveStatUpvote = filtered_upvoted.map(post => ({
            post: post,
            saveStatus: post.savedBy.some(users => users._id.equals(user._id)) ? 1 : 0
        }));

        const saveStatDownvote = filtered_downvoted.map(post => ({
            post: post,
            saveStatus: post.savedBy.some(users => users._id.equals(user._id)) ? 1 : 0
        }));

        const upvoteStatSave = filtered_saved.map(post => ({
            post: post,
            upvoteStatus: post.upvotedBy.some(users => users._id.equals(user._id)) ? 1 : 0
        }));

        const downvoteStatSave = filtered_saved.map(post => ({
            post: post,
            downvoteStatus: post.downvotedBy.some(users => users._id.equals(user._id)) ? 1 : 0
        }));

        res.render("main-profile", {
            title: "My Profile",
            user: user,
            postsMade: filtered_postMade,
            comments: filtered_comments,
            upvoted: filtered_upvoted,
            downvoted: filtered_downvoted,
            saved: filtered_saved,
            filters: filters,
            currentUser: req.session.user,
            upvoteStatusArray: upvoteStatPostMade,
            downvoteStatusArray: downvoteStatPostMade,
            saveStatusArray: saveStatPostMade,
            saveStatusUpvote: saveStatUpvote,
            saveStatusDownvote: saveStatDownvote,
            upvoteStatusSave: upvoteStatSave,
            downvoteStatusSave: downvoteStatSave
        });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// This route renders the edit profile page.
router.get("/edit", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.session.user.username });

        res.render("edit", {
            title: "Edit Profile",
            user: user
        });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// This route allows the profile to be edited
router.put("/edit-profile", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.session.user.username });
        const { name, bio } = req.body;

        user.name = name;
        user.bio = bio;

        await user.save();

        res.status(200).json({ message: "Edited profile successfully" });
    } catch (error) {
        console.error("Error editing profile:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// This route renders the non main profile page.
router.get("/profile/:name", async (req, res) => {
    try {
        const name = req.params.name;
        const filters = ['Posts', 'Comments'];
        const users = await User.find().populate('postsMade');
        const posts = await Post.find().populate('author').populate('comments').populate('upvotedBy').populate('downvotedBy').populate('savedBy').lean();
        const user = await User.findOne({ name: name })
            .populate('postsMade');
        const comments = await Comment.find()
            .populate('author')
            .populate({
                path: 'parentPost',
                populate: {
                    path: 'author',
                    model: 'User',
                    select: 'username title'
                }
            });

        if (req.session.user.username === user.username) {
            res.redirect('/main-profile');
        } else {
            const filtered_comments = [];
            var filtered_postMade = [];

            for (var i = 0; i < user.commentsMade.length; i++) {
                const found_comment = comments.find(comment => comment._id.toString() === user.commentsMade[i]._id.toString());
                if (found_comment) {
                    filtered_comments.push(found_comment);
                }
            }

            for (var i = 0; i < user.postsMade.length; i++) {
                const found_post = posts.find(post => post._id.toString() === user.postsMade[i]._id.toString());
                if (found_post) {
                    filtered_postMade.push(found_post);
                }
            }

            const upvoteStatusArray = filtered_postMade.map(post => ({
                post: post,
                upvoteStatus: post.upvotedBy.some(users => users._id.equals(user._id)) ? 1 : 0
            }));

            const downvoteStatusArray = filtered_postMade.map(post => ({
                post: post,
                downvoteStatus: post.downvotedBy.some(users => users._id.equals(user._id)) ? 1 : 0
            }));

            const saveStatusArray = filtered_postMade.map(post => ({
                post: post,
                saveStatus: post.savedBy.some(users => users._id.equals(user._id)) ? 1 : 0
            }));


            res.render("profile", {
                title: user.name,
                user: user,
                comments: filtered_comments,
                filters: filters,
                currentUser: req.session.user,
                postsMade: filtered_postMade,
                upvoteStatusArray: upvoteStatusArray,
                downvoteStatusArray: downvoteStatusArray,
                saveStatusArray: saveStatusArray
            });
        }
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// This route renders the search page.
router.get("/search/:query", async (req, res) => {
    try {
        const query = req.params.query;
        const search_filters = ['Posts', 'Comments', 'Users'];
        const posts = await Post.find().populate('author').populate('comments').populate('upvotedBy').populate('downvotedBy').populate('savedBy');
        const comments = await Comment.find()
            .populate('author')
            .populate({
                path: 'parentPost',
                populate: {
                    path: 'author',
                    model: 'User',
                    select: 'username title post_id name'
                }
            });
        const users = await User.find().populate('postsMade');

        const search = query.toLowerCase();

        const filtered_posts = posts.filter(post => post.title.toLowerCase().includes(search)
            || post.content.toLowerCase().includes(search)
            || post.author.username.toLowerCase().includes(search));

        const filtered_comments = comments.filter(comment => comment.content.toLowerCase().includes(search)
            || comment.author.username.toLowerCase().includes(search)
            || comment.parentPost.title.toLowerCase().includes(search)
            || comment.parentPost.author.username.toLowerCase().includes(search));

        const filtered_users = users.filter(user => user.username.toLowerCase().includes(search)
            || user.name.toLowerCase().includes(search));


        const upvoteStatusArray = filtered_posts.map(post => ({
            post: post,
            upvoteStatus: post.upvotedBy.some(user => user._id.equals(req.session.user._id)) ? 1 : 0
        }));

        const downvoteStatusArray = filtered_posts.map(post => ({
            post: post,
            downvoteStatus: post.downvotedBy.some(user => user._id.equals(req.session.user._id)) ? 1 : 0
        }));

        const saveStatusArray = filtered_posts.map(post => ({
            post: post,
            saveStatus: post.savedBy.some(user => user._id.equals(req.session.user._id)) ? 1 : 0
        }));

        res.render("search", {
            title: "Search",
            query: query,
            search_filters: search_filters,
            posts: filtered_posts,
            comments: filtered_comments,
            users: filtered_users,
            currentUser: req.session.user,
            upvoteStatusArray: upvoteStatusArray,
            downvoteStatusArray: downvoteStatusArray,
            saveStatusArray: saveStatusArray
        });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/register', (req, res) => {
    res.render('register', {
        noLayout: true
    });
});

router.get('/signin', (req, res) => {
    res.render('signin', {
        noLayout: true
    });
});

// This route renders the anime page
router.get('/anime', async (req, res) => {
    const posts = await Post.find().populate('author');
    posts.sort((post1, post2) => post2.voteCtr - post1.voteCtr);
    res.render('anime', {
        title: 'Anime',
        toppost: posts[0],
        currentUser: req.session.user
    });
});

// This route renders the games page
router.get('/games', async (req, res) => {
    const posts = await Post.find().populate('author');
    posts.sort((post1, post2) => post2.voteCtr - post1.voteCtr);
    res.render('games', {
        title: 'Games',
        toppost: posts[0],
        currentUser: req.session.user
    });
});

// This route renders the polls page
router.get('/polls', async (req, res) => {
    res.render('polls', {
        title: 'Polls',
        currentUser: req.session.user
    });
});

// This route renders the featured page
router.get('/featured', async (req, res) => {
    try {
        const posts = await Post.find().populate('author').populate('comments').populate('upvotedBy').populate('downvotedBy').populate('savedBy');
        posts.sort((post1, post2) => post2.voteCtr - post1.voteCtr);

        const randi = Math.floor(Math.random() * posts.length);
        const upvoteStatus = posts[randi].upvotedBy.some(user => user._id.equals(req.session.user._id)) ? 1 : 0;
        const downvoteStatus = posts[randi].downvotedBy.some(user => user._id.equals(req.session.user._id)) ? 1 : 0;
        const saveStatus = posts[randi].savedBy.some(user => user._id.equals(req.session.user._id)) ? 1 : 0;

        res.render('featured', {
            title: 'Featured',
            post: posts[randi],
            currentUser: req.session.user,
            upvoteStatus: upvoteStatus,
            downvoteStatus: downvoteStatus,
            saveStatus: saveStatus
        });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// This route renders the policy page
router.get('/policy', async (req, res) => {
    res.render('policy', {
        title: 'Privacy Policy'
    });
});
// This route renders the wip page
router.get('/wip', async (req, res) => {
    res.render('wip', {
        title: 'Work in Progress'
    });
});

// intercept all requests with the content-type, routerlication/json
router.use(express.json());

// This route is used for creating posts.
router.post("/post", async (req, res) => {
    try {
        const posts = await Post.find().populate('author');
        const users = await User.find().populate('postsMade');
        console.log("POST Request to /post received.");
        const { title, content, image } = req.body;
        if (title && content) {
            const newPost = {
                post_id: posts.length,
                title: title,
                author: req.session.user._id,
                content: content,
                image: image,
                comments: [],
                voteCtr: 0,
                comCtr: 0,
                upvotedBy: [],
                downvotedBy: [],
                savedBy: [],
                edited: false,
                __v: 0
            };
            const result = await Post.collection.insertOne(newPost);
            console.log("New post inserted with _id:", result.insertedId);

            const userIdToUpdate = req.session.user._id;
            await User.updateOne(
                { _id: userIdToUpdate },
                { $push: { postsMade: result.insertedId } }
            );
            res.status(200).json({ post_id: newPost.post_id });
        }
        else {
            res.status(400);
            res.redirect("/error");
        }
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// This route is used for editing posts.
router.put("/post/:post_id", async (req, res) => {
    try {
        const postIdToUpdate = parseInt(req.params.post_id);
        const posts = await Post.find().populate('author');
        const postToUpdate = posts.find(post => post.post_id === postIdToUpdate);

        console.log("PUT Request to /post/" + postIdToUpdate +  " received.");

        if (!postToUpdate) {
            return res.status(404).json({ error: "Post not found" });
        }

        const { title, content, img } = req.body;

        // Update the properties of the post
        postToUpdate.title = title;
        postToUpdate.content = content;
        postToUpdate.image = img;
        postToUpdate.edited = true;

        await postToUpdate.save();

        res.status(200).json({ message: "Post updated successfully" });
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// This route is used for deleting a post.
router.delete("/post/:post_id", async (req, res) => {
    try {
        const postIdToDelete = parseInt(req.params.post_id);
        const postToDelete = await Post.findOneAndDelete({ post_id: postIdToDelete });

        console.log("DELETE Request to /post/" + postIdToDelete + " received.");

        if (!postToDelete) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Decrement the post_id of all posts with an id greater than the deleted post_id
        await Post.updateMany({ post_id: { $gt: postIdToDelete } }, { $inc: { post_id: -1 } });

        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// This route is used for creating comments.
router.post("/comment", async (req, res) => {
    try {
        const posts = await Post.find();
        const comments = await Comment.find().populate('author');

        console.log("POST Request to /comment received.");
        const { content, post_id } = req.body;

        if (content && post_id) {

            const newComment = {
                author: req.session.user._id,
                content: content,
                profpic: req.session.user.profile_pic,
                comment_id: comments.length,
                parentPost: posts[post_id]._id,
                parentComment: null,
                reply: [],
                voteCtr: 0
            };

            const result = await Comment.collection.insertOne(newComment);
            console.log("New comment inserted with _id:", result.insertedId);

            const postIdToUpdate = posts[post_id]._id;
            const updatedPost = await Post.findOneAndUpdate(
                { _id: postIdToUpdate },
                {
                    $push: { comments: result.insertedId }, // Add the new comment to the comments array
                    $inc: { comCtr: 1 } // Increment the comCtr by 1
                },
                { new: true } // Return the updated document after the update is routerlied
            );
            res.status(200).json({ message: "Comment created successfully" });
        } else {
            res.status(400).json({ error: "Invalid content or post_id" });
        }
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.delete("/comment/:comment_id", async (req, res) => {
    try {
        const commentIdToDelete = parseInt(req.params.comment_id); // Convert comment_id to an integer
        const comments = await Comment.find().populate('parentPost').populate('parentComment');
        const commentToDelete = comments.find(comment => comment.comment_id === commentIdToDelete);

        if (!commentToDelete) {
            return res.status(404).json({ error: "Comment not found" });
        }

        const postIdToUpdate = commentToDelete.parentPost;
        const commentUID = commentToDelete._id;

        const result = await Comment.deleteOne({ comment_id: commentIdToDelete });
        const updatedPost = await Post.findOneAndUpdate(
            { _id: postIdToUpdate },
            {
                $pull: { comments: commentUID }, // Remove the comment from the comments array
                $inc: { comCtr: -1 } // Decrement the comCtr by 1
            },
            { new: true } // Return the updated document after the update is routerlied
        );

        if (commentToDelete.parentComment) {
            const parentCommentIdToUpdate = commentToDelete.parentComment;
            await Comment.findOneAndUpdate(
                { _id: parentCommentIdToUpdate },
                { $pull: { reply: commentUID } },
                { new: true }
            );
        }

        if (result.deletedCount > 0) {
            res.status(200).json({ message: "Comment deleted successfully" });
        } else {
            res.status(404).json({ error: "Comment not found" });
        }
    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.put("/comment/:comment_id", async (req, res) => {
    try {
        const commentIdToUpdate = parseInt(req.params.comment_id);
        const commentToUpdate = await Comment.findOneAndUpdate(
            { comment_id: commentIdToUpdate },
            { content: req.body.content, edited: true },
            { new: true }
        );

        if (!commentToUpdate) {
            return res.status(404).json({ error: "Comment not found" });
        }

        res.status(200).json({ message: "Comment updated successfully", edited: true });
    } catch (error) {
        console.error("Error updating comment:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// This route is used for creating replies.
router.post("/reply", async (req, res) => {
    try {
        const posts = await Post.find().populate('author');;

        console.log("POST Request to /post received.");
        const { author, replyContent, profpic } = req.body;
        const post_id = req.body.post_id;

        const newReply = {
            author: author,
            content: replyContent,
            profpic: profpic,
            comment_id: posts[post_id].comments.length,
            reply: []
        };
        if (newReply && post_id) {
            posts[post_id].comments.push(newComment);
            res.status(200);
            res.redirect("/view/:post_id");
        }
        else {
            res.status(400);
        }
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// This route is used for voting on comments.
router.post("/vote-comment", async (req, res) => {
    try {
        const comments = await Comment.find().populate('author');;;
        const { comVotes, comment_id, check } = req.body;
        const user = await User.findOne({ username: req.session.user.username });
        const foundupUser = comments[comment_id].upvotedBy.find(id => id.toString() === user._id.toString());
        const founddownUser = comments[comment_id].downvotedBy.find(id => id.toString() === user._id.toString());
        console.log("userUp:" + foundupUser);
        console.log("userDown:" + founddownUser);

        if (check == "up") {
            if (foundupUser && !founddownUser) {
                await Comment.updateOne(
                    { _id: comments[comment_id]._id },
                    { $pull: { upvotedBy: user._id } }
                )
            } else if (foundupUser && founddownUser) {
                await Comment.updateOne(
                    { _id: comments[comment_id]._id },
                    { $pull: { upvotedBy: user._id } }
                )
                await Comment.updateOne(
                    { _id: comments[comment_id]._id },
                    { $pull: { downvotedBy: user._id } }
                )
            } else if (!foundupUser && founddownUser) {
                await Comment.updateOne(
                    { _id: comments[comment_id]._id },
                    { $push: { upvotedBy: user._id } }
                )
                await Comment.updateOne(
                    { _id: comments[comment_id]._id },
                    { $pull: { downvotedBy: user._id } }
                )
            } else {
                await Comment.updateOne(
                    { _id: comments[comment_id]._id },
                    { $push: { upvotedBy: user._id } }
                )
            }
        } else if (check == "down") {
            if (founddownUser && !foundupUser) {
                await Comment.updateOne(
                    { _id: comments[comment_id]._id },
                    { $pull: { downvotedBy: user._id } }
                )
            } else if (founddownUser && foundupUser) {
                await Comment.updateOne(
                    { _id: comments[comment_id]._id },
                    { $pull: { downvotedBy: user._id } }
                )
                await Comment.updateOne(
                    { _id: comments[comment_id]._id },
                    { $pull: { upvotedBy: user._id } }
                )
            } else if (!founddownUser && foundupUser) {
                await Comment.updateOne(
                    { _id: comments[comment_id]._id },
                    { $push: { downvotedBy: user._id } }
                )
                await Comment.updateOne(
                    { _id: comments[comment_id]._id },
                    { $pull: { upvotedBy: user._id } }
                )
            } else {
                await Comment.updateOne(
                    { _id: comments[comment_id]._id },
                    { $push: { downvotedBy: user._id } }
                )
            }
        }

        if (comVotes && comment_id) {
            await User.updateOne(
                { _id: comments[comment_id] },
                { $push: { voteCtr: votes } }
            )

            res.status(200);
        } else {
            res.status(400);
        }
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// This route is used for voting on posts.
router.post("/vote", async (req, res) => {
    try {
        const posts = await Post.find().populate('author');;
        //console.log("POST Request to /vote received.");
        const { votes, post_id, check } = req.body;
        const user = await User.findOne({ username: req.session.user.username });
        const foundup = user.upvotedPosts.find(id => id.toString() === posts[post_id]._id.toString());
        const founddown = user.downvotedPosts.find(id => id.toString() === posts[post_id]._id.toString());
        const foundupUser = posts[post_id].upvotedBy.find(id => id.toString() === user._id.toString());
        const founddownUser = posts[post_id].downvotedBy.find(id => id.toString() === user._id.toString());
        console.log("post:" + foundup);
        console.log("post:" + founddown);
        console.log("user:" + foundupUser);
        console.log("user:" + founddownUser);

        if (check == "up") {
            //user side
            if (foundup && !founddown) {
                await User.updateOne(
                    { _id: user._id },
                    { $pull: { upvotedPosts: posts[post_id]._id } }
                )
            } else if (foundup && founddown) {
                await User.updateOne(
                    { _id: user._id },
                    { $pull: { upvotedPosts: posts[post_id]._id } }
                )
                await User.updateOne(
                    { _id: user._id },
                    { $pull: { downvotedPosts: posts[post_id]._id } }
                )

            } else if (!foundup && founddown) {
                await User.updateOne(
                    { _id: user._id },
                    { $push: { upvotedPosts: posts[post_id]._id } }
                )
                await User.updateOne(
                    { _id: user._id },
                    { $pull: { downvotedPosts: posts[post_id]._id } }
                )
               
            } else {
                await User.updateOne(
                    { _id: user._id },
                    { $push: { upvotedPosts: posts[post_id]._id } }
                )

            }
            //post side
            if (foundupUser && !founddownUser) {
                await Post.updateOne(
                    { _id: posts[post_id]._id },
                    { $pull: { upvotedBy: user._id } }
                )
            } else if (foundupUser && founddownUser) {
                await Post.updateOne(
                    { _id: posts[post_id]._id },
                    { $pull: { upvotedBy: user._id } }
                )
                await postToUpdate.updateOne(
                    { _id: posts[post_id]._id },
                    { $pull: { downvotedBy: user._id } }
                )
            } else if (!foundupUser && founddownUser) {
                await Post.updateOne(
                    { _id: posts[post_id]._id },
                    { $push: { upvotedBy: user._id } }
                )
                await Post.updateOne(
                    { _id: posts[post_id]._id },
                    { $pull: { downvotedBy: user._id } }
                )
            } else {
                await Post.updateOne(
                    { _id: posts[post_id]._id },
                    { $push: { upvotedBy: user._id } }
                )
            }
        } else if (check == "down") {
            if (founddown && !foundup) {
                await User.updateOne(
                    { _id: user._id },
                    { $pull: { downvotedPosts: posts[post_id]._id } }
                )
            } else if (founddown && foundup) {
                await User.updateOne(
                    { _id: user._id },
                    { $pull: { downvotedPosts: posts[post_id]._id } }
                )
                await User.updateOne(
                    { _id: user._id },
                    { $pull: { upvotedPosts: posts[post_id]._id } }
                )
            } else if (!founddown && foundup) {
                await User.updateOne(
                    { _id: user._id },
                    { $push: { downvotedPosts: posts[post_id]._id } }
                )
                await User.updateOne(
                    { _id: user._id },
                    { $pull: { upvotedPosts: posts[post_id]._id } }
                )
            } else {
                await User.updateOne(
                    { _id: user._id },
                    { $push: { downvotedPosts: posts[post_id]._id } }
                )
            }
            //post side
            if (founddownUser && !foundupUser) {
                await Post.updateOne(
                    { _id: posts[post_id]._id },
                    { $pull: { downvotedBy: user._id } }
                )
            } else if (founddownUser && foundupUser) {
                await Post.updateOne(
                    { _id: posts[post_id]._id },
                    { $pull: { downvotedBy: user._id } }
                )
                await Post.updateOne(
                    { _id: posts[post_id]._id },
                    { $pull: { upvotedBy: user._id } }
                )
            } else if (!founddownUser && foundupUser) {
                await Post.updateOne(
                    { _id: posts[post_id]._id },
                    { $push: { downvotedBy: user._id } }
                )
                await Post.updateOne(
                    { _id: posts[post_id]._id },
                    { $pull: { upvotedBy: user._id } }
                )
            } else {
                await Post.updateOne(
                    { _id: posts[post_id]._id },
                    { $push: { downvotedBy: user._id } }
                )
            }
        }

        if (votes && post_id) {
            await Post.updateOne(
                { _id: posts[post_id] },
                { $set: { voteCtr: votes } });
            res.status(200).send();
        } else {
            res.status(400).send();
        }
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route for save buttons
router.post('/save', async (req, res) => {
    try {
        const posts = await Post.find().populate('author');
        const post_id = req.body.post_id;
        const user = await User.findOne({ username: req.session.user.username });
        const foundSave = user.savedPosts.includes(posts[post_id]._id);
        const foundUser = posts[post_id].savedBy.includes(user._id);;

        if (foundSave) {
            await User.updateOne(
                { _id: user._id },
                { $pull: { savedPosts: posts[post_id]._id } }

            )
            if (foundUser) {
                await Post.updateOne(
                    { _id: posts[post_id]._id },
                    { $pull: { savedBy: user._id } }
                )

            }
            else if (!foundUser) {
                await Post.updateOne(
                    { _id: posts[post_id]._id },
                    { $push: { savedBy: user._id } }
                )

            }

        } else {
            await User.updateOne(
                { _id: user._id },
                { $push: { savedPosts: posts[post_id]._id } }
            )
            if (foundUser) {
                await Post.updateOne(
                    { _id: posts[post_id]._id },
                    { $pull: { savedBy: user._id } }
                )
            }
            else if (!foundUser) {
                await Post.updateOne(
                    { _id: posts[post_id]._id },
                    { $push: { savedBy: user._id } }
                )

            }
        }
        //console.log(foundSave); 
        res.status(200).send();
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})
// Route for user registration
router.post('/registerFunc', async (req, res) => {
    try {
        const users = await User.find();

        console.log("POST Request to /register received.");
        const { username, password } = req.body;

        if (username && password) {

            const newUser = {
                user_id: users.length,
                profile_pic: "default.png",
                name: "User",
                username: "u/" + username,
                password: password,
                bio: "Edit Profile to add a bio and change username",
                followers_info: "0 followers • 0 following",
                postsMade: []
            };
            const result = await User.collection.insertOne(newUser);
            console.log("New user inserted with _id:", result.insertedId);

            res.status(200).json({ message: "User created successfully" });
        } else {
            res.status(400).json({ error: "Invalid content or username" });
        }
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post('/signinFunc', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Query the database to find the user
        const user = await User.findOne({ username: "u/" + username, password: password });
        console.log(user);
        if (user) {
            // Set the user information in the session
            req.session.user = user;
            res.status(200).json({ message: 'Sign-in successful' });
        } else {
            res.status(401).json({ message: 'User not found! Please register first.' });
        }
    } catch (error) {
        console.error('Error during sign-in:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/getCurrentUser', async (req, res) => {
    res.json(req.session.user);
    console.log(req.session.user);
});

router.put('/signinAnon', async (req,res) => {
    try {
        console.log("PUT Request to /signinAnon received.");

        // Assuming req.body contains the new user data
        const newUser = req.body;
        console.log("signinAnon received:" + req.body);

        req.session.user = newUser;

        res.status(200).json({ message: "Edited profile successfully" });
    } catch (error) {
        console.error("Error editing profile:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;