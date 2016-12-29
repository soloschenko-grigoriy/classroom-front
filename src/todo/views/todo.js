export default class TodoView{
	constructor(){
		console.log(33);
	}

	init(params){
		this.model = params.model;
		this.parent = params.parent;

		this.render().addListeners().append();
	}

	addListeners(){
		this.el.addEventListener('click', () => {
			this.remove();
		});

		return this;
	}

	render(){
		this.el = document.createElement(`input`);
		this.el.type = 'text';
		this.el.value = this.model.text;

		return this;
	}

	append(){
		this.parent.appendChild(this.el);

		return this;
	}

	remove(){
		this.parent.removeChild(this.el);
		this.el = null;

		return this;
	}
}