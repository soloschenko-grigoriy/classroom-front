import Cookie from '../auth/cookie';

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
                    <a class="navbar-brand" href="/">GS</a>
                </div>
                <div id="navbar" class="collapse navbar-collapse">
                    <ul class="nav navbar-nav">
                    <li class="active"><a href="/">Quiz</a></li>
                    <li><a href="/homework">Homework</a></li>
                    </ul>
                    <ul class="nav navbar-nav navbar-right">
                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><user-name>${Cookie.get('user-name')}</user-name> <span class="caret"></span></a>
                        <ul class="dropdown-menu">
                        <li><a href="/settings">Настройки</a></li>
                        <li><a href="/scores">Статистика</a></li>
                        <li role="separator" class="divider"></li>
                        <li><a href="/logout">Выйти</a></li>
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

		return this;
	}
}