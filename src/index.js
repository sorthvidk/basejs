import Events from './events';
export default class {
    constructor (el=null, options={}) {
        if (!el) {   }
        this.el = el || document.createElement('span');
		this.options = Object.assign({ mutationObserve: false, delegateEvents: true }, this.initialOptions, options); 
        this.mutationObservers = [];
		this.delegateDomMutationObservers();
		this.state = this.initialState; // get initial state from child class
		this.localDelegateEvents();
    }

    /**
	 * Attaches an event listener
	 * @param {String} eventName - the event string
	 * @param {String} selector - the associated DOMelement
	 * @param {Function} eventHandler - the handler function
	*/
	on(eventName, selector=null, eventHandler) {
		const triggers = typeof selector === 'string' ? this.el.querySelectorAll(selector) : [selector];
		[].forEach.call(triggers, el => {
			if (el.addEventListener) {
				el.addEventListener(eventName, eventHandler, false);
			} else {
				el.attachEvent('on' + eventName, function(){
				  eventHandler.call(el);
				});
			}
		});
	}
	/**
	 * Removes an event listener
	 * @param {String} eventName - the event string
	 * @param {String} selector - the associated DOMelement
	 * @param {Function} eventHandler - the handler function
	 */
	off(eventName, selector, eventHandler) {
		const triggers = typeof selector === 'string' ? this.el.querySelectorAll(selector) : [selector];
		[].forEach.call(triggers, el => {
			if (el.removeEventListener) {
				el.removeEventListener(eventName, eventHandler, false);
			} else {
				el.detachEvent('on' + eventName, eventHandler);
			}
		});
	}
	
	localDelegateEvents () {
		if(this.state.eventsDelegated && this.undelegateEvents) {
			this.undelegateEvents()
		}
		if (this.delegateEvents && this.options.delegateEvents) {
			this.setState({ eventsDelegated: true }, true);
			this.delegateEvents();
		}
	}
    
    find (selector, context) {
		if(context) return context.querySelectorAll(selector);
		return this.el.querySelectorAll(selector);
    }
    
    delegateDomMutationObservers () {
		[].forEach.call(this.find('[data-mutation-observer]'), this.delegateMutationObserver.bind(this));
		if(this.options.mutationObserve) this.delegateMutationObserver(this.el);
	}

	delegateMutationObserver (element) {
		if(!window.MutationObserver || !element || element.classList.contains('dom-control-init')) return;
		const _mo = new MutationObserver(this._onMutation.bind(this));
		_mo.observe(element, { attributes: true, childList: true, characterData: true });
		this.mutationObservers.push(_mo);
		return _mo;
	} 

	undelegateMutationOberservers () {
		this.mutationObservers.forEach(mO=>{
			mO.disconnect();
		});
		this.mutationObservers = [];
		return true;
    }

    /**
	 * onMutation - 
	 * @param {nodeList} mutation 
	 */
	_onMutation (mutation) {
		if(this.undelegateEvents) this.undelegateEvents();
		if(this.delegateEvents) this.delegateEvents();
		[].forEach.call(mutation, mu=>{
			Events.trigger('mutationObserver:done', mu);
		});
	}
	
	/**
     * Super simple local state management
     * @param {Obj|Func} state Obj or function to be calledback to receive a new stateObject
	 * @param {Bool} silent if set to true the update func. will not be invoked. default false.   
     */
	setState(state, silent=false) {
        const target = this.state;
        const source = typeof state === 'function' ? state.call(this, target) : state;
        Object.keys(source).forEach((key)=>{
            if ({}.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
            }
        });
        if(!silent) this.update.call(this, this.state, source);
	}
	
	getState(){
		return this.state;
	}

    /**
     * placeholder - update function called every time a setState is invoked
     * @param {Obj} newState
     * @param {Obj} oldState
     */
    update() {
        return;
    }

    getState() {
        return this.state;
	}
	
	/**
     * placeholder
     */
    get initialState() {
        return {};
	}
	/**
     * placeholder
     */
    get initialOptions() {
        return {};
    }

    /**
     * @param selector {String} - DOM selector
     * @param viewClass {String} - viewclass to instantiate
     * 
     */
    static viewFactory (selector=null, ViewClass=null) {
        if( selector && ViewClass) {
            const elements = document.querySelectorAll( selector );
            [].forEach.call(elements, (element)=>{
                new ViewClass(element);
            });
        }
	}
}