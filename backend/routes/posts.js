import express from "express";
import cors from "cors";
import { uploadPostController } from "../controllers/posts/upload-post.js";
import { getPostController } from "../controllers/posts/get-posts.js";

const app = express();
export const postsRouter = express.Router();

app.use(cors());
app.use(express.json());

postsRouter.post("/upload-post", uploadPostController);
postsRouter.get("/get-post", getPostController);