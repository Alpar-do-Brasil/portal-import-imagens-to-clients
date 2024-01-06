import dayjs from "dayjs";
import "dotenv/config";
import FormData from "form-data";
import path from "path";
import { api } from "./services/api";
import { File as FileServices } from "./utils/file";

const file = new FileServices();

interface ClientList {
  clientCod: number;
  files: string[];
}

class App {
  readonly PATH_FOLDER_IMAGES = process.env.PATH_FOLDER_IMAGES ?? "";

  async execute() {
    if (!this.PATH_FOLDER_IMAGES) throw new Error("Unspecified path");

    const listFolders = await file.listFolder(this.PATH_FOLDER_IMAGES);

    let listClients: ClientList[] = [];

    for (const filename of listFolders) {
      const alreadyExist = listClients.find(
        (item) => item.clientCod === this.getClientCod(filename)
      );

      if (!alreadyExist) {
        listClients.push({
          clientCod: this.getClientCod(filename),
          files: listFolders.filter(
            (f) => this.getClientCod(f) === this.getClientCod(filename)
          ),
        });
      }
    }

    for (const client of listClients) {
      try {
        const stat = await file.stat(
          path.resolve(this.PATH_FOLDER_IMAGES, client.files[0])
        );
        const cratedAt = dayjs(stat.mtime).add(1, "day").format("YYYY-MM-DD");
        const conceitoCod = 2020;

        const fileFormData = new FormData();

        for (const filename of client.files) {
          const filepath = path.resolve(this.PATH_FOLDER_IMAGES, filename);
          fileFormData.append("file", file.readStream(filepath));
        }

        await api({
          method: "post",
          url: `/request-update-client/import/images/updated-concept/${client.clientCod}/concept/${conceitoCod}/${cratedAt}`,
          data: fileFormData,
        });
      } catch (error) {
        console.log(error);
      }
    }

    console.log("fim");
  }

  getClientCod(data: string): number {
    let pattern = /^(\d+)\s*\(/;

    const match = data.match(pattern);

    if (!match) throw new Error("Dont match");

    const clientCod = Number(match[1]);

    if (isNaN(clientCod)) throw new Error("Not number");

    return clientCod;
  }
}

const app = new App();
app.execute();
