
export const DEBUG_SUPPRESS_ALL_MESSAGES: boolean = false;
export const DEBUG_SUPPRESS_ALL_WARNINGS: boolean = false;

export const DEBUG_DO_RERENDER_LOGS: boolean = false;

export function debugLogMessage(message: string) {
    if (!DEBUG_SUPPRESS_ALL_MESSAGES) {
        console.log(`%c[DEBUG]%c ${message}`, "color: LightSeaGreen; font-weight: bold; text-decoration: underline;", "color: LightSeaGreen; font-weight: normal; text-decoration: none;");
    }
}

export function debugLogWarning(message: string) {
    if (!DEBUG_SUPPRESS_ALL_WARNINGS) {
        console.log(`%c[WARNING]%c ${message}`, "color: Khaki; font-weight: bold; text-decoration: underline;", "color: Khaki; font-weight: normal; text-decoration: none;");
    }
}

export function debugLogError(message: string) {
    console.log(`%c[ERROR]%c ${message}`, "color: Crimson; font-weight: bold; text-decoration: underline;", "color: Crimson; font-weight: normal; text-decoration: none;");
}

export function debugLogComponentRerender(functionName: string) {
    if (DEBUG_DO_RERENDER_LOGS) {
        debugLogMessage(`RERENDERING ${functionName}.`);
    }
}
