import * as dotenv from "dotenv";
dotenv.config({ path: ".env.example" });

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import { dirname } from "path";

import configureRoutes from "./routes/index.js";

await mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log(`Database connected successfully`))
  .catch((err) => console.log(err));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

global.__basedir = __dirname;

const app = express();
app.use(cors());
app.use(express.json());

configureRoutes(app);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Connected to server");
  console.log(`Server started at http://localhost:${port}`);
});
