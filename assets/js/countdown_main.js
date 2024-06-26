const ccfwooLocal = {
    cart_count: 1,
    ccfwoo_minutes: 15,
    expired_message_seconds: 5,
    countdown_text: 'Jūsų prekę krepšelyje laikysime 15min. Liko: <span><strong>{minutes}</strong>:<strong>{seconds}</strong></span>',
    leading_zero: 'on',
    enable_banner_message: 'off',
    expired_text: 'Laikas baigėsi. Krepšelis tuščias.',
    loading_html: 'Kraunasi'
};

const ccfwooController = {
    counting: !1,
    cartItems: ccfwooLocal.cart_count,
    cart: 0,
    interval: !1,
    htmlElements: !1,
    config: ccfwooLocal,
    setElements(o) {
        const e = o || 'checkout-countdown-wrapper',
            t = document.getElementsByClassName(e);
        return (this.htmlElements = t), t;
    },
    getElements() {
        return this.htmlElements;
    },
    setHtml(o, e, t) {
        if (((t = t || !1), !(e = e || this.htmlElements) || !o)) return !1;
        let n;
        for (n = 0; n < e.length; n++) {
            const c = e[n].firstElementChild;
            'loading' === o && ccfwooLoadingHTML(c), 'counting' === o && ccfwooUpdateCountingHTML(c, t), 'expired' === o && ccfwooFinishedCountingHTML(c), 'banner' === o && ccfwooBannerHTML(c);
        }
        return !0;
    },
    isCounting() {
        return this.counting;
    },
    hasCart() {
        return this.cartItems >= 1;
    },
    getCartItems() {
        return this.cartItems;
    },
    setCartItems(o) {
        this.cartItems = o;
    },
    setIsCounting(o) {
        !1 === o
            ? ccfwooController.classes('remove', 'checkout-countdown-is-counting')
            : (ccfwooController.classes('add', 'checkout-countdown-is-counting'), ccfwooController.classes('remove', 'ccfwoo-is-hidden')),
            (this.counting = o);
    },
    stopInterval(o) {
        !0 === o && localStorage.removeItem('ccfwoo_end_date'), this.setIsCounting(!1), clearInterval(this.interval);
    },
    startInterval() {
        this.hasCart() ? this.setIsCounting(!0) : this.setIsCounting(!1), (this.interval = setInterval(ccfwooCounter, 1e3));
    },
    restartInterval() {
        this.stopInterval(!0), this.setHtml('loading'), this.startInterval();
    },
    setNewDate(o) {
        const e = o || 60 * ccfwooLocal.ccfwoo_minutes,
            t = new Date();
        return t.setSeconds(t.getSeconds() + e), localStorage.setItem('ccfwoo_end_date', t), t;
    },
    triggerEvent(o, e) {
        if (((e = new Event(e, { bubbles: !0 })), 'document' === o && document.dispatchEvent(e), 'window' === o && window.dispatchEvent(e), 'body' === o)) {
            document.getElementsByTagName('BODY')[0].dispatchEvent(e);
        }
    },
    classes(o, e, t) {
        const n = this.htmlElements;
        if (!n) return !1;
        let c;
        for (c = 0; c < n.length; c++) 'add' === o && n[c].classList.add(e), 'remove' === o && n[c].classList.remove(e), 'replace' === o && t && (n[c].classList.remove(e), n[c].classList.add(t));
    },
};
function ccfwooCounter() {
    if (!ccfwooController.hasCart()) return ccfwooController.setHtml('banner'), ccfwooController.classes('remove', 'checkout-countdown-is-counting'), void ccfwooController.stopInterval(!0);
    const o = ccfwooGetDurationRange(),
        e = ccfwooFormatDuration(o.start, o.end);
    !0 === e.isPast
        ? (ccfwooController.setHtml('loading'),
          ccfwooController.stopInterval(!0),
          ccfwooController.triggerEvent('document', 'ccfwooReachedZero', !0),
          setTimeout(function () {
              ccfwooController.isCounting() || (ccfwooController.triggerEvent('document', 'ccfwooFinishedCounting', !0), ccfwooController.setHtml('expired'));
          }, 1e3),
          setTimeout(function () {
              ccfwooController.isCounting() || ccfwooController.setHtml('banner');
          }, 1e3 * parseInt(ccfwooLocal.expired_message_seconds)))
        : ccfwooController.setHtml('counting', !1, e);
}
function ccfwooUpdateCountingHTML(o, e) {
    if (!o) return;
    let t = ccfwooLocal.countdown_text.replace('{minutes}', e.minutes);
    (t = t.replace('{seconds}', e.seconds)), (t = t.replace('{hours}', e.hours)), (t = t.replace('{days}', e.days)), (o.innerHTML = t);
}
function ccfwooLoadingHTML(o) {
    o && (o.innerHTML = ccfwooLocal.loading_html);
}
function ccfwooBannerHTML(o) {
    o && 'on' === ccfwooLocal.enable_banner_message && ccfwooLocal.banner_message_text && (o.innerHTML = ccfwooLocal.banner_message_text);
}
function ccfwooFinishedCountingHTML(o) {
    o && (o.innerHTML = ccfwooLocal.expired_text);
}
function ccfwooGetDurationRange() {
    const o = new Date();
    let e = !!localStorage.getItem('ccfwoo_end_date') && localStorage.getItem('ccfwoo_end_date');
    e = e ? new Date(e) : ccfwooController.setNewDate();
    return { start: o, end: e };
}
function ccfwooFormatDuration(o, e) {
    const t = new Date(e) - new Date(o),
        n = Number.isInteger(t),
        c = Math.floor(t / 1e3 / 60 / 60 / 24 / 7),
        r = Math.floor(t / 1e3 / 60 / 60 / 24 - 7 * c),
        s = Math.floor(t / 1e3 / 60 / 60 - 7 * c * 24 - 24 * r),
        a = Math.floor(t / 1e3 / 60 - 7 * c * 24 * 60 - 24 * r * 60 - 60 * s),
        l = Math.floor(t / 1e3 - 7 * c * 24 * 60 * 60 - 24 * r * 60 * 60 - 60 * s * 60 - 60 * a),
        i = t / 1e3 <= 0;
    return {
        milliseconds: Math.floor(t - 7 * c * 24 * 60 * 60 * 1e3 - 24 * r * 60 * 60 * 1e3 - 60 * s * 60 * 1e3 - 60 * a * 1e3 - 1e3 * l),
        seconds: ccfwooLeadingZero(l),
        minutes: ccfwooLeadingZero(a),
        hours: s,
        days: r,
        weekdays: c,
        totalSeconds: t / 1e3,
        isPast: i,
        ValidDates: n,
    };
}
function ccfwooGetCookie(o) {
    const e = document.cookie.match(new RegExp('(^| )' + o + '=([^;]+)'));
    if (e) return e[2];
}
function ccfwooLeadingZero(o) {
    if ('on' === ccfwooLocal.leading_zero) {
        const e = 2;
        for (o = o.toString(); o.length < e; ) o = '0' + o;
        return o;
    }
    return o;
}

document.addEventListener('DOMContentLoaded', function (o) {
    ccfwooController.setElements();
    //const e = ccfwooGetCookie('woocommerce_items_in_cart'),
    //    t = e && e >= 1 ? 1 : 0;
    ccfwooController.setCartItems(1), ccfwooCounter(), ccfwooController.startInterval(), ccfwooController.isCounting() && ccfwooController.classes('add', 'checkout-countdown-is-counting');
}),
    document.addEventListener('ccfwooFinishedCounting', function (o) {
        ccfwooController.classes('remove', 'checkout-countdown-is-counting');
    });
