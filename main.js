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
        if (element) {
            return element.getAttribute('data-asin') || 'ASIN not found';
        } else {
            return 'ASIN element not found';
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
            let productElements = document.querySelectorAll('div[data-asin]');
            let productData = [];

            productElements.forEach(element => {
                let asin = getASIN(element);
                let productName = getProductName(element);
                productData.push({ asin, productName });
            });

            if (productData.length > 0) {
                displayData(productData);
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
