import logger from "../config/logger.js";
import { randomUUID } from "node:crypto";

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

const log = (req, res, next) => {
  const startTime = Date.now();
  const existingId = req.header("X-Request-Id");
  const requestId = existingId || randomUUID();

  req.requestId = requestId;
  res.setHeader("X-Request-Id", requestId);

  // Log request details
  const requestDetails = {
    method: req.method,
    url: req.originalUrl,
    path: req.path,
    ip: req.ip,
    requestId,
    userAgent: req.get("user-agent"),
    contentType: req.get("content-type"),
  };

  // Add query params if present
  if (Object.keys(req.query || {}).length > 0) {
    requestDetails.query = req.query;
  }

  // Add params if present
  if (Object.keys(req.params || {}).length > 0) {
    requestDetails.params = req.params;
  }

  // Add body if present (sanitized)
  if (req.body && Object.keys(req.body).length > 0) {
    requestDetails.body = sanitizeData(req.body);
  }

  // Add user info if authenticated
  if (req.user) {
    requestDetails.user = {
      id: req.user.id,
      roles: req.user.roles || [],
    };
  }

  logger.info(`REQUEST: ${JSON.stringify(requestDetails, null, 2)}`);

  // Log response when finished
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const responseDetails = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      requestId,
    };

    if (res.statusCode >= 400) {
      logger.warn(`RESPONSE: ${JSON.stringify(responseDetails, null, 2)}`);
    } else {
      logger.info(`RESPONSE: ${JSON.stringify(responseDetails, null, 2)}`);
    }
  });

  next();
};
export default log;
