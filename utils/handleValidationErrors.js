import { validationResult } from "express-validator";

/* In cazul in care a fost facut un bad request */
export default (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  next();
};
