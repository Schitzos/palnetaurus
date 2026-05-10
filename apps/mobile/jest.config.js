module.exports = {
  preset: 'react-native',
  moduleNameMapper: {
    '^@palnetaurus/shared$': '<rootDir>/../../packages/shared/src/index',
    '^@palnetaurus/shared/(.*)$': '<rootDir>/../../packages/shared/src/$1',
  },
};
