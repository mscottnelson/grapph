System.config({
  baseURL: "/",
  defaultJSExtensions: true,
  transpiler: false,
  paths: {
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },

  map: {
    "angular": "github:angular/bower-angular@1.5.8",
    "angular-mocks": "github:angular/bower-angular-mocks@1.5.8",
    "angular-route": "github:angular/bower-angular-route@1.5.8",
    "d3": "npm:d3@3.5.17",
    "lodash": "npm:lodash@4.13.1",
    "nvd3": "npm:nvd3@1.8.4",
    "github:angular/bower-angular-mocks@1.5.8": {
      "angular": "github:angular/bower-angular@1.5.8"
    },
    "github:angular/bower-angular-route@1.5.8": {
      "angular": "github:angular/bower-angular@1.5.8"
    },
    "npm:nvd3@1.8.4": {
      "d3": "npm:d3@3.5.17"
    }
  }
});
