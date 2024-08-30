(function() {
    'use strict';

    function createButton() {
        let button = document.createElement('button');
        button.id = 'scrapeButton';
        button.textContent = 'Kategorileri Getir';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '1000';
        button.style.padding = '10px';
        button.style.backgroundColor = '#f0c14b';
        button.style.border = '1px solid #a88734';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        document.body.appendChild(button);
        return button;
    }

    function createPopup() {
        let popup = document.createElement('div');
        popup.id = 'categoryPopup';
        popup.style.display = 'none';
        popup.style.position = 'fixed';
        popup.style.top = '20%';
        popup.style.left = '20%';
        popup.style.width = '60%';
        popup.style.height = '60%';
        popup.style.backgroundColor = 'white';
        popup.style.border = '1px solid #a88734';
        popup.style.borderRadius = '5px';
        popup.style.zIndex = '1001';
        popup.style.padding = '20px';
        popup.style.overflowY = 'scroll';
        document.body.appendChild(popup);
        return popup;
    }

    function setupEventListeners(button, popup) {
        button.addEventListener('click', function() {
            popup.innerHTML = '<h3>Kategoriler:</h3>';
            popup.style.display = 'block';

            let categoryContainer = document.createElement('div');
            categoryContainer.id = 'categoryContainer';
            categoryContainer.style.display = 'flex';
            categoryContainer.style.flexWrap = 'wrap';
            categoryContainer.style.gap = '10px';
            popup.appendChild(categoryContainer);

            let categories = document.querySelectorAll("#departments ul li a");
            categories.forEach(function(category) {
                let categoryName = category.textContent.trim();
                let checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'categoryCheckbox';

                let label = document.createElement('label');
                label.textContent = categoryName;

                let categoryItem = document.createElement('div');
                categoryItem.className = 'categoryItem';
                categoryItem.style.display = 'flex';
                categoryItem.style.alignItems = 'center';

                categoryItem.appendChild(checkbox);
                categoryItem.appendChild(label);
                categoryContainer.appendChild(categoryItem);
            });

            let fetchButton = document.createElement('button');
            fetchButton.id = 'fetchAsins';
            fetchButton.textContent = 'ASIN Kodlarını Al';
            popup.appendChild(fetchButton);

            fetchButton.addEventListener('click', function() {
                let selectedCategories = [];
                document.querySelectorAll('.categoryCheckbox:checked').forEach(function(checkbox) {
                    selectedCategories.push(checkbox.nextElementSibling.textContent);
                });

                let asinList = [];
                selectedCategories.forEach(function(categoryName) {
                    // Burada ASIN'leri çekme işlemini yapabilirsiniz
                    // TODO: Belirli bir kategoriye göre sayfaları dolaşıp ASIN'leri ekle
                });

                let csvContent = "data:text/csv;charset=utf-8," + asinList.join("\n");
                let encodedUri = encodeURI(csvContent);
                let link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", "asin_list.csv");
                document.body.appendChild(link); // Required for Firefox
                link.click();
            });
        });
    }

    // Ana işlevi başlat
    document.addEventListener('DOMContentLoaded', function() {
        let button = createButton();
        let popup = createPopup();
        setupEventListeners(button, popup);
    });
})();
