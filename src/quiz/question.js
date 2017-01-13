import Config from '../config';
import Router from '../router';
import Cookie from '../auth/cookie';

var _ = require("../../node_modules/underscore/underscore.js");

/**
 * Header class
 */
export default class Question{

    /**
     * Construcor
     */
    constructor(params){
        this.scores = [];
        this.questions = [];
        
        this.scoresLoaded = true;
        this.questionLoaded = true;

        this.selector = '.section-inner';
        this.template = `
            <div class="preload text-center">
                <img src="/assets/img/preloader.gif" alt="Loading">
            </div>
            <div class="container section-content">
                <div class="row">
                    <div class="col-xs-8" question></div>
                    <div class="col-xs-12 col-sm-3 col-md-2" style="border-left: 1px solid #f06060">
                        <ul class="nav nav-sidebar"></ul>
                    </div>
                </div>
            </div>
        `;

        this.course = params.course;
        this.lesson = params.lesson;

        this.prepare().load();
    }

    /**
     * Add event listeners
     * 
     * @chainable
     * 
     * @returns Login
     */
    addListeners(){
        this.$el.find('.btn.btn-default').on('click', this.answer.bind(this));
        this.$el.find('.btn.btn-rj').on('click', this.next.bind(this));

        return this;
    }   

    load(){
        if(!this.scores || this.scores.length < 1){
            this.scoresLoaded = false;

            $.ajax({
                url: Config.api + '/questions',
                method:'get',
                dataType:'json',
                data:{
                    lesson: this.lesson
                },
                contentType:'application/json',
                success: this.questionsLoad.bind(this),
                error: this.onError.bind(this),
            });
        }
        
        if(!this.scores || this.scores.length < 1){
            this.questionLoaded = false;

            $.ajax({
                url: Config.api + '/scores',
                method:'get',
                dataType:'json',
                data:{
                    user: Cookie.get('user-id'),
                    lesson: this.lesson
                },
                contentType:'application/json',
                success: this.scoresLoad.bind(this),
                error: this.onError.bind(this),
            });
        }

        return this.onLoad();
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

        var answeredQuestionIds = _.pluck(this.scores, 'question');
        var question = _.sample(_.filter(this.questions, (one) => {
            return !~answeredQuestionIds.indexOf(one.id);
        }));

        if(!question){
            return this.done();
        }    
        this.question = question;
        this.$el.find('[question]').html(`
            <h3><b>Вопрос ${++answeredQuestionIds.length}/${this.questions.length}.</b><br> ${question.name}</h3>
            <div class="row">                  
                <div class="col-xs-6 mbx2">
                    <button class="btn btn-default" style="width:100%" data-num="answer1">
                        <pre><code class="${question.answer1type}"></code></pre>
                    </button>
                </div>
                <div class="col-xs-6 mbx2">
                    <button class="btn btn-default" style="width:100%" data-num="answer2">
                        <pre><code class="${question.answer2type}"></code></pre>
                    </button>
                </div>
            </div>
            <div class="row"> 
                <div class="col-xs-6 mbx2">
                    <button class="btn btn-default" style="width:100%" data-num="answer3">
                        <pre><code class="${question.answer3type}"></code></pre>
                    </button>
                </div>
                <div class="col-xs-6 mbx2">
                    <button class="btn btn-default" style="width:100%" data-num="answer4">
                        <pre><code class="${question.answer4type}"></code></pre>
                    </button>
                </div>
            </div>    
            <div class="preload text-center">
                <img src="/assets/img/preloader.gif" alt="Loading">
            </div>                          
            <div class="row mtx3 hidden next">
                <div class="col-xs-12 text-center">
                    <button class="btn btn-rj btn-lg mtx3">Следующий вопрос</button>
                </div>
            </div>`);

        this.$el.find('[question] code').each(function(i, block){
            $(this).text(question['answer' + ++i]);
            if(!$(this).hasClass('normal')){
                window.hljs.highlightBlock(block);
            }
            
        });
        
        for(var i = 1; i <= this.questions.length; i++){
            let icon = '';
            let answered = this.scores[i-1];
            if(answered && answered.correct){
                icon = '<i class="pull-right fa fa-check-circle"></i>';
            }else if(answered && !answered.correct){
                icon = '<i class="pull-right fa fa-times-circle"></i>';
            }
            
            this.$el.find('.nav-sidebar').append(`
                <li class="${(i === answeredQuestionIds.length) ? 'active' : ''}">
                    <a>Вопрос ${i} ${icon}</a>
                </li>
            `);
        }


        this.$el.find('.section-content').removeClass('hidden');
        this.$el.find('.preload').addClass('hidden');

        Router.updatePageLinks();

        return this.addListeners();
    }
    
