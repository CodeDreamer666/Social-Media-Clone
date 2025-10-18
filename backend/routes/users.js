import express from "express";
import cors from "cors";
import { signInController } from "../controllers/users/sign-in.js";
import { meController } from "../controllers/users/me.js";
import { logoutController} from "../controllers/users/logout.js";
import { loginController } from "../controllers/users/login.js";
import { userProfileController } from "../controllers/users/user-profile.js";
import { editProfileController } from "../controllers/users/edit-profile.js";
import { bioController } from "../controllers/users/bio.js";

const app = express();
export const usersRouter = express.Router();

app.use(cors());
app.use(express.json());

usersRouter.post("/sign-in", signInController);
usersRouter.get("/me", meController);
usersRouter.post("/logout", logoutController);
usersRouter.post("/login", loginController);
usersRouter.get("/user-profile/:id", userProfileController);
usersRouter.patch("/edit-profile", editProfileController);
usersRouter.get("/bio", bioController);