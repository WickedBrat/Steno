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

	router.get('/user/todo',securePages ,function(req, res, next) {
		res.render('todo', {title:'Dashboard', user:req.user,config:config});
	})

	router.get('/logout', function (req, res, next) {
		req.logout();
		res.redirect('/');
	})

	app.use('/', router);
}