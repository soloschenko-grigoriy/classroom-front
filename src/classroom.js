import Router from "./router";
import Cookie from './auth/cookie';
import Config from './config';

$.ajaxPrefilter(function( options, originalOptions, jqXHR ) {
    options.crossDomain = true;
    options.headers = {
    'X-Auth-Token' : Cookie.get('keycode')
    };
});
Router.updatePageLinks();
Router.resolve();