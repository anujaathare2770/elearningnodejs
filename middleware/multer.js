import multer from "multer";
import path from "path";
import { v4 as uuid } from "uuid";

const storage = multer.diskStorage({
    destination(req, file, cb) {
        // Use an absolute path for "uploads"
        cb(null, path.join(process.cwd(), "server", "uploads"));
    },
    filename(req, file, cb) {
        const id = uuid();
        const extName = file.originalname.split(".").pop();
        const fileName = `${id}.${extName}`;
        cb(null, fileName);
    },
});

export const uploadFiles = multer({ storage }).single("file");
