[![npm](https://img.shields.io/npm/v/jsx-render-dom.svg)](https://github.com/guncha/jsx-render-dom)
[![David](https://img.shields.io/david/guncha/jsx-render-dom.svg)](https://github.com/guncha/jsx-render-dom)

# Create DOM nodes directly using JSX with Typescript support #

This is yet another library that allows you to create DOM nodes using JSX syntax. Other libraries were
missing one or more of the following:

1. Typescript support including JSX element types
2. Property names and behavior matching that of React
3. Does not require any special transpilation step (apart from JSX itself)
4. Ref support to quickly grab the node for future reference

## Example ##

```ts
import * as React from "jsx-render-dom"

function LoginForm(initialEmail: string, callback: (email: string) => any) {
  let email: HTMLInputElement
  let password: HTMLInputElement
  let error: HTMLDivElement

  const onSubmit = evt => {
    evt.preventDefault()

    if (password.value === "h4x0rz") {
      callback(email.value)
    } else {
      error.textContent = "Wrong password, buddy!"
      error.style.display = "block"
    }
  }

  return <form onSubmit={ onSubmit }>
    <input ref={ el => email = el } type="email" value={ initialEmail } />
    <input ref={ el => password = el } type="password" />
    <button type="submit">Submit</button>
    <div ref={ el => error = el } className="error" style={{ display: "none" }}/>
  </form>
}

document.body.appendChild(LoginForm("hello@world.com", email => {
  console.log("signed in with email", email)
}))

```

### Alternatives ###

1. https://github.com/alexlur/jsx-dom
2. https://github.com/pixelass/jsx-create-element
3. https://github.com/sdunster/jsx-dom-factory
4. https://github.com/turtlemay/jsx-dom
5. https://github.com/vjeux/jsxdom
