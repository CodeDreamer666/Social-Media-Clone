import express from "express";
import cors from "cors";
import { commentPostController } from "../controllers/comments/comment-post.js";
import { makeCommentController } from "../controllers/comments/make-commet.js";
import { getCommentsController } from "../controllers/comments/get-comments.js";

const app = express();
export const commentsRouter = express.Router();

app.use(cors());
app.use(express.json());

commentsRouter.get("/comment-post/:postId", commentPostController);
commentsRouter.post("/make-comment/:postId", makeCommentController);
commentsRouter.get("/:postId", getCommentsController);