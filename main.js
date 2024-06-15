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

    // Lisans kodu doğrulama işlevi
    function validateLicenseCode(enteredCode) {
        // Gerçek uygulamada lisans kodlarını bir veritabanında saklamanız veya bir servisten doğrulamanız gerekebilir.
        let validCodes = ['ABC123', 'XYZ456', '123ABC']; // Örnek geçerli lisans kodları

        return validCodes.includes(enteredCode);
    }

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

    // Lisans kodu girişi için modal gösterme
    function showLicenseModal() {
        // Modal container
        let modalContainer = document.createElement('div');
        modalContainer.id = 'licenseModal';
        modalContainer.style.position = 'fixed';
        modalContainer.style.top = '0';
        modalContainer.style.left = '0';
        modalContainer.style.width = '100%';
        modalContainer.style.height = '100%';
        modalContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        modalContainer.style.display = 'flex';
        modalContainer.style.justifyContent = 'center';
        modalContainer.style.alignItems = 'center';
        modalContainer.style.zIndex = '2000';

        // Modal içeriği
        let modalContent = document.createElement('div');
        modalContent.style.backgroundColor = '#fff';
        modalContent.style.padding = '20px';
        modalContent.style.borderRadius = '5px';
        modalContent.style.width = '300px';
        modalContent.style.textAlign = 'center';

        // Modal başlık
        let modalTitle = document.createElement('h2');
        modalTitle.textContent = 'Enter License Code';

        // Lisans kodu giriş alanı
        let licenseInput = document.createElement('input');
        licenseInput.type = 'text';
        licenseInput.id = 'licenseInput';
        licenseInput.placeholder = 'Enter your license code';
        licenseInput.style.width = '100%';
        licenseInput.style.marginBottom = '10px';
        licenseInput.style.padding = '8px';
        licenseInput.style.border = '1px solid #ccc';
        licenseInput.style.borderRadius = '3px';

        // Lisans kodu gönder butonu
        let submitButton = document.createElement('button');
        submitButton.textContent = 'Submit';
        submitButton.style.backgroundColor = '#4CAF50';
        submitButton.style.color = '#fff';
        submitButton.style.padding = '10px';
        submitButton.style.border = 'none';
        submitButton.style.borderRadius = '3px';
        submitButton.style.cursor = 'pointer';

        // Submit button click event
        submitButton.addEventListener('click', function() {
            let licenseCode = document.getElementById('licenseInput').value;
            if (licenseCode.trim() !== '') {
                // Lisans kodu doğrulaması yap
                let isValid = validateLicenseCode(licenseCode);

                if (isValid) {
                    // Lisans kodu geçerliyse devam et
                    console.log('Valid license code:', licenseCode);

                    // Lisans kodu girişini kapat
                    closeModal();
                    
                    // ASIN ve ürün adını al ve göster
                    let asin = getASIN();
                    let productName = getProductName();

                    if (asin && productName) {
                        displayData(asin, productName);
                    } else {
                        console.error("ASIN veya ürün adı bulunamadı.");
                    }

                    // Ürün bilgilerini çekmeye başla
                    fetchProductData();
                } else {
                    // Lisans kodu geçerli değilse hata mesajı göster
                    alert('Invalid license code. Please try again.');
                }
            } else {
                alert('Please enter a valid license code.');
            }
        });

        // Modal içeriğini oluştur
        modalContent.appendChild(modalTitle);
        modalContent.appendChild(licenseInput);
        modalContent.appendChild(submitButton);

        // Modal container'a içeriği ekle
        modalContainer.appendChild(modalContent);

        // Body'ye modal container'ı ekle
        document.body.appendChild(modalContainer);
    }

    // Modalı kapatma
    function closeModal() {
        let modal = document.getElementById('licenseModal');
        if (modal) {
            modal.remove();
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
            showLicenseModal();
        });
    }

    // Sayfa yüklendiğinde butonu oluştur
    window.addEventListener('load', function() {
        createButton();
    });

})();
