import {modules} from "./main";
import {registerEvents, triggerHeartRate} from "./events";
import {WebSocket} from "ws";
import {IntegrationData, IntegrationDefinition} from "@crowbartools/firebot-custom-scripts-types";
import {EventEmitter} from "events";
import {HYPERATE_WEBSOCKET_TOKEN} from "./auth";
import {loadVariables, update} from "./variables";

// @ts-ignore
export const definition: IntegrationDefinition = {
    id: "hyperate",
    name: "HypeRate",
    description: "Heartrate events",
    connectionToggle: true,
    linkType: "id",
    idDetails: {
        steps:
            `Get your HypeRate ID and put it in the ID field. Use internal-testing for test data. Press Save and activate the integration in the bottom left of the screen.`
    }
};

class HypeRateIntegration extends EventEmitter {
    connected: boolean;
    _socket: WebSocket;
    _heartbeat: NodeJS.Timeout;
    reconnectAttempts: number;
    constructor() {
        super();
        this.connected = false;
        this._socket = null;
        this.reconnectAttempts = 0;
    }

    init() {
        registerEvents();
        loadVariables();
    }
    async connect(integrationData: IntegrationData) {
        const { accountId } = integrationData;

        if (accountId == null || accountId === "") {
            this.emit("disconnected", definition.id);
            return;
        }

        this._socket = new WebSocket("wss://app.hyperate.io/socket/websocket?token=" + HYPERATE_WEBSOCKET_TOKEN);

        this._socket.on('error', error => modules.logger.error("Error from HypeRate Websocket:", error));

        function sendHeartbeat(socket: WebSocket) {
            socket.send(JSON.stringify({
                topic: "phoenix",
                event: "heartbeat",
                payload: {},
                ref: 0
            }));
        }

        this._socket.on('open', () => {
            this._socket.send(JSON.stringify({
                topic: "hr:" + accountId,
                event: "phx_join",
                payload: {},
                ref: 0
            }));
            this._heartbeat = setInterval(sendHeartbeat, 9000, this._socket);
            this.connected = true;
            this.reconnectAttempts = 0
            this.emit("connected", definition.id);
        });

        this._socket.on('message', function message(data) {
            let response = JSON.parse(data.toString());
            if (response.event === "hr_update") {
                update(response.payload.hr, Date.now() / 1000);
                triggerHeartRate(response.payload.hr);
            }
        });

        this._socket.on('close', (code, reason) => {
            if (code !== 3000) {
                this.disconnect();
                this.reconnect();
            }
        });
    }

    reconnect() {
        if (this.reconnectAttempts === 3) {
            modules.logger.warn("Attemped to reconnect to HypeRate 3 times, setting integration to disconnected...");
            this.disconnect();
            return;
        }

        this.reconnectAttempts++;

        setTimeout(() => this.emit("reconnect", definition.id), (Math.pow(3, this.reconnectAttempts) - 1) * 1000);
    }

    disconnect() {
        this._socket.close(3000, "Purposeful Disconnect");
        this.connected = false;
        clearInterval(this._heartbeat);

        this.emit("disconnected", definition.id);
    }

    link() {}

    async unlink() {
        if (this._socket) {
            this.disconnect();
        }
    }
}

export const integration = new HypeRateIntegration();