module.exports = {
    testEnvironment: "node",
    verbose: true,
    collectCoverage: true,
    coverageDirectory: "coverage",
    coveragePathIgnorePatterns: ["/node_modules/", "/tests/mocks/"],
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
    testMatch: ["**/tests/**/*.js"],
};
