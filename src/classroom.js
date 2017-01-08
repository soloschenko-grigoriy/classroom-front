import Router from "./router";
import Cookie from './auth/cookie';

$.ajaxPrefilter(function(options) {
    options.crossDomain = true;
    options.headers = {
        'X-Auth-Token' : Cookie.get('keycode')
    };
});
Router.updatePageLinks();
Router.resolve();