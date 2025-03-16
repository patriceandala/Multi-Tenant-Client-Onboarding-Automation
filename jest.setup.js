// Store original console methods
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

//  Override console.error, but do not throw errors for expected logs
console.error = (...args) => {
    const message = args[0];

    //  Ignore known expected errors in tests (such as internal server errors)
    if (typeof message === "string" && message.includes("Internal Server Error")) {
        return;
    }

    //  Otherwise, log the error normally
    originalConsoleError(...args);
};

//  Silence console warnings during tests to reduce noise
console.warn = (...args) => {
    const message = args[0];

    //  Ignore known AWS SDK warnings
    if (typeof message === "string" && message.includes("AWS SDK for JavaScript (v3)")) {
        return;
    }

    originalConsoleWarn(...args);
};

//  Increase Jest timeout to handle async AWS operations
jest.setTimeout(30000);
