import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js"
import passport from "passport"
import {Strategy as GoogleStrategy} from "passport-google-oauth20"

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
app.use("/api",postRoutes)
app.use(passport.initialize())
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_USER_URL
  },
  function(_, __, profile, cb) {
      return cb(null,profile)
  }
));
app.get("/",(req,res)=>{
    res.send(req.user)
})

app.get('/auth/google',
  passport.authenticate('google', { scope: ["profile","email"] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/',session:false }),
  function(req, res) {
    console.log(req.user.name.givenName+" "+req.user.name.familyName+" "+req.user.provider)
    res.redirect("/")
  });

export default app;
