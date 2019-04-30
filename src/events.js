import Emitter from 'es6-event-emitter';

class Events extends Emitter {
    constructor () {
        super();
        this._state = {};
        this.stateIgnited = false;
    }
    /**
     * 
     * @param {Obj} stateObject to use as initial global State
     */
    initState (state) {
        this._state = state || {};
        this.stateIgnited = true;
    }
    
    /**
     * 
     * @param {Obj/Func} state object to set as state if a func is provided it will be invoked with the current state obj.  
     */
    setState (state) {
        const target = this._state;
        const source = typeof state === 'function' ? state.call(this, target) : state;
		for (const key in source) target[key] = source[key];
		this.trigger('store:update', this._state);
	}
	/**
     * 
     * @param {Func} subscribtion callback 
     */
	subscribe (cb) {
		this.on('store:update', cb);
	}
	
	getState () {
		return this._state;
    }
    get state () {
        return this._state;
    }
}

// export singleton
export default new Events();