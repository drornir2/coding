import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import morgan from "morgan";
import mongoose from "mongoose";
import http from "http";
import cors from "cors";
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
import { setUpIo } from "./services/SocketService.js";
import codingRoomRouter from "./routes/codingRoomRouter.js";
app.use("/api/v1/codingRoom", codingRoomRouter);

const server = http.createServer(app); //creating http server
setUpIo(server);
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
