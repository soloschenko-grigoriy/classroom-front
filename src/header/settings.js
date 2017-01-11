import Cookie from '../auth/cookie';
import Config from '../config';

export default class Settings{

    /**
     * Construcor
     */
    constructor(){
        this.selector = '.section-inner';
        this.template = `
            <div class="container section-content">
                <div class="row">
                    <div class="col-md-12">
                        <div class="section-title text-center">
                        <h2 class="main-title">Настройки</h2>

                        <h3 class="sub-title">Здесь Вы можете настроить параметры Вашего пользователя</h3>

                        <span class="section-line"></span>

                        <div class="row mtx3">
                            <div class="col-xs-4 col-xs-offset-4">
                            <form method="post" role="form" class="newsletter-form">
                                <div class="form-group">
                                <label for="name">Имя*</label>
                                <input type="name" id="name" class="form-control" value="${Cookie.get('user-name')}">
                                </div>

                                <div class="form-group">
                                <label for="email">Email адрес*</label>
                                <input type="email" id="email" class="form-control" value="${Cookie.get('user-email')}">
                                </div>

                                <div class="form-group">
                                <label for="password">Пароль</label>
                                <input type="password" id="password" class="form-control">
                                </div>

                                <div class="form-group">
                                <label for="confirm">Повторите пароль</label>
                                <input type="password" id="confirm" class="form-control">
                                </div>

                                <button type="submit" class="btn btn-rj" id="save-settings">Сохранить</button>
                            </form>
                            <div class="row">
                            <div class="col-md-12">
                                <div class="form-respond text-center"></div>
                            </div>
                            <!-- //.col-md-12 -->
                            </div>
                        </div>
                        </div>
                    </div>
                    <!-- //.section-title -->
                    </div>
                    <!-- //.col-md-12 -->
                </div>
            <!-- //.row -->
            </div>
        `;

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
        this.$el.find('[type=submit]').on('click', this.save.bind(this));

        return this;
    }  

    save(e){
        e.preventDefault();
        
        if($(event.currentTarget).prop('disabled')){
            return this;
        }

        var name     = $.trim(this.$el.find('#name').val()),
            email    = $.trim(this.$el.find('#email').val()),
            password = $.trim(this.$el.find('#password').val()),
            confirm  = $.trim(this.$el.find('#confirm').val());

        this.$el.find('.has-error').removeClass('has-error');

        if(!name){
            this.$el.find('#name').parent().addClass('has-error');
            this.$el.find('#name').focus();
            return;
        }

        if(!email || !this.isEmailValid(email)){
            this.$el.find('#email').parent().addClass('has-error');
            this.$el.find('#email').focus();
            return;
        }

        if(!password){
            this.$el.find('#password').parent().addClass('has-error');
            this.$el.find('#password').focus();
            return;
        }

        if(!confirm){
            this.$el.find('#confirm').parent().addClass('has-error');
            this.$el.find('#confirm').focus();
            return;
        }

        if(confirm !== password){
            this.$el.find('#confirm').parent().addClass('has-error');
            this.$el.find('#confirm').focus();
            return;
        }

        this.$el.find('form').addClass('hidden');

        $.ajax({
            url: Config.api + '/users/' + Cookie.get('user-id'),
            type: 'put',
            dataType: 'json',
            data: {
                name: name,
                email: email,
                password: password,
                confirm: confirm
            },
            success: (data) => {
                if (data == true){
                    this.$el.find('.form-respond').html("<div class='content-message'><i class='fa fa-rocket fa-4x'></i> <h2>Информация успешно сохранена</h2> <p>Ваши параметры были успешно сохранены на сервере.</p></div>");
                } else {
                    this.$el.find('.form-respond').html("<div class='content-message'><i class='fa fa-exclamation-circle fa-4x'></i> <h2>Произошла ошибка</h2> <p>Если ошибка повторяется обратитесь к вашему учителю</p></div>");
                }

                setTimeout(() => {
                    this.$el.find('form').removeClass('hidden');
                    this.$el.find('.form-respond').html("");
                    this.$el.find('form').removeClass('hidden');
                },3000);
            },
            error: () => {
                this.$el.find('.form-respond').html("<div class='content-message'><i class='fa fa-exclamation-circle fa-4x'></i> <h2>Произошла ошибка</h2> <p>Если ошибка повторяется обратитесь к вашему учителю</p></div>");

                setTimeout(() => {
                    this.$el.find('form').removeClass('hidden');
                    this.$el.find('.form-respond').html("");
                    this.$el.find('form').removeClass('hidden');
                },3000);
            }
        });
    }

    isEmailValid(email){
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        return re.test(email);
    }

    onError(e){
        console.log(e);
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
        this.$el.empty();

        if(!this.$el.length){
            throw new Error(`Element specified by selector "${this.selector}" not found in DOM`);
        }

        this.$el.html(this.template);

        return this;
    }

    destroy(){
        $(this.selector).empty();

        return this;
    }
}