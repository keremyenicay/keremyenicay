// ==UserScript==
// @name         Amazon Category ASIN Extractor
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Extracts ASINs from specified Amazon product categories in the background.
// @author       Your Name
// @match        https://www.amazon.com.au/s?me=A33YPZRNNQ0YTU&marketplaceID=A39IBJ37TRP1C6*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      amazon.com.au
// ==/UserScript==

(function() {
    'use strict';

    // Kategorilerin URL'lerini listele
    const categories = {
        "Category 1": "https://www.amazon.com.au/s?me=A33YPZRNNQ0YTU&marketplaceID=A39IBJ37TRP1C6&rh=n%3Acategory1",
        "Category 2": "https://www.amazon.com.au/s?me=A33YPZRNNQ0YTU&marketplaceID=A39IBJ37TRP1C6&rh=n%3Acategory2",
        // Diğer kategorileri buraya ekleyin
    };

    // ASIN'leri saklamak için bir dizi
    let allAsins = [];

    // Sayfa içinde ASIN'leri çıkarmak için fonksiyon
    function getASINsFromPage(doc) {
        let asins = [];
        doc.querySelectorAll('div[data-asin]').forEach((el) => {
            const asin = el.getAttribute('data-asin');
            if (asin) {
                asins.push(asin);
            }
        });
        return asins;
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

    // Bir kategori sayfasından ASIN'leri toplamak için fonksiyon
    function fetchASINsFromCategory(url, page = 1) {
        GM_xmlhttpRequest({
            method: "GET",
            url: url + `&page=${page}`,
            onload: function(response) {
                if (response.status === 200) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, "text/html");
                    const asins = getASINsFromPage(doc);
                    allAsins = allAsins.concat(asins);
                    console.log(`ASINs from ${url} (page ${page}):`, asins);

                    // Bir sonraki sayfaya geçiş yapmak için
                    const nextPageLink = doc.querySelector('li.a-last a');
                    if (nextPageLink) {
                        fetchASINsFromCategory(url, page + 1);
                    } else {
                        console.log('All ASINs:', allAsins);
                    }
                }
            }
    function addEventListeners() {
        // Kapatma butonuna tıklama olayını ekle
        document.getElementById('closeCategorySelection').addEventListener('click', () => {
            document.getElementById('categorySelection').remove();
        });
    }

    // Kullanıcı arayüzü oluşturma
    function createUI() {
        const button = document.createElement('button');
        button.textContent = 'Extract ASINs';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '1000';
        button.style.backgroundColor = '#FF9900';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.padding = '10px';
        button.style.cursor = 'pointer';
        document.body.appendChild(button);

        button.addEventListener('click', () => {
            showCategorySelection();
        // Tümünü Seç butonuna tıklama olayını ekle
        document.getElementById('selectAllCategories').addEventListener('click', () => {
            const checkboxes = document.querySelectorAll('#categorySelection input[type="checkbox"]');
            checkboxes.forEach(checkbox => checkbox.checked = true);
        });
    }

    // Kategori seçimini göstermek için fonksiyon
    function showCategorySelection() {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.zIndex = '1000';

        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.backgroundColor = 'white';
        modal.style.padding = '20px';
        modal.style.borderRadius = '10px';
        modal.style.zIndex = '1001';

        const title = document.createElement('h2');
        title.textContent = 'Select Categories';
        modal.appendChild(title);

        const form = document.createElement('form');
        Object.keys(categories).forEach(category => {
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = category;
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(category));
            form.appendChild(label);
            form.appendChild(document.createElement('br'));
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

        const submitButton = document.createElement('button');
        submitButton.textContent = 'Start Extraction';
        submitButton.style.marginTop = '10px';
        form.appendChild(submitButton);
    function scrapeASINs(categories) {
        // Sayfadaki ürünlerin ASIN kodlarını topla
        let asins = [];
        let products = document.querySelectorAll('.s-main-slot .s-result-item');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const selectedCategories = Array.from(form.querySelectorAll('input:checked')).map(input => input.value);
            overlay.remove();
            startExtraction(selectedCategories);
        products.forEach(product => {
            let asin = product.getAttribute('data-asin');
            let category = product.querySelector('.a-text-bold')?.textContent.trim();
            if (asin && categories.includes(category)) {
                asins.push(asin);
            }
        });

        modal.appendChild(form);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        console.log('ASIN Kodları:', asins);
        alert('ASIN Kodları: ' + asins.join(', '));
    }

    // Seçilen kategoriler için ASIN'leri toplama işlemini başlatma
    function startExtraction(selectedCategories) {
        allAsins = [];  // ASIN listesini temizle
        selectedCategories.forEach(category => {
            const url = categories[category];
            if (url) {
                fetchASINsFromCategory(url);
            }
        });
    function init() {
        createCategorySelection();
        addEventListeners();
    }

    // Sayfa tamamen yüklendiğinde UI oluştur
    window.addEventListener('load', createUI);
    // Başlat
    init();
})();
