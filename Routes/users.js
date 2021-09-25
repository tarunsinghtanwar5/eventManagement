const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Event = require('../models/events');
const passport = require('passport');

router.get('/login', (req, res) => res.render('login'));
router.get('/signup', (req, res) => res.render('signup'));

router.post('/signup', async (req, res) => {
	const { username, email, password } = req.body;
	const user = new User({ email, username });
	const registeredUser = await User.register(user, password); //passport method to register user and add salt to password
	res.redirect('/users/login');
});

router.post('/login', passport.authenticate('local'), (req, res) => {
	//passport middleware to authenticate
	res.redirect(`/users/events`);
	// res.redirect(`/users/:${id}`);
});

router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/users/login');
});

router.get('/events', async (req, res) => {
	if (!req.isAuthenticated()) {
		return res.redirect('/users/login');
	} 
  else
  {
		

    User.findById(req.user.id).populate('events').exec((err, userData) => {
			console.log(userData.events);
      return res.render('events', { 'events': userData.events });

		});
    
  
	}
});

router.post('/events', async (req, res) => {
	const { description } = req.body;
	const event = new Event({ description });
	await event.save();
	const user = await User.findById(req.user.id);
	user.events.push(event);
	user.save((err) => {
		if (err) {
			res.status(500).json({ msg: 'sorry some error' });
		} else {
			return res.redirect('/users/events');
		}
	});

});

router.get('/events/new', (req, res) => {
	if (!req.isAuthenticated()) {
		res.redirect('/users/login');
	}
	res.render('newEvent');
});

module.exports = router;
