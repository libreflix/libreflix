var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GithubStrategy = require('passport-github').Strategy;


var User = require('../models/User');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// Sign in with Email and Password
passport.use(new LocalStrategy({ usernameField: 'email' }, function(email, password, done) {
  User.findOne({ email: email }, function(err, user) {
    if (!user) {
      return done(null, false, { msg: 'O endereço de e-mail ' + email + ' não está associado com nenhuma conta. ' +
      'Cheque seu e-mail e tente novamente.' });
    }
    user.comparePassword(password, function(err, isMatch) {
      if (!isMatch) {
        return done(null, false, { msg: 'Endereço de e-mail ou senha inválidos.' });
      }
      return done(null, user);
    });
  });
}));

// Sign in with Facebook
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
  callbackURL: '/auth/facebook/callback',
  profileFields: ['name', 'email', 'gender', 'location'],
  passReqToCallback: true
}, function(req, accessToken, refreshToken, profile, done) {
  if (req.user) {
    User.findOne({ facebook: profile.id }, function(err, user) {
      if (user) {
        req.flash('error', { msg: 'There is already an existing account linked with Facebook that belongs to you.' });
        done(err);
      } else {
        User.findById(req.user.id, function(err, user) {
          user.name = user.name || profile.name.givenName + ' ' + profile.name.familyName;
          user.gender = user.gender || profile._json.gender;
          user.username = profile.id;
          user.picture = user.picture || 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
          user.facebook = profile.id;
          user.save(function(err) {
            req.flash('success', { msg: 'Your Facebook account has been linked.' });
            done(err, user);
          });
        });
      }
    });
  } else {
    User.findOne({ facebook: profile.id }, function(err, user) {
      if (user) {
        return done(err, user);
      }
      User.findOne({ email: profile._json.email }, function(err, user) {
        if (user) {
          req.flash('error', { msg: user.email + ' is already associated with another account.' });
          done(err);
        } else {
          var newUser = new User({
            name: profile.name.givenName + ' ' + profile.name.familyName,
            email: profile._json.email,
            username: profile.id,
            gender: profile._json.gender,
            location: profile._json.location && profile._json.location.name,
            picture: 'https://graph.facebook.com/' + profile.id + '/picture?type=large',
            facebook: profile.id
          });
          newUser.save(function(err) {
            done(err, newUser);
          });
        }
      });
    });
  }
}));

// Sign in with Twitter
passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_KEY,
  consumerSecret: process.env.TWITTER_SECRET,
  callbackURL: '/auth/twitter/callback',
  passReqToCallback: true
}, function(req, accessToken, tokenSecret, profile, done) {
  if (req.user) {
    User.findOne({ twitter: profile.id }, function(err, user) {
      if (user) {
        req.flash('error', { msg: 'There is already an existing account linked with Twitter that belongs to you.' });
        done(err);
      } else {
        User.findById(req.user.id, function(err, user) {
          user.name = user.name || profile.displayName;
          user.location = user.location || profile._json.location;
          user.picture = user.picture || profile._json.profile_image_url_https;
          user.twitter = profile.id;
          user.username = profile.id;
          user.save(function(err) {
            req.flash('success', { msg: 'Your Twitter account has been linked.' });
            done(err, user);
          });
        });
      }
    });
  } else {
    User.findOne({ twitter: profile.id }, function(err, existingUser) {
      if (existingUser) {
        return done(null, existingUser);
      }
      // Twitter does not provide an email address, but email is a required field in our User schema.
      // We can "fake" a Twitter email address as follows: username@twitter.com.
      // Ideally, it should be changed by a user to their real email address afterwards.
      // For example, after login, check if email contains @twitter.com, then redirect to My Account page,
      // and restrict user's page navigation until they update their email address.
      var newUser = new User({
        name: profile.displayName,
        email: profile.username + '@twitter.com',
        location: profile._json.location,
        picture: profile._json.profile_image_url_https,
        twitter: profile.id,
        username: profile.username
      });
      newUser.save(function(err) {
        done(err, newUser);
      });
    });
  }
}));

// Sign in with Github
passport.use(new GithubStrategy({
  clientID: process.env.GITHUB_ID,
  clientSecret: process.env.GITHUB_SECRET,
  callbackURL: '/auth/github/callback',
  passReqToCallback: true
}, function(req, accessToken, refreshToken, profile, done) {
  if (req.user) {
    User.findOne({ github: profile.id }, function(err, user) {
      if (user) {
        req.flash('error', { msg: 'There is already an existing account linked with Github that belongs to you.' });
      } else {
        User.findById(req.user.id, function(err, user) {
          user.name = user.name || profile.displayName;
          user.picture = user.picture || profile._json.avatar_url;
          user.github = profile.id;
          user.save(function(err) {
            req.flash('success', { msg: 'Your Github account has been linked.' });
            done(err, user);
          });
        });
      }
    });
  } else {
    User.findOne({ github: profile.id }, function(err, user) {
      if (user) {
        return done(null, user);
      }
      User.findOne({ email: profile.email }, function(err, user) {
        if (user) {
          req.flash('error', { msg: user.email + ' is already associated with another account.' });
          done(err);
        } else {
          var newUser = new User({
            name: profile.displayName,
            email: profile._json.email,
            location: profile._json.location,
            picture: profile._json.avatar_url,
            github: profile.id
          });
          newUser.save(function(err) {
            done(err, newUser);
          });
        }
      });
    });
  }
}));
