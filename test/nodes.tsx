import * as DOM from "../"
import assert = require("better-assert")
import expect = require("expect.js")

describe("createElement", () => {
  it("should create create correct nodes", () => {
    assert(<div /> instanceof HTMLDivElement)
    assert(<span /> instanceof HTMLSpanElement)
  })

  it("should create nested nodes", () => {
    const div = <div><div /></div>
    assert(div.firstChild instanceof HTMLDivElement)
  })

  it("should create text nodes", () => {
    assert((<div>Hello</div>).firstChild instanceof Text)

    const multiple = <div>Hello{ "World" }</div>
    assert(multiple.childNodes.length === 2)
    assert(multiple.firstChild instanceof Text)
    assert(multiple.lastChild instanceof Text)

    const numbers = <div>{ 1 }{ 2 }{ 3 }</div>
    assert(numbers.childNodes.length === 3)
    assert(numbers.firstChild instanceof Text)
    assert(numbers.lastChild instanceof Text)

    const array = <div>{ [1, 2, 3] }</div>
    assert(array.childNodes.length === 3)
    assert(numbers.firstChild instanceof Text)
    assert(numbers.lastChild instanceof Text)
  })

  it("should ignore null or undefined children", () => {
    assert((<div>{ null }{ undefined }{ [null, undefined] }{ [] }</div>).childNodes.length === 0)
  })

  it("should thow when not given a string tag name", () => {
    const Fn = () => null
    expect(() => <Fn />).to.throwError()

    const Null = null
    expect(() => <Null />).to.throwError()

    const Undefined = undefined
    expect(() => <Undefined />).to.throwError()
  })

  it("should set basic attributes", () => {
    assert((<div id="hello" />).id === "hello")
  })

  // Inline styles don't seem to be supported by jsdom very well..
  xit("should set style attributes", () => {
    const div = <div style={{ float: "left", width: 25 }} />
    assert(div.getAttribute("style") === "float:left;width:25px")
  })

  it("should call ref function with the constructed node", () => {
    let div: any
    <div ref={ el => div = el } />
    assert(div instanceof HTMLElement)
  })

  it("should set children via children prop", () => {
    const div = <div children={ [<div />, "hehe", null, undefined] }></div>
    assert(div.firstChild instanceof HTMLDivElement)
    assert(div.lastChild instanceof Text)
  })

  it("should set attributes with different attributeName", () => {
    assert((<div className="hello" />).className === "hello")
    assert((<div className="hello" />).classList[0] === "hello")
    assert((<div className="hello" />).getAttribute("class") === "hello")

    assert((<meta acceptCharset="hello" />).getAttribute("accept-charset") === "hello")
  })

  it("should set attributes that require to be set via a property", () => {
    let input: HTMLInputElement = <input type="checkbox" /> as any
    assert(input.checked === false)

    input = <input type="checkbox" checked={ false } /> as any
    assert(input.checked === false)

    input = <input type="checkbox" checked /> as any
    assert(input.checked === true)

    input = <input type="checkbox" checked={ true } /> as any
    assert(input.checked === true)
  })

})
