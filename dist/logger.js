const LOG_LEVELS = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
};
let logs = [];
let currentLogLevel = LOG_LEVELS.ERROR;
function setLogLevel(level) {
    currentLogLevel = LOG_LEVELS[level];
}
function exportLogs() {
    console.log(logs.join("\n"));
}
function log(level, ...args) {
    if (LOG_LEVELS[level] >= currentLogLevel) {
        console.log(`[${level}]`, ...args);
        logs.push(`[${level}] ${args.map(a => typeof a === "string" ? a : JSON.stringify(a)).join(" ")}`);
    }
}
const logger = {
    debug: (...args) => log("DEBUG", ...args),
    info: (...args) => log("INFO", ...args),
    warn: (...args) => log("WARN", ...args),
    error: (...args) => log("ERROR", ...args),
    setLogLevel,
    exportLogs,
};
export default logger;
