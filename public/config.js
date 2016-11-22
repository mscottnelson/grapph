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
    "lodash": "npm:lodash@4.13.1",
    "github:angular/bower-angular-mocks@1.5.8": {
      "angular": "github:angular/bower-angular@1.5.8"
    },
    "github:angular/bower-angular-route@1.5.8": {
      "angular": "github:angular/bower-angular@1.5.8"
    }
  }
});
