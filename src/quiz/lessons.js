import Config from '../config';
import Router from '../router';

/**
 * Header class
 */
export default class Lessons{

    /**
     * Construcor
     */
    constructor(params){
        this.selector = '.section-inner';
        this.template = `
            <div class="preload text-center">
                <img src="/assets/img/preloader.gif" alt="Loading">
            </div>
            <div class="container section-content hidden">
                <div class="row">
                    <div class="col-md-12">
                        <div class="section-title text-center">
                            <h2 class="main-title">Выберите урок</h2>
                            <h3 class="sub-title">Который Вы сейчас проходите:</h3>
                            <span class="section-line"></span>
                        </div>
                    </div>
                </div>
                <div class="row"></div>                                
            </div>
        `;

        this.prepare().loadLessons(params.course).addListeners();
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

    loadLessons(course){
        $.ajax({
            url: Config.api + '/lessons',
            method:'get',
            dataType:'json',
            data:{
                course: course,
                sort:'position'
            },
            contentType:'application/json',
            success: this.onLoad.bind(this),
            error: this.onError.bind(this),
        });

        return this;
    }

    onLoad(response){
        response.forEach((item) => {
            if(item.notest && item.nohw){
                return this;
            }

            if(!item.active){
                return this;
            }

            let test = `<a href="/quiz/course/${item.course}/lesson/${item.id}" class="btn btn-rj">Начать тест</a>`;
            let hw = `<a href="/homework/course/${item.course}/lesson/${item.id}" class="btn btn-rj">Домашка</a>`;

            if(item.notest){
                test = '';
            }

            if(item.nohw){
                hw = '';
            }

            
            this.$el.find('.row').last().append(
                `<div class="col-xs-12 col-sm-6 col-md-4 mbx3 pbx3">
                  <div class="funny-boxes outline-inward text-center">
                    <span class="funny-boxes-icon">${item.icon}</span>
                    <div class="funny-boxes-text">
                      <h4>${item.name}</h4>
                      <p>${item.description}</p>
                      ${test} ${hw}
                    </div>
                  </div>
                </div>`
            );
        });

        this.$el.find('.section-content').removeClass('hidden');
        this.$el.find('.preload').addClass('hidden');

        Router.updatePageLinks();

        return this;
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