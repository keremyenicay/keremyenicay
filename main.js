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
            showLicenseModal();
        });
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
                // Lisans kodu doğrulaması yapılabilir, burada sadece konsola yazdırıyoruz
                console.log('License code entered:', licenseCode);

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

    // ASIN ve ürün adını al
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

    // Modalı kapatma
    function closeModal() {
        let modal = document.getElementById('licenseModal');
        if (modal) {
            modal.remove();
        }
    }

    // Sayfa yüklendiğinde butonu oluştur
    window.addEventListener('load', function() {
        createButton();
    });

})();
