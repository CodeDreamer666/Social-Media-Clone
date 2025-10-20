import express from "express";
import cors from "cors";
import { signInController } from "../controllers/users/sign-in.js";
import { meController } from "../controllers/users/me.js";
import { logoutController } from "../controllers/users/logout.js";
import { loginController } from "../controllers/users/login.js";
import { userProfileController } from "../controllers/users/user-profile.js";
import { editProfileController } from "../controllers/users/edit-profile.js";
import { bioController } from "../controllers/users/bio.js";
import checkIsLogin from "../middlewares/checkIsLogin.js";
import errorHandler from "../middlewares/errorHandler.js";

const app = express();
export const usersRouter = express.Router();

app.use(cors());
app.use(express.json());

usersRouter.post(
    "/sign-in",
    signInController
);

usersRouter.get(
    "/me",
    checkIsLogin(""),
    meController
);

usersRouter.post(
    "/logout",
    logoutController
);

usersRouter.post(
    "/login",
    loginController
);

usersRouter.get(
    "/profile/:id",
    checkIsLogin("Please sign in or login to see your profile"),
    userProfileController
);

usersRouter.patch(
    "/profile",
    checkIsLogin("Please sign in or log in to edit your profile"),
    editProfileController
);

usersRouter.get(
    "/bio",
    checkIsLogin(""),
    bioController
);

app.use(errorHandler);