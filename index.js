"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Importing required modules
const express_1 = __importDefault(require("express"));
const error_handler_1 = __importDefault(require("./utils/error.handler")); // Importing custom error handler
const connect_db_1 = __importDefault(require("./config/connect.db")); // Importing MongoDB connection function
const energie_routes_1 = __importDefault(require("./routes/energie.routes")); // Importing energy routes
const energieServices = __importStar(require("./services/energies.services")); // Importing energy services
const mqtt_services_1 = __importDefault(require("./services/mqtt.services"));
const cors_1 = __importDefault(require("cors"));
require("dotenv").config();
// Creating an Express app
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Connecting to MongoDB
(0, connect_db_1.default)();
// Initialize MQTT client
const mqttClient = (0, mqtt_services_1.default)();
// Event handler for MQTT client when it's connected to the broker
mqttClient.on("connect", function () {
    console.log("Connected to MQTT broker");
});
// Subscribing to a MQTT topic
mqttClient.subscribe("Helioss/Energie", () => {
    console.log("Subscribed to Helioss/Energie topic");
});
// Event handler for receiving MQTT messages
mqttClient.on("message", async function (topic, message) {
    console.log(`Received message from topic : ${topic} and the message is :${message}`);
    // Updating energy data
    // todo try and catch
    try {
        await energieServices.updateEnergie(message.toString());
    }
    catch (error) {
        throw new error_handler_1.default(500, `updateEnergie error : ${error}`);
    }
});
// Using the energy routes
app.use("/", energie_routes_1.default);
// Middleware for handling 404 errors
app.use("*", (req, res) => {
    return res.status(404).json(new error_handler_1.default(404, "Page not found"));
});
// Starting the server and listening on the specified port
app.listen(process.env.PORT || 5000, function () {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
//# sourceMappingURL=index.js.map