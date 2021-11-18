/*==============================
    Modal
    ==============================*/
$('.open-video, .open-map').magnificPopup({
    disableOn: 0,
    fixedContentPos: true,
    type: 'iframe',
    preloader: false,
    removalDelay: 300,
    mainClass: 'mfp-fade',
});

$('.asset__img').magnificPopup({
    fixedContentPos: true,
    type: 'image',
    closeOnContentClick: true,
    closeBtnInside: false,
    mainClass: 'my-mfp-zoom-in',
    image: {
        verticalFit: true
    },
    zoom: {
        enabled: true,
        duration: 400
    }
});

$('.open-modal').magnificPopup({
    fixedContentPos: true,
    fixedBgPos: true,
    overflowY: 'auto',
    type: 'inline',
    preloader: false,
    focus: '#username',
    modal: false,
    removalDelay: 300,
    mainClass: 'my-mfp-zoom-in',
});

console.log("damn")


$('.modal__close').on('click', function(e) {
    e.preventDefault();
    $.magnificPopup.close();
});
