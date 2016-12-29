import Todo from './models/todo.js';
import TodoView from './views/todo.js';

export default class TodoComponent{
	
	constructor(){
		console.log(2);
		this.selector = '';
		this.el = null;
	}

	init(params){ 
		this.selector = params.selector;

		this.prepareEl();

		if(!params.autoRender){
			return this;
		}

		var model = new Todo({
			text: 'Some text'
		});

		new TodoView().init({
			model: model,
			parent: this.el
		});

		// return this._render();
	}

	prepareEl(){ 
		var el = document.querySelector(this.selector);
		if(!el){
			throw new Error(`Element specified by selector "${this.selector}" not found in DOM`);
		}

		this.el = el;

		return this;
	}
};