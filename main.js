// Amazon ürün sayfasından ASIN ve ürün adını alır ve konsola yazdırır
(function() {
    'use strict';

    // ASIN'i sayfadaki belirli bir meta etiketinden alır
    function getASIN() {
        let asin = null;
        let asinElement = document.querySelector("input#ASIN");
        if (asinElement) {
            asin = asinElement.value;
        }
        return asin;
    }

    // Ürün adını alır
    function getProductName() {
        let productName = null;
        let productElement = document.getElementById("productTitle");
        if (productElement) {
            productName = productElement.textContent.trim();
        }
        return productName;
    }

    // Sayfa yüklendikten sonra çalışır
    window.addEventListener('load', function() {
        let asin = getASIN();
        let productName = getProductName();

        if (asin && productName) {
            console.log(`ASIN: ${asin}`);
            console.log(`Product Name: ${productName}`);
        } else {
            console.error("ASIN veya ürün adı bulunamadı.");
        }
    });

})();
