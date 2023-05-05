import * as multer from "multer";
import { join } from "path";

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, join(__dirname, "../files"));
  },
  filename(req, file: Express.Multer.File, callback) {
    callback(null, new Date() + file.originalname);
  },
});

const limits = {
  //100mb
  fileSize: 1024 * 1024 * 100,
};

export const upload = multer({
  storage,
  limits,
});
