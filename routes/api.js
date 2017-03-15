const fs = require('fs');
const data = {teams:[]};

const open = () => {


return data
}
// initialize our faux database

// GET
exports.posts = function (req, res) {
  var posts = [];
  fs.readFile('data.json', function (err, dat) {
   if (err) {
       return console.error(err);
   }
   data.teams = JSON.parse(dat)
   data.teams.forEach(function (team, i) {
      posts.push({
        id: i,
        title: team.name,
        sum: team.sum,
        playname0: team.players[0].name,
        playpoints0: team.players[0].points,
        playname1: team.players[1].name,
        playpoints1: team.players[1].points,
        playname2: team.players[2].name,
        playpoints2: team.players[2].points,
        playname3: team.players[3].name,
        playpoints3: team.players[3].points,
        playname4: team.players[4].name,
        playpoints4: team.players[4].points,
        playname5: team.players[5].name,
        playpoints5: team.players[5].points
      });
    });
    res.json({
      posts: posts
    });
  });
};

exports.post = function (req, res) {
  var id = req.params.id;
  if (id >= 0 && id < data.posts.length) {
    res.json({
      post: data.posts[id]
    });
  } else {
    res.json(false);
  }
};


// POST
exports.addPost = function (req, res) {
  data.posts.push(req.body);
  res.json(req.body);
};

// PUT
exports.editPost = function (req, res) {
  var id = req.params.id;

  if (id >= 0 && id < data.posts.length) {
    data.posts[id] = req.body;
    res.json(true);
  } else {
    res.json(false);
  }
};

// DELETE
exports.deletePost = function (req, res) {
  var id = req.params.id;

  if (id >= 0 && id < data.posts.length) {
    data.posts.splice(id, 1);
    res.json(true);
  } else {
    res.json(false);
  }
};
