import { unlinkSync } from "fs";

export const updateImage = (filepath: string) => {
  try {
    unlinkSync("./storage/"+filepath);
  } catch (error) {
    throw error;
  }
}