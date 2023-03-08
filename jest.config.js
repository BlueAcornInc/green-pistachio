module.exports = {
    roots: ['<rootDir>/src'],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    testRegex: '(.*\.(test|spec)).tsx?$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    collectCoverage: true,
    coveragePathIgnorePatterns: ['(.*.(mock|test|spec)).(jsx?|tsx?)$'],
    verbose: true,
    projects: ['<rootDir>'],
    coverageDirectory: '<rootDir>/coverage/',
    testTimeout: 30000
};
