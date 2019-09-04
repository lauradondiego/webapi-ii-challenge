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
  //   db.insertComment(createComment)
  //     .then(com => {
  //       if (com) {
  //         res.status(201).json(com);
  //       } else {
  //         res
  //           .status(404)
  //           .json({ message: "The post with the specified ID does not exist." });
  //       }
  //     })
  //     .catch(error => {
  //       res.status(500).json({
  //         error: "There was an error while saving the comment to the database"
  //       });
  //     });
  // });
  if (createComment.post_id && createComment.text) {
    db.insertComment(createComment)
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
      .then(post => {
        res.status(200).json({ api: "get request working", post });
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
  const id = req.params.id;
  console.log("comments id", id);
  if (id) {
    db.findPostComments(id)
      .then(comments => {
        console.log(comments);
        res.status(200).json({ api: "get request working", comments });
      })
      .catch(error => {
        res.send(500).json({
          error: "The comments information could not be retrieved."
        });
      });
  } else {
    res.status(404).json({
      message: "The post with the specified ID does not exist."
    });
  }
});
// server.get("/api/posts/:id/comments", (req, res) => {
//     const { id } = req.params;
//     console.log(id);
//     db.findById(id)
//       .then(post => {
//         if (post.length) {
//           db.findPostComments(id)
//             .then(comments => {
//               if (comments.length) {
//                 res.status(200).json(comments);
//               } else {
//                 res
//                   .status(404)
//                   .json({ error: `comments for post ${id} not found` });
//               }
//             })
//             .catch(err => res.status(500).json(err.message));
//         } else {
//           res
//             .status(404)
//             .json({ error: `no post with id: ${id} found in the database` });
//         }
//       })
//       .catch(err => res.status(500).json(err.message));
//   });
//this below code works too but the above code is much simpler

// step 6
// Removes the post with the specified id and returns the deleted post object
// You may need to make additional calls to the database in order to satisfy this requirement.
server.delete("/api/posts/:id", (req, res) => {
  const id = req.params.id;

  db.remove(id)
    .then(deleted => {
      // returns a number of items that were deleted (deleted)
      if (deleted) {
        res.status(200).json({ api: "delete request working", deleted });
      } else {
        res.status(404).json({
          message: "The post with the specified ID does not exist."
        });
      }
    })
    .catch(error => {
      res.send(500).json({
        error: "The post could not be removed"
      });
    });
});

// step 7
// Updates the post with the specified id using data from the request body
// Returns the modified document, NOT the original.
server.put("/api/posts/:id", (req, res) => {
  const id = req.params.id;
  const update = req.body;

  if (!update.title && !update.contents)
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  else {
    db.update(id, update)
      .then(updated => {
        if (updated) {
          db.findById(id)
            .then(post => {
              res.status(200).json({ api: "update working", post });
            })
            .catch(error => {
              res.send(500).json({
                error: "The user information could not be modified."
              });
            });
        } else {
          res.status(404).json({
            message: "The user with the specified ID does not exist."
          });
        }
      })
      .catch(error => {
        res.send(500).json({
          error: "The user information could not be modified."
        });
      });
  }
});

module.exports = server;
