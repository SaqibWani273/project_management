import express from "express";
import ApiResponse from "../utils/api_response.js";
import {asyncHandler} from "../utils/handlers.js";

export const healthcheck = asyncHandler(async (req, res) => {
 return  res.status(200).json(new ApiResponse(200, "Success", "Healthy"))
});