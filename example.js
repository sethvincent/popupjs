var popup = require('./index')

var info = popup({
  content: 'This is pretty fun'
}).show()

var btn = document.querySelector('.open-popup')

btn.addEventListener('click', function (e) {
  var info = popup({
    content: 'This is pretty fun'
  }).show()
})