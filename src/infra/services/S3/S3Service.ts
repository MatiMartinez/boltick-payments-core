import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { FileResponse } from "./interface";

export class S3Service {
  private S3Client: S3Client;

  constructor() {
    this.S3Client = new S3Client({ region: "us-east-1" });
  }

  async getMultipleJsonFiles(bucketName: string, fileKeys: string[]): Promise<FileResponse[]> {
    try {
      const filePromises: Promise<FileResponse | null>[] = fileKeys.map((key) => this.getJsonFile(bucketName, key));

      const files = await Promise.all(filePromises);

      return files.filter((file) => file !== null);
    } catch (error) {
      const err = error as Error;
      console.error(err.message);
      throw new Error("Error getting files from S3.");
    }
  }

  private async getJsonFile(bucketName: string, fileKey: string): Promise<FileResponse | null> {
    try {
      const { Body } = await this.S3Client.send(new GetObjectCommand({ Bucket: bucketName, Key: fileKey }));

      if (!Body) {
        console.error("File not found: ", fileKey);
        return null;
      }

      const fileContent = await this.streamToString(Body as Readable);

      return { fileKey, content: JSON.parse(fileContent) };
    } catch (error) {
      const err = error as Error;
      console.error(err.message);
      return null;
    }
  }

  private async streamToString(stream: Readable): Promise<string> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
      stream.on("error", reject);
    });
  }
}
