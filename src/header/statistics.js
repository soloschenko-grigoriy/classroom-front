import Cookie from '../auth/cookie';
import Config from '../config';

var _ = require("../../node_modules/underscore/underscore.js");

export default class Statistics{

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
                            <h2 class="main-title">Статистика</h2>
                            <h3 class="sub-title">Здесь отображается статистика обо всех завершенных тестах</h3>
                            <span class="section-line"></span>
                        </div>
                    </div>
                </div>
                <div class="row mbx3"></div>
            `;
    
        this.prepare().load().addListeners();
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

    load(){
        $.ajax({
            url: Config.api + '/scores',
            dataType:'json',
            data:{
                user: Cookie.get('user-id'),
                populate:['lesson', 'lesson.course'],
                limit:1000
            },
            contentType:'application/json',
            success: this.onLoad.bind(this),
            error: this.onError.bind(this),
        });  

        return this;
    }

    onLoad(scores){
        let courses = _.groupBy(scores, function(one){
            return $.trim(one.lesson.course.name);
        });
        
        _.each(courses, function(one, i){
            var lessons = _.groupBy(one, function(elm){
                return $.trim(elm.lesson.name);
            });
            
            _.each(lessons, (lesson, k) => {
                lessons[k] = {
                    total: lesson.length,
                    correct: _.where(lesson, { correct: true }).length
                };
            });

            courses[i] = lessons;            
        });

        console.log(courses);

        var html = '';
        _.each(courses, (lessons, course) => {
            html += `
                <div class="col-md-8 col-md-offset-2 text-center mbx3" >
                    <h3>${course}</h3>
                    <div class="bar-chart">
               `;

            _.each(lessons, (info, lesson) => {
                html += `
                    <div class="bar-chart-item" data-percent="${info.correct/info.total * 100}">
                        <p>${lesson}</p>
                    </div>                                                                                                                                                                                                                                                      
                    <div class="bar-chart-legend clearfix mbx3">
                        <div class="legend legend-left">
                            <p>0%</p>
                        </div>

                        <div class="legend legend-left">
                            <p>25%</p>
                        </div>

                        <div class="legend legend-right">
                            <p>75%</p>
                        </div>

                        <div class="legend legend-right">
                            <p>100%</p>
                        </div>
                    </div>
                `;
            });

            html +=  `</div></div>`;
        });

        this.$el.find('.row').last().html(html);

        this.$el.find('.bar-chart-item').each(function(){
            var percent = $(this).data('percent');
            $(this).css('width', $(this).parent().width() * (percent / 100));
        });

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