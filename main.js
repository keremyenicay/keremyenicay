// main.js

(function($) {
    'use strict';

    // Kategorileri göstermek için kullanılan fonksiyon
    function showCategorySelector() {
        let categories = $('#departments ul li a').map(function() {
            return { name: $(this).text().trim(), href: $(this).attr('href') };
        }).get();

        if (categories.length === 0) {
            alert('Kategoriler bulunamadı.');
            return;
        }

        let $container = $('<div>', {
            css: {
                position: 'fixed',
                top: '10%',
                left: '10%',
                width: '300px',
                padding: '20px',
                backgroundColor: 'white',
                border: '1px solid #ccc',
                zIndex: 10000,
                maxHeight: '500px',
                overflowY: 'auto'
            }
        });

        $.each(categories, function(index, category) {
            let $checkbox = $('<input>', { type: 'checkbox', value: category.href });
            let $label = $('<label>').css('display', 'block').css('marginBottom', '5px')
                .append($checkbox)
                .append(' ' + category.name);
            $container.append($label);
        });

        let $closeButton = $('<button>', { text: 'Close' }).css('marginTop', '10px')
            .on('click', function() {
                $container.remove();
            });

        $container.append($closeButton);
        $('body').append($container);
    }

    // Butonu sayfaya ekleme
    function createButton() {
        let $button = $('<button>', {
            text: 'Show Categories',
            css: {
                position: 'fixed',
                bottom: '10px',
                right: '10px',
                padding: '10px 20px',
                backgroundColor: '#ff9900',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                zIndex: 10000
            }
        });

        $button.on('click', showCategorySelector);
        $('body').append($button);
    }

    // Sayfa yüklendiğinde butonu oluştur
    $(document).ready(createButton);

})(jQuery);
