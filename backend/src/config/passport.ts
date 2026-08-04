import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

console.log("GOOGLE_CLIENT_ID =", process.env.GOOGLE_CLIENT_ID);
console.log("GOOGLE_CLIENT_SECRET =", process.env.GOOGLE_CLIENT_SECRET?.substring(0, 10));

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',

      callbackURL:
        process.env.NODE_ENV === 'production'
          ? 'https://community-dashboard-assignment.onrender.com/api/auth/google/callback'
          : 'http://localhost:5000/api/auth/google/callback',
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0].value || '',
            avatar: profile.photos?.[0].value || '',
            lastLogin: new Date(),
          });
        } else {
          user.lastLogin = new Date();
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);