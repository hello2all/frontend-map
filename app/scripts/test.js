$(document).ready(function(){

    $.ajax({
        type: 'GET',
        url: 'https://en.wikipedia.org/w/api.php?action=parse&page=Baba_House&prop=text&section=0&format=json',
        contentType: 'application/json; charset=utf-8',
        async: false,
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {

            var markup = data.parse.text['*'];
            var blurb = $('<div></div>').html(markup);

            // remove links as they will not work
            blurb.find('a').each(function() { $(this).replaceWith($(this).html()); });

            // remove any references
            blurb.find('sup').remove();

            // remove cite error
            blurb.find('.mw-ext-cite-error').remove();
            $('#article').html($(blurb).find('p'));

        },
        error: function (errorMessage) {
        }
    });
});
