import {modules} from "./main";

const EVENT_SOURCE = {
    id: "hyperate",
    name: "HypeRate",
    description: "Heartrate Events for HypeRate",
    events: [
        {
            id: "heartrate",
            name: "HypeRate Heartrate",
            description: "When HypeRate sends your heartrate.",
            manualMetadata: {
                rate: 80
            },
            isIntegration: true,
            activityFeed: {
                icon: "fad fa-heartbeat",
                getMessage: (eventData: {rate: number}) => {
                    return `Received heartrate event from HypeRate: ${eventData.rate} bpm.`;
                }
            }
        }
    ]
}

export function registerEvents() {
    modules.eventManager.registerEventSource(EVENT_SOURCE);
}

export function triggerHeartRate(rate: number) {
    modules.eventManager.triggerEvent("hyperate", "heartrate", {rate: rate});
}