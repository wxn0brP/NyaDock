declare const LOG_LEVELS: {
    DEBUG: number;
    INFO: number;
    WARN: number;
    ERROR: number;
};
declare function setLogLevel(level: keyof typeof LOG_LEVELS): void;
declare function exportLogs(): void;
declare const logger: {
    debug: (...args: any[]) => void;
    info: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    error: (...args: any[]) => void;
    setLogLevel: typeof setLogLevel;
    exportLogs: typeof exportLogs;
};
export default logger;
