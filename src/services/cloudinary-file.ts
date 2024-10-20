import { v2 as cloudinary } from "cloudinary";
import { AbstractFileService } from "@medusajs/medusa";
import {
  DeleteFileType,
  FileServiceGetUploadStreamResult,
  FileServiceUploadResult,
  GetUploadedFileType,
  UploadStreamDescriptorType,
} from "@medusajs/types";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});
const preset = "chekout";

class CloudinaryFileService extends AbstractFileService {
  constructor(container) {
    // @ts-ignore
    super(...arguments);
  }

  async upload(file: Express.Multer.File): Promise<FileServiceUploadResult> {
    //* Upload a file to the cloudinary bucket.
    let fileData: string = "";

    if (file.buffer) {
      // * Convert file data to a data_uri
      const imageB64 = Buffer.from(file.buffer).toString("base64");
      fileData = "data:" + file.mimetype + ";base64," + imageB64;
    } else {
      fileData = file.path;
    }

    try {
      const uploadResult = await cloudinary.uploader.upload(fileData, {
        upload_preset: preset,
        resource_type: "auto",
      });
      const { url, public_id: key } = uploadResult;
      return { url, key };
    } catch (err: any) {
      console.log(err);
      throw new Error("An error occured when uploading file. Please try again");
    }
  }

  async uploadProtected(
    file: Express.Multer.File
  ): Promise<FileServiceUploadResult> {
    // Handle file uploads for authenticated users
    return {
      url: "",
      key: "",
    };
  }

  async delete(file: DeleteFileType): Promise<void> {
    try {
      await cloudinary.uploader.destroy(file.fileKey);
    } catch (err: any) {
      throw new Error(
        "An error occured when handling your media. Please try again"
      );
    }
  }

  async getUploadStreamDescriptor(
    fileData: UploadStreamDescriptorType
  ): Promise<FileServiceGetUploadStreamResult> {
    // This method will be implemented if we prefer to handle streaming file uploads
    throw new Error("Not Implemented");
  }

  async getDownloadStream(
    fileData: GetUploadedFileType
  ): Promise<NodeJS.ReadableStream> {
    // This method will be implemented if we need to retrieve a read stream for a file, to use for its download
    throw new Error("Not Implemented");
  }

  async getPresignedDownloadUrl(
    fileData: GetUploadedFileType
  ): Promise<string> {
    // Get a url for downloading the file
    throw new Error("Not Implemented");
  }
}

export default CloudinaryFileService;
