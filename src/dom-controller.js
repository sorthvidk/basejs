import Events from './events';

class DomController {
    constructor ({views = [], dummey = false}={}) { // jshint ignore:line
        this.domControllers = [];
        this.views = {};
        Events.on('mutationOberserver:done', this.onMutation.bind(this));
    }

    init (views) {
        if ( !views.length ) return;
        this.register(views);
        this.$domControllers = document.querySelectorAll('[data-controller]');
        this.update(this.$domControllers);
    }   
    /**
     * 
     * @param {Array} array of View/Base classes if a new name is wanted it can be overwritten by passing an Obj. with 'view' and 'name' as keys.  
     */
    register (views) {
        views.forEach(item => {
            const _item = typeof item == 'object' ? item.view : item;
            if(!this.views[item.name]) {
                this.views[item.name] = _item;
            }
        });
    }
    
    update (elements=[]) {
        if(!elements) return;
        [].forEach.call(elements, el => {
            this.createClass(el);
        });
    }
    
    onMutation (mutation) {
        this.update(mutation[0].target.querySelectorAll('[data-controller]'));
    }

    createClass (item) {
        if(item.dataset.controller && this.views[item.dataset.controller] && !item.classList.contains('dom-control-init')) {
            new this.views[item.dataset.controller]( item );
        }
    }
}

export default DomController; 