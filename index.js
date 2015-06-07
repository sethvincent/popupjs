var fs = require('fs')
var path = require('path')
var Emitter = require('component-emitter')
var template = require('lodash.template')
var select = require('dom-select')
var extend = require('extend')
var on = require('dom-event')

var popupTemplate = template(fs.readFileSync(__dirname + '/popup.html', 'utf8'))

module.exports = Popup

function Popup (opts) {
  if (!(this instanceof Popup)) return new Popup(opts)
  var self = this

  this.template = popupTemplate || opts.template
  this.el = opts.el || document.body
  this.id = opts.id
  this.center = opts.center || true
  this.data = { content: opts.content || '' }

  if (opts.buttons === false) this.data.buttons = null

  else {
    this.data.buttons = opts.buttons || [{
      text: 'OK',
      className: 'confirm',
      fn: function () {
        self.remove()
      }
    }]
  }

  this._create()
  this.on('show', function () {
    if (this.center) this._center()
    this._createEventListeners()
  })
}

Emitter(Popup.prototype)

Popup.prototype._create = function () {
  this.html = document.createElement('div')
  this.html.id = this.id
  this.html.className = 'popupjs-background'
  this.html.innerHTML = this.template(this.data)
}

Popup.prototype._center = function () {
  var wrapper = select('.popupjs-wrapper')
  wrapper.style.marginLeft = -(wrapper.offsetWidth / 2) + 'px'
  wrapper.style.marginTop = -(wrapper.offsetHeight / 2) + 'px'
  wrapper.style.top = '50%'
  wrapper.style.left = '50%'
}

Popup.prototype._createEventListeners = function () {
  var self = this

  on(select('.popupjs-close'), 'click', function (e) {
    self.remove()
  })

  on(select('.popupjs-background'), 'click', function (e) {
    if (e.target.className === 'popupjs-background') {
      self.remove()
    }
  })

  if (this.data.buttons) {
    this.data.buttons.forEach(function (button) {
      on(select('.popupjs-button-' + button.className), 'click', function (e) {
        if (!button.fn) return self.remove()
        button.fn(e)
      })
    })
  }
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
  this.html.innerHTML = this.template(this.data)
  this.emit('update', this.data, this.html)
  this._createEventListeners()
}

Popup.prototype.remove = function () {
  if (this.html) {
    this.el.removeChild(this.html)
    delete this.html
    this.emit('remove')
  }
}