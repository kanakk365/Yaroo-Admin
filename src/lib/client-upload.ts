"use client"

import axios from "axios";

const FILE_UPLOAD_URL = "https://files-public.coffeecodes.in/upload";

export const uploadFile = async (file: File | null): Promise<string | null> => {
  if (!file) return null;
  const formData = new FormData();
  formData.append(
    "apiKey",
    "fdbf4587fmd,nfa,s#%$#^WGroei458eofhuahirh218798110`0uwiq",
  );
  formData.append("file", file);
  try {
    const response = await axios.post(FILE_UPLOAD_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.url;
  } catch (error) {
    console.error("Error in uploadFile:", error);
    throw error;
  }
};