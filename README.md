# BaseJS #

KernelJS is sorthvid's main view class used for small progressive enhanced web projects. Where HTML is already present at render time. 

## Download ##
Kerneljsorthvid is under MIT license and supports modern environments. All use in production environments is at own risk. 

### Install

```js
npm install --save kerneljsorthvid
```

## Consume it as an ES2015 module ##

```js
import { View } from 'kerneljsorthvid';

let Box extends View {
	get initialOptions() {
		return {
			events : {
				'click':'onClick'
			},
			displayName : 'Box'
		}
	}
	constructor(options){
		super(options);
	}
	onClick() {
		console.log('you clicked the box');
	}
}

new Box({el: document.querySelector('.box')})

```

## Events ##

## DOM - Utility functions for selecting, looping etc. 
We added a few wellknown functions from jQuery thanks to [you Might Not Need Jquery](http://youmightnotneedjquery.com/) for inspiration.

* find 
* closest
* append
* remove
* hasClass
* addClass
* removeClass
* toggleClass
* elementProxy
* listProxy

### find(arg1, arg2) ###
Proxies querySelectorAll, allways returns a element list (Array). 

@args:
* selector: String
* context: htmlElement to use as search context
```js
import DOM from 'kerneljsorthvid';

DOM.find('.box', DOM.find('.header'));
// -> all .box in .header
```

### closest ###
```js
import DOM from 'kerneljsorthvid';

var box = new Box({el: document.querySelector('.box')})

DOM.closest(box, 'article');
// -> closest <article> from the .box position in the dom tree. 
```

## Emmet templates ##

## Browser support ##
Internet Explorer 10+
Chrome latest
Safari latest
Firefox latest
Opera latest

## Comming releases ##
* 3.0.0: remove emmet and replace with literal string templates.   

## Changelog ##
* 2.1.1: added initialOptions as getter in viewClass, removed console.log in viewFactory
* 2.0.1: fixed small bugs
* 2.0.0: converted to ES6
* 1.0.0: first version 

## Todo ##
* Add covering unit test

## Auto-generated JS Documentation ##
See [documentation](documentation/js) for the project

