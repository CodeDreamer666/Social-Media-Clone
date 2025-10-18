import express from "express";
import cors from "cors";
import { likeController } from "../controllers/likes/like.js";
import { userLikePostsController } from "../controllers/likes/user-liked-posts.js";

const app = express();
export const likesRouter = express.Router();

app.use(cors());
app.use(express.json());

likesRouter.post("/like-post/:id", likeController);
likesRouter.get("/user-like-posts", userLikePostsController);