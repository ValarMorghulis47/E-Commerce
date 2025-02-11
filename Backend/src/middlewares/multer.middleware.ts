import multer from "multer";

const singleUpload = multer().single("photo");
const multipleUpload = multer().array("photos", 5);

export {singleUpload, multipleUpload};