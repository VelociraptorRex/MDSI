import fs from "node:fs";
import path from "node:path";

const dist = path.resolve("dist");
const server = path.join(dist, "server");
const config = path.join(dist, ".openai");

fs.mkdirSync(server, { recursive: true });
fs.mkdirSync(config, { recursive: true });
fs.copyFileSync(path.resolve(".openai/hosting.json"), path.join(config, "hosting.json"));

fs.writeFileSync(path.join(server, "index.js"), `export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let response = await env.ASSETS.fetch(request);

    if (response.status === 404 && !url.pathname.includes(".")) {
      const normalized = url.pathname.endsWith("/") ? url.pathname : url.pathname + "/";
      response = await env.ASSETS.fetch(new Request(new URL(normalized + "index.html", url), request));
    }

    return response;
  }
};\n`);

console.log("Sites static adapter prepared");
