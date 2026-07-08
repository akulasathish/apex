import { Firestore } from "@google-cloud/firestore";
import { Storage } from "@google-cloud/storage";

// Initialize Firestore
export const db = new Firestore({
  projectId: "apex-501001",
});

// Initialize Cloud Storage
export const storage = new Storage({
  projectId: "apex-501001",
});

export const bucket = storage.bucket("apex-certificates-501001");
