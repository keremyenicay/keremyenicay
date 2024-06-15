// ==UserScript==
// @name         Amazon ASIN ADAM Veri Kazıyıcı by Adnan
// @namespace    http://tampermonkey.net/
// @version      8.0
// @description  Amazon sayfasından ASIN bilgisi dahil birçok veriyi tek tıkla karşına getir.
// @author       Adnan Gökmen - Instagram: @adnangokmen_
// @include      /^https?:\/\/(?:www\.)?amazon\.(com|co\.uk|de|fr|es|it|com\.au|nl|ca|in|co\.jp|com\.mx|com\.br|cn)\/.*/i
// @grant        GM_xmlhttpRequest
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

    // ASIN'leri txt olarak kaydet
    function saveAsinToFile(asins) {
        let asinText = asins.join('\n');
        let blob = new Blob([asinText], { type: 'text/plain' });
        let url = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = 'asins.txt';
        a.click();
        URL.revokeObjectURL(url);
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

        // ASIN bilgilerini içeren listeyi oluştur
        let asins = productData.map(item => item.asin);
        let asinList = document.createElement('ul');
        asins.forEach(asin => {
            let listItem = document.createElement('li');
            listItem.textContent = asin;
            asinList.appendChild(listItem);
        });

        popupContainer.appendChild(asinList);

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
            saveAsinToFile(asins);
        });

        popupContainer.appendChild(saveButton);

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

    // ASIN'leri arka planda çekmek için fonksiyon
    async function fetchASINsInBackground(url) {
        try {
            let response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            let htmlString = await response.text();
            let parser = new DOMParser();
            let doc = parser.parseFromString(htmlString, 'text/html');
            let productElements = doc.querySelectorAll('div[data-asin]');
            let productData = [];

            productElements.forEach(element => {
                let asin = getASIN(element);
                if (asin) {
                    let productName = getProductName(element);
                    productData.push({ asin, productName });
                }
            });

            return productData;
        } catch (error) {
            throw new Error(`Error fetching ASINs: ${error.message}`);
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
        button.addEventListener('click', async function() {
            try {
                let currentURL = window.location.href;
                let productData = await fetchASINsInBackground(currentURL);
                if (productData.length > 0) {
                    displayData(productData);
                } else {
                    console.error("ASIN veya ürün adı bulunamadı.");
                }

                // Diğer sayfalardaki ürünlerin ASIN'lerini arka planda çek
                let nextPageButton = doc.querySelector('.a-pagination .a-last');
                if (nextPageButton) {
                    let nextPageURL = new URL(nextPageButton.href);
                    let nextURL = `${currentURL.split('/ref=')[0]}${nextPageURL.pathname}`;
                    while (nextPageButton && nextURL !== currentURL) {
                        let nextPageData = await fetchASINsInBackground(nextURL);
                        if (nextPageData.length > 0) {
                            displayData(nextPageData);
                        }
                        nextPageButton = doc.querySelector('.a-pagination .a-last');
                        if (nextPageButton) {
                            nextPageURL = new URL(nextPageButton.href);
                            nextURL = `${currentURL.split('/ref=')[0]}${nextPageURL.pathname}`;
                        }
                    }
                }
            } catch (error) {
                console.error("Arka planda ASIN bilgileri çekilirken hata oluştu:", error);
            }
        });
    }

    // Sayfa yüklendiğinde butonu oluştur
    window.addEventListener('load', function() {
        createButton();
    });

})();
