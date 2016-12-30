import Config from '../config';
import Cookie from './cookie';
var crypto = require('crypto');

/**
 * Login class
 */
export default class Login{

    /**
     * Construcor
     */
    constructor(){
        this.selector = 'login';

        this.template = `
            <div class="container">
                <form class="form-signin" method="post" action="login">
                    <h2 class="form-signin-heading">Авторизация</h2>
                    <input name="email" type="email" class="form-control" placeholder="Email адрес" required="" autofocus=""><br>
                    <input name="password" type="password" class="form-control" placeholder="Пароль" required="">
                    <br>
                    <button class="btn btn-lg btn-primary btn-block btn-rj" type="submit">Войти</button>
                    <small class="text-center hidden">Извините, произошла ошибка</small>
                </form>
            </div>`;
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
        this.$el.find('form').on('submit', this.onSubmit.bind(this));
        this.$el.find('input').on('keydown', this.onKeydown.bind(this));

		return this;
	}

    /**
     * onKeydown event handler
     * 
     * @chainable
     * 
     * @param {Event} e
     * @returns Login
     */
    onKeydown(e){
        this.$el.find('.form-signin').removeClass('has-error');
        this.$el.find('small').addClass('hidden');

        return this;
    }

    /**
     * onKeydown event handler
     * 
     * @chainable
     * 
     * @param {Event} e
     * @returns Login
     */
    onSubmit(e){
        e.preventDefault();   
        
        $.ajax({
            url: Config.api + '/users',
            method:'get',
            data: {
                email: $.trim(this.$el.find('[type=email]').val()),
                password: $.trim(this.$el.find('[type=password]').val())
            },
            dataType:'json',
            contentType:'application/json',
            success: this.onSuccess.bind(this),
            error: this.onError.bind(this),
        });

        return this;
    }

    /**
     * onSuccess event handler
     * 
     * @chainable
     * 
     * @param {Event} e
     * @returns Login
     */
    onSuccess(r){
        if(r.length < 1){
            return this.onError();
        }
        var user = r[0];
        var timstamp = Date.now();
        var shasum = crypto.createHash('sha1');
        shasum.update(user.id+user.email+timstamp+user.name+'gs-classes-classroom+keycode');

        Cookie.set('keycode', shasum.digest('hex'), { expires: 60 * 60 * 24 * 30 * 3});
        
        $.ajax({
            url: Config.api + '/users/' + user.id,
            method:'put',
            data: JSON.stringify({
                keycode: timstamp
            }),
            dataType:'json',
            contentType:'application/json',
            success: function(){
                Cookie.set('user-name', user.name, { expires: 60 * 60 * 24 * 30 * 3});
                Cookie.set('user-email', user.email, { expires: 60 * 60 * 24 * 30 * 3});
                Cookie.set('user-id', user.id, { expires: 60 * 60 * 24 * 30 * 3});

                window.location.reload();
            },
            error: this.onError.bind(this),
        });

        

        return this;
    }

    /**
     * onError event handler
     * 
     * @chainable
     * 
     * @param {Event} e
     * @returns Login
     */
    onError(r){
        Cookie.remove('keycode');
        this.$el.find('.form-signin').addClass('has-error');
        this.$el.find('small').removeClass('hidden');

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