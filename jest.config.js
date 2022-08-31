module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    transformIgnorePatterns: ['<rootDir>/node_modules/'],
    collectCoverage: true,
    coverageDirectory: "reports/coverage",
    collectCoverageFrom: ['src/**/*'],
    reporters: [
        "default",
        ["jest-junit", {"outputDirectory": "reports/jest-junit"}],
        ["./node_modules/jest-html-reporter", {"outputPath": "reports/jest-html-reporter/index.html"}]
    ],
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 0
        }
    }
};
