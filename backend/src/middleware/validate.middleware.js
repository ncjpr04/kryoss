import { ApiError } from "../common/errors/ApiError.js";
import logger from "../config/logger.js";

export const validate = (schema) => (req, res, next) => {
  try {
    const data = {
      body: req.body,
      query: req.query,
      params: req.params,
    };

    const parsed = schema.parse(data);

    // Update body (mutable in Express)
    if (parsed.body) req.body = parsed.body;
    
    // Note: req.query and req.params are read-only getters in Express
    // We can't overwrite them, but validation still works - if schema.parse
    // succeeds, the values are valid. If transformation is needed (e.g., string to number),
    // attach transformed values to req.validated for controllers to use.
    if (parsed.query) {
      req.validated = req.validated || {};
      req.validated.query = parsed.query;
    }
    if (parsed.params) {
      req.validated = req.validated || {};
      req.validated.params = parsed.params;
    }

    next();
  } catch (err) {
    if (err.name === "ZodError" && Array.isArray(err.errors)) {
      const formattedErrors = err.errors.map((e) => ({
        path: Array.isArray(e.path) ? e.path.join(".") : String(e.path || ""),
        message: e.message || "Validation error",
      }));
      return next(
        new ApiError(
          400,
          "VALIDATION_ERROR",
          "Invalid request data",
          formattedErrors
        )
      );
    }
    // If it's a ZodError but errors array is missing, log it and pass through
    if (err.name === "ZodError") {
      logger.warn("ZodError without errors array:", err);
    }
    return next(err);
  }
};


