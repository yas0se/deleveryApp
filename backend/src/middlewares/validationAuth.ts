import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

const validateRegister = [
  body("name")
    .isLength({ min: 3 })
    .withMessage("name must be at least 3 characters")
    .isAlpha()
    .withMessage("name must contain only letters"),
  body("email")
    .isEmail()
    .withMessage("Email must be a valid email address")
    .matches(/@gmail\.com$/)
    .withMessage("Email must end with @gmail.com"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array().map((err) => err.msg) });
    }
    next();
  },
];

const validateLogin = [
  body("email")
    .isEmail()
    .withMessage("Email must be a valid email address")
    .matches(/@gmail\.com$/)
    .withMessage("Email must end with @gmail.com"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array().map((err) => err.msg) });
    }
    next();
  },
];

const validatePassword = [
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array().map((err) => err.msg) });
    }
    next();
  },
];
export { validateRegister, validateLogin, validatePassword };