    onError(err){
        console.log(err);
    }

    answer(e){
        e.preventDefault();

        var correct = this.question.correct;
        var isCorrect = $(e.currentTarget).data('num') === correct ? true : false;

        $(e.currentTarget).addClass(isCorrect ? 'btn-success' : 'btn-danger');

        this.$el.find('.btn.btn-default')
            .prop('disabled', true)
            .each(function(){
                if($(this).data('num') === correct){
                    $(this).addClass('btn-success');
                }
            });

        this.$el.find('.preload').last().removeClass('hidden');

        $.ajax({
            url: Config.api + '/scores',
            method:'post',
            dataType:'json',
            data:JSON.stringify({
                user: Cookie.get('user-id'),
                lesson: this.question.lesson,
                question: this.question.id,
                correct: isCorrect,
                answered: $(e.currentTarget).data('num')
            }),
            contentType:'application/json',
            success: (response) => {
                this.$el.find('.preload').last().addClass('hidden');
                this.$el.find('.next').removeClass('hidden');
                this.scores.push(response);
            },
            error: this.onError.bind(this),
        });        
    }

    next(){
        this.destroy().prepare().load();

        return this;
    }

    done(){
        let correct = _.where(this.scores, { correct: true });
        let result = correct.length/this.questions.length*100;

        this.$el.html(`
            <div class="container section-content">
                <div class="row">
                    <div class="col-xs-offset-4 col-xs-4 text-center">
                        <h1>Тест завершен</h1>
                        <div class="pie-chart-item text-center">
                            <div class="pie-chart-content">
                                <div class="pie-chart" data-percent="${result}" data-bar-color="#f06060" data-track-color="#fff">
                                    <span class="percent" style="color:#000"></span>
                                </div>

                                <div class="pie-chart-text">
                                    <h4>Правильных ответов</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <questions class="hidden">
                    <div class="row text-center mtx3">
                        <h1>Неправильные ответы:</h1>
                    </div>
                    <section></section>
                </questions>
            </div>
        `);

        $('.pie-chart').easyPieChart({
            scaleColor: false,
            lineCap: 'butt',
            lineWidth: 10,
            size: 210,
            animate: 2000,
            easing: 'easeOutBounce',
            onStep: function(from, to, percent) {
                $(this.el).find('.percent').text(Math.round(percent) + '%');
            }
        });

        if(result >= 100){
            return this;
        }
        this.questions.forEach((question) => {
            let score = _.find(this.scores, function(one){
                return one.question === question.id;
            });

            if(score.correct){
                return;
            }

            this.$el.find('questions section').append(`
                <question>
                    <h3>${question.name}</h3>
                    <div class="row">                  
                        <div class="col-xs-6 mbx2">
                            <button class="btn ${score.answered === 'answer1' ? 'btn-danger' : 'btn-default'} ${question.correct === 'answer1' ? 'btn-success' : 'btn-default'}" style="width:100%" data-num="answer1" disabled>
                                <pre><code class="${question.answer1type}"></code></pre>
                            </button>
                        </div>
                        <div class="col-xs-6 mbx2">
                            <button class="btn ${score.answered === 'answer2' ? 'btn-danger' : 'btn-default'} ${question.correct === 'answer2' ? 'btn-success' : 'btn-default'}" style="width:100%" data-num="answer2" disabled>
                                <pre><code class="${question.answer2type}"></code></pre>
                            </button>
                        </div>
                    </div>
                    <div class="row"> 
                        <div class="col-xs-6 mbx2">
                            <button class="btn ${score.answered === 'answer3' ? 'btn-danger' : 'btn-default'} ${question.correct === 'answer3' ? 'btn-success' : 'btn-default'}" style="width:100%" data-num="answer3" disabled>
                                <pre><code class="${question.answer3type}"></code></pre>
                            </button>
                        </div>
                        <div class="col-xs-6 mbx2">
                            <button class="btn ${score.answered === 'answer4' ? 'btn-danger' : 'btn-default'} ${question.correct === 'answer4' ? 'btn-success' : 'btn-default'}" style="width:100%" data-num="answer4" disabled>
                                <pre><code class="${question.answer4type}"></code></pre>
                            </button>
                        </div>
                    </div>
                    <br><br>
                </question>
            `);

            this.$el.find('questions question:last-child code').each(function(i, block){
                $(this).text(question['answer' + ++i]);
                window.hljs.highlightBlock(block);
            });
        });

        this.$el.find('questions').removeClass('hidden');

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
        this.$el.find('.btn.btn-default').off();
        this.$el.find('.btn.btn-rj').off();
        $(this.selector).empty();

        return this;
    }
}