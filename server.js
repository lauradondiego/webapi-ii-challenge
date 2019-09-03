const express = require("express");
const db = require("./data/db");
const server = express();
server.use(express.json());

// step 1
// Creates a post using the information sent inside the request body
server.post("/api/posts", (req, res) => {
  const createPost = req.body;
  if (createPost.title && createPost.contents) {
    db.insert(createPost)
      //dont forget line 2
      .then(result => {
        res.status(201).json(result);
      })
      .catch(error => {
        res.send(500).json({
          error: "There was an error while saving the post to the database"
        });
      });
  } else {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  }
});

// step 2
// Creates a comment for the post with the specified id using information sent inside of the request body.
server.post("/api/posts/:id/comments", (req, res) => {
  const createComment = req.body;
  if (createComment.post_id && createComment.text) {
    db.insert(createComment)
      .then(result => {
        res.status(201).json(result);
      })
      .catch(error => {
        res.send(500).json({
          error: "There was an error while saving the comment to the database"
        });
      });
  } else {
    if (!createComment.post_id) {
      res.status(404).json({
        message: "The post with the specified ID does not exist."
      });
    } else {
      if (!createComment.text) {
        res.status(400).json({
          errorMessage: "Please provide text for the comment."
        });
      }
    }
  }
});

// step 3
// Returns an array of all the post objects contained in the database.
server.get("/api/posts", (req, res) => {
  db.find()
    .then(posts => {
      res.status(200).json({ api: "get request working", posts });
    })
    .catch(error => {
      res.send(500).json({
        error: "The posts information could not be retrieved."
      });
    });
});

// step 4
// Returns the post object with the specified id.
server.get("/api/posts/:id", (req, res) => {
  const getId = req.params.id;
  if (getId) {
    db.findById(getId)
      .then(getId => {
        res.status(200).json({ api: "get request working", getId });
      })
      .catch(error => {
        res.send(500).json({
          error: "The post information could not be retrieved."
        });
      });
  } else {
    res.status(404).json({
      message: "The post with the specified ID does not exist."
    });
  }
});

// step 5
// Returns an array of all the comment objects associated with the post with the specified id.
server.get("/api/posts/:id/comments", (req, res) => {
  const getCommentsById = req.params.id;

  if (getCommentsById) {
    db.findPostComments(getCommentsById)
      .then(getCommentsById => {
        res.status(200).json({ api: "get request working", getCommentsById });
      })
      .catch(error => {
        res.send(500).json({
          error: "The comments information could not be retrieved.."
        });
      });
  } else {
    res.status(404).json({
      message: "The post with the specified ID does not exist."
    });
  }
});

// step 6
// Removes the post with the specified id and returns the deleted post object
// You may need to make additional calls to the database in order to satisfy this requirement.
server.delete("/api/posts/:id", (req, res) => {
  const id = req.body;
  if (id.post_id) {
    db.remove(id)
      // db.findById(id)
      // i also need to do db.remove
      .then(id => {
        res.status(200).json({ api: "get request working", id });
      })
      .catch(error => {
        res.send(500).json({
          error: "The post could not be removed"
        });
      });
  } else {
    res.status(404).json({
      message: "The post with the specified ID does not exist."
    });
  }
});

// step 7
// Updates the post with the specified id using data from the request body
// Returns the modified document, NOT the original.

module.exports = server;
