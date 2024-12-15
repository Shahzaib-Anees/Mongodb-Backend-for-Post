import express from "express";
import {
  getSingleUser,
  loginUser,
  registerUser,
  uploadImageToDb,
} from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/uploadImage", upload.single("image"), uploadImageToDb);
router.get("/:id", getSingleUser);

export default router;
