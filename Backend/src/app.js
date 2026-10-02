import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js"
import cartRoutes from "./routes/cart.routes.js"
import CommentRoutes from "./routes/comment.routes.js"
import chatRoutes from "./routes/chat.routes.js"
import wishlistRoutes from "./routes/wishlist.routes.js"
import passport from "passport"
import {Strategy as GoogleStrategy} from "passport-google-oauth20"

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
];

app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(req.method, req.originalUrl);
  next();
});
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api",postRoutes)
app.use("/api/comment",CommentRoutes)
app.use("/api",chatRoutes)
app.use("/api/wishlist", wishlistRoutes)
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
app.put("/put-test", (req, res) => {
  res.json({ message: "PUT works" });
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ["profile","email"] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/',session:false }),
  function(req, res) {
    console.log(req.user.name.givenName+" "+req.user.name.familyName+" "+req.user.provider)
    res.redirect("/")
  });

export default app;
