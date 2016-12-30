import Navigo from "../../node_modules/navigo/lib/navigo.min";
import Cookie from '../auth/cookie';

import {Login} from "../auth/login";

var Router = new Navigo(null, false);
Router.on({
    '/': function () { 
        if(!isAuth()){return;}
        console.log('Welcome');
    },
     '/login': function () { 
        if(Cookie.get('keycode')){
            return Router.navigate('/');
        }
        new Login();
    },
  });


function isAuth(){
    if(!Cookie.get('keycode')){
        Router.navigate('/login');
        return false;
    }

    return true;
}

Router.updatePageLinks();

export default Router;