module.exports = function(express, app, passport, config, rooms){
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
			if (err) throw err;
			db.collection("users").find({profileID:req.user.profileID}).toArray(function(err,result){
				if (err) throw err;
				res.render('todo', {title:'Dashboard', user:req.user,config:config, todos:result});
				db.close();
			});
		});
	});

	router.post('/user/todo', urlencodedParser, function(req, res, next) {
		var data = [{}];
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
		data.push(req.body);
		res.json(data);
	});

	router.delete('/user/todo/:item', function(req, res, next){
		console.log('Delete request called...');
		var data = [{}];
		MongoClient.connect(url, function(err, db) {
			if (err) throw err;		
			console.log('connection to mongo established...');
			console.log(req.params.item);
			var deleteitem = {$pull: {todo: {items:req.params.item}}};
			db.collection("users").update({profileID:req.user.profileID}, deleteitem , {multi:true});
				if (err) {console.log('something smrthing');}
					console.log('run to command...');
			res.json(data);
					console.log('responding json...');
			db.close();
		});
	});







//Logout and Gethelp Page
	router.get('/user/gethelp',securePages ,function(req, res, next) {
		res.render('gethelp', {title:'Get Help', user:req.user,config:config});
	});

	router.get('/user/gethelp/room/:id', securePages , function(req, res, next) {
		var room_name = findTitle(req.params.id);
		res.render('room', {user:req.user, room_number:req.params.id, config:config, room_name:room_name})
	});

	function findTitle(room_id) {
		var n=0;
		while(n < rooms.length) {
			if (rooms[n].room_number == room_id) {
				return rooms[n].room_name;
				break;
			}
			else {
				n++;
				continue;
			}
		}
	}




	router.get('/logout', function (req, res, next) {
		req.logout();
		res.redirect('/');
	});

	app.use('/', router);
}