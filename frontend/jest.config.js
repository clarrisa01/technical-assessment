// module.exports = {
//   testEnvironment: "jsdom",
//   setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
//   moduleNameMapper: {
//     "^@/(.*)$": "<rootDir>/src/$1",
//   },
//   testMatch: ["<rootDir>/**/*.test.tsx", "<rootDir>/**/*.test.ts"],
//   transform: {
//     "^.+\\.(ts|tsx)$": "ts-jest",
//   },
//   collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts"],
// };

module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|tsx)$": "babel-jest",
  },
  moduleNameMapper: {
    // Adjust if you're using aliases like @/components
    "^@/(.*)$": "<rootDir>/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  transformIgnorePatterns: ["<rootDir>/node_modules/"],
};
