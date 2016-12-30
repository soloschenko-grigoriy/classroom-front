import Config from '../config';
import Router from '../router';
import Cookie from '../auth/cookie';

/**
 * Header class
 */
export default class Question{

    /**
     * Construcor
     */
    constructor(params){
        this.selector = '.section-inner';
        this.template = `
            <div class="preload text-center">
                <img src="/assets/img/preloader.gif" alt="Loading">
            </div>
            <div class="container section-content">
                <div class="row">
                    <div class="col-xs-12 col-sm-3 col-md-2" style="border-left: 1px solid #f06060">
                        <ul class="nav nav-sidebar"></ul>
                    </div>
                </div>
            </div>
        `;

        this.prepare().load(params).addListeners();
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

    load(params){
        this.scores = [];
        this.questions = [];
        this.scoresLoaded = false;
        this.questionLoaded = false;
        
        $.ajax({
            url: Config.api + '/questions',
            method:'get',
            dataType:'json',
            data:{
                lesson: params.lesson
            },
            contentType:'application/json',
            success: this.questionsLoad.bind(this),
            error: this.onError.bind(this),
        });

        $.ajax({
            url: Config.api + '/scores',
            method:'get',
            dataType:'json',
            data:{
                user:Cookie.get('user-id'),
                question: params.question
            },
            contentType:'application/json',
            success: this.scoresLoad.bind(this),
            error: this.onError.bind(this),
        });

        return this;
    }

    scoresLoad(scores){
        this.scores = scores;
        this.scoresLoaded = true;

        return this.onLoad();
    }

    questionsLoad(questions){
        this.questions = questions;
        this.questionsLoaded = true;

        return this.onLoad();
    }

    onLoad(){
        if(!this.questionsLoaded || !this.scoresLoaded){
            return this;
        }

        this.questions.forEach((item) => {
            // if(item.disabled){
            //     return;
            // }
            // this.$el.find('.row').last().append(
            //     `<div class="col-xs-12 col-sm-6 col-md-4 mbx3 pbx3">
            //       <div class="funny-boxes float-shadow text-center">
            //         <span class="funny-boxes-icon">${item.icon}</span>
            //         <div class="funny-boxes-text">
            //           <h4>${item.name}</h4>
            //           <p>${item.description}</p>
            //           <a href="/lessons/${item.course}/question" class="btn btn-rj">Начать тест</a>
            //         </div>
            //       </div>
            //     </div>`
            // );
        });

        
        
        for(var i = 1; i<= this.questions.length; i++){
            this.$el.find('.nav-sidebar').append(`<li><a href="javascript:;">Вопрос ${i}</a></li>`);
        }
        this.$el.find('.nav-sidebar li').last().addClass('active');

        this.$el.find('.section-content').removeClass('hidden');
        this.$el.find('.preload').addClass('hidden');

        Router.updatePageLinks();

        return this;
    }

    onError(e){
        console.log('e');
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
}