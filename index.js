const core = require("@actions/core");
const httpClient = require("@actions/http-client");
const os = require("os");
const process = require("process");
const toolCache = require("@actions/tool-cache");

const USER = "tweag";
const REPO = "ormolu";

const HTTP = new httpClient.HttpClient(`${USER}/${REPO}`);
const TOOL = REPO;

(async () => {
  try {
    let platform = process.platform;
    switch (platform) {
      case "win32":
        platform = "windows";
        break;
      default:
        break;
    }
    core.info(`Platform is ${JSON.stringify(platform)}.`);

    let architecture = os.arch();
    switch (architecture) {
      case "arm64":
        architecture = "aarch64";
        break;
      case "x64":
        architecture = "x86_64";
        break;
      default:
        break;
    }
    core.info(`Architecture is ${JSON.stringify(architecture)}.`);

    let version = core.getInput("version");
    core.info(`Requested version is ${JSON.stringify(version)}.`);
    if (!version || version === "latest") {
      core.info("Getting latest version ...");
      const headers = {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      };
      const token = core.getInput("token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const response = await HTTP.getJson(
        `https://api.github.com/repos/${USER}/${REPO}/releases/latest`,
        headers,
      );
      version = response.result.tag_name;
    }
    core.info(`Actual version is ${JSON.stringify(version)}.`);

    let dir = toolCache.find(TOOL, version);
    if (dir) {
      core.info("Using cached executable ...");
    } else {
      core.info("Downloading executable ...");
      const file = await toolCache.downloadTool(
        `https://github.com/${USER}/${REPO}/releases/download/${version}/${TOOL}-${architecture}-${platform}.zip`,
      );
      const directory = await toolCache.extractZip(file);
      dir = await toolCache.cacheDir(directory, TOOL, version);
    }
    core.info(`Executable installed in ${JSON.stringify(dir)}.`);

    core.addPath(dir);
  } catch (error) {
    core.setFailed(error);
  }
})();
