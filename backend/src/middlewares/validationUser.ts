import Joi from "joi";
import { Request, Response, NextFunction } from "express";


const validateUpdateUser = async (req: Request, res: Response, next: NextFunction) => {
  const updateSchema = Joi.object({
    firstName: Joi.string().min(3).max(15).required(),
    lastName: Joi.string().min(3).max(15).required(),
    phone: Joi.number().required(),
    email: Joi.string().email().required(),
  });

  try {
    await updateSchema.validateAsync(req.body);
    next();
  } catch (error: any) {
    return res.json({ error: error.message });
  }
};

export default validateUpdateUser;
