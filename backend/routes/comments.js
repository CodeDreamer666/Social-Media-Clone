import express from "express";
import cors from "cors";
import { commentPostController } from "../controllers/comments/comment-post.js";
import { makeCommentController } from "../controllers/comments/make-commet.js";
import { getCommentsController } from "../controllers/comments/get-comments.js";
import checkIsLogin from "../middlewares/checkIsLogin.js";
import errorHandler from "../middlewares/errorHandler.js";

const app = express();
export const commentsRouter = express.Router();

app.use(cors());
app.use(express.json());

commentsRouter.get("/post/:postId", commentPostController);
commentsRouter.post("/:postId", checkIsLogin("Please sign in or login to make a comment"), makeCommentController);
commentsRouter.get("/:postId", getCommentsController);

app.use(errorHandler);

