
export const editorTheme = `
  body {
    color: #ffffff;
    background-color: #363636;
    padding: 10px;
    align-items: center;
    margin: 0;
    max-width: 100%;
    overflow-x: hidden;
    word-wrap: break-word;
  }

  p, div, span, a, li {
    max-width: 100%;
    word-wrap: break-word;
  }

  code {
    display: inline-block;
    width: 100%;
    max-width: 90vw;
    background-color: #16537e;
    color: #f9c014;
    padding: 7px;
    overflow-x: scroll;
    white-space: nowrap;
    font-family: monospace;
  }

  p:has(code) + p:has(code) {
    margin-top: -25px;
  }


  blockquote {
    background-color: #404040;
    border-radius: 4px;
    padding: 2px;
  }
`