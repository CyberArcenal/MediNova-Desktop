//@ts-check
//src/main/initializers/service.js
const updaterModule = require("../ipc/utils/updater/index.ipc");
const { logger } = require("../../utils/logger");

// ===================== SERVICE INITIALIZATION =====================
/**
 * @param {Electron.CrossProcessExports.BrowserWindow | null} mainWindow
 */
async function initializeServices(mainWindow) {
  logger.info("Initializing services...");

  updaterModule.setMainWindow(mainWindow);
  logger.debug("All services initialized");
}


module.exports = {initializeServices}