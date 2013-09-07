/*
 * GET home page.
 */

exports.main = function(req, res){
  res.render('main', { title: 'Event'});
};