import Navigo from "../node_modules/navigo/lib/navigo.min";
import Cookie from './auth/cookie';
import Login from "./auth/login";
import Header from "./header/header";
import Config from './config';

var user = {};
function isAuth(){
    if(!Cookie.get('keycode')){
        Router.navigate('/login');
        return false;
    }

    return true;
}

var Router = new Navigo(null, false);

Router.on({
    '/': function () { 
        if(!isAuth()){return;}
        new Header();
    },
     '/login': function () { 
        if(Cookie.get('keycode')){
            return Router.navigate('/');
        }
        new Login();
    },
    '/logout': function () { 
        Cookie.remove('keycode');
        window.location.href = '/';
    }
  });

Router.updatePageLinks();
Router.resolve();