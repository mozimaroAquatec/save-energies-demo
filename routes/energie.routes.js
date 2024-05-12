"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const energie_controllers_1 = require("./../controllers/energie.controllers");
const express_1 = __importDefault(require("express"));
const energie_controllers_2 = require("../controllers/energie.controllers");
const validate_object_id_1 = require("../middlewares/validate.object.id");
// Initialize a new router instance
const energieRoutes = express_1.default.Router();
// Route for subscribing to MQTT messages using GET method
energieRoutes.get("/", energie_controllers_2.getEnergies);
energieRoutes.get("/pagination", energie_controllers_1.getEnergiesWithPagination);
energieRoutes.get("/year", energie_controllers_2.getEnergiesByYear);
energieRoutes.get("/date-time", energie_controllers_2.getEnergieByDateAndTime);
energieRoutes.post("/", energie_controllers_2.createEenrgies);
energieRoutes.post("/year-month", energie_controllers_1.createEnergiesByYearAndMonth);
energieRoutes.put("/", energie_controllers_2.updateEnergie);
energieRoutes.put("/:id", validate_object_id_1.validateObjectId, energie_controllers_2.resetEnergieById);
energieRoutes.delete("/", energie_controllers_2.deleteEnergiesByYear);
energieRoutes.delete("/year-month", energie_controllers_1.deleteEnergiesByYearAndMonth);
energieRoutes.delete("/date", energie_controllers_1.deleteEnergiesByDate);
// Export the router instance
exports.default = energieRoutes;
//# sourceMappingURL=energie.routes.js.map