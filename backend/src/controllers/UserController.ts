import { StatusCodes } from "http-status-codes";
import { PrismaClient } from "@prisma/client";
import { BadRequestError, NotFoundError } from "../errors/index";
import { Request, Response, NextFunction } from "express";

interface CustomRequest extends Request {
  user?: any; // Replace 'any' with a more specific type based on the user structure
}

const prisma = new PrismaClient();

const updateUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
      const id = req.user.id;
    const { firstName, lastName, phone, email } = req.body;

    if (!firstName || !lastName || !phone || !email) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: new BadRequestError("Please fill all the data !").message,
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: new NotFoundError("User not found!").message,
      });
    }
    const userUpdated = await prisma.user.update({
      where: {
        id: id,
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

const deleteUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
      const userId = req.user.id;

    if (!userId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: new BadRequestError("Please fill all the data !").message,
      });
    }
    const existUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!existUser) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: new NotFoundError("User not found!").message,
      });
    }

    let userDeleted = await prisma.user.delete({
      where: {
        id: userId,
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

const getUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
      const userId = req.user.id;
      console.log("userid: ", userId)

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
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
