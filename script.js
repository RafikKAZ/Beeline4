document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("connectionForm");
    const citySelect = document.getElementById("city");
    const addressInput = document.getElementById("address");
    const coordinatesInput = document.getElementById("coordinates");
    let map, placemark;

    ymaps.ready(() => {
        map = new ymaps.Map("map", {
            center: [43.238949, 76.889709], // Координаты Алматы по умолчанию
            zoom: 12,
        });

        map.events.add("click", (e) => {
            const coords = e.get("coords");
            if (placemark) map.geoObjects.remove(placemark);
            placemark = new ymaps.Placemark(coords);
            map.geoObjects.add(placemark);

            // Обновление полей адреса и координат
            ymaps.geocode(coords).then((res) => {
                const firstGeoObject = res.geoObjects.get(0);
                addressInput.value = firstGeoObject.getAddressLine();
                coordinatesInput.value = coords.join(", ");
            });
        });
    });

    citySelect.addEventListener("change", () => {
        const city = citySelect.value;
        ymaps.geocode(city).then((res) => {
            const firstGeoObject = res.geoObjects.get(0);
            const coords = firstGeoObject.geometry.getCoordinates();
            map.setCenter(coords, 12);
        });
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Проверка заполненности полей
        if (![...form.elements].every((input) => input.value.trim())) {
            alert("Заполните все поля!");
            return;
        }

        const data = {
            city: citySelect.value,
            fullName: document.getElementById("fullName").value,
            phoneNumber: document.getElementById("phoneNumber").value,
            address: addressInput.value,
            coordinates: coordinatesInput.value,
        };

        try {
            const response = await fetch("https://script.google.com/macros/s/AKfycbwAj5jmO20rc5_0ZjvgaVlBUc2pmnNFbh4NdhjIvknYZR_ByQI_QI2aNBjLPWhrkn1Ltg/exec", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                alert("Заявка успешно отправлена!");
                form.reset();
            } else {
                throw new Error("Ошибка при отправке данных.");
            }
        } catch (error) {
            console.error(error);
            alert("Произошла ошибка. Повторите попытку.");
        }
    });
});
