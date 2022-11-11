# Postmark

A GFM inspired Markdown parser for Node.JS.

## Installation
```bash
npm install cyric2020/postmark
```

To make Postmark work properly you need to include the `style.css` file in the head of the page.

## Usage
```js
const postmark = require('postmark');

const md = `
# Hello World

This is a paragraph.`;

const theme = 'atom-one-dark';

const html = postmark.parse(markdown, theme);
```

## Themes

Postmark comes with a few themes built in, but you can also use any of the [highlight.js themes](https://highlightjs.org/static/demo/).

## Features

- [x] Headings
- [x] Paragraphs
- [x] Bold
- [x] Italic
- [x] Strikethrough
- [x] Code
- [x] Syntax Highlighting
- [x] Inline Code
- [x] Blockquotes
- [x] Lists
- [x] LaTeX
- [x] Tables