before(() => {
  // Copy JSDom methods over to the global object
  global["__proto__"] = require("jsdom").jsdom().defaultView
})
