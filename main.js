(function() {
    // JQuery'nin yüklü olup olmadığını kontrol et
    if (typeof jQuery == 'undefined') {
        let script = document.createElement('script');
        script.src = "https://code.jquery.com/jquery-3.6.0.min.js";
        document.getElementsByTagName('head')[0].appendChild(script);
    }

    $(document).ready(function() {
        // Butonu ekle
        let button = $('<button id="scrapeButton">Kategorileri Getir</button>');
        button.css({
            position: 'fixed',
            top: '10px',
            right: '10px',
            zIndex: 1000,
            padding: '10px',
            backgroundColor: '#f0c14b',
            border: '1px solid #a88734',
            borderRadius: '5px',
            cursor: 'pointer'
        });
        $('body').append(button);

        // Pop-up penceresini oluştur
        let popup = $('<div id="categoryPopup" style="display:none;"></div>');
        popup.css({
            position: 'fixed',
            top: '20%',
            left: '20%',
            width: '60%',
            height: '60%',
            backgroundColor: 'white',
            border: '1px solid #a88734',
            borderRadius: '5px',
            zIndex: 1001,
            padding: '20px',
            overflowY: 'scroll'
        });
        $('body').append(popup);

        // Kategorileri al ve pop-up penceresine ekle
        $('#scrapeButton').click(function() {
            $('#categoryPopup').html('<h3>Kategoriler:</h3>');
            $('#categoryPopup').show();

            // Kategorilerin olduğu bir kapsayıcı oluştur
            let categoryContainer = $('<div id="categoryContainer"></div>');
            categoryContainer.css({
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px'
            });
            $('#categoryPopup').append(categoryContainer);

            // Kategorileri al ve ekrana ekle
            let categories = document.querySelectorAll("#departments ul li a");
            categories.forEach(function(category) {
                let categoryName = category.textContent.trim();
                let checkbox = $('<input type="checkbox" class="categoryCheckbox" />');
                let label = $('<label></label>').text(categoryName);
                
                let categoryItem = $('<div class="categoryItem"></div>');
                categoryItem.css({
                    display: 'flex',
                    alignItems: 'center'
                });
                categoryItem.append(checkbox).append(label);
                categoryContainer.append(categoryItem);
            });

            // ASIN'leri çekme butonu ekle
            $('#categoryPopup').append('<button id="fetchAsins">ASIN Kodlarını Al</button>');
            $('#fetchAsins').click(function() {
                let selectedCategories = [];
                $('.categoryCheckbox:checked').each(function() {
                    selectedCategories.push($(this).next('label').text());
                });

                let asinList = [];
                selectedCategories.forEach(function(categoryName) {
                    // Burada ASIN'leri çekme işlemini yapabilirsiniz
                    // TODO: Belirli bir kategoriye göre sayfaları dolaşıp ASIN'leri ekle
                });

                // ASIN'leri CSV dosyası olarak indir
                let csvContent = "data:text/csv;charset=utf-8," + asinList.join("\n");
                let encodedUri = encodeURI(csvContent);
                let link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", "asin_list.csv");
                document.body.appendChild(link); // Required for Firefox
                link.click();
            });
        });
    });
})();
