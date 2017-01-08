import Navigo from "../node_modules/navigo/lib/navigo.min";
import Cookie from './auth/cookie';
import Login from "./auth/login";
import Header from "./header/header";
import Statistics from "./header/statistics";
import Settings from "./header/settings";
import Courses from "./quiz/courses";
import Lessons from "./quiz/lessons";
import Homework from "./homework/homework";

import Question from "./quiz/question";

var Router = new Navigo(null, false);

var header = null;
var content = null;

function isAuth(){
    if(!Cookie.get('keycode')){
        Router.navigate('/login');
        return false;
    }

    return true;
}

function beforeEach(route){
    window.dispatchEvent(new CustomEvent('routechanged', { detail: {route: route} }));
    
    if(!content){
        return this;
    }
    if(!content.destroy){
        return this;
    }
    content.destroy();
}
Router.on({
    '/':  () => { 
        if(!isAuth()){return;}
        if(!header){ 
            header = new Header();
        }
        beforeEach('/');
        content = new Courses();
    },
    '/quiz':  () => { 
        if(!isAuth()){return;}
        if(!header){ 
            header = new Header();
        }
        beforeEach('/quiz');
        content= new Courses();
    },
    '/quiz/course':  () => { 
        if(!isAuth()){return;}
        if(!header){ 
            header = new Header();
        }
        beforeEach('/quiz/course');
        content = new Courses();
    },
    '/quiz/course/:course': (params) => { 
        if(!isAuth()){return;}
        if(!header){ 
            header = new Header();
        }
        beforeEach('/quiz/course/:course');
        content = new Lessons(params);
    },
    '/quiz/course/:course/lesson': (params) => { 
        if(!isAuth()){return;}
        if(!header){ 
            header = new Header();
        }
        beforeEach('/quiz/course/:course/lesson');
        content = new Lessons(params);
    },
    '/quiz/course/:course/lesson/:lesson': (params) => {
        if(!isAuth()){return;} 
        if(!header){ 
            header = new Header();
        }
        beforeEach('/quiz/course/:course/lesson/:lesson');
        content = new Question(params);
    },
    '/login': () => { 
        if(Cookie.get('keycode')){
            return Router.navigate('/');
        }
        content = new Login();
    },
    '/settings':  () => { 
        if(!isAuth()){return;}
        if(!header){ 
            header = new Header();
        }
        beforeEach('/settings');
        content = new Settings();
    },
    '/statistics':  () => { 
        if(!isAuth()){return;}
        if(!header){ 
            header = new Header();
        }
        beforeEach('/statistics');
        content = new Statistics();
    },
    '/homework/course/:course':  (params) => {
        Router.navigate('/quiz/course/'+params.course);
    },
    '/homework/course/:course/lesson':  (params) => { 
        Router.navigate('/quiz/course/'+params.course);
    },
    '/homework/course/:course/lesson/:lesson':  (params) => { 
        if(!isAuth()){return;}
        if(!header){ 
            header = new Header();
        }
        beforeEach('/homework/course/:course/lesson/:lesson');
        content = new Homework(params);
    },
    '/logout':  () => { 
        beforeEach();
        Cookie.remove('keycode');
        window.location.href = '/';
    }
});

export default Router;