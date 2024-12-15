import { schemaForUser } from "../models/user.model.js";
import {
  createAccessToken,
  createRefreshToken,
  uploadImage,
} from "../Methods/Methods.js";
import mongoose from "mongoose";
// Create User
const registerUser = async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName)
    return res.status(400).send({ message: "Full Name is required" });
  if (!email) return res.status(400).send({ message: "Email is required" });
  if (!password)
    return res.status(400).send({ message: "Password is required" });

  const user = await schemaForUser.findOne({ email: email });
  if (user) return res.status(400).send({ message: "User already exists" });

  const newUser = await schemaForUser.create({
    fullName,
    email,
    password,
  });

  const accessToken = createAccessToken(newUser);
  const refreshToken = createRefreshToken(newUser);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxage: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).send({
    message: "User created successfully",
    accessToken,
    user: newUser,
  });
};
// logIn user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email) return res.status(400).send({ message: "Email is required" });
  if (!password)
    return res.status(400).send({ message: "Password is required" });

  const user = await schemaForUser.findOne({ email: email });
  if (!user) return res.status(400).send({ message: "User not found" });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).send({ message: "Invalid credentials" });
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxage: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: "User logged in successfully",
    accessToken,
    user: {
      fullName: user.fullName,
      email: user.email,
    },
  });
};

// get Single User
const getSingleUser = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).send({ message: "User id is required" });
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).send({ message: "User id is invalid" });
  const user = await schemaForUser.findById(id).populate(["posts" , "likedPost"]);
  if (!user) return res.status(400).send({ message: "User not found" });
  res.status(200).json({
    message: "User fetched successfully",
    user,
  });
};

// upload Image
const uploadImageToDb = async (req, res) => {
  if (!req.file) return res.status(400).send({ message: "Image is required" });
  const image = req.file.path;
  try {
    const result = await uploadImage(image);
    res.status(200).json({
      message: "Image uploaded successfully",
      image: result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error occurred while uploading image",
      error,
    });
  }
};
export { registerUser, loginUser, uploadImageToDb, getSingleUser };
