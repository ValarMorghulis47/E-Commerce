import multer from "multer";

const multerUpload = multer({
    limits: {
        fileSize: 1024 * 1024 * 5
    }
});

const singleUpload = multerUpload.single("photo");
const multipleUpload = multerUpload.array("photos", 5);

export {singleUpload, multipleUpload};