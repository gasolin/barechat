const { withGradleProperties } = require('@expo/config-plugins');

/**
 * Ensures android.minSdkVersion is set to 29 (required by react-native-bare-kit)
 */
module.exports = function withMinSdk(config) {
  return withGradleProperties(config, (config) => {
    config.modResults = config.modResults.filter(
      (item) => !(item.type === 'property' && item.key === 'android.minSdkVersion')
    );
    config.modResults.push({
      type: 'property',
      key: 'android.minSdkVersion',
      value: '29',
    });
    return config;
  });
};
