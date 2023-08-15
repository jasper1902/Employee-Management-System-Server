import multer, { diskStorage } from "multer";
import { v4 as uuidv4 } from "uuid";
import { Request } from "express";
import fs from "fs";
import path from "path";

const storage = diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb) {
    const destinationPath = path.join(__dirname, "../public/images");

    fs.mkdirSync(destinationPath, { recursive: true });

    cb(null, destinationPath);
  },
  filename: function (req: Request, file: Express.Multer.File, cb) {
    const uniqueSuffix = uuidv4();
    const sanitizedOriginalName = file.originalname.replace(
      /[^a-zA-Z0-9]/g,
      "_"
    );
    const uniqueFilename = `${sanitizedOriginalName}-${uniqueSuffix}.jpg`;
    cb(null, uniqueFilename);
  },
});

export const uploadAvatar = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5 MB
}).single("image");
