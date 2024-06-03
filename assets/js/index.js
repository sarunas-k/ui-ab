const initialHeight = 850;
function resizeCheckoutColumn() {
    let productsInCart = $('.woocommerce-checkout-review-order .woo-product').length;
    let tooMany = productsInCart - 3;
    let column = $('.woocommerce-checkout .jupiterx-main .woocommerce.woocommerce-checkout');
    if (tooMany > 0) {
        let heightOfOne = 190;
        let adding = heightOfOne * tooMany;
        column.css('max-height', initialHeight + adding + 'px');
    } else {
        column.css('max-height', initialHeight + 'px');
    }
}
$(document.body).on('removed_from_cart', function () {
    $(document.body).trigger('update_checkout');
    resizeCheckoutColumn();
});
$(document.body).on('wc_fragment_refresh', function () {
    $(document.body).trigger('update_checkout');
    resizeCheckoutColumn();
});
$(window).on('load resize', function () {
    var element = $('.woocommerce-checkout .jupiterx-main .woocommerce.woocommerce-checkout');
    if (window.innerWidth < 1024) {
        element.css('max-height', '100%');
    } else {
        resizeCheckoutColumn();
    }
});
$(document).ready(function () {
    $('.raven-nav-menu-toggle-button').on('click', function (event) {
        $('.raven-nav-menu-dropdown').toggleClass('nav-opened');
    });

    $('.elementor-menu-cart__toggle_button').on('click', function(event) {
        $('.elementor-menu-cart__container').toggle();
    });
    $('.elementor-menu-cart__close-button').on('click', function(event) {
        $('.elementor-menu-cart__container').toggle();
    });
});
