import { StatusCodes } from "http-status-codes";
import { PrismaClient } from "@prisma/client";
import { BadRequestError, NotFoundError } from "../errors/index";
import { Request, Response, NextFunction } from "express";


const prisma = new PrismaClient();

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, phone, email } = req.body;

    if (!firstName || !lastName || !phone || !email) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: new BadRequestError("Please fill all the data !").message,
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: new NotFoundError("User not found!").message,
      });
    }
    const userUpdated = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        firstName,
        lastName,
        phone,
        email,
      },
    });

    return res.status(StatusCodes.OK).json({ data: { ...userUpdated, password: "" } });
  } catch (error: any) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: new BadRequestError("Please fill all the data !").message,
      });
    }
    const existUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!existUser) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: new NotFoundError("User not found!").message,
      });
    }

    let userDeleted = await prisma.user.delete({
      where: {
        email: email,
      },
    });
    console.log("userDeleted")
    return res.status(StatusCodes.NO_CONTENT).json("Delete Done");
  } catch (error: any) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: new NotFoundError("User not found!").message,
      });
    }

    return res.status(StatusCodes.OK).json({ data: { ...user, password: "" } });
  } catch (error: any) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export { updateUser, deleteUser, getUser };
