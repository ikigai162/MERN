import express from "express";
import mongoose from "mongoose";
import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from "./validations.js";
import checkAuth from "./utils/checkAuth.js";

import * as UserController from "./controllers/UserController.js"; /* Importa toate metodele in variabila UserController */
import * as PostController from "./controllers/PostController.js"; /* Importa toate metodele in variabila PostrController */

mongoose
  .connect(
    "mongodb+srv://admin:wwwwww@cluster0.rxi8j.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("DB erorr", err));

const app = express();

app.use(express.json());

app.use("/auth/login", loginValidation, UserController.login);
/* cand vine un request pe server, trece prin registerValidation care verifica toate datele precum noi am introdus */
app.post("/auth/register", registerValidation, UserController.register);
app.get("/auth/me", checkAuth, UserController.getMe);

app.get("/posts", checkAuth, postCreateValidation, PostController.create);
app.get("/posts", PostController.getAll);

app.listen(4444, (err) => {
  if (err) {
    return console.log("err");
  }
  console.log("Server ok");
});
