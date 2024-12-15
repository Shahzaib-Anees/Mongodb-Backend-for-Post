import mongoose from "mongoose";
import { schemaForUser } from "../models/user.model.js";
import { schemaForPost } from "../models/post.model.js";

// like post
const likePost = async (req, res) => {
  const { id } = req.params;
  const { postId } = req.body;
  if (!id) return res.status(400).json({ message: "User id is required" });
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: "Invalid user id" });
  if (!mongoose.Types.ObjectId.isValid(postId))
    return res.status(400).json({ message: "Invalid post id" });

  const existingUser = await schemaForUser.findById(id);
  if (!existingUser)
    return res.status(400).json({ message: "No such user found" });
  const existingPost = await schemaForPost.findById(postId);
  if (!existingPost)
    return res.status(400).json({ message: "No such post found" });
  if (existingPost.likes.includes(existingUser._id))
    return res.status(400).json({ message: "Post already liked" });
  await schemaForPost.findOneAndUpdate(
    { _id: postId },
    { $push: { likes: existingUser._id } }
  );

  await schemaForUser.findOneAndUpdate(
    { _id: id },
    { $push: { likedPost: postId } }
  );
  res.status(200).json({ message: "Post liked successfully" });
};

export { likePost };
