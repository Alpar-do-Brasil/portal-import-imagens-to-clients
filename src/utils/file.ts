import * as fs from "node:fs";
import { promises as fsPromises } from "node:fs";
import path from "node:path";

export class File {
  delete(filename: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.unlink(filename, (err) => {
        if (err) {
          reject(err);
        }

        resolve();
      });
    });
  }

  move(oldFilename: string, newFilename: string): Promise<void> {
    return fsPromises.rename(oldFilename, newFilename);
  }

  readStream(filename: string) {
    return fs.createReadStream(filename);
  }

  read(filename: string) {
    return new Promise((resolve, reject) =>
      fs.readFile(filename, (err, data) => {
        if (err) {
          reject(err);
        }

        resolve(data);
      })
    );
  }

  stat(filename: string): Promise<fs.Stats> {
    return new Promise((resolve, reject) =>
      fs.stat(filename, (err, data) => {
        if (err) {
          reject(err);
        }

        resolve(data);
      })
    );
  }

  async listFolder(pathname: string) {
    return await fsPromises.readdir(path.resolve(pathname));
  }
}

export const file = new File();
