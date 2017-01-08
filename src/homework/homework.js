import Config from '../config';
import Router from '../router';

/**
 * Header class
 */
export default class Homework{

    /**
     * Construcor
     */
    constructor(params){
        this.selector = '.section-inner';
        this.template = `
            <div class="preload text-center">
                <img src="/assets/img/preloader.gif" alt="Loading">
            </div>`;

        this.prepare().load(params.lesson).addListeners();
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

    load(lesson){
        $.ajax({
            url: Config.api + '/homeworks',
            dataType:'json',
            data:{
                lesson: lesson,
                populate:['lesson']
            },
            contentType:'application/json',
            success: this.onLoad.bind(this),
            error: this.onError.bind(this),
        });    

        return this;    
    }

    onLoad(homeworks){
        if(!homeworks || homeworks.length < 1){
            return this;
        }

        this.$el.html(`
            <div class="container section-content">
                <div class="row">
                    <div class="col-md-12">
                        <div class="section-title text-center">
                            <h2 class="main-title">Домашнее задание</h2>
                            <h3 class="sub-title">К уроку ${homeworks[0].lesson.name}</h3>
                            <span class="section-line"></span>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 col-md-offset-3">
                        <div class="accordion accordion-rj style-one">
                            <div class="panel-group"></div>
                        </div>
                    </div>
                </div>
            </div>
        `);

        homeworks.forEach((homework, i) => {
            this.$el.find('.panel-group').last().append(`
                <div class="panel">
                    <div class="panel-heading">
                        <div class="panel-title">
                            <a class="accordion-toggle" data-toggle="collapse" href="#accordion-style-three-item-${i}">    
                                ${homework.special ? '*' : ''} Задача №${i+1} 
                            </a>
                        </div>
                    </div>
                    <div id="accordion-style-three-item-${i}" class="panel-collapse collapse in">
                        <div class="panel-body">
                            <p>${homework.description}</p>
                        </div>
                    </div>
                </div>
            `);
        });

        return this;
    }

    onError(e){
        console.log(e);
        
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