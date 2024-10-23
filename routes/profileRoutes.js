import express from "express";
const router = express.Router();
import multer from "multer";
import path from "path";
import { 
  updateProfile,
  deleteAccount,
  updateProfilePicture,
  updatePassword
} from "../controllers/profileController.js";
import authMiddleware from "../middleware/authMiddleware.js";

router.use(authMiddleware);

router.put("/update", updateProfile);

router.delete("/delete", deleteAccount);

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
}).single("profilePicture");

router.put("/update-profile-picture", upload, updateProfilePicture);

router.put("/update-password", updatePassword);

export default router;