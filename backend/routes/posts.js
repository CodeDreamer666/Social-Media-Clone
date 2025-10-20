import express from "express";
import cors from "cors";
import { uploadPostController } from "../controllers/posts/upload-post.js";
import { getPostController } from "../controllers/posts/get-posts.js";
import checkIsLogin from "../middlewares/checkIsLogin.js";
import errorHandler from "../middlewares/errorHandler.js";

const app = express();
export const postsRouter = express.Router();

app.use(cors());
app.use(express.json());

postsRouter.post("/post", checkIsLogin("Please sign in or login to upload post"), uploadPostController);
postsRouter.get("/post", getPostController);

app.use(errorHandler);