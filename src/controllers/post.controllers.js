import mongoose from "mongoose";
import { schemaForPost } from "../models/post.model.js";
import { schemaForUser } from "../models/user.model.js";
const createPost = async (req, res) => {
  const { id } = req.params;
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
  const existingUser = await schemaForUser.findById(id);
  if (!existingUser) {
    return res.status(400).json({
      message: "User not found",
    });
  }
  const { content, media } = req.body;
  if (!content) {
    return res.status(400).json({
      message: "Content is required",
    });
  }

  const post = await schemaForPost.create({
    content,
    media,
    createdBy: id,
  });

  await existingUser.updateOne({
    $push: { posts: post._id },
  });

  res.status(200).json({
    message: "Post created successfully",
    post,
  });
};

const getSinglePost = async (req, res) => {
  const { postId } = req.params;
  if (!postId) {
    return res.status(400).json({
      message: "Post id is required",
    });
  }
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({
      message: "Post id is invalid",
    });
  }
  const post = await schemaForPost
    .findById(postId)
    .populate(["createdBy", "likes", "comments"]);
  if (!post) {
    return res.status(400).json({
      message: "Post not found",
    });
  }

  res.status(200).json({
    message: "Post found",
    post,
  });
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  const { postId } = req.body;
  if (!id) {
    return res.status(400).json({
      message: "User id  is required",
    });
  }

  if (!postId) {
    return res.status(400).json({
      message: "Post id is required",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "User id is invalid",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({
      message: "User is invalid",
    });
  }
  const existingUser = await schemaForUser.findById(id);
  if (!existingUser) {
    return res.status(400).json({
      message: "No such user found",
    });
  }

  const existingPost = await schemaForPost.findById(postId);
  if (!existingPost) {
    return res.status(400).json({
      message: "No such post found",
    });
  }
  const deletedPost = await schemaForPost.findOneAndDelete({
    _id: postId,
  });

  await schemaForUser.findOneAndUpdate(
    { _id: id },
    {
      $pull: {
        posts: postId,
      },
    }
  );

  res.status(200).json({
    message: "Post deleted successfully",
    data: deletedPost,
  });
};

export { createPost, getSinglePost, deletePost };
