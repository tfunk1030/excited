// Mock file for handling image imports in tests
module.exports = {
  __esModule: true,
  default: 'test-file-stub',
  // Add metadata that might be needed by tests
  uri: 'test-file-stub',
  width: 100,
  height: 100,
  scale: 1,
  // Add methods that might be called on image objects
  toString: () => 'test-file-stub',
  valueOf: () => 'test-file-stub',
  // Add React Native specific image properties
  resolveAssetSource: () => ({
    uri: 'test-file-stub',
    width: 100,
    height: 100,
    scale: 1,
  }),
};
