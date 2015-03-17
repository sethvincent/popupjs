var fs = require('fs')
var path = require('path')
var Emitter = require('component-emitter')
var on = require('component-delegate').bind
var template = require('lodash.template')
var extend = require('extend')

var popupTemplate = template(fs.readFileSync(__dirname + '/popup.html', 'utf8'))

module.exports = Popup

function Popup (opts) {
  if (!(this instanceof Popup)) return new Popup(opts)
  var self = this
  
  this.template = popupTemplate || opts.template
  this.el = opts.el || document.body
  
  this.data = {
    content: opts.content || '',
    buttons: opts.buttons || [{
      text: 'OK',
      className: 'confirm',
      fn: function () {
        self.remove()
      }
    }]
  }
  
  this._create()
}

Emitter(Popup.prototype)

Popup.prototype._create = function () {
  this.html = document.createElement('div')
  this.html.className = 'popupjs-background'
  this.html.innerHTML = this.template(this.data)
  this._createEventListeners()
}

Popup.prototype._createEventListeners = function () {
  var self = this
  
  on(document.body, '.popupjs-close', 'click', function (e) {
    self.remove()
  })
  
  on(document.body, '.popupjs-background', 'click', function (e) {
    if (e.target.className === 'popupjs-background') {
      self.remove()
    }
  })
  
  this.data.buttons.forEach(function (button) {
    on(document.body, '.popupjs-button-' + button.className, 'click', function (e) {
      if (!button.fn) return self.remove()
      button.fn(e)
    })
  })
}

Popup.prototype.show = function () {
  this.el.appendChild(this.html)
  this.emit('show')
}

Popup.prototype.hide = function () {
  this.el.removeChild(this.html)
  this.emit('hide')
}

Popup.prototype.update = function (data) {
  this.data = extend(this.data, data)
  this.html = this.template(data)
  this.emit('update', this.data, this.html)
}

Popup.prototype.remove = function () {
  if (this.html) {
    this.el.removeChild(this.html)
    delete this.html
    this.emit('remove')
  }
}