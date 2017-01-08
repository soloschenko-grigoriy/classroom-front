export default class Statistics{

    /**
     * Construcor
     */
    constructor(){
        this.selector = '.section-inner';
        this.template = ``;

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