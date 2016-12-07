"use strict";
var properties_1 = require("./properties");
var Properties = properties_1["default"];
function createElement(tagName, props) {
    var children = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        children[_i - 2] = arguments[_i];
    }
    if (typeof tagName !== "string") {
        throw new Error("tagName should be a string");
    }
    var element = document.createElement(tagName);
    if (props && typeof props === "object") {
        for (var prop in props) {
            var value = props[prop];
            if (prop === "style") {
                if (value && typeof value === "object") {
                    var style = element.style;
                    for (var styleName in value) {
                        if (style.hasOwnProperty(styleName)) {
                            style[styleName] = value[styleName] || "";
                        }
                    }
                }
                else {
                    element.setAttribute("style", "");
                }
            }
            else if (prop === "ref" && typeof value === "function") {
                var ref = value;
            }
            else if (prop === "children") {
                children = [value];
            }
            else if (prop.indexOf("on") === 0 && prop[2] && prop[2] === prop[2].toUpperCase()) {
                if (typeof value === "function") {
                    element.addEventListener(prop.slice(2).toLowerCase(), value);
                }
            }
            else {
                var propInfo = Properties[prop];
                if (propInfo !== undefined) {
                    if (shouldIgnoreValue(propInfo, value)) {
                        continue;
                    }
                    else if (propInfo.mustUseProperty) {
                        element[propInfo.propertyName] = value;
                    }
                    else {
                        if (propInfo.attributeNamespace) {
                            element.setAttributeNS(propInfo.attributeNamespace, propInfo.attributeName, value);
                        }
                        else if (propInfo.hasBooleanValue || propInfo.hasOverloadedBooleanValue && value === true) {
                            element.setAttribute(propInfo.attributeName, "");
                        }
                        else {
                            element.setAttribute(propInfo.attributeName, "" + value);
                        }
                    }
                }
            }
        }
    }
    appendChild(element, children);
    if (ref) {
        ref(element);
    }
    return element;
}
exports.createElement = createElement;
function appendChild(element, child) {
    if (child instanceof HTMLElement) {
        element.appendChild(child);
    }
    else if (child instanceof Array) {
        for (var i in child) {
            appendChild(element, child[i]);
        }
    }
    else if (typeof child === "string" || typeof child === "number") {
        element.appendChild(document.createTextNode("" + child));
    }
    else if (child === null || child === undefined) {
    }
    else {
        throw new Error("unknown type of child: " + child);
    }
}
function shouldIgnoreValue(propertyInfo, value) {
    return value == null ||
        (propertyInfo.hasBooleanValue && !value) ||
        (propertyInfo.hasNumericValue && isNaN(value)) ||
        (propertyInfo.hasPositiveNumericValue && (value < 1)) ||
        (propertyInfo.hasOverloadedBooleanValue && value === false);
}
