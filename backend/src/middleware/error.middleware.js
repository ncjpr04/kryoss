import logger from "../config/logger.js";

/**
 * Sanitize sensitive data from objects
 */
const sanitizeData = (data) => {
  if (!data || typeof data !== "object") return data;
  
  const sensitiveKeys = ["password", "token", "authorization", "secret", "key"];
  const sanitized = { ...data };
  
  for (const key of Object.keys(sanitized)) {
    const lowerKey = key.toLowerCase();
    if (sensitiveKeys.some((sk) => lowerKey.includes(sk))) {
      sanitized[key] = "***REDACTED***";
    } else if (typeof sanitized[key] === "object" && sanitized[key] !== null) {
      sanitized[key] = sanitizeData(sanitized[key]);
    }
  }
  
  return sanitized;
};

const error = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const code = err.code || "INTERNAL_SERVER_ERROR";
  let message = err.message || "Internal Server Error";
  const details = err.details;
  const requestId = req.requestId;

  // Build detailed error log
  const errorDetails = {
    requestId,
    method: req.method,
    url: req.originalUrl,
    path: req.path,
    statusCode,
    errorCode: code,
    message,
    details,
    ip: req.ip,
    userAgent: req.get("user-agent"),
  };

  // Add request data for debugging
  if (Object.keys(req.query || {}).length > 0) {
    errorDetails.query = req.query;
  }
  if (Object.keys(req.params || {}).length > 0) {
    errorDetails.params = req.params;
  }
  if (req.body && Object.keys(req.body).length > 0) {
    errorDetails.body = sanitizeData(req.body);
  }
  if (req.user) {
    errorDetails.user = {
      id: req.user.id,
      roles: req.user.roles || [],
    };
  }

  // Log full error details
  if (statusCode === 500) {
    message = "Something went wrong on the server.";
    errorDetails.stack = err.stack;
    logger.error(`ERROR: ${JSON.stringify(errorDetails, null, 2)}`);
    logger.error(err);
  } else {
    // Log client errors (4xx) with details but no stack
    logger.warn(`ERROR: ${JSON.stringify(errorDetails, null, 2)}`);
  }

  res.status(statusCode).json({
    error: {
      code,
      message,
      details,
      requestId,
    },
  });
};
export default error;
