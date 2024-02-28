import {Firebot, ScriptModules} from "@crowbartools/firebot-custom-scripts-types";
import {definition, integration} from "./integration";

interface Params { }

const script: Firebot.CustomScript<Params> = {
  getScriptManifest: () => {
    return {
      name: "Firebot Hyperate",
      description: "A Firebot Integration for Hyperate.",
      author: "DennisOnTheInternet",
      version: "1.0",
      firebotVersion: "5",
      website: "https://www.hyperate.io/",
      startupOnly: true
    };
  },
  getDefaultParameters: () => {
    return { };
  },
  run: async (runRequest) => {
    modules = runRequest.modules;
    modules.integrationManager.registerIntegration({definition, integration});
  },
  stop: () => {
    integration.disconnect();
  }
};

export default script;

export let modules: ScriptModules = null;

