var headerNav = document.querySelector('.header-nav');
var headerToggle = document.querySelector('.header-nav__toggle');
var popup = document.querySelector('.popup');
var overlay = document.querySelector('.modal-overlay');
var buttonOrder = document.querySelector('.button--order-js');



headerNav.classList.remove('header-nav--nojs');

// Кнопка переключения меню в мобильной версии

headerToggle.addEventListener('click', function() {
  if (headerNav.classList.contains('header-nav--closed')) {
    headerNav.classList.remove('header-nav--closed');
    headerNav.classList.add('header-nav--opened');
  } else {
    headerNav.classList.add('header-nav--closed');
    headerNav.classList.remove('header-nav--opened');
  }
});

// Форма попап

buttonOrder.addEventListener('click', function(evt) {
  evt.preventDefault();
  popup.classList.add('popup--show');
  overlay.classList.add('modal-overlay--show');
  console.log('ok');
});


overlay.addEventListener('click', function() {
  overlay.classList.remove('modal-overlay--show');
  popup.classList.remove('popup--show');
});


window.addEventListener('keydown', function (t) {
  if (t.keyCode === 27) {
    if (overlay.classList.contains('modal-overlay--show') && popup.classList.contains('popup--show')) {
      overlay.classList.remove('modal-overlay--show');
      popup.classList.remove('popup--show');
    }
  }
});
