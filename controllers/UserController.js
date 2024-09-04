import jwt from "jsonwebtoken";
import bcrypt, { hash } from "bcrypt";
import { validationResult } from "express-validator"; /* Verifica inca odata daca sunt greseli in info introdusa de catre utilizator */
import UserModal from "../models/user.js";

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json(
          errors.array()
        ); /* In cazul in care a fost facut un bad request */
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModal({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });

    const user =
      await doc.save(); /* Indicam ca documentul nostru trebuie salvat in baza de date si rezultatul care vine de la mongodb vine la user */

    const token = jwt.sign(
      {
        /* Cripteaza id-ul. secret123 este cheia datorita careia se cripteaza _id */
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
    });
  } catch (err) {
    console.log(err);
    res.json({
      message: "Nu a reușit să vă înregistrați.",
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModal.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({
        message: "Utilizatorul nu a fost găsit",
      });
    }
    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );
    if (!isValidPass) {
      return res.status(404).json({
        message: "Login sau parola gresită",
      });
    }

    const token = jwt.sign(
      {
        /* Cripteaza id-ul. secret123 este cheia datorita careia se cripteaza _id */
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.json({
      message: "Nu a reușit să vă autentificați.",
    });
  }
};

export const getMe = async (req, res) => {
  /* checkAuth functie care verifica autorizarea */
  try {
    const user = await UserModal.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "Acest utilizator nu exista",
      });
    }
    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
    });
  } catch (err) {
    console.log(err);
    res.json({
      message: "Nu aveți acces",
    });
  }
};
