// main.js

(function() {
    'use strict';

    function showCategorySelector() {
        // Mevcut kategorileri toplama
        let categories = Array.from(document.querySelectorAll('#departments ul li a'))
            .map(a => ({ name: a.textContent.trim(), href: a.href }));

        if (categories.length === 0) {
            alert('Kategoriler bulunamadı.');
            return;
        }

        // Arayüzü oluşturma
        let container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '10%';
        container.style.left = '10%';
        container.style.width = '300px';
        container.style.padding = '20px';
        container.style.backgroundColor = 'white';
        container.style.border = '1px solid #ccc';
        container.style.zIndex = 10000;
        container.style.maxHeight = '500px';
        container.style.overflowY = 'auto';

        // Kategorileri listeleme
        categories.forEach(category => {
            let checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = category.href;

            let label = document.createElement('label');
            label.style.display = 'block';
            label.style.marginBottom = '5px';
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(' ' + category.name));

            container.appendChild(label);
        });

        // Kapatma düğmesi ekleme
        let closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.marginTop = '10px';
        closeButton.addEventListener('click', function() {
            document.body.removeChild(container);
        });
        container.appendChild(closeButton);

        document.body.appendChild(container);
    }

    // Tuş kombinasyonu: Alt + C ile betiği çalıştırma
    document.addEventListener('keydown', function(event) {
        if (event.altKey && event.key === 'c') {
            showCategorySelector();
        }
    });

})();
