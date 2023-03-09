import {Firebot, ScriptModules} from "@crowbartools/firebot-custom-scripts-types";
import {definition, integration} from "./integration";

interface Params { }

const script: Firebot.CustomScript<Params> = {
  getScriptManifest: () => {
    return {
      name: "Firebot Hyperate",
      description: "A Firebot Integration for Hyperate.",
      author: "DennisOnTheInternet",
      version: "1.0-rc1",
      firebotVersion: "5",
      website: "https://www.hyperate.io/",
      startupOnly: true
    };
  },
  getDefaultParameters: () => {
    return { };
  },
  run: (runRequest) => {
    runRequest.modules.logger.debug("", modules);
    modules = runRequest.modules;
    modules.integrationManager.registerIntegration({definition, integration});
  },
};

export default script;

export let modules: ScriptModules = null;

