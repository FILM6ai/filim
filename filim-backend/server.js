// server.js
import express from "express";
import cors from "cors";
// import bodyParser from 'body-parser';
import "dotenv/config.js";
import connectDB from "./utils/db.js";
import homeRouter from "./routes/homeRoute.js";
import serviceRoute from "./routes/serviceRoute.js";
import festivalRoute from "./routes/festivalRoute.js";
import studioRoute from "./routes/studio.js";
import contatcRoute from "./routes/contact.js";
import formRoute from "./routes/form.js";
import blogRoute from "./routes/blogRoute.js";
import newRoute from "./routes/newRoute.js";
import navbarRouter from "./routes/navbarRoute.js";
import footerRouter from "./routes/footerRoute.js";
import metaRouter from "./routes/metaRoute.js";
import faqRoute from "./routes/faqRoute.js";
import termRoute from "./routes/termRoute.js";
import emailRoute from "./routes/emailRoute.js";
import registrationRoute from './routes/registrationRoute.js';
import cloudinaryRoute from './routes/cloudinaryRoute.js';
import authRoute from './routes/authRoute.js';
// TEMPORARY - see routes/dbMigrateRoute.js. Remove after the database move.
import dbMigrateRoute from './routes/dbMigrateRoute.js';
import { protect } from './middlewere/auth.js';
import { isAllowedOrigin } from './config/security.js';

const app = express();
// const port = process.env.Port || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ limit: "200mb", extended: true }));

app.use(
  cors({
    // Answering "no" leaves the CORS headers off so the browser blocks the
    // response, rather than throwing, which would turn every request from an
    // unrecognised origin into a 500 in the logs.
    origin: (origin, callback) => callback(null, isAllowedOrigin(origin)),
  }),
);
connectDB();

// ---------------------------------------------------------------------------
// Who is allowed to call what
// ---------------------------------------------------------------------------
//
// Applied in one place rather than route by route, so that any endpoint added
// later is protected by default: anything that changes data needs a signed-in
// account unless it is explicitly listed as public below. Getting this wrong by
// forgetting a route is how the API ended up open to the whole internet in the
// first place.

// Things a visitor to the website genuinely has to be able to POST.
const PUBLIC_WRITE_PATHS = new Set([
  "/api/form/formroute", // contact form
  "/api/postemail", // newsletter signup
  "/api/postregistration", // festival registration
]);

// Reads that look public but return personal data, so they are locked as
// tightly as the write endpoints.
const PROTECTED_READ_PATHS = new Set([
  "/api/form/getform", // contact form submissions
  "/api/getemail", // newsletter subscriber list
  "/api/getregistration", // registration list
]);

// Express matches routes case-insensitively and ignores a trailing slash, so
// the comparison has to as well - otherwise "/api/postemail/" would look like
// an unknown write and start rejecting real form submissions.
const normalisePath = (path) =>
  path.toLowerCase().replace(/\/+$/, "") || "/";

const gate = protect();

app.use((req, res, next) => {
  // The account endpoints do their own, always-on checking.
  if (normalisePath(req.path).startsWith("/api/auth/")) return next();

  const path = normalisePath(req.path);
  const isWrite = !["GET", "HEAD", "OPTIONS"].includes(req.method);
  const needsAuth =
    (isWrite && !PUBLIC_WRITE_PATHS.has(path)) || PROTECTED_READ_PATHS.has(path);

  return needsAuth ? gate(req, res, next) : next();
});

app.use("/api/auth", authRoute);
// TEMPORARY - database move. Sits behind the gate above like everything else,
// and additionally requires a sign-in and a token of its own.
app.use("/api/_migrate", dbMigrateRoute);
app.use("/api/home", homeRouter);
app.use("/api/service", serviceRoute);
app.use("/api/festival", festivalRoute);
app.use("/api/studio", studioRoute);
app.use("/api/contact", contatcRoute);
app.use("/api/form", formRoute);
app.use("/api/blog", blogRoute);
app.use("/api/news", newRoute);
app.use("/api", navbarRouter);
app.use("/api", footerRouter);
app.use("/api", metaRouter);
app.use("/api/faq", faqRoute);
app.use("/api/term", termRoute);
app.use("/api/", emailRoute);
app.use('/api', registrationRoute);
app.use('/api/cloudinary', cloudinaryRoute);


app.get("/", (req, res) => {
  res.send("Hello World!");
});
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

export default app;
