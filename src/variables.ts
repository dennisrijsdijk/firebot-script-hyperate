import {ReplaceVariable} from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import {modules} from "./main";

let rate: number = 0;
let time: number = 0;

export function update(newRate: number, newTime: number) {
    rate = newRate;
    time = newTime;
}

export function loadVariables() {
    modules.replaceVariableManager.registerReplaceVariable(HeartRateVariable);
    modules.replaceVariableManager.registerReplaceVariable(LastHeartRateTime);
}

const HeartRateVariable: ReplaceVariable = {
    definition: {
        description: "HypeRate's last reported heart rate in bpm.",
        handle: "heartRate",
        possibleDataOutput: ["number"]
    },
    evaluator(): number {
        return rate;
    }
}

const LastHeartRateTime: ReplaceVariable = {
    definition: {
        description: "The time in seconds since the last heartbeat from HypeRate",
        handle: "timeSinceLastHeartRate",
        possibleDataOutput: ["number"]
    },
    evaluator(): number {
        return Math.round(Date.now() / 1000 - time);
    }
}