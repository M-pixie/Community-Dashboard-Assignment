import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

const callback =
  process.env.NODE_ENV === 'production'
    ? 'https://community-dashboard-assignment.onrender.com/api/auth/google/callback'
    : 'http://localhost:5000/api/auth/google/callback';

console.log("NODE_ENV =", process.env.NODE_ENV);
console.log("GOOGLE_CLIENT_ID =", process.env.GOOGLE_CLIENT_ID);
console.log("Using Callback =", callback);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: callback,
      proxy: true,
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