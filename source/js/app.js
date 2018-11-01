var headerNav = document.querySelector('.header-nav');
var headerToggle = document.querySelector('.header-nav__toggle');
var popup = document.querySelector('.popup');
var popupOverlay = document.querySelector('.popup-overlay');
// var bodyPage = document.querySelector('.page-body');
var buttonOrder = document.querySelectorAll('.button--order-js');
var mapYandex = document.querySelector('.contacts__map-yandex');
var mapImg = document.querySelector('.contacts__img');



headerNav.classList.remove('header-nav--nojs');
mapYandex.classList.remove('contacts__map-yandex--nojs');
mapImg.classList.remove('contacts__img--nojs');


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


// Карта Яндекс

ymaps.ready(function () {
  var myMap = new ymaps.Map(mapYandex, {
    center: [59.938695, 30.323053],
    zoom: 17
  }),

    myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
        hintContent: 'Наш офис',
        balloonContent: 'г. Санкт-Петербург, ул. Большая Конюшенная, д. 19/8, офис 101'
    }, {
        iconLayout: 'default#image',
        // Своё изображение иконки метки.
        iconImageHref: '../img/icon-map-pin.svg',
        // Размеры метки.
        iconImageSize: [66, 100],
        // Смещение левого верхнего угла иконки относительно
        // её "ножки" (точки привязки).
        iconImageOffset: [-33, -100]
    });

  myMap.geoObjects
    .add(myPlacemark);
});
