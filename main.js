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
        // Yeni bir pencere aç
        let popupWindow = window.open('', 'Amazon Product Data', 'width=600,height=400,scrollbars=yes,resizable=yes');

        // Pencere içeriği oluştur
        let content = `
            <html>
            <head>
                <title>Amazon Product Data</title>
            </head>
            <body>
                <h2>ASIN: ${asin}</h2>
                <h3>Product Name: ${productName}</h3>
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
            let asin = getASIN();
            let productName = getProductName();

            if (asin && productName) {
                displayData(asin, productName);
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
