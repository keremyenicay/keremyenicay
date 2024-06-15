// ==UserScript==
// @name         Amazon ASIN ADAM Veri Kazıyıcı by Adnan
// @namespace    http://tampermonkey.net/
// @version      8.0
// @description  Amazon sayfasından ASIN bilgisi dahil birçok veriyi tek tıkla karşına getir.
// @author       Adnan Gökmen - Instagram: @adnangokmen_
// @include      /^((https?:\/\/(?:www\.amazon\..*\/.*)))$/
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// ==/UserScript==

(function() {
    'use strict';

    // ASIN ve ürün adını al
    function getASIN(element) {
        if (element && element.hasAttribute('data-asin')) {
            return element.getAttribute('data-asin');
        } else {
            return null; // data-asin özniteliği yoksa null döndür
        }
    }

    function getProductName(element) {
        if (element) {
            return element.querySelector('h2')?.textContent.trim() || 'Product name not found';
        } else {
            return 'Product element not found';
        }
    }

    // Verileri ekranda göster
    function displayData(productData) {
        // Yeni bir div oluştur
        let popupContainer = document.createElement('div');
        popupContainer.id = 'popupContainer';
        popupContainer.style.position = 'fixed';
        popupContainer.style.top = '50%';
        popupContainer.style.left = '50%';
        popupContainer.style.transform = 'translate(-50%, -50%)';
        popupContainer.style.backgroundColor = '#fff';
        popupContainer.style.padding = '20px';
        popupContainer.style.border = '1px solid #ccc';
        popupContainer.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
        popupContainer.style.zIndex = '1000';
        popupContainer.style.textAlign = 'center';

        // Kapatma butonu oluştur
        let closeButton = document.createElement('button');
        closeButton.textContent = 'Kapat';
        closeButton.style.marginRight = '10px';
        closeButton.style.cursor = 'pointer';
        closeButton.addEventListener('click', function() {
            popupContainer.remove();
        });

        // Kaydetme butonu oluştur
        let saveButton = document.createElement('button');
        saveButton.textContent = 'Kaydet';
        saveButton.style.backgroundColor = '#4CAF50';
        saveButton.style.color = 'white';
        saveButton.style.padding = '10px 20px';
        saveButton.style.border = 'none';
        saveButton.style.cursor = 'pointer';
        saveButton.style.borderRadius = '5px';
        saveButton.addEventListener('click', function() {
            saveData(productData);
            popupContainer.remove();
        });

        // Butonları div içine ekle
        popupContainer.appendChild(closeButton);
        popupContainer.appendChild(saveButton);

        // Popup penceresini sayfaya ekle
        document.body.appendChild(popupContainer);
    }

    // Verileri kaydetmek için fonksiyon
    function saveData(productData) {
        // Burada kaydetme işlemlerini yapabilirsiniz
        console.log('Kaydedilen veriler:', productData);
        alert('Veriler başarıyla kaydedildi!');
    }

    // Belirli bir kategorideki ürünleri çekme
    function fetchProductsInCategory() {
        // Örnek olarak kategori seçimi yapıldı
        let categorySelector = document.querySelector("#departments > ul > span > span:nth-child(1)");

        if (categorySelector) {
            // Kategoriye ait URL'sini al
            let categoryUrl = categorySelector.querySelector('a').getAttribute('href');
            let apiUrl = `https://www.amazon.com${categoryUrl}`;

            // Kategori sayfasını fetch ile getir
            fetch(apiUrl)
                .then(response => response.text())
                .then(html => {
                    // HTML içeriğinden ürünleri çek
                    let parser = new DOMParser();
                    let doc = parser.parseFromString(html, 'text/html');
                    let productElements = doc.querySelectorAll('div[data-asin]');
                    let productData = [];

                    productElements.forEach(element => {
                        let asin = getASIN(element);
                        if (asin) {
                            let productName = getProductName(element);
                            productData.push({ asin, productName });
                        }
                    });

                    if (productData.length > 0) {
                        displayData(productData);
                    } else {
                        console.error("ASIN veya ürün adı bulunamadı.");
                    }
                })
                .catch(error => {
                    console.error('Error fetching products:', error);
                });
        } else {
            console.error("Kategori seçici bulunamadı veya URL alınamadı.");
        }
    }

    // Buton oluşturma ve sayfaya ekleme
    function createButton() {
        // Buton oluştur
        let button = document.createElement('button');
        button.id = 'fetchDataButton';
        button.textContent = 'Fetch ASIN Data';

        // Buton stilini ayarla
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.padding = '10px';
        button.style.backgroundColor = '#ff9900';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.zIndex = 1000;
        button.style.cursor = 'pointer';

        // Butonu sayfaya ekle
        document.body.appendChild(button);

        // Butona tıklama olayı ekle
        button.addEventListener('click', function() {
            fetchProductsInCategory();
        });
    }

    // Sayfa yüklendiğinde butonu oluştur
    window.addEventListener('load', function() {
        createButton();
    });

})();
