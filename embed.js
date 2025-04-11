const links = [{"href":"https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css","integrity":"sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T","crossOrigin":"anonymous"},{"href":"https://use.fontawesome.com/releases/v5.7.2/css/all.css","integrity":"sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr","crossOrigin":"anonymous"},{"href":"https://bus-to-show.github.io/bus-to-show-react/static/css/main.a8d72baf.css"}];

for (const link of links) {
    const element = document.createElement('link');
    element.href = link.href;
    if (link.integrity) element.integrity = link.integrity;
    if (link.crossOrigin) element.crossOrigin = link.crossOrigin;
    document.head.appendChild(element);
}

const scripts = [{"src":"https://bus-to-show.github.io/bus-to-show-react/static/js/main.9ca04874.js","defer":true},{"src":"https://code.jquery.com/jquery-3.3.1.slim.min.js","integrity":"sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo","crossOrigin":"anonymous"},{"src":"https://cdn.jsdelivr.net/npm/popper.js@1.14.7/dist/umd/popper.min.js","integrity":"sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1","crossOrigin":"anonymous"},{"src":"https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/js/bootstrap.min.js","integrity":"sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM","crossOrigin":"anonymous"},{"src":"https://apis.google.com/js/platform.js?onload=onLoadCallback","async":true},{"src":"https://js.stripe.com/v3/","async":true}];

for (const script of scripts) {
    const element = document.createElement('script');
    element.src = script.src;
    if (script.integrity) element.integrity = script.integrity;
    if (script.crossOrigin) element.crossOrigin = script.crossOrigin;
    if (script.defer) element.defer = true;
    if (script.async) element.async = true;
    document.body.appendChild(element);
}