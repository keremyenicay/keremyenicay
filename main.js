(function() {
    'use strict';

    function createCategorySelection() {
        const categorySelectionHtml = `
            <div id="categorySelection" style="position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background:white; border:1px solid black; padding:10px; z-index:1000; max-height:80%; overflow-y:auto;">
                <button id="closeCategorySelection" style="position:absolute; top:5px; right:5px;">X</button>
                <h3>Kategori Seçimi</h3>
                <div>
                    <label><input type="checkbox" value="Automotive"> Automotive</label><br>
                    <label><input type="checkbox" value="Baby"> Baby</label><br>
                    <label><input type="checkbox" value="Beauty"> Beauty</label><br>
                    <label><input type="checkbox" value="Books"> Books</label><br>
                    <label><input type="checkbox" value="CDs & Vinyl"> CDs & Vinyl</label><br>
                    <label><input type="checkbox" value="Clothing, Shoes & Accessories"> Clothing, Shoes & Accessories</label><br>
                    <label><input type="checkbox" value="Computers"> Computers</label><br>
                    <label><input type="checkbox" value="Electronics"> Electronics</label><br>
                    <label><input type="checkbox" value="Everything Else"> Everything Else</label><br>
                    <label><input type="checkbox" value="Garden"> Garden</label><br>
                    <label><input type="checkbox" value="Health, Household & Personal Care"> Health, Household & Personal Care</label><br>
                    <label><input type="checkbox" value="Home"> Home</label><br>
                    <label><input type="checkbox" value="Home Improvement"> Home Improvement</label><br>
                    <label><input type="checkbox" value="Kitchen & Dining"> Kitchen & Dining</label><br>
                    <label><input type="checkbox" value="Lighting"> Lighting</label><br>
                    <label><input type="checkbox" value="Musical Instruments"> Musical Instruments</label><br>
                    <label><input type="checkbox" value="Pantry Food & Drinks"> Pantry Food & Drinks</label><br>
                    <label><input type="checkbox" value="Pet Supplies"> Pet Supplies</label><br>
                    <label><input type="checkbox" value="Sports, Fitness & Outdoors"> Sports, Fitness & Outdoors</label><br>
                    <label><input type="checkbox" value="Stationery & Office Products"> Stationery & Office Products</label><br>
                    <label><input type="checkbox" value="Toys & Games"> Toys & Games</label><br>
                </div>
                <button id="selectAllCategories">Tümünü Seç</button>
                <button id="startScraping">Başlat</button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', categorySelectionHtml);
    }

    function addEventListeners() {
        // Kapatma butonuna tıklama olayını ekle
        document.getElementById('closeCategorySelection').addEventListener('click', () => {
            document.getElementById('categorySelection').remove();
        });

        // Tümünü Seç butonuna tıklama olayını ekle
        document.getElementById('selectAllCategories').addEventListener('click', () => {
            const checkboxes = document.querySelectorAll('#categorySelection input[type="checkbox"]');
            checkboxes.forEach(checkbox => checkbox.checked = true);
        });

        // Başlat butonuna tıklama olayını ekle
        document.getElementById('startScraping').addEventListener('click', () => {
            const selectedCategories = Array.from(document.querySelectorAll('#categorySelection input[type="checkbox"]:checked')).map(cb => cb.value);
            if (selectedCategories.length === 0) {
                alert('Lütfen en az bir kategori seçin.');
                return;
            }
            scrapeASINs(selectedCategories);
        });
    }

    function scrapeASINs(categories) {
        // Sayfadaki ürünlerin ASIN kodlarını topla
        let asins = [];
        let products = document.querySelectorAll('.s-main-slot .s-result-item');

        products.forEach(product => {
            let asin = product.getAttribute('data-asin');
            let category = product.querySelector('.a-text-bold')?.textContent.trim();
            if (asin && categories.includes(category)) {
                asins.push(asin);
            }
        });

        console.log('ASIN Kodları:', asins);
        alert('ASIN Kodları: ' + asins.join(', '));
    }

    function init() {
        createCategorySelection();
        addEventListeners();
    }

    // Başlat
    init();
})();
