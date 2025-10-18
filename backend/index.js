import express from "express";
import cors from "cors";
import session from "express-session";
import { secret } from "./config.js";
import { postsRouter } from "./routes/posts.js";
import { usersRouter } from "./routes/users.js";
import { likesRouter } from "./routes/likes.js";
import { commentsRouter } from "./routes/comments.js";
import { commentsLikesRouter } from "./routes/comment-likes.js";

const PORT = 8000;
const app = express();

// ✅ CORS setup for credentials
app.use(cors({
  origin: "http://localhost:5173", // React app URL
  credentials: true,              // allows cookies to be sent
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
}));

app.use(express.json());
app.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: "lax"
  }
}));

app.use("/api", postsRouter);
app.use("/api/auth", usersRouter);
app.use("/api/likes", likesRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/comments-likes", commentsLikesRouter);


app.listen(PORT, () => console.log("Connected"));
