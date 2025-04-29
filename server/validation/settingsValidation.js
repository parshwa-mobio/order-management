import { body } from "express-validator";

export const settingsValidation = {
  updateSettings: [
    body("moqEnabled").isBoolean(),
    body("defaultMOQ").isInt({ min: 1 }),
    body("containerTypes").isArray(),
    body("containerTypes.*").isString(),
    body("alertThresholds.stock").isInt({ min: 0, max: 100 }),
    body("alertThresholds.order").isInt({ min: 0, max: 168 }),
    body("emailTemplates.orderConfirmation").isBoolean(),
    body("emailTemplates.shipmentUpdate").isBoolean(),
    body("emailTemplates.stockAlert").isBoolean(),
  ],
};
