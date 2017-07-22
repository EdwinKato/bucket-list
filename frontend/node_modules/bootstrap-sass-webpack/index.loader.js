module.exports = function () {};
module.exports.pitch = function (remainingRequest) {
  this.cacheable(true);
  return [
    'require(' + JSON.stringify("-!" + require.resolve("style-loader") + '!' + require.resolve("css-loader") +
      '!' + require.resolve("sass-loader") + '!' + require.resolve("./bootstrap-sass-styles.loader.js") + '!' + remainingRequest) + ');',
    'require(' + JSON.stringify("-!" + require.resolve("./bootstrap-sass-scripts.loader.js") + "!" + remainingRequest) + ');'
  ].join("\n");
};
