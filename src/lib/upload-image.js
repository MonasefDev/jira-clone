import { ID } from "node-appwrite";
import { IMAGES_BUCKET_ID } from "./config";

export const uploadImage = async ({ image, storage }) => {
  let uploadedImageUrl = "";
  if (image instanceof File) {
    const file = await storage.createFile(IMAGES_BUCKET_ID, ID.unique(), image);

    const arrayBuffer = await storage.getFilePreview(
      IMAGES_BUCKET_ID,
      file.$id
    );

    uploadedImageUrl = `data:image/png;base64,${Buffer.from(
      arrayBuffer
    ).toString("base64")}`;
  } else {
    uploadedImageUrl = image;
  }
  return uploadedImageUrl;
};
