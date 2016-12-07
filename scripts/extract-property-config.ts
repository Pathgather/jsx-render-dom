// Extract DOMPropertyConfig from react-dom and make it available to our createElement

import {writeFileSync} from "fs"
import {join} from "path"

const HTMLDOMPropertyConfig = require("react-dom/lib/HTMLDOMPropertyConfig")
const DOMProperty = require("react-dom/lib/DOMProperty")

DOMProperty.injection.injectDOMPropertyConfig(HTMLDOMPropertyConfig)

const content = "export default " + JSON.stringify(DOMProperty.properties, null, 2)

writeFileSync(join(__dirname, "..", "Properties.ts"), content)
