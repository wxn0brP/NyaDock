const LOG_LEVELS = {
	DEBUG: 0,
	INFO: 1,
	WARN: 2,
	ERROR: 3,
};

let logs: string[] = [];
let currentLogLevel = LOG_LEVELS.ERROR;

function setLogLevel(level: keyof typeof LOG_LEVELS) {
	currentLogLevel = LOG_LEVELS[level];
}

function exportLogs() {
	console.log(logs.join("\n"));
}

function log(level: keyof typeof LOG_LEVELS, ...args: any[]) {
	if (LOG_LEVELS[level] >= currentLogLevel) {
		console.log(`[${level}]`, ...args);
		logs.push(
			`[${level}] ${args.map(a => (typeof a === "string" ? a : JSON.stringify(a))).join(" ")}`,
		);
	}
}

const logger = {
	debug: (...args: any[]) => log("DEBUG", ...args),
	info: (...args: any[]) => log("INFO", ...args),
	warn: (...args: any[]) => log("WARN", ...args),
	error: (...args: any[]) => log("ERROR", ...args),
	setLogLevel,
	exportLogs,
};

export default logger;
