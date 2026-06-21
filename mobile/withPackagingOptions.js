const { withAppBuildGradle } = require('@expo/config-plugins');

module.exports = function withPackagingOptions(config) {
  return withAppBuildGradle(config, (config) => {
    const packagingOptions = `
android {
    packagingOptions {
        pickFirst 'META-INF/versions/9/OSGI-INF/MANIFEST.MF'
    }
}
`;
    config.modResults.contents += packagingOptions;
    return config;
  });
};