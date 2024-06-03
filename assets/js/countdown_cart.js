// Po užsikrovimo
window.addEventListener("load", function(){
    // Užsikrovimo metu dėl cache retai krepšelyje parodoma viena prekė, kuri paleidus skaičiavimą neberodoma.
    // Fix: Palaukiame 2s nuo užkrovimo, jeigu skaičiavimo nėra, juosta paslepiama
    this.setTimeout(function() {
        if (typeof ccfwooController !== undefined && !ccfwooController.isCounting())
            hideCountdown();
    }, 2000);
});

// Kai prekė pridedama į krepšelį
$(document.body).on("added_to_cart", function () {
    // Jeigu skaičiavimas jau vyksta, nedaryti nieko
    if (typeof ccfwooController == undefined || ccfwooController.isCounting())
        return;

    // Pradedamas skaičiavimas
    ccfwooController.cartItems = 1;
    ccfwooLocal.cart_count = 1;
    showCountdown();
    ccfwooController.startInterval();
});

// Kai prekė išimama iš krepšelio
$(document.body).on("removed_from_cart", function () {

    // Jeigu skaičiavimas nevyksta, nedaryti nieko
    if (typeof ccfwooController == undefined || !ccfwooController.isCounting())
        return;

    // Jeigu krepšelis tuščias, sustabdomas skaičiavimas
    if (typeof Cookies.get('woocommerce_items_in_cart') == 'undefined') {
        ccfwooController.cartItems = 0;
        ccfwooLocal.cart_count = 0;
        ccfwooController.stopInterval();
        hideCountdown();
    }
});

// Kai užsibaigia skaičiavimas
document.addEventListener("ccfwooFinishedCounting", function () {
    // Ištuštinamas krepšelis
    clearWoocommerceCart();
});

function clearWoocommerceCart() {
    if (typeof wc_add_to_cart_params == undefined || typeof wc_add_to_cart_params.ajax_url == undefined)
        return false;

    /* Išjungta development versijoje
    const request = new XMLHttpRequest();
    request.addEventListener("load", handleClearCartResponse);
    request.open("POST", wc_add_to_cart_params.ajax_url, true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send("action=clear_cart");
    */

    /* Tik developmentui */
    this.status = 200;
    handleClearCartResponse();


    return true;
}

function showCountdown() {
    ccfwooController.classes('remove', 'ccfwoo-is-hidden');
}

function hideCountdown() {
    ccfwooController.classes('add', 'ccfwoo-is-hidden');
}

function handleClearCartResponse() {
    /* Išjungta frontend versijoje
    if (!this.status)
        return;

    if (this.status == 200) {
    */
        ccfwooController.stopInterval(true);
        ccfwooLocal.cart_count = 0;
        ccfwooController.setCartItems(0);
        document.body.dispatchEvent(new Event('wc_fragment_refresh'));
        setTimeout(function () {
            hideCountdown();
        }, parseInt(ccfwooLocal.expired_message_seconds) * 1000) + 1000;

        /* Tik frontend versijoje */
        $('.elementor-button-icon-qty').text('0');

     //}

}