// main.js

(function() {
    'use strict';

    // Kategorileri göstermek için kullanılan fonksiyon
    function showCategorySelector() {
        let categories = Array.from(document.querySelectorAll('#departments ul li a'))
            .map(a => ({ name: a.textContent.trim(), href: a.href }));

        if (categories.length === 0) {
            alert('Kategoriler bulunamadı.');
            return;
        }

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

        let closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.marginTop = '10px';
        closeButton.addEventListener('click', function() {
            document.body.removeChild(container);
        });
        container.appendChild(closeButton);

        document.body.appendChild(container);
    }

    // Butonu sayfaya ekleme
    function createButton() {
        let button = document.createElement('button');
        button.textContent = 'Show Categories';
        button.style.position = 'fixed';
        button.style.bottom = '10px';
        button.style.right = '10px';
        button.style.padding = '10px 20px';
        button.style.backgroundColor = '#ff9900';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.zIndex = 10000;

        button.addEventListener('click', showCategorySelector);
        document.body.appendChild(button);
    }

    // Sayfa yüklendiğinde butonu oluştur
    window.onload = createButton;
})();
