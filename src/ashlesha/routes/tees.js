
/*
 * GET home page.
 */

exports.tees = function(req, res){
  res.send("Test"+req.params.id);
};