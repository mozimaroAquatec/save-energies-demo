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
exports.deleteEnergiesByDate = exports.deleteEnergiesByYearAndMonth = exports.deleteEnergiesByYear = exports.createEnergiesByYearAndMonth = exports.resetEnergieById = exports.updateEnergie = exports.getEnergieByDateAndTime = exports.getEnergiesByYear = exports.getEnergiesWithPagination = exports.getEnergies = exports.createEenrgies = void 0;
// Importing necessary modules
const error_handler_1 = __importDefault(require("../utils/error.handler")); // Importing custom error handler
const energie_model_1 = __importDefault(require("../models/energie.model")); // Importing Helioss model
const energieServices = __importStar(require("../services/energies.services"));
const year_validation_1 = require("../utils/year-validation");
const energies_shema_1 = require("../utils/schemas/energies.shema");
const success_response_1 = require("../utils/success.response");
/**
 * @desc inserts energy records for all dates and hours of a given year into the database.
 * @param POST
 * @access PUBLIC
 */
const createEenrgies = async function (req, res) {
    try {
        let { year } = req.body;
        // Validating input data from client
        const { error } = (0, energies_shema_1.yearSchema)(req.body);
        if (error)
            return res
                .status(400)
                .json(new error_handler_1.default(400, `${error.details[0].message}`));
        if (typeof year === "string") {
            year = parseInt(year);
        }
        const checkYear = (0, year_validation_1.isValidYear)(year);
        if (!checkYear)
            return res.status(400).json({ status: "false", message: "invalid year" });
        // Generate energy records for the specified year
        await energieServices.createAllDatesAndHoursOfYear(year);
        // const saveEbergies = new Energies({ energies });
        // await saveEbergies.save();
        console.log("save energie out");
        return res
            .status(201)
            .json(new success_response_1.SuccessResponse(201, "energies created successfully"));
    }
    catch (error) {
        // Handle errors
        res.status(500).json(new error_handler_1.default(500, "Internal server error"));
        throw new error_handler_1.default(500, `createEenrgies error: ${error}`);
    }
};
exports.createEenrgies = createEenrgies;
/**
 * @desc  Controller function to handle getting all energies
 * @param GET /
 * @param PUBLIC
 **/
const getEnergies = async function (req, res) {
    try {
        // Query the database for all Energies records
        const energies = await energie_model_1.default.find().select("-updatedAt -createdAt -message -year -month");
        // Return success response with Energies data
        return res.status(200).json(energies);
    }
    catch (error) {
        // Handle errors
        res.status(500).json(new error_handler_1.default(500, "Internal server error"));
        throw new error_handler_1.default(500, `getEnergies error : ${error}`);
    }
};
exports.getEnergies = getEnergies;
/**
 * @desc Controller function to handle getting energies with pagination
 * @param GET /pagination
 * @param PUBLIC
 **/
const getEnergiesWithPagination = async function (req, res) {
    try {
        const currentPage = parseInt(req.query.currentPage) || 1;
        const pageSize = parseInt(req.query.pageSize) || 50;
        const pagesCount = Math.ceil((await energie_model_1.default.find().select("-updatedAt -createdAt -message -year -month")).length / pageSize);
        console.log("pagesCount", pagesCount);
        if (!pagesCount) {
            return res.status(200).json([]);
        }
        if (pagesCount < currentPage)
            return res
                .status(400)
                .json(new error_handler_1.default(400, `current page must be smaller than pages count : ${pagesCount}`));
        // Query the database for all Energies records
        const energies = await energie_model_1.default.find()
            .skip((currentPage - 1) * pageSize)
            .limit(pageSize) // pagination
            .select("-updatedAt -createdAt -message -year");
        // Return success response with Energies data
        return res.status(200).json(energies);
    }
    catch (error) {
        // Handle errors
        res.status(500).json(new error_handler_1.default(500, "Internal server error"));
        throw new error_handler_1.default(500, `getEnergies error : ${error}`);
    }
};
exports.getEnergiesWithPagination = getEnergiesWithPagination;
/**
 * @desc Get Energies from the database by year
 * @param GET /year
 * @param PUBLIC
 **/
