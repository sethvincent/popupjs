# popupjs

Simple popup/modal/dialog component to replace browser dialogs.

## Install

```
npm install --save popupjs
```

## Usage

### var popup = require('popupjs')

### var example = popup(opts)

Options:

- **content** – the html string that will be the body of the popup
- **buttons** – optional array of objects used to create buttons
- **template** – optional lodash.template, handlebars, or similar template 

Example `button` object:

```
{
  text: 'OK',
  className: 'confirm',
  fn: function () {
    // some optional action
    // if omitted the remove() method is called
  }
}
```

### example.show()

### example.update(data)

`data` is an object with `content` and `buttons` properties, like when creating a popup instance.

### example.remove()

## Example

```
var popup = require('./index')

var info = popup({
  content: 'This is pretty fun'
}).show()
```

## Events

### example.on('show', function () {})

### example.on('update', function (data, html) {})

### example.on('remove', function () {})

## CSS

A very basic stylsheet is in the style.css file. You could import it using something like [rework-npm-cli](http://npmjs.org/rework-npm-cli).

## License
MIT