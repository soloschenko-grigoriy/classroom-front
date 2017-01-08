import Cookie from '../auth/cookie';
import Router from '../router';

/**
 * Header class
 */
export default class Header{

    /**
     * Construcor
     */
    constructor(){
        this.selector = 'header';
        this.template = `
            <nav class="navbar navbar-fixed-top navbar-inverse">
                <div class="container">
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    </button>
                    <a class="navbar-brand" href="/" data-navigo>GS Classroom</a>
                </div>
                <div id="navbar" class="collapse navbar-collapse">
                    <ul class="nav navbar-nav hidden">
                    <li quiz class="active"><a href="/" data-navigo>Quiz</a></li>
                    <li homework><a href="/homework" data-navigo>Homework</a></li>
                    </ul>
                    <ul class="nav navbar-nav navbar-right">
                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><user-name>${Cookie.get('user-name')}</user-name> <span class="caret"></span></a>
                        <ul class="dropdown-menu">
                        <li><a href="/settings" data-navigo>Настройки</a></li>
                        <li><a href="/statistics" data-navigo>Статистика</a></li>
                        <li role="separator" class="divider"></li>
                        <li><a href="/logout" data-navigo>Выйти</a></li>
                        </ul>
                    </li>
                    </ul>
                </div><!-- /.nav-collapse -->
                </div><!-- /.container -->
            </nav>`;

        this.prepare().addListeners();
    }

    /**
     * Add event listeners
     * 
     * @chainable
     * 
     * @returns Login
     */
    addListeners(){
        window.addEventListener('routechanged', this.checkRoute.bind(this));

        return this;
    }   

    checkRoute(e){
        var route = e.detail.route.replace('/', '').split('/');
        var primary = route[0];

        if(!primary){
            primary = 'quiz';
        }

        this.$el.find('#navbar li').removeClass('active');
        this.$el.find('#navbar [ ' + primary + ']').addClass('active');
        
        return this;
    }

    /**
     * Prepare template, elemnt etc
     * 
     * @chainable
     * 
     * @returns Login
     */
    prepare(){
        this.$el = $(this.selector);
        
        if(!this.$el.length){
            throw new Error(`Element specified by selector "${this.selector}" not found in DOM`);
        }

        this.$el.html(this.template);
        
        Router.updatePageLinks();
        
        return this;
    }
}