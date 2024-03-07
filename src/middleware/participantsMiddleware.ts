import { NextFunction, Request, Response } from "express";
import { isObjectID } from "./objectIdFormatCheck";
import User from "../models/User/User.model";
import { NotFoundError } from "../errors/NotFoundError";

/**
 * Sets req.user.id to the actual user attached
 * to the provider userIdentifier passed in by the
 * participant
 */
export const setUserIdForParticipant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userIdentifier = req.params.userId;
    isObjectID(userIdentifier);

    const user = await User.findOne({ identifiers: userIdentifier });
    if (!user) throw new NotFoundError("User not found");

    req.user = {
      id: user._id,
    };
    next();
  } catch (err) {
    next(err);
  }
};
