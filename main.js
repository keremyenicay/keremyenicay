(function() {
    'use strict';

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
            fetchData();
        });
    }

    // ASIN ve ürün adını alıp ekrana yazdırma
    function fetchData() {
        let asin = getASIN();
        let productName = getProductName();

        if (asin && productName) {
            displayData(asin, productName);
        } else {
            console.error("ASIN veya ürün adı bulunamadı.");
        }
    }

    // ASIN'i al
    function getASIN() {
        let asin = null;
        let asinElement = document.querySelector("input#ASIN");
        if (asinElement) {
            asin = asinElement.value;
        }
        return asin;
    }

    // Ürün adını al
    function getProductName() {
        let productName = null;
        let productElement = document.getElementById("productTitle");
        if (productElement) {
            productName = productElement.textContent.trim();
        }
        return productName;
    }

    // Verileri ekrana yazdırma
    function displayData(asin, productName) {
        // Ekrana yazdır
        let dataContainer = document.createElement('div');
        dataContainer.style.position = 'fixed';
        dataContainer.style.top = '50px';
        dataContainer.style.right = '10px';
        dataContainer.style.backgroundColor = '#f0f0f0';
        dataContainer.style.padding = '10px';
        dataContainer.style.border = '1px solid #ccc';
        dataContainer.style.borderRadius = '5px';
        dataContainer.style.zIndex = 1000;

        let html = `<p><strong>ASIN:</strong> ${asin}</p>`;
        html += `<p><strong>Product Name:</strong> ${productName}</p>`;

        dataContainer.innerHTML = html;
        document.body.appendChild(dataContainer);
    }

    // Sayfa yüklendiğinde butonu oluştur
    window.addEventListener('load', function() {
        createButton();
    });

})();
