import { body } from "express-validator";

export const loginValidation = [
  body("email", "formatul postei este gersit").isEmail(),
  body("password", "parola trebuie sa fie minim de 5 caractere").isLength({ min: 5, }),
];

export const registerValidation = [
  body("email", "formatul postei este gersit").isEmail(),
  body("password", "parola trebuie sa fie minim de 5 caractere").isLength({ min: 5, }),
  body("fullName", "introduceti numele").isLength({ min: 3 }),
  body("avatarUrl", "link gresit pentru avatar").optional().isURL(),
];

export const postCreateValidation = [
  body("title", "Introduceti titlul postarii").isLength({ min: 3 }).isString(),
  body("text", "Introduceti un comentariu la postare").isLength({ min: 3, }).isString(),
  body("tag", "Format gresit al tagurilor").optional().isString(),
  body("imageUrl", "Link gresit").optional().isString(),
];
