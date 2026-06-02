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

const app = express();
// const port = process.env.Port || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ limit: "200mb", extended: true }));

app.use(cors());
connectDB();
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


app.get("/", (req, res) => {
  res.send("Hello World!");
});
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

export default app;
