import express from "express";
import {
  createPost,
  deletePost,
  getSinglePost,
} from "../controllers/post.controllers.js";
import { likePost } from "../controllers/like.controllers.js";
import { createComment } from "../controllers/comment.controllers.js";
import { authenticateUser } from "../middlewares/authentication.middleware.js";
const router = express.Router();

router.post("/:id", authenticateUser, createPost);
router.get("/:postId", authenticateUser, getSinglePost);
router.delete("/:id", authenticateUser, deletePost);
router.post("/like/:id", authenticateUser, likePost);
router.post("/comment/:id", authenticateUser, createComment);

export default router;