const getEnergiesByYear = async function (req, res) {
    try {
        let { year } = req.query;
        // Validating input data from client
        const { error } = (0, energies_shema_1.yearSchema)(req.query);
        if (error)
            return res
                .status(400)
                .json(new error_handler_1.default(400, `${error.details[0].message}`));
        const checkYear = (0, year_validation_1.isValidYear)(parseInt(year));
        if (!checkYear)
            return res.status(400).json(new error_handler_1.default(400, "invalid year"));
        // Query the database for all Energies records
        const energies = await energie_model_1.default.find({ year }).select("-message -year -updatedAt -createdAt");
        // Return success response with Energies data
        return res.status(200).json(energies);
    }
    catch (error) {
        // Handle errors
        res.status(500).json(new error_handler_1.default(500, "Internal server error"));
        throw new error_handler_1.default(500, `getEnergies error : ${error}`);
    }
};
exports.getEnergiesByYear = getEnergiesByYear;
/**
 * @desc  Controller function to get energies by date and time
 * @param GET /date-time/
 * @param PUBLIC
 **/
const getEnergieByDateAndTime = async function (req, res) {
    try {
        let { date, time } = req.query;
        // Validating input data from client
        const { error } = (0, energies_shema_1.DateAndTimeSchema)(req.query);
        if (error)
            return res
                .status(400)
                .json(new error_handler_1.default(400, `${error.details[0].message}`));
        // Query the database for all Energies records
        const energie = await energie_model_1.default.findOne({
            $and: [{ time }, { date }],
        }).select("-message -year -month -updatedAt -createdAt");
        // Return success response with Energies data
        return res.status(200).json(energie);
    }
    catch (error) {
        // Handle errors
        res.status(500).json(new error_handler_1.default(500, "Internal server error"));
        throw new error_handler_1.default(500, `getEnergies error : ${error}`);
    }
};
exports.getEnergieByDateAndTime = getEnergieByDateAndTime;
/**
 * @desc Update an energy record based on the provided message
 * @param PUT /
 * @access PUBLIC
 **/
const updateEnergie = async function (req, res) {
    try {
        const { message } = req.body;
        // Validate the input data using the updateEnergieSchema
        const { error } = (0, energies_shema_1.updateEnergieSchema)(req.body);
        if (error)
            return res
                .status(400)
                .json(new error_handler_1.default(400, `${error.details[0].message}`));
        // Call the service function to update the energy record
        await energieServices.updateEnergie(message);
        // Return a success response
        return res
            .status(200)
            .json(new success_response_1.SuccessResponse(200, "updated energie success"));
    }
    catch (error) {
        // Handle errors
        res.status(500).json(new error_handler_1.default(500, "Internal server error"));
        throw new error_handler_1.default(500, `updateEnergie error : ${error}`);
    }
};
exports.updateEnergie = updateEnergie;
/**
 * @desc reset energie by message
 * @param PUT /:id
 * @access PUBLIC
 **/
const resetEnergieById = async function (req, res) {
    try {
        await energie_model_1.default.findByIdAndUpdate(req.params.id, {
            message: "00.00:000.00:00:00",
            energie: "00.00:000",
        });
        return res
            .status(200)
            .json({ status: "success", message: "updated energie success" });
    }
    catch (error) {
        // Handle errors
        res.status(500).json(new error_handler_1.default(500, "Internal server error"));
        throw new error_handler_1.default(500, `updateHeliossByiD error : ${error}`);
    }
};
exports.resetEnergieById = resetEnergieById;
/**
 * @desc Controller function to create energy records for all dates and hours of a given year and month.
 * @param POST
 * @access PUBLIC
 */
