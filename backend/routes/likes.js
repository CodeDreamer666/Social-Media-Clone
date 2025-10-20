import express from "express";
import cors from "cors";
import { likeController } from "../controllers/likes/like.js";
import { userLikePostsController } from "../controllers/likes/user-liked-posts.js";
import checkIsLogin from "../middlewares/checkIsLogin.js";
import errorHandler from "../middlewares/errorHandler.js";

const app = express();
export const likesRouter = express.Router();

app.use(cors());
app.use(express.json());

likesRouter.post("/:id", checkIsLogin("Please sign in or login to like the post"), likeController);
likesRouter.get("/", userLikePostsController);

app.use(errorHandler);