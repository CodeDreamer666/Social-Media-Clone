import express from "express";
import cors from "cors";
import { userLikedCommentsController } from "../controllers/comments-likes/user-liked-comments.js";
import { likeCommentController } from "../controllers/comments-likes/like-comment.js";
import checkIsLogin from "../middlewares/checkIsLogin.js"
import errorHandler from "../middlewares/errorHandler.js"

const app = express();
export const commentsLikesRouter = express.Router();

app.use(cors());
app.use(express.json());

commentsLikesRouter.post("/like-comment/:commentId", checkIsLogin("Please sign in or login to like the comment"), likeCommentController);
commentsLikesRouter.get("/user-like-comments", userLikedCommentsController);

app.use(errorHandler);