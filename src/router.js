import Navigo from "../node_modules/navigo/lib/navigo.min";
import Cookie from './auth/cookie';
import Login from "./auth/login";
import Header from "./header/header";
import Courses from "./quiz/courses";
import Lessons from "./quiz/lessons";
import Config from './config';

var Router = new Navigo(null, false);

function isAuth(){
    if(!Cookie.get('keycode')){
        Router.navigate('/login');
        return false;
    }

    return true;
}

Router.on({
    '/':  () => { 
        if(!isAuth()){return;}
        new Header();
        new Courses();
    },
    '/lessons/:id': (params) => { 
        new Header();
        new Lessons({
            course: params.id
        });
    },
     '/login': () => { 
        if(Cookie.get('keycode')){
            return Router.navigate('/');
        }
        new Login();
    },
    '/logout':  () => { 
        Cookie.remove('keycode');
        window.location.href = '/';
    }
  });

export default Router;