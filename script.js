document.addEventListener("DOMContentLoaded", function () {
    // Карта Яндекс
    let map, placemark;

    // Инициализация карты
    ymaps.ready(initMap);

    function initMap() {
        map = new ymaps.Map("map", {
            center: [43.238949, 76.889709], // Центр на Алматы
            zoom: 10
        });

        map.events.add('click', function (e) {
            const coords = e.get('coords');
            if (placemark) {
                placemark.geometry.setCoordinates(coords);
            } else {
                placemark = createPlacemark(coords);
                map.geoObjects.add(placemark);
            }

            getAddress(coords);
        });
    }

    function createPlacemark(coords) {
        return new ymaps.Placemark(coords, {}, {
            preset: 'islands#blueDotIcon',
            draggable: false
        });
    }

    function getAddress(coords) {
        ymaps.geocode(coords).then(function (res) {
            const firstGeoObject = res.geoObjects.get(0);
            const address = firstGeoObject.getAddressLine();
            document.getElementById('address').value = address;
            document.getElementById('coordinates').value = coords.join(', ');
        });
    }

    // Отправка данных через форму
    document.getElementById("submissionForm").addEventListener("submit", async function (event) {
        event.preventDefault();

        const formData = new FormData(event.target);

        try {
            const response = await fetch("https://script.google.com/macros/s/AKfycbwAj5jmO20rc5_0ZjvgaVlBUc2pmnNFbh4NdhjIvknYZR_ByQI_QI2aNBjLPWhrkn1Ltg/exec", {
                method: "POST",
                body: formData,
            });

            const result = await response.text();
            alert(result);
        } catch (error) {
            console.error("Ошибка:", error);
            alert("Произошла ошибка при отправке данных.");
        }
    });
});
