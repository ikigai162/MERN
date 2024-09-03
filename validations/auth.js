import { body } from "express-validator";

export const registerValidation = [
  body("email", "formatul postei este gersit").isEmail(),
  body("password", "parola trebuie sa fie minim de 5 caractere").isLength({ min: 5, }),
  body("fullName", "introduceti numele").isLength({ min: 3 }),
  body("avatarUrl", "link gresit pentru avatar").optional().isURL(),
];
