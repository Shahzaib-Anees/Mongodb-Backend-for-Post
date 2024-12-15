import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/db/index.js";
import userRoutes from "./src/routes/user.routes.js";
import postRoutes from "./src/routes/post.routes.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);

(async () => {
  try {
    const res = await connectDB();
    console.log(res);
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
})();