const createEnergiesByYearAndMonth = async function (req, res) {
    try {
        // Extract year and month from request body
        let { year, month } = req.body;
        // Validating input data from client
        const { error } = (0, energies_shema_1.EnergiesByYearAndMonthSchema)(req.body);
        if (error)
            return res
                .status(400)
                .json(new error_handler_1.default(400, `${error.details[0].message}`));
        if (typeof year === "string") {
            year = parseInt(year);
        }
        if (typeof month === "string") {
            month = parseInt(month);
        }
        const checkYear = (0, year_validation_1.isValidYear)(year);
        if (!checkYear)
            return res.status(400).json({ status: "false", message: "invalid year" });
        // Generate energy records for the specified year
        await energieServices.generateDatesAndHoursOfMonth(year, month);
        return res
            .status(201)
            .json(new success_response_1.SuccessResponse(201, "energies created successfully"));
    }
    catch (error) {
        // Handle errors
        res.status(500).json(new error_handler_1.default(500, "Internal server error"));
        throw new error_handler_1.default(500, `createEenrgies error: ${error}`);
    }
};
exports.createEnergiesByYearAndMonth = createEnergiesByYearAndMonth;
/**
 * @desc delete enrgies by year
 * @param DELETE /
 * @access PUBLIC
 **/
const deleteEnergiesByYear = async function (req, res) {
    try {
        const { year } = req.query;
        // Validating input data from client
        const { error } = (0, energies_shema_1.yearSchema)(req.query);
        if (error)
            return res
                .status(400)
                .json(new error_handler_1.default(400, `${error.details[0].message}`));
        const existEnrgies = await energie_model_1.default.find({ year });
        if (!existEnrgies.length) {
            return res
                .status(404)
                .json(new error_handler_1.default(404, "Energy record does not exist"));
        }
        await energie_model_1.default.deleteMany({ year });
        return res
            .status(200)
            .json(new success_response_1.SuccessResponse(200, "energies deleted successfully"));
    }
    catch (error) {
        // Handle errors
        res.status(500).json(new error_handler_1.default(500, "Internal server error"));
        throw new error_handler_1.default(500, `deleteEnergiesByYear error : ${error}`);
    }
};
exports.deleteEnergiesByYear = deleteEnergiesByYear;
/**
 * @desc delete enrgies by year
 * @param DELETE /year-month
 * @access PUBLIC
 **/
const deleteEnergiesByYearAndMonth = async function (req, res) {
    try {
        const { year, month } = req.query;
        // Validating input data from client
        const { error } = (0, energies_shema_1.EnergiesByYearAndMonthSchema)(req.query);
        if (error)
            return res
                .status(400)
                .json(new error_handler_1.default(400, `${error.details[0].message}`));
        const existEnrgie = await energie_model_1.default.find({ $and: [{ year }, { month }] });
        if (!existEnrgie.length) {
            return res
                .status(404)
                .json(new error_handler_1.default(404, "Energy record does not exist."));
        }
        await energie_model_1.default.deleteMany({ $and: [{ year }, { month }] });
        return res
            .status(200)
            .json(new success_response_1.SuccessResponse(200, "energies deleted successfully"));
    }
    catch (error) {
        // Handle errors
        res.status(500).json(new error_handler_1.default(500, "Internal server error"));
        throw new error_handler_1.default(500, `deleteEnergiesByYearAndMonth error : ${error}`);
    }
};
exports.deleteEnergiesByYearAndMonth = deleteEnergiesByYearAndMonth;
/**
 * @desc delete enrgies by year
 * @param DELETE /date
 * @access PUBLIC
 **/
const deleteEnergiesByDate = async function (req, res) {
    try {
        const { date } = req.query;
        const existDate = await energie_model_1.default.findOne({ date });
        if (!existDate) {
            return res
                .status(404)
                .json(new error_handler_1.default(404, "Energy record does not exist"));
        }
        // Validating input data from client
        const { error } = (0, energies_shema_1.EnergiesByDateSchema)(req.query);
        if (error)
            return res
                .status(400)
                .json(new error_handler_1.default(400, `${error.details[0].message}`));
        await energie_model_1.default.deleteMany({ date });
        return res
            .status(200)
            .json(new success_response_1.SuccessResponse(200, "energies deleted successfully"));
    }
    catch (error) {
        // Handle errors
        res.status(500).json(new error_handler_1.default(500, "Internal server error"));
        throw new error_handler_1.default(500, `deleteEnergiesByDate error : ${error}`);
    }
};
exports.deleteEnergiesByDate = deleteEnergiesByDate;
//# sourceMappingURL=energie.controllers.js.map