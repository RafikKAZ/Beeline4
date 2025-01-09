document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('request-form');
    const submitButton = document.getElementById('submit-button');
    
    let map, placemark;

    // Инициализация карты Яндекс
    ymaps.ready(function () {
        map = new ymaps.Map('map', {
            center: [43.2220, 76.8512], // Начальный центр карты (например, Алматы)
            zoom: 10
        });

        placemark = new ymaps.Placemark(map.getCenter(), {
            hintContent: 'Ваш дом'
        }, {
            preset: 'islands#icon',
            iconColor: '#0095b6'
        });

        map.geoObjects.add(placemark);

        map.events.add('click', function (e) {
            const coords = e.get('coords');
            placemark.geometry.setCoordinates(coords);

            // Записываем координаты в поле адреса
            document.getElementById('address').value = `Координаты: ${coords[0]}, ${coords[1]}`;
        });
    });

    // Проверка валидности всех полей формы
    function validateForm() {
        const city = document.getElementById('city').value.trim();
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const address = document.getElementById('address').value.trim();

        // Проверяем, что все поля заполнены
        if (!city || !name || !phone || !address) {
            alert("Пожалуйста, заполните все поля!");
            return false;
        }
        return true;
    }

    // Обработчик отправки формы
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Останавливаем стандартную отправку формы

        if (validateForm()) {
            const formData = {
                city: document.getElementById('city').value,
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value
            };

            // Отправляем данные на сервер (например, в Google Sheets)
            sendData(formData);
        }
    });

    // Функция отправки данных
    function sendData(data) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://script.google.com/macros/s/AKfycbwAj5jmO20rc5_0ZjvgaVlBUc2pmnNFbh4NdhjIvknYZR_ByQI_QI2aNBjLPWhrkn1Ltg/exec', true); // URL вашего скрипта
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    alert('Заявка успешно отправлена!');
                } else {
                    alert('Ошибка при отправке заявки');
                }
            }
        };

        xhr.send(JSON.stringify(data));
    }
});
