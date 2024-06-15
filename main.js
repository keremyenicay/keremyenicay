// ==UserScript==
// @name         Amazon ASIN Collector
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Collect ASINs from Amazon pages
// @author       Your Name
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
        // Yeni bir pencere aç
        let popupWindow = window.open('', 'Amazon Product Data', 'width=600,height=400,scrollbars=yes,resizable=yes');

        // Pencere içeriği oluştur
        let content = `
            <html>
            <head>
                <title>Amazon Product Data</title>
            </head>
            <body>
                <h1>Amazon Ürün Bilgileri</h1>
                <ul>
                    ${productData.map(item => `<li>ASIN: ${item.asin}, Ürün Adı: ${item.productName}</li>`).join('')}
                </ul>
            </body>
            </html>
        `;

        // Pencere içeriğini yaz
        popupWindow.document.write(content);
    }

    // Tüm sayfaları tarayacak fonksiyon
    function scrapeAllPages() {
        let productData = [];

        // Amazon sayfalarını gez
        // Bu örnekte sadece 5 sayfa taranacak şekilde sınırlı
        for (let pageNum = 1; pageNum <= 5; pageNum++) {
            let url = `https://www.amazon.com/s?page=${pageNum}`;
            
            fetch(url)
                .then(response => response.text())
                .then(html => {
                    let parser = new DOMParser();
                    let doc = parser.parseFromString(html, 'text/html');
                    let productElements = doc.querySelectorAll('div[data-asin]');
                    
                    productElements.forEach(element => {
                        let asin = getASIN(element);
                        if (asin) {
                            let productName = getProductName(element);
                            productData.push({ asin, productName });
                        }
                    });
                    
                    if (pageNum === 5) {
                        displayData(productData);
                    }
                })
                .catch(error => console.error('Error fetching page:', error));
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
            scrapeAllPages();
        });
    }

    // Sayfa yüklendiğinde butonu oluştur
    window.addEventListener('load', function() {
        createButton();
    });

})();
