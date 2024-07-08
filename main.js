// ==UserScript==
// @name         Amazon Category ASIN Extractor
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Extracts ASINs from specified Amazon product categories in the background.
// @author       Your Name
// @match        https://www.amazon.com.au/s?me=A33YPZRNNQ0YTU&marketplaceID=A39IBJ37TRP1C6*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      amazon.com.au
// ==/UserScript==

(function() {
    'use strict';

    // Kategorilerin URL'lerini listele
    const categories = {
        "Category 1": "https://www.amazon.com.au/s?me=A33YPZRNNQ0YTU&marketplaceID=A39IBJ37TRP1C6&rh=n%3Acategory1",
        "Category 2": "https://www.amazon.com.au/s?me=A33YPZRNNQ0YTU&marketplaceID=A39IBJ37TRP1C6&rh=n%3Acategory2",
        // Diğer kategorileri buraya ekleyin
    };

    // ASIN'leri saklamak için bir dizi
    let allAsins = [];

    // Sayfa içinde ASIN'leri çıkarmak için fonksiyon
    function getASINsFromPage(doc) {
        let asins = [];
        doc.querySelectorAll('div[data-asin]').forEach((el) => {
            const asin = el.getAttribute('data-asin');
            if (asin) {
                asins.push(asin);
            }
        });
        return asins;
    }

    // Bir kategori sayfasından ASIN'leri toplamak için fonksiyon
    function fetchASINsFromCategory(url, page = 1) {
        GM_xmlhttpRequest({
            method: "GET",
            url: url + `&page=${page}`,
            onload: function(response) {
                if (response.status === 200) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, "text/html");
                    const asins = getASINsFromPage(doc);
                    allAsins = allAsins.concat(asins);
                    console.log(`ASINs from ${url} (page ${page}):`, asins);

                    // Bir sonraki sayfaya geçiş yapmak için
                    const nextPageLink = doc.querySelector('li.a-last a');
                    if (nextPageLink) {
                        fetchASINsFromCategory(url, page + 1);
                    } else {
                        console.log('All ASINs:', allAsins);
                    }
                }
            }
        });
    }

    // Kullanıcı arayüzü oluşturma
    function createUI() {
        const button = document.createElement('button');
        button.textContent = 'Extract ASINs';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '1000';
        button.style.backgroundColor = '#FF9900';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.padding = '10px';
        button.style.cursor = 'pointer';
        document.body.appendChild(button);

        button.addEventListener('click', () => {
            showCategorySelection();
        });
    }

    // Kategori seçimini göstermek için fonksiyon
    function showCategorySelection() {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.zIndex = '1000';

        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.backgroundColor = 'white';
        modal.style.padding = '20px';
        modal.style.borderRadius = '10px';
        modal.style.zIndex = '1001';

        const title = document.createElement('h2');
        title.textContent = 'Select Categories';
        modal.appendChild(title);

        const form = document.createElement('form');
        Object.keys(categories).forEach(category => {
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = category;
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(category));
            form.appendChild(label);
            form.appendChild(document.createElement('br'));
        });

        const submitButton = document.createElement('button');
        submitButton.textContent = 'Start Extraction';
        submitButton.style.marginTop = '10px';
        form.appendChild(submitButton);

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const selectedCategories = Array.from(form.querySelectorAll('input:checked')).map(input => input.value);
            overlay.remove();
            startExtraction(selectedCategories);
        });

        modal.appendChild(form);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }

    // Seçilen kategoriler için ASIN'leri toplama işlemini başlatma
    function startExtraction(selectedCategories) {
        allAsins = [];  // ASIN listesini temizle
        selectedCategories.forEach(category => {
            const url = categories[category];
            if (url) {
                fetchASINsFromCategory(url);
            }
        });
    }

    // Sayfa tamamen yüklendiğinde UI oluştur
    window.addEventListener('load', createUI);
})();
