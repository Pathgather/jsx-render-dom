import _properties from "./properties"

interface PropertyInfo {
  attributeName: string
  attributeNamespace: string | null
  propertyName: string
  mutationMethod: null
  mustUseProperty: boolean
  hasBooleanValue: boolean
  hasNumericValue: boolean
  hasPositiveNumericValue: boolean
  hasOverloadedBooleanValue: boolean
}

const Properties: {
  [propName: string]: PropertyInfo
} = _properties

export function createElement(tagName, props?, ...children): HTMLElement {
  if (typeof tagName !== "string") {
    throw new Error("tagName should be a string")
  }

  const element = document.createElement(tagName)

  if (props && typeof props === "object") {
    for (const prop in props) {
      const value = props[prop]

      if (prop === "style") {
        if (value && typeof value === "object") {
          const {style} = element
          for (const styleName in value) {
            if (style.hasOwnProperty(styleName)) {
              style[styleName] = value[styleName] || ""
            }
          }
        } else {
          element.setAttribute("style", "")
        }
      } else if (prop === "ref" && typeof value === "function") {
        var ref = value
      } else if (prop === "children") {
        children = [value]
      } else if (prop.indexOf("on") === 0 && prop[2] && prop[2] === prop[2].toUpperCase()) {
        if (typeof value === "function") {
          element.addEventListener(prop.slice(2).toLowerCase(), value)
        }
      } else {
        const propInfo = Properties[prop]

        if (propInfo !== undefined) {
          if (shouldIgnoreValue(propInfo, value)) {
            continue
          } else if (propInfo.mustUseProperty) {
            element[propInfo.propertyName] = value
          } else {
            if (propInfo.attributeNamespace) {
              element.setAttributeNS(propInfo.attributeNamespace, propInfo.attributeName, value)
            } else if (propInfo.hasBooleanValue || propInfo.hasOverloadedBooleanValue && value === true) {
              element.setAttribute(propInfo.attributeName, "")
            } else {
              element.setAttribute(propInfo.attributeName, "" + value)
            }
          }
        }
      }
    }
  }

  appendChild(element, children)

  if (ref) {
    ref(element)
  }

  return element
}

function appendChild(element: HTMLElement, child) {
  if (child instanceof HTMLElement) {
    element.appendChild(child)
  } else if (child instanceof Array) {
    for (const i in child) {
      appendChild(element, child[i])
    }
  } else if (typeof child === "string" || typeof child === "number") {
    element.appendChild(document.createTextNode("" + child))
  } else if (child === null || child === undefined) {
    // do nothing
  } else {
    throw new Error("unknown type of child: " + child)
  }
}

function shouldIgnoreValue(propertyInfo: PropertyInfo, value) {
  return value == null ||
    (propertyInfo.hasBooleanValue && !value) ||
    (propertyInfo.hasNumericValue && isNaN(value)) ||
    (propertyInfo.hasPositiveNumericValue && (value < 1)) ||
    (propertyInfo.hasOverloadedBooleanValue && value === false)
}
