//import shim from 'core-js';


import Log from '../src/log';
import View from '../src/view';
import DOM from '../src/dom';
import Utils from '../src/utils';
import Emmet from '../src/emmet';

// import { View } from '../dist/kernel';
// import { DOM } from '../dist/kernel';
// import { Utils } from '../dist/kernel';
// import { Log } from '../dist/kernel';

class Overlay extends View {

	get defaultOptions() {
		return {
			events: {
				'click':'onClick'
			},
			el: 'div.overlay.overlay--modal',
			displayName: 'Overlay'
		}
	}

	constructor(settings){
		super(settings);
		this.bodyRef = DOM.find('body');
		View.emitter.on('modal:close', this.close.bind(this));

	}

	render(mountPoint) {
		super.render(mountPoint);
		this.addClass('is-active');
	}

	onClick(e) {
		Log.fn("Overlay | onClick");
		if(e.target != this.el) { return false; }
		View.emitter.trigger('overlay:clicked', e);
		this.close();
	}
	close(e) {
		DOM.removeClass(this.bodyRef,'is-fixed');
		DOM.removeClass(this.bodyRef,'is-blurred');
		this.remove();
	}
}


class ModalBox extends View {

	constructor(settings){

		settings.events = {
			'click .js--close-modal': 'onClose'
		};
		settings.displayName = 'ModalBox';
		settings.el = 'div.modal.'+settings.cssClasses+'>a.button.button--icon.has-icon.js--close-modal[href=""]>span.icon[data-text="close"]^div.modal__content.js--modal-content';
		settings.state = {close:'×'};
		super(settings);

		this.content = settings.content;

		this.overlay = new Overlay({ isFixed: true, fixBody: settings.fixBody });

		View.emitter.on('overlay:clicked', this.close.bind(this));
	}
	render() {
		this.find('.js--modal-content')[0].innerHTML = this.content;
		this.overlay.render('body');
		this.overlay.append(this.el);
		View.emitter.trigger('modalbox:rendered', this);
	}
	onClose(e) {
		e.stopPropagation();
		View.emitter.trigger('modal:close');
		this.close();
	}
	close() {
		this.remove();
	}
}


class Box extends View {

	constructor(settings) {
		settings.events = {
			'click .js--button-1': 'onClick',
			'click .js--button-2': 'onClick2',
			'click .js--button-3': 'onClick3',
			'click .js--button-4': 'onClick4',
			'click .js--button-5': 'onClick5',
			'mouseenter': 'onMouseEnter'
		};
		super(settings);
		this.active = false;
		var buttons = this.find('.button');
		DOM.addClass(buttons, 'is-active');
	}
	onMouseEnter(e) {
		Log.fn('Box | onMouseEnter',this.instanceId,"this.active="+this.active);
		this.toggleClass('is-hovered', this.active)
	}
	onClick(e) {
		e.preventDefault();
		Utils.scrollTo(boxes[2], 2000);
	}
	onClick2(e) {
		e.preventDefault();
		boxes[1].remove();
	}
	onClick3(e) {
		this.active = !this.active;
		e.preventDefault();
		View.emitter.trigger('view:action', this);
	}
	onClick4(e) {
		e.preventDefault();
		this.modal = new ModalBox({ content: '<div>We did it!</div>', cssClasses:'modal--success', fixBody:true});
		this.modal.render();
	}
	onClick5(e) {
		e.preventDefault();
		Log.fn("onClick4")
		Utils.scrollTo(boxes[0], 2000);
	}
}

let boxes = Utils.viewFactory('.box', Box, {displayName:'Lars'});

class Table extends View {

	constructor(settings) {
		settings.events = {
			'click':'onClick'
		}
		settings.displayName = 'Table';
		super(settings);
	}
	onMouseEnter(e) {
		Log.fn('Table | onMouseEnter');
	}
	onClick(e) {
		Log.db("cookie",Utils.cookie.get('cookietest'))
		e.preventDefault();

	}
	render() {
		DOM.append( DOM.find('body'), this.el);
	}
}

class CookieAccept extends View {

	constructor(settings = {}) {
		settings = settings || {};

		Object.assign(settings, {
			events: {
				//'click .js--button': 'onClick',
				'click': 'onClick'
			},
			displayName: 'Cookie-accept',
			el: 'div.section-header>span.heading[data-text="heading"]>div.test^span.section-text[data-text="text"]',
			state: {
				heading: 'heading text  g f dsf dsf dsfdsf ',
				text: 'cookie kasse sdf dsf sdf dsf'
			},
			mount: '.container'
		})
		super(settings);
		View.emitter.on("view:action", this.onAction.bind(this));
	}
	onAction(e) {
		Log.fn("onAction",this, e);
	}
	onMouseEnter(e) {
		Log.fn('CookieAccept | onMouseEnter');
	}
	onClick(e) {
		Log.db("CookieAccept | onClick",Utils.cookie.get('cookietest'))
		this.setState({'heading': 'new heading'});
		e.preventDefault();
	}
}
class Updater extends View {
	constructor(settings = {}) {
		settings = settings || {};

		Object.assign(settings, {
			events: {
				'keyup .form-input': 'onKeyUp'
			},
			state: {
				'output': 'output container will we overwritten',
				'shown': false
			},
			displayName: 'Cookie-accept',
			el: 'div.form-container>input.form-input[placeholder="prøv at skrive noget"]+div.form-output[data-text="output"]',
			mount: '.container'
		})
		super(settings);
	}
	onKeyUp(e) {
		this.setState({ 'output': e.target.value });
	}
}

var tt = new View({el: '#testId1', displayName: 'tt'});

Log.db("TEST - id selector", tt);


//TESTS

var cookie = new CookieAccept();


let table1 = new Table({el: DOM.find('#table') });
let table2 = new Table({el: 'div.table-test.class2.class3>a.js--button{TEST cookie}'});
table2.render();

console.log("------ DOM test --------");

Log.db("TEST - hasClass", table1.hasClass('table'));
Log.db("TEST - hasClass", table1.hasClass('abe'));
Log.db("TEST - add class", table1.addClass('abe').hasClass('abe'));
Log.db("TEST remove class", table1.removeClass('abe').hasClass('abe'));

var section = DOM.closest(table1,'section');
Log.db("section", section);
DOM.addClass(section, 'extra-class');

Log.db('TEST getUrlParms', Utils.getUrlParms('t'));
Log.db('TEST getHeight', Utils.getHeight(table1) );
Log.db('TEST isElementInViewport', Utils.isElementInViewport(boxes[2]));
Log.db('TEST cumulativeOffset', Utils.cumulativeOffset(boxes[2]) );

Utils.cookie.set({cookieValue:23459875934857, cookieName:'cookietest'})
