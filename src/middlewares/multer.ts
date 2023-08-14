import multer, { diskStorage } from "multer";
import { v4 as uuidv4 } from "uuid";
import { Request } from "express";

const storage = diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb) {
    cb(null, "./src/public/images/");
  },
  filename: function (req: Request, file: Express.Multer.File, cb) {
    const sanitizedName = file.originalname.replace(/ /g, "_");
    const uniqueFilename = `${sanitizedName}-${
      file.fieldname
    }-${uuidv4()}-${sanitizedName}`;
    cb(null, uniqueFilename);
  },
});

export const uploadAvatar = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5 MB
}).single("image");
