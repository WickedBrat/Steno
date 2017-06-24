var bodyParser =require('body-parser');

var data = [{item:'Me and Me'}]
var urlencodedParser = bodyParser.urlencoded({extended:false});
module.exports = function(app) {
	
	console.log('1');
	app.get('/user/todo', function(req, res) {
		res.render('todo', {todos:data});
	console.log('2');
	});

	app.post('/user/todo', urlencodedParser, function(req, res) {
		data.push(req.body);
	console.log('3');
		res.JSON(data);
	console.log('4');
	});

	app.delete('/user/todo', function(req, res) {
		
	});
};