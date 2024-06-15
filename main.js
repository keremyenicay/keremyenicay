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
    function getASIN() {
        let asinElement = document.querySelector("input#ASIN");
        if (asinElement) {
            return asinElement.value;
        } else {
            console.error("ASIN element not found.");
            return null;
        }
    }

    function getProductName() {
        let productTitleElement = document.querySelector("span#productTitle");
        if (productTitleElement) {
            return productTitleElement.textContent.trim();
        } else {
            console.error("Product title element not found.");
            return null;
        }
    }

    // Verileri ekranda göster
    function displayData(asin, productName) {
        alert(`ASIN: ${asin}\nProduct Name: ${productName}`);
    }

    // Ürün bilgilerini çekme işlevi
    function fetchProductData() {
        let products = [];

        // Örnek olarak 5 sayfa gezilecek
        for (let page = 1; page <= 5; page++) {
            let url = `https://www.amazon.com/s?k=keywords&page=${page}`; // Keywords yerine arama terimlerinizi geçirin

            fetch(url)
                .then(response => response.text())
                .then(data => {
                    let parser = new DOMParser();
                    let htmlDocument = parser.parseFromString(data, 'text/html');

                    // Her ürünü seç
                    let productElements = htmlDocument.querySelectorAll('div[data-asin]');

                    productElements.forEach(element => {
                        let asin = element.getAttribute('data-asin');
                        let titleElement = element.querySelector('h2');
                        let title = titleElement ? titleElement.textContent.trim() : 'No Title Found';

                        // Ürün bilgilerini listeye ekle
                        products.push({ asin, title });
                    });

                    // Son sayfaya ulaşıldığında işlemi tamamla
                    if (page === 5) {
                        console.log('Fetched Products:', products);
                        displayProductData(products);
                    }
                })
                .catch(error => console.error('Error fetching product data:', error));
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
            // ASIN ve ürün adını al
            let asin = getASIN();
            let productName = getProductName();

            if (asin && productName) {
                displayData(asin, productName);
                
                // Ürün bilgilerini çekmeye başla
                fetchProductData();
            } else {
                console.error("ASIN veya ürün adı bulunamadı.");
            }
        });
    }

    // Sayfa yüklendiğinde butonu oluştur
    window.addEventListener('load', function() {
        createButton();
    });

})();
