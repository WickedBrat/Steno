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


		var MongoClient = require('mongodb').MongoClient;
		var url = "mongodb://siddhant:harshsri@ds025973.mlab.com:25973/chatbox";

//TODO Page
	var bodyParser =require('body-parser');
	var urlencodedParser = bodyParser.urlencoded({extended:false});






	router.get('/user/todo',securePages ,function(req, res, next) {

		MongoClient.connect(url, function(err, db) {
			console.log("connected to mongo");
		  if (err) console.log("test");
			console.log("Going to request...");

		  db.collection("users").find().toArray(function(err,result){
			  if (err) throw err;
			    console.log(result);
			    db.close();
		  }
						       ));
			console.log("requested and going to render");
		    
		    console.log(data);
		res.render('todo', {title:'Dashboard', user:req.user,config:config, todos:data});
			console.log("rendered");
			db.close();
		  });
	});






	router.post('/user/todo', urlencodedParser, function(req, res, next) {

		MongoClient.connect(url, function(err, db) {
		  if (err) throw err;
		  var myquery = {"profileID":req.user.profileID};
		  var newvalues = {$push: {todo: req.body}};
		  db.collection("users").updateOne(myquery, newvalues, function(err, res) {
		    if (err) throw err;
		    console.log("1 record updated");
		    db.close();
		  });
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
