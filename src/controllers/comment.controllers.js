import mongoose from "mongoose";
import { schemaForUser } from "../models/user.model.js";
import { schemaForPost } from "../models/post.model.js";
import { schemaForComment } from "../models/comments.model.js";

// create comment
const createComment = async (req, res) => {
  const { id } = req.params;
  const { postId } = req.body;
  const { content } = req.body;
  if (!id) {
    return res.status(400).json({
      message: "User id is required",
    });
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "User id is invalid",
    });
  }
  if (!postId)
    return res.status(400).json({
      message: "Post id is required",
    });

  if (!content)
    return res.status(400).json({
      message: "Content is required",
    });

  const existingUser = await schemaForUser.findById(id);
  if (!existingUser) {
    return res.status(400).json({
      message: "User not found",
    });
  }
  const existingPost = await schemaForPost.findById(postId);
  if (!existingPost) {
    return res.status(400).json({
      message: "Post not found",
    });
  }

  const comment = await schemaForComment.create({
    content,
    createdBy: existingUser._id,
    post: existingPost._id,
  });

  await existingPost.updateOne({
    $push: {
      comments: comment._id,
    },
  });

  res.status(200).json({
    message: "Comment created successfully",
    comment,
  });
};

export { createComment };
