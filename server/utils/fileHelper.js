import fs from "fs/promises";
import path from "path";
import multer from "multer";

export const fileHelper = {
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(process.cwd(), "uploads", "documents"));
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
  }),

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only PDF, DOC, DOCX, JPG and PNG files are allowed.",
        ),
        false,
      );
    }
  },

  getUploader() {
    return multer({
      storage: this.storage,
      fileFilter: this.fileFilter,
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
    });
  },

  async deleteFile(filePath) {
    try {
      if (filePath) {
        await fs.unlink(filePath);
      }
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  },
};
