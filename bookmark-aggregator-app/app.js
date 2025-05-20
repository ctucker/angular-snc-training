const express = require('express');
const ejs = require('ejs');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const { db } = require('./database'); // Import db from database.js

const app = express();
const port = 3000;

// Session Configuration
app.use(session({
  secret: 'your secret key', // Replace with a real secret in production
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // For dev; set to true if using HTTPS
}));

// Passport Initialization
app.use(passport.initialize());
app.use(passport.session());

// --- Passport Strategy Configurations ---

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: 'YOUR_GOOGLE_CLIENT_ID',
    clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
    callbackURL: '/auth/google/callback',
    passReqToCallback: true // We might need req for consistency, though not strictly for Google initial login
  },
  (req, accessToken, refreshToken, profile, done) => {
    const provider = 'google';
    const providerId = profile.id;
    const displayName = profile.displayName;
    const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
    const profileJson = JSON.stringify(profile);

    db.get('SELECT * FROM authenticators WHERE provider = ? AND providerId = ?', [provider, providerId], (err, authenticator) => {
      if (err) { return done(err); }

      if (authenticator) {
        // Authenticator found, fetch the user
        db.get('SELECT * FROM users WHERE id = ?', [authenticator.userId], (userErr, user) => {
          if (userErr) { return done(userErr); }
          if (!user) { return done(null, false, { message: 'User not found for this authenticator.' });}
          // Optionally update authenticator tokens/profileJson here
          db.run('UPDATE authenticators SET accessToken = ?, refreshToken = ?, profileJson = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
            [accessToken, refreshToken, profileJson, authenticator.id], updateErr => {
              if (updateErr) console.error("Error updating Google authenticator:", updateErr);
              return done(null, user);
          });
        });
      } else {
        // No authenticator, check if user exists by email (if provided)
        db.get('SELECT * FROM users WHERE email = ? AND email IS NOT NULL', [email], (userErr, existingUser) => {
          if (userErr) { return done(userErr); }

          if (existingUser) {
            // User exists, create new authenticator for this user
            const stmt = db.prepare('INSERT INTO authenticators (userId, provider, providerId, displayName, email, accessToken, refreshToken, profileJson) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
            stmt.run(existingUser.id, provider, providerId, displayName, email, accessToken, refreshToken, profileJson, function(authErr) {
              if (authErr) { return done(authErr); }
              return done(null, existingUser);
            });
            stmt.finalize();
          } else {
            // No existing user by email, create new user and new authenticator
            db.run('INSERT INTO users (email, displayName) VALUES (?, ?)', [email, displayName], function(newUserErr) {
              if (newUserErr) { return done(newUserErr); }
              const newUserId = this.lastID;
              const stmt = db.prepare('INSERT INTO authenticators (userId, provider, providerId, displayName, email, accessToken, refreshToken, profileJson) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
              stmt.run(newUserId, provider, providerId, displayName, email, accessToken, refreshToken, profileJson, function(authErr) {
                if (authErr) { return done(authErr); }
                db.get('SELECT * FROM users WHERE id = ?', [newUserId], (err, newUserFull) => {
                    if(err) return done(err);
                    return done(null, newUserFull);
                });
              });
              stmt.finalize();
            });
          }
        });
      }
    });
  }
));

