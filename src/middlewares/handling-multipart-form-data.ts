import multer from "multer";

const storage = multer.memoryStorage();

export const handleStoreThumbnail = (file_field_name: string) => {
  const upload = multer({
    storage,
    limits: {
      fieldSize: 2097152,
      fileSize: 2097152,
      files: 1,
    },
  });

  return upload.single(file_field_name);
};
