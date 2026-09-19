import express from "express";
import {
  createFilm,
  deleteFilm,
  getFilm6Tv,
  getFilms,
  updateFilm,
  updateFilm6Tv,
} from "../controllers/filmController.js";

const filmRoute = express.Router();

// Catalogue. GET is public (the website reads it); ?all=1 returns unpublished
// films too, which is what the panel asks for.
filmRoute.get("/getfilms", getFilms);
filmRoute.post("/film", createFilm);
filmRoute.put("/film/:id", updateFilm);
filmRoute.delete("/film/:id", deleteFilm);

// Page furniture - hero, the film-maker call to action, the legal slot and the
// Bunny library id.
filmRoute.get("/settings", getFilm6Tv);
filmRoute.put("/settings", updateFilm6Tv);

export default filmRoute;