// LinkedIn Strategy
passport.use(new LinkedInStrategy({
    clientID: 'YOUR_LINKEDIN_API_KEY',
    clientSecret: 'YOUR_LINKEDIN_SECRET_KEY',
    callbackURL: '/auth/linkedin/callback',
    scope: ['r_emailaddress', 'r_liteprofile'],
    state: true,
    passReqToCallback: true
  },
  (req, accessToken, refreshToken, profile, done) => {
    const provider = 'linkedin';
    const providerId = profile.id;
    const displayName = profile.displayName;
    const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
    const profileJson = JSON.stringify(profile);

    if (req.user) { // User is logged in, link account
      const userId = req.user.id;
      db.get('SELECT * FROM authenticators WHERE userId = ? AND provider = ?', [userId, provider], (err, existingAuth) => {
        if (err) return done(err);
        if (existingAuth) { // Update existing LinkedIn authenticator
          db.run('UPDATE authenticators SET providerId = ?, displayName = ?, email = ?, accessToken = ?, refreshToken = ?, profileJson = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
            [providerId, displayName, email, accessToken, refreshToken, profileJson, existingAuth.id], updateErr => {
              if (updateErr) console.error("Error updating LinkedIn authenticator:", updateErr);
              return done(null, req.user);
          });
        } else { // Add new LinkedIn authenticator
          const stmt = db.prepare('INSERT INTO authenticators (userId, provider, providerId, displayName, email, accessToken, refreshToken, profileJson) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
          stmt.run(userId, provider, providerId, displayName, email, accessToken, refreshToken, profileJson, function(authErr) {
            if (authErr) return done(authErr);
            return done(null, req.user);
          });
          stmt.finalize();
        }
      });
    } else { // Not logged in, direct LinkedIn login attempt
      db.get('SELECT * FROM authenticators WHERE provider = ? AND providerId = ?', [provider, providerId], (err, authenticator) => {
        if (err) return done(err);
        if (authenticator) { // Authenticator found, fetch user
          db.get('SELECT * FROM users WHERE id = ?', [authenticator.userId], (userErr, user) => {
            if (userErr) return done(userErr);
            if (!user) return done(null, false, { message: 'User not found.' });
            // Optionally update authenticator
            db.run('UPDATE authenticators SET accessToken = ?, refreshToken = ?, profileJson = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
              [accessToken, refreshToken, profileJson, authenticator.id], updateErr => {
                if (updateErr) console.error("Error updating LinkedIn authenticator:", updateErr);
                return done(null, user);
            });
          });
        } else { // No authenticator, create new user and authenticator
          db.run('INSERT INTO users (email, displayName) VALUES (?, ?)', [email, displayName], function(newUserErr) {
            if (newUserErr) return done(newUserErr);
            const newUserId = this.lastID;
            const stmt = db.prepare('INSERT INTO authenticators (userId, provider, providerId, displayName, email, accessToken, refreshToken, profileJson) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
            stmt.run(newUserId, provider, providerId, displayName, email, accessToken, refreshToken, profileJson, function(authErr) {
              if (authErr) return done(authErr);
              db.get('SELECT * FROM users WHERE id = ?', [newUserId], (err, newUserFull) => {
                if(err) return done(err);
                return done(null, newUserFull);
              });
            });
            stmt.finalize();
          });
        }
      });
    }
  }
));

// Twitter Strategy
passport.use(new TwitterStrategy({
    consumerKey: 'YOUR_TWITTER_CONSUMER_KEY',
    consumerSecret: 'YOUR_TWITTER_CONSUMER_SECRET',
    callbackURL: '/auth/twitter/callback',
    includeEmail: true, // Request email, though Twitter may not always provide it
    passReqToCallback: true
  },
  (req, token, tokenSecret, profile, done) => { // Twitter uses token, tokenSecret
    const provider = 'twitter';
    const providerId = profile.id;
    const displayName = profile.displayName;
    const username = profile.username;
    const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
    const profileJson = JSON.stringify(profile);
    // Note: Twitter uses 'token' and 'tokenSecret' instead of accessToken/refreshToken for OAuth1.0a
    // We store token in accessToken field and tokenSecret in refreshToken field for simplicity.

    if (req.user) { // User is logged in, link account
      const userId = req.user.id;
      db.get('SELECT * FROM authenticators WHERE userId = ? AND provider = ?', [userId, provider], (err, existingAuth) => {
        if (err) return done(err);
        if (existingAuth) { // Update existing Twitter authenticator
          db.run('UPDATE authenticators SET providerId = ?, displayName = ?, username = ?, email = ?, accessToken = ?, refreshToken = ?, profileJson = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
            [providerId, displayName, username, email, token, tokenSecret, profileJson, existingAuth.id], updateErr => {
              if (updateErr) console.error("Error updating Twitter authenticator:", updateErr);
              return done(null, req.user);
          });
        } else { // Add new Twitter authenticator
          const stmt = db.prepare('INSERT INTO authenticators (userId, provider, providerId, displayName, username, email, accessToken, refreshToken, profileJson) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
          stmt.run(userId, provider, providerId, displayName, username, email, token, tokenSecret, profileJson, function(authErr) {
            if (authErr) return done(authErr);
            return done(null, req.user);
          });
          stmt.finalize();
        }
      });
    } else { // Not logged in, direct Twitter login attempt
      db.get('SELECT * FROM authenticators WHERE provider = ? AND providerId = ?', [provider, providerId], (err, authenticator) => {
        if (err) return done(err);
        if (authenticator) { // Authenticator found, fetch user
          db.get('SELECT * FROM users WHERE id = ?', [authenticator.userId], (userErr, user) => {
            if (userErr) return done(userErr);
            if (!user) return done(null, false, { message: 'User not found.' });
             db.run('UPDATE authenticators SET accessToken = ?, refreshToken = ?, profileJson = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
              [token, tokenSecret, profileJson, authenticator.id], updateErr => {
                if (updateErr) console.error("Error updating Twitter authenticator:", updateErr);
                return done(null, user);
            });
          });
        } else { // No authenticator, create new user and authenticator
          // Twitter might not provide an email, so handle null email gracefully
          db.run('INSERT INTO users (email, displayName) VALUES (?, ?)', [email, displayName], function(newUserErr) {
            if (newUserErr) return done(newUserErr);
            const newUserId = this.lastID;
            const stmt = db.prepare('INSERT INTO authenticators (userId, provider, providerId, displayName, username, email, accessToken, refreshToken, profileJson) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
            stmt.run(newUserId, provider, providerId, displayName, username, email, token, tokenSecret, profileJson, function(authErr) {
              if (authErr) return done(authErr);
               db.get('SELECT * FROM users WHERE id = ?', [newUserId], (err, newUserFull) => {
                if(err) return done(err);
                return done(null, newUserFull);
              });
            });
            stmt.finalize();
          });
        }
      });
    }
  }
));

// Serialization and Deserialization
passport.serializeUser((user, done) => {
  done(null, user.id); // user.id is the ID from the 'users' table
});

passport.deserializeUser((id, done) => {
  db.get('SELECT users.*, GROUP_CONCAT(auth.provider) as providers FROM users LEFT JOIN authenticators auth ON users.id = auth.userId WHERE users.id = ? GROUP BY users.id', [id], (err, user) => {
    if (err) { return done(err); }
    if (user && user.providers) {
        user.providers = user.providers.split(',');
    } else if (user) {
        user.providers = [];
    }
    // For profile page, might want to fetch full authenticator details too
    // For now, just basic user object with provider list
    done(err, user);
  });
});


// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// --- Routes ---
// Google Auth
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => res.redirect('/profile'));

// LinkedIn Connect/Auth
app.get('/connect/linkedin', (req, res, next) => {
  if (!req.isAuthenticated()) return res.redirect('/');
  req.session.save(err => {
    if (err) return next(err);
    passport.authenticate('linkedin')(req, res, next);
  });
});
app.get('/auth/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/profile', successRedirect: '/profile' }));

// Twitter Connect/Auth
app.get('/connect/twitter', (req, res, next) => {
  if (!req.isAuthenticated()) return res.redirect('/');
  req.session.save(err => {
    if (err) return next(err);
    passport.authenticate('twitter')(req, res, next);
  });
});
app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/profile', successRedirect: '/profile' }));

// Logout
app.get('/auth/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    req.session.destroy(() => { // Destroy session on logout
        res.clearCookie('connect.sid'); // Clear session cookie
        res.redirect('/');
    });
  });
});

// Profile Page
app.get('/profile', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  // Fetch full authenticator details for the profile page
  db.all('SELECT provider, displayName, username, email FROM authenticators WHERE userId = ?', [req.user.id], (err, authenticators) => {
    if (err) {
      console.error("Error fetching authenticators for profile:", err);
      // Render profile with just basic user info if auth fetch fails
      return res.render('profile', { user: req.user, authenticators: [] });
    }
    // Augment user object with authenticator details for the view
    const userProfileData = { ...req.user, authenticators: authenticators || [] };
    res.render('profile', { user: userProfileData });
  });
});


// Homepage
app.get('/', (req, res) => {
  res.render('index', { title: 'Bookmark Aggregator', user: req.user });
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
  // db.initDb() is called when database.js is loaded.
  // If explicit call needed: const database = require('./database'); database.initDb();
});
