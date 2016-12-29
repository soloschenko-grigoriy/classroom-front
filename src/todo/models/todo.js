export default class Todo{

	constructor(params){
		this.done = params.done || false;
		this.text = params.text || '';
	}

	get id(){
		return this._id;
	}

	set id(value){
		value = +value;
		if(!isFinite(value)){
			throw new Error('id for Todo must be a number');
		}

		this._id = value;
	}

	set text(value){
		this._text = value ? value.toUpperCase() : '';
	}

	get text(){
		return this._text;
	}


	set done(value){
		this._done = value ? true : false;
	}

	get done(){
		return this._done;
	}
}