var partials = [
  "mixins",

  "normalize",
  "print",

  "scaffolding",
  "type",
  "code",
  "grid",
  "tables",
  "forms",
  "buttons",

  "component-animations",
  "glyphicons",
  "dropdowns",
  "button-groups",
  "input-groups",
  "navs",
  "navbar",
  "breadcrumbs",
  "pagination",
  "pager",
  "labels",
  "badges",
  "jumbotron",
  "thumbnails",
  "alerts",
  "progress-bars",
  "media",
  "list-group",
  "panels",
  "wells",
  "close",

  "modals",
  "tooltip",
  "popovers",
  "carousel",

  "utilities",
  "responsive-utilities"
];

module.exports = function (content) {
  this.cacheable(true);
  var config = this.exec(content, this.resourcePath);
  var start =
      "@import          \"~bootstrap-sass/assets/stylesheets/bootstrap/variables\";\n"
    + "@icon-font-path: \"~bootstrap-sass/assets/fonts/bootstrap/\";\n"
    + "@import          \"./bootstrap-sass.config.scss\";\n";
  source = start + partials.filter(function (partial) {
    return config.styles[partial];
  }).map(function (partial) {
    return "@import \"~bootstrap-sass/assets/stylesheets/bootstrap/" + partial;
  }).join("\n");
  return source;
}
