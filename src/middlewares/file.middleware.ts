import { NextFunction, Request, Response } from "express";

import { ApiError } from "../errors/api-error";

class FileMiddleware {
  public validateFiles({
    allowMultiple = false,
  }: { allowMultiple?: boolean } = {}) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!req.files || !req.files.avatar) {
          throw new ApiError("No file uploaded", 400);
        }

        const files = Array.isArray(req.files.avatar)
          ? req.files.avatar
          : [req.files.avatar];

        if (!allowMultiple && files.length > 1) {
          throw new ApiError("Only one file can be uploaded at a time", 400);
        }

        const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
        const maxSize = 1 * 1024 * 1024;

        for (const file of files) {
          if (!allowedTypes.includes(file.mimetype)) {
            throw new ApiError(
              "Invalid file type. Only JPG, JPEG, and PNG are allowed.",
              400,
            );
          }

          if (file.size > maxSize) {
            throw new ApiError("File size exceeds 1MB limit.", 400);
          }
        }

        next();
      } catch (e) {
        next(e);
      }
    };
  }
}

export const fileMiddleware = new FileMiddleware();
