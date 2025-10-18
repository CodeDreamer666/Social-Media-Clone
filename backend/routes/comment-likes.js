import express from "express";
import cors from "cors";
import { userLikedCommentsController } from "../controllers/comments-likes/user-liked-comments.js";
import { likeCommentController } from "../controllers/comments-likes/like-comment.js";

const app = express();
export const commentsLikesRouter = express.Router();

app.use(cors());
app.use(express.json());

commentsLikesRouter.post("/like-comment/:commentId", likeCommentController);
commentsLikesRouter.get("/user-like-comments", userLikedCommentsController);