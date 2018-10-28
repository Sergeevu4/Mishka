var headerNav = document.querySelector('.header-nav');
var headerToggle = document.querySelector('.header-nav__toggle');
var popup = document.querySelector('.popup');
var popupOverlay = document.querySelector('.popup-overlay');
// var bodyPage = document.querySelector('.page-body');
var buttonOrder = document.querySelectorAll('.button--order-js');

headerNav.classList.remove('header-nav--nojs');

// Кнопка переключения меню в мобильной версии
headerToggle.addEventListener('click', function() {
  headerNav.classList.toggle('header-nav--opened');
});

// Форма попап

for (var i = 0; i < buttonOrder.length; i++) {
  buttonOrder[i].addEventListener('click', function (evt) {
    evt.preventDefault();
    popupOverlay.classList.add('popup-overlay--show');
    // bodyPage.classList.add('page-body--popup-overlay');
  });
}

popupOverlay.addEventListener('click', function() {
  popupOverlay.classList.remove('popup-overlay--show');
  // bodyPage.classList.remove('page-body--popup-overlay');
});

popup.addEventListener('click', function (evt) {
  evt.stopPropagation();
});


window.addEventListener('keydown', function (evt) {
  if (evt.keyCode === 27) {
    evt.preventDefault();
    if (popupOverlay.classList.contains('popup-overlay--show')) {
      popupOverlay.classList.remove('popup-overlay--show');
      // bodyPage.classList.remove('page-body--popup-overlay');
    }
  }
});
