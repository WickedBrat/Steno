module.exports = function(express, app, passport, config){
	var router = express.Router();

	router.get('/', function(req, res, next) {
		res.render('index');
	})

	function securePages(req, res, next) {
		if(req.isAuthenticated()){
			next();
		}else{
			res.redirect('/');
		}
	}









	router.get('/auth/facebook', passport.authenticate('facebook'));
	router.get('/auth/facebook/callback', passport.authenticate('facebook', {
		successRedirect:'/user',
		failureRedirect:'/'
	}))

	router.get('/user',securePages ,function(req, res, next) {
		res.render('user', {title:'Dashboard', user:req.user,config:config});
	})

//TODO Page
	var bodyParser =require('body-parser');
	var data = [{}];
	var urlencodedParser = bodyParser.urlencoded({extended:false});

	router.get('/user/todo',securePages ,function(req, res, next) {
		res.render('todo', {title:'Dashboard', user:req.user,config:config, todos:data});
	});

	router.post('/user/todo', urlencodedParser, function(req, res, next) {
		var MongoClient = require('mongodb').MongoClient
  		, format = require('util').format;

		MongoClient.connect('mongodb://siddhant:harshsri@ds025973.mlab.com:25973/chatbox', function(err, db) {
		if(err) throw err;
		
		db.users.update({"profileID":profile.id}, {$push: { todo: {item: req.body}}});
	});
		res.json(data);
	});

	router.delete('/user/todo:item', function(req, res, next){
		data = data.filter(function(todo){
			return todos.item.replace(/ /g, '-') !== req.params.item;
		});
		res.json(data);
	});



	router.get('/user/gethelp',securePages ,function(req, res, next) {
		res.render('gethelp', {title:'Get Help', user:req.user,config:config});
	});

	router.get('/logout', function (req, res, next) {
		req.logout();
		res.redirect('/');
	});

	app.use('/', router);
}