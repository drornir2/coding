import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import http from "http";
import cors from "cors";
import { setUpIo } from "./services/socketService.js";
import codingRoomRouter from "./routes/codingRoomRouter.js";
//public
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const app = express();
const server = http.createServer(app); //creating http server
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
setUpIo(server); // create SocketIO server
app.use("/api/v1/codingRoom", codingRoomRouter);
app.use(express.static(path.join(__dirname, "public")));

app.use("*", (req, res) => {
  res.status(404).json({ msg: "not found" });
});
const port = process.env.PORT || 5000;

try {
  await mongoose.connect(
    "mongodb+srv://chen201296:coding2012@cluster0.spzdrgs.mongodb.net/codingMentor?retryWrites=true&w=majority"
  );
  server.listen(port, () => {
    console.log("server is running on port 5000");
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}
