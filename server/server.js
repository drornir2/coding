import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import http from "http";
import cors from "cors";
import { setUpIo } from "./services/SocketService.js";
import codingRoomRouter from "./routes/codingRoomRouter.js";

const app = express();
const server = http.createServer(app); //creating http server

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use("/api/v1/codingRoom", codingRoomRouter);

setUpIo(server); // create SocketIO server

app.get("*", (req, res) => {
  res.send("server is running");
});

const port = process.env.PORT || 5000;

try {
  await mongoose.connect(process.env.MONGO_URL);
  server.listen(port, () => {
    console.log("server is running on port 5000");
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}
