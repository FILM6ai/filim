import express from "express";
import {
  getWaimf,
  updateWaimf,
  seedWaimf,
} from "../controllers/waimfController.js";

const waimfRoute = express.Router();

// Read is public - it is what waimf.org renders from.
waimfRoute.get("/getwaimf", getWaimf);

// Writes are not listed in PUBLIC_WRITE_PATHS in server.js, so the shared
// `protect` middleware requires a signed-in admin for both of these.
waimfRoute.put("/updatewaimf", updateWaimf);
waimfRoute.post("/seed", seedWaimf);

export default waimfRoute;
