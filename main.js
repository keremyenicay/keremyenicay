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

        // ASIN bilgilerini ve ürün adlarını içeren tabloyu oluştur
        let table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';

        // Tablo başlıkları
        let headerRow = document.createElement('tr');
        let asinHeader = document.createElement('th');
        asinHeader.textContent = 'ASIN';
        asinHeader.style.border = '1px solid #ddd';
        let productNameHeader = document.createElement('th');
        productNameHeader.textContent = 'Ürün Adı';
        productNameHeader.style.border = '1px solid #ddd';
        headerRow.appendChild(asinHeader);
        headerRow.appendChild(productNameHeader);
        table.appendChild(headerRow);

        // ASIN bilgileri ve ürün adlarını listele
        productData.forEach(item => {
            let row = document.createElement('tr');
            let asinCell = document.createElement('td');
            asinCell.textContent = item.asin;
            asinCell.style.border = '1px solid #ddd';
            let productNameCell = document.createElement('td');
            productNameCell.textContent = item.productName;
            productNameCell.style.border = '1px solid #ddd';
            row.appendChild(asinCell);
            row.appendChild(productNameCell);
            table.appendChild(row);
        });

        popupContainer.appendChild(table);

        // Kapatma butonu oluştur
        let closeButton = document.createElement('button');
        closeButton.textContent = 'Kapat';
        closeButton.style.marginTop = '10px';
        closeButton.style.cursor = 'pointer';
        closeButton.addEventListener('click', function() {
            popupContainer.remove();
        });

        // Butonları div içine ekle
        popupContainer.appendChild(closeButton);

        // Popup penceresini sayfaya ekle
        document.body.appendChild(popupContainer);
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
        button.addEventListener('click', async function() {
            // ASIN ve ürün adını al
            let productElements = document.querySelectorAll('div[data-asin]');
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
        });
    }

    // Sayfa yüklendiğinde butonu oluştur
    window.addEventListener('load', function() {
        createButton();
    });

})();
