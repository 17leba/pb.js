(function(window,undefined){

	var toString = Object.prototype.toString,
		//事件列表
		readyList = [],
		DOMContentLoaded;

	var pb = function(selector,context){
		return new pb.fn.init(selector,context);
	}
	pb.fn = pb.prototype = {
		constructor:pb,
		selector:"",
		length:0,
		init:function(selector,context){
			var	ele;
			if(!selector){
				return this;
			}
			// getElementById getElementsByClassName querySelectorAll 
			if(typeof selector === "string"){
				if(this.isId(selector)){
					var arr = [];
					arr[arr.length] = this.isId(selector);
					this.selector = arr;
				}else if(document.querySelectorAll){
					ele = document.querySelectorAll(selector);
					this.selector = ele;
				}else{
					//IE6/7 class
					selector = selector.replace(".","");
					this.selector = getElementsByClassName(selector);
				}
			//selector 为函数则 返回 ready()
			}else if(isFunction(selector)){
				return pb(document).ready(selector);
			}else if(selector.nodeType){
				this.selector = selector;
				this.length = 1;
			}
			this.pushSelector(this.selector);
			return this;
		},
		isId:function(elem){
			var rgexp = /^#/;
			if(elem && typeof elem === "string" && rgexp.test(elem)){
				var elem = elem.replace("#","");
				return document.getElementById(elem);
			}
			return false;
		},
		ready:function(fn){
			readyList[readyList.length] = fn;
			if(document.addEventListener){
				document.addEventListener("DOMContentLoaded",DOMContentLoaded,false);
				window.addEventListener("load",DOMContentLoaded,false);
			}else{
				var top = false;
				try{
					top = window.frameElement == null && document.documentElement;
				}catch(e){}

				if(top && top.doScroll){
					(function(){
						if(!pb.isReady){
							try{
								top.doScroll("left");
							}catch(e){
								return setTimeout(arguments.callee,10);
							}
						}
						pb.ready();
					})()
				}
				document.attachEvent("onreadystatechange",DOMContentLoaded);
				window.attachEvent("onload",DOMContentLoaded);
			}
		},
		on:function(type,selector,fn){
			if(fn == null ){
				// (type,fn)
				fn = selector;
				selector = undefined;
			}else{
				// (type,selector,fn)
				this.selector = y(selector).parent();
			}
			return this.each(function(){
				pb.event.addHandler(this,type,fn);
			},this.length)
		},
		off:function(type,fn){
			return this.each(function(){
				pb.event.removeHandler(this,type,fn);
			},this.length)
		},
		trigger:function(type){
			if(document.createEvent){
				event = document.createEvent("Events");
				event.initEvent(type,false,false);
				this.selector.dispatchEvent(event);
			}else{
				this.selector.fireEvent("on" + type);
			}
		},
		parent:function(){
			return this.selector.parentNode;
		},
		html:function(html){
			if(html === undefined){
				// html()
				return this.selector.innerHTML;
			}
			if(html){
				// html("value")
				this.selector.innerHTML = html;
			}else{
				// html("")
				this.selector.innerHTML = "";
			}
		},
		pushSelector:function(elems){
			var arr = [],
				i = this.length;
			if(!elems){
				return;
			}
			for(var k = 0;k < elems.length;k++){
				arr.push(elems[k]);
			}
			for(var j = 0;j < arr.length;j++){
				this[i++] = arr[j];
			}
			this.length = i;
			return this;
		},
		each:function(fn,num){
			return this.eachInter(this,fn,num);
		},
		eachInter:function(obj,fn,num){
			// 遍历对象和数组
			// num 循环个数
			var length = obj.length,
				num = num || length,
				v;

			if(isArray(obj)){
				for(var i = 0;i < index;i++){
					v = fn.call(obj[i],i,obj[i]);
					if(v === false){
						break;
					}
				}
			}else{
				for(var i in obj){
					v = fn.call(obj[i],i,obj[i]);
					if(v === false || this.index(obj[i])+1 === num){
						break;
					}
				}
			}
			return obj;
		},
		index:function(obj){
			var length = this.length;
			for(var i = 0;i < length;i++){
				if(this[i] === obj){
					return i;
				}
			}
		},
		size:function(){
			return this.length;
		}
	}

	pb.fn.init.prototype = pb.fn;

	pb.extend = pb.fn.extend = function(){
		var target,copy,src,options,name,clone,copyIsArray,
			i = 1,
			target = arguments[0] || {},
			deep = false,
			length = arguments.length;
		if(typeof arguments[0] === "boolean"){
			//arguments[0] == true deepCopy
			deep = true;
			//跳过前两个参数 true target
			i = 2;
			target = arguments[1] || {};
		}
		if(i === length){
			//合并到pb对象
			target = this;
			//从第一个参数开始遍历
			--i;
		}
		for(;i < length;i++){
			if((options = arguments[i]) != null){
				for(name in options){
					src = target[name];
					copy = options[name];
					if(copy === target){
						continue;
					}
					if(!deep && copy !== undefined){
						target[name] = copy;
					}else if(deep && copy && (copyIsArray = isArray(copy) || isObject(copy))){
						if(copyIsArray){
							copyIsArray = false;
							clone = src && isArray(src) ? src : [];
						}else{
							clone = src && isObject(src) ? src : [];
						}
						target[name] = pb.extend(deep,clone,copy);
					}
				}
			}
		}
		return target;
	}

	pb.extend({
		isReady:false,
		ready:function(){
			if(pb.isReady){
				return;
			}
			pb.isReady = true;
			for(var i = 0; i < readyList.length;i++){
				var fn = readyList[i];
				fn();
			}
		}

	})

	pb.event = {
		addHandler:function(elem,type,fn){
			if(elem.addEventListener){
				elem.addEventListener(type,fn,false);
			}else if(elem.attachEvent){
				elem.attachEvent("on" + type,fn);
			}
		},
		removeHandler:function(elem,type,fn){
			if(elem.removeHandler){
				elem.removeHandler(type,fn,false);
			}else if(elem.detachEvent){
				elem.detachEvent("on" + type,fn);
			}
		}
	}
	
	// if(document.addEventListener){
	// 	DOMContentLoaded = function(){
	// 		document.removeEventListener("DOMContentLoaded",DOMContentLoaded,false)
	// 		pb.ready();
	// 	}
	// }else{
	// 	DOMContentLoaded = function(){
	// 		if(document.readyState === "complete"){
	// 			document.detachEvent("onreadystatechange",DOMContentLoaded)
	// 			pb.ready();
	// 		}
	// 	}
	// }
	DOMContentLoaded = function(){
		if(document.addEventListener){
			document.removeEventListener("DOMContentLoaded",DOMContentLoaded,false);
			pb.ready();
		}else if(document.readyState === "complete"){
			document.detachEvent("onreadystatechange",DOMContentLoaded);
			pb.ready();
		}
	}
	function isArray(obj){
		return toString.call(obj) === "[object Array]";
	}
	function isFunction(obj){
		return toString.call(obj) === "[object Function]";
	}
	function isObject(obj){
		return toString.call(obj) === "[object Object]";
	}
	function getElementsByClassName(className,node,tag){
		var node = node || document,
			tag = tag || "*",
			childs = node.getElementsByTagName(tag),
			arr = [],
			lengths = childs.length;
		for(var i = 0;i < lengths;i++){
			var classNames = childs[i].className.split(" "),
				length = classNames.length,
				child = childs[i];
			for(var j = 0;j < length;j++){
				if(classNames[j] === className){
					arr.push(child);
					break;
				}
			}
		}
		return arr;
	}

	window.y = window.pb = pb;

})(window)