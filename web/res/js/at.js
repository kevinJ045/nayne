/**
  * @author: kevinj045
  * @version: 1.0.0
  * At.js@1.0.0
  * 
*/


(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(global) :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = global || self, global.at = factory(global));
  }(this, (function (global) { 'use strict';
  
	// +++ 
	// + Helpers
	// +++
  
  
	var log = function(){
	  console.log.apply(console,arguments);
	};
  
	var warn = function(){
	  console.warn.apply(console,arguments);
	};
  
	var err = function(){
	  console.error.apply(console,arguments);
	}
  
	var error = function(err){
	  throw new Error(err);
	}
  
	function isNil(s){
	  return null == s;
	}
  
	function coerceToNumber(value) {
	  var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  
	  if (isNil(value)) {
		return defaultValue;
	  }
  
	  if (typeof value === 'number') {
		return value;
	  }
  
	  return Number(value);
	}
  
	function coerceToString(value) {
	  var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  
	  if (isNil(value)) {
		return defaultValue;
	  }
  
	  if (isString(value)) {
		return value;
	  }
  
	  return String(value);
	}
  
	function getPath(p){
	  if(!p) return "";
	  var path = p.match('/') ? p.split('/') : [p];
	  path.pop();
	  return path.join('/')+"/";
	}
  
	function getFileName(p){
	  if(!p) return "";
	  var path = p.match('/') ? p.split('/') : [p];
	  return path.pop();
	}
	
  
	var win = global instanceof Window ? global : window,
	doc = win.document,
	scr = doc.currentScript,
	currentPath = getPath(scr.src),
	scrPath = scr.src,
	scrName = getFileName(scr.src),
	scrUrl = new URL(scrPath),
	At = function At(){},
	_AT = {},
	$ = {},
	atEl = (function(){
	  var el = doc.createElement('at-el');
	  el.style.display = 'none';
	  el.style.position = 'fixed';
	  el.style.left = '-555555px';
	  el.style.top = '-555555px';
	  el.style.width = '0.00000001px';
	  el.style.height = '0.00000001px';
	  doc.body.appendChild(el);
	  return el;
	})(),
	JT = function(text) {
	  return JSON.stringify(text);
	},JP = function(text) {
	  return JSON.parse(text);
	},toArray = function(list) {
	  return Array.prototype.slice.call(list || [], 0);
	},randFrom = function(min,max) {
	  return Math.floor(Math.random()*(max-min+1)+min);
	},__construct = function(at){},
	forEachArr = function forEach(array,fn){
	  if(!array || !array instanceof Array ||
		!fn || typeof fn != "function") return;
	  if(array.forEach){
		array.forEach(fn);
		return;
	  }
	  var array = this;
	  for (var i = 0; i < array.length; i++) {
		fn(array[i],i);
	  }
	},
	findArr = function(array,fn){
	  if(!array || !array instanceof Array ||
		!fn || typeof fn != "function") return;
	  if(array.find){
		return array.find(fn);
	  }
	  var that = array,returns = null;
	  that.forEach(function(item){
		if(fn(item) == true){
		  returns = item;
		}
	  });
	  return returns;
	},
	filterArr = function(array,fn){
	  if(!array || !array instanceof Array ||
		!fn || typeof fn != "function") return;
	  if(array.filter){
		return array.filter(fn);
	  }
	  var that = this.valueOf(),returns = [];
	  that.forEach(function(item){
		if(fn(item) == true){
		  returns.push(item);
		}
	  });
	  return returns;
	},
	arrFinder = function(str){
	  var s = findArr(this,function(s){
		return s.toLowerCase() == str.toLowerCase();
	  });
	  return s ? true : false;
	},
	uid_index = 0,uid = "at0",
	provide = function Provider(p){
	  try{
		var provider = new Array();
		if(p.match(',')){
		  p = p.split(',');
		} else {
		  p = [p];
		}
		p.forEach(function(s){
		  if(s.charAt(0) == '@'){
			var cs = s.split('@')[1].toLowerCase();
			if(s.indexOf('[') > -1 && s.indexOf(']') > -1){
			  var ss = cs.split('[')[1].split(']')[0];
			  cs = cs.split('[')[0];
			  if(ss.match(' ')){
				ss = ss.split(' ');
			  } else {
				ss = [ss];
			  }
			  ss = ss;
			  ss.searchOf = arrFinder;
			  provider[cs] = ss;
			} else {
			  provider.push(cs);
			}
		  } else {
			provider.push(s);
		  }
		});
		if(p == "@all"){
		  provider = new Array('all');
		}
		provider.indexOf = arrFinder;
		return ["provide",provider];
	  } catch(e){
		return ["error",e];
	  }
	},
	Symbols = [["{{","}}"],["“","”"],["${|","|}"],["¶"],["…"],["ƒ"]],
	pluses = /\+/g,
	raw = function(s){
	  return s;
	},decoded = function(s) {
	  return decodeURIComponent(s.replace(pluses, ' '))
	},fileInput = function(onchange,readAs,options){
	  var settings = $.extend({
		name: null,
		multiple: false,
		accepts: false
	  },options),_readAs;
  
	  if(!onchange) return false;
	  if(!readAs) return false;
  
	  if(readAs == "text"){
		_readAs = "readAsText";
	  } else if(readAs == "data"){
		_readAs = "readAsDataURL";
	  } else if(readAs == "arrayBuffer"){
		_readAs = "readAsArrayBuffer";
	  } else if(readAs == "binaryString"){
		_readAs = "readAsBinaryString";
	  } else {
		error(readAs + " is not defined. try: text,data or arrayBuffer");
		return false;
	  }
  
	  var fileChooser = $("<input />",{
		'type': "file",
	  });
  
	  if(settings.multiple == true){
		fileChooser.attr("multiple","true");
	  } else {}
	  if(settings.accepts != null && settings.accepts != false){
		fileChooser.attr("accept",accepts);
	  } else {}
  
	  fileChooser.on("change",function(event){
		let files = event.target.files;
		if (!files || !files.length) {
		  return false;
		}
  
		files = toArray(files);
  
		files.forEach(function(file,index){
		  let reader = new FileReader()
		  reader.onload = function(evt){
			try {
			  onchange(evt,event,fileChooser);
			} catch (e) {
			  error(e);
			}
		  }
		  reader[_readAs](file)
		});
	  });
  
	  fileChooser.click();
  
	  return fileChooser;
	},pickRandom = function(){
	  var words = arguments;
	  if(words.length <= 1) return arguments[0];
	  if(arguments[0] instanceof Array) words = arguments[0];
	  var randomWord = toArray(words);
	  var rand = Math.floor(Math.random() * randomWord.length);
	  return randomWord[rand];
	},it = function(obj){
	  if(!obj) return null;
	  var g = typeof obj,
		  c = g.constructor,
		  n = c.name;
	  if(n == "String" || n == "Function" || n == "Array" || 
		n == "Number" || n == "Boolean") return null;
	  return n;
	},
	modulr = function(req,pro,fn,args){ // Requested,Provider,Function,Arguments
	  if(!fn) return function(){};
	  if(!req) req = ['any'];
	  if(!pro) pro = ['all'];
	  var r = function(){};
	  if(args){
		r = fn.apply(win,args);
	  } else {
		r = fn.apply(win,[win,doc,_AT]);
	  }
	  if(req[0] == 'any') return r;
	  if(pr('all') || pro.searchOf){
		req.forEach(function(req,i){
		  if(!pr('all') && !pro.searchOf('all') && !pro.searchOf(req)){
			r = null;
		  }
		});
	  } else {
		r = null;
	  }
	  return r;
	},
	decoded = function(s) {
	  return decodeURIComponent(s.replace(pluses, ' '))
	},regex = new (function regExpObj(){
	  var s = this;
	  s.latin = /[A-Z\xC0-\xD6\xD8-\xDE]?[a-z\xDF-\xF6\xF8-\xFF]+|[A-Z\xC0-\xD6\xD8-\xDE]+(?![a-z\xDF-\xF6\xF8-\xFF])|\d+/g,
	  s.nonLatin = /[^A-Za-z0-9]/g,
	  s.special = /[-[\]{}()*+!<=:?./\\^$|#,]/g,
	  s.ascii = /^[\x01-\xFF]*$/,
	  s.taglist = /<([A-Za-z0-9]+)>/g,
	  s.flags = /[gimuy]*$/,
	  s.trailing_zeros = /\.?0+$/g,
	  s.convSpec = /(%{1,2})(?:(\d+)\$)?(\+)?([ 0]|'.{1})?(-)?(\d+)?(?:\.(\d+))?([bcdiouxXeEfgGs])?/g,
	  s.htmlSpecial = /[<>&"'`]/g,
	  s.digit = '\\d',
	  s.whitespace = '\\s\\uFEFF\\xA0',
	  s.highSurrogate = '\\uD800-\\uDBFF',
	  s.lowSurrogate = '\\uDC00-\\uDFFF',
	  s.generalPunctuationBlock = '\\u2000-\\u206F',
	  s.nonCharacter = '\\x00-\\x2F\\x3A-\\x40\\x5B-\\x60\\x7b-\\xBF\\xD7\\xF7',
	  s.dingbatBlock = '\\u2700-\\u27BF',
	  s.lowerCaseLetter = 'a-z\\xB5\\xDF-\\xF6\\xF8-\\xFF\\u0101\\u0103\\u0105\\u0107\\u0109\\u010B\\u010D\\u010F\\u0111\\u0113\\u0115\\u0117\\u0119\\u011B\\u011D\\u011F\\u0121\\u0123\\u0125\\u0127\\u0129\\u012B\\u012D\\u012F\\u0131\\u0133\\u0135\\u0137\\u0138\\u013A\\u013C\\u013E\\u0140\\u0142\\u0144\\u0146\\u0148\\u0149\\u014B\\u014D\\u014F\\u0151\\u0153\\u0155\\u0157\\u0159\\u015B\\u015D\\u015F\\u0161\\u0163\\u0165\\u0167\\u0169\\u016B\\u016D\\u016F\\u0171\\u0173\\u0175\\u0177\\u017A\\u017C\\u017E-\\u0180\\u0183\\u0185\\u0188\\u018C\\u018D\\u0192\\u0195\\u0199-\\u019B\\u019E\\u01A1\\u01A3\\u01A5\\u01A8\\u01AA\\u01AB\\u01AD\\u01B0\\u01B4\\u01B6\\u01B9\\u01BA\\u01BD-\\u01BF\\u01C6\\u01C9\\u01CC\\u01CE\\u01D0\\u01D2\\u01D4\\u01D6\\u01D8\\u01DA\\u01DC\\u01DD\\u01DF\\u01E1\\u01E3\\u01E5\\u01E7\\u01E9\\u01EB\\u01ED\\u01EF\\u01F0\\u01F3\\u01F5\\u01F9\\u01FB\\u01FD\\u01FF\\u0201\\u0203\\u0205\\u0207\\u0209\\u020B\\u020D\\u020F\\u0211\\u0213\\u0215\\u0217\\u0219\\u021B\\u021D\\u021F\\u0221\\u0223\\u0225\\u0227\\u0229\\u022B\\u022D\\u022F\\u0231\\u0233-\\u0239\\u023C\\u023F\\u0240\\u0242\\u0247\\u0249\\u024B\\u024D\\u024F',
	  s.upperCaseLetter = '\\x41-\\x5a\\xc0-\\xd6\\xd8-\\xde\\u0100\\u0102\\u0104\\u0106\\u0108\\u010a\\u010c\\u010e\\u0110\\u0112\\u0114\\u0116\\u0118\\u011a\\u011c\\u011e\\u0120\\u0122\\u0124\\u0126\\u0128\\u012a\\u012c\\u012e\\u0130\\u0132\\u0134\\u0136\\u0139\\u013b\\u013d\\u013f\\u0141\\u0143\\u0145\\u0147\\u014a\\u014c\\u014e\\u0150\\u0152\\u0154\\u0156\\u0158\\u015a\\u015c\\u015e\\u0160\\u0162\\u0164\\u0166\\u0168\\u016a\\u016c\\u016e\\u0170\\u0172\\u0174\\u0176\\u0178\\u0179\\u017b\\u017d\\u0181\\u0182\\u0184\\u0186\\u0187\\u0189-\\u018b\\u018e-\\u0191\\u0193\\u0194\\u0196-\\u0198\\u019c\\u019d\\u019f\\u01a0\\u01a2\\u01a4\\u01a6\\u01a7\\u01a9\\u01ac\\u01ae\\u01af\\u01b1-\\u01b3\\u01b5\\u01b7\\u01b8\\u01bc\\u01c4\\u01c5\\u01c7\\u01c8\\u01ca\\u01cb\\u01cd\\u01cf\\u01d1\\u01d3\\u01d5\\u01d7\\u01d9\\u01db\\u01de\\u01e0\\u01e2\\u01e4\\u01e6\\u01e8\\u01ea\\u01ec\\u01ee\\u01f1\\u01f2\\u01f4\\u01f6-\\u01f8\\u01fa\\u01fc\\u01fe\\u0200\\u0202\\u0204\\u0206\\u0208\\u020a\\u020c\\u020e\\u0210\\u0212\\u0214\\u0216\\u0218\\u021a\\u021c\\u021e\\u0220\\u0222\\u0224\\u0226\\u0228\\u022a\\u022c\\u022e\\u0230\\u0232\\u023a\\u023b\\u023d\\u023e\\u0241\\u0243-\\u0246\\u0248\\u024a\\u024c\\u024e',
	  s.surrogateParts = (function(){
		return new RegExp('([' + s.highSurrogate + '])([' + s.lowSurrogate + '])', 'g')
	  }),
	  s.regDig = (function(){
		return new RegExp('^' + s.digit + '+$');
	  })(),
	  s.regWhite = (function(){
		return new RegExp('[' + s.whitespace + ']');
	  })(),
	  s.trimRight = (function(){
		return new RegExp('[' + s.whitespace + ']+$');
	  })(),
	  s.trimLeft = (function(){
		return new RegExp('^[' + s.whitespace + ']+');
	  })(),
	  s.base = '\\0-\\u02FF\\u0370-\\u1AAF\\u1B00-\\u1DBF\\u1E00-\\u20CF\\u2100-\\uD7FF\\uE000-\\uFE1F\\uFE30-\\uFFFF',
	  s.diacriticalMark = '\\u0300-\\u036F\\u1AB0-\\u1AFF\\u1DC0-\\u1DFF\\u20D0-\\u20FF\\uFE20-\\uFE2F',
	  s.marks = (function(){
		return new RegExp(
		  '([' +
			s.base +
			']|[' +
			s.highSurrogate +
			'][' +
			s.lowSurrogate +
			']|[' +
			s.highSurrogate +
			'](?![' +
			s.lowSurrogate +
			'])|(?:[^' +
			s.highSurrogate +
			']|^)[' +
			s.lowSurrogate +
			'])([' +
			s.diacriticalMark +
			']+)',
		  'g'
		);
	  })(),
	  s.unicode = (function(){
		return new RegExp(
		  '((?:[' +
			s.base +
			']|[' +
			s.highSurrogate +
			'][' +
			s.lowSurrogate +
			']|[' +
			s.highSurrogate +
			'](?![' +
			s.lowSurrogate +
			'])|(?:[^' +
			s.highSurrogate +
			']|^)[' +
			s.lowSurrogate +
			'])(?:[' +
			s.diacriticalMark +
			']+))|\
		([' +
			s.highSurrogate +
			'][' +
			s.lowSurrogate +
			'])|\
		([\\n\\r\\u2028\\u2029])|\
		(.)',
		  'g'
		);
	  })(),
	  s.word = (function(){
		return new RegExp(
		'(?:[' +
		  s.upperCaseLetter +
		  '][' +
		  s.diacriticalMark +
		  ']*)?(?:[' +
		  s.lowerCaseLetter +
		  '][' +
		  s.diacriticalMark +
		  ']*)+|\
	  (?:[' +
		  s.upperCaseLetter +
		  '][' +
		  s.diacriticalMark +
		  ']*)+(?![' +
		  s.lowerCaseLetter +
		  '])|\
	  [' +
		  s.digit +
		  ']+|\
	  [' +
		  s.dingbatBlock +
		  ']|\
	  [^' +
		  s.nonCharacter +
		  s.generalPunctuationBlock +
		  s.whitespace +
		  ']+',
		'g'
	  )
	  })()
	})(),
	worder = function(string,sign){
	  if(!string.match(' ')) return string;
	  return string.split(' ').join(sign);
	},
	toCamelCase = function toCamelCase(string) {
	  return string.toLowerCase().replace(/-(.)/g, function (match, group1) { return group1.toUpperCase(); });
	},
	toKebabCase = function toKebabCase(string){
	  return worder(string,'-');
	},
	toSnakeCase = function toSnakeCase(string){
	  return worder(string,'_');
	},
	toSwapCase = function toSwapCase(string){
	  if(string == "") return "";
	  return string.split('').reduce(function(swapped, character){
		const lowerCase = character.toLowerCase();
		const upperCase = character.toUpperCase();
		return swapped + (character === lowerCase ? upperCase : lowerCase);
	  }, '');
	},
	capitalize = function capitalize(string,restToLower){
	  const restToLowerCaseBoolean = Boolean(restToLower);
	  if (string === '') {
		return '';
	  }
	  if (restToLowerCaseBoolean) {
		string = string.toLowerCase();
	  }
	  return string.substr(0, 1).toUpperCase() + string.substr(1);
	},
	toTitleCase = function toTitleCase(string,noSplit){
	  if(string == "") return '';
	  const noSplitArray = Array.isArray(noSplit) ? noSplit : [];
	  const wordsRegExp = regex.ascii.test(string) ? regex.latin : regex.word;
	  return string.replace(wordsRegExp, function(word, index) {
		const isNoSplit = index > 0 && noSplitArray.indexOf(string[index - 1]) >= 0;
		return isNoSplit ? word.toLowerCase() : capitalize(word, true);
	  });
	},
	_createClass = function () { 
	  function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
		  var descriptor = props[i];
		  descriptor.enumerable = descriptor.enumerable || false;
		  descriptor.configurable = true; 
		  if ("value" in descriptor)
			descriptor.writable = true;
		  Object.defineProperty(target, descriptor.key, descriptor);
		}
	  }
	  return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);
		if (staticProps) defineProperties(Constructor, staticProps);
		return Constructor; 
	  }; 
	}();
  
	// +++ 
	// + Utils
	// +++
  
	const Utils = new (function AtUtils(){
	  var that = this,
	  utils = that;
	  utils.Event = function(event,eventData){
		var evt;
		try {
		  evt = new win.CustomEvent(event, {
			detail: eventData,
			bubbles: true,
			cancelable: true,
		  });
		} catch (e) {
		  evt = doc.createEvent('Event');
		  evt.initEvent(event, true, true);
		  evt.detail = eventData;
		}
		return evt;
	  }
	  utils.validateElement = function validateElement(el){
		var $el;
		if(typeof el == "string"){
		  $el = $(el);
		} else {
		  if(el instanceof Utils.AtDomConstructor){
			$el = el;
		  } else if(el instanceof HTMLElement){
			$el = $(el);
		  } else {
			return false;
		  }
		}
  
		return $el;
	  };
	  utils.isEmptyObject = function( obj ) {
		var name;
  
		for ( name in obj ) {
		  return false;
		}
		return true;
	  };
	  utils.isEqual = function isEqual(var1,variable){
		if(!var1 || !variable) return false;
		var bool = true;
		var m = var1.valueOf();
		var notp = typeof m != 'string' && typeof m != 'number' && typeof m != 'boolean';
		if(m instanceof Array && typeof m == 'object' && notp){
		  if(typeof variable != 'object' && !variable instanceof Array) return false;
		  m.forEach(function(item,index){
			if(typeof variable[index] == 'function' && typeof item == 'function'){
			  bool = bool && true;
			} else {
			  if(!variable[index]) {bool = bool && false; return;};
			  bool = bool && utils.isEqual(variable[index],item);
			}
		  });
		} else if(m instanceof Object && typeof m == 'object' && notp){
		  if(typeof variable != 'object' || variable instanceof Array || notp == false) return false;
		  for(var i in m){
			if(typeof variable[i] == 'function' && typeof m[i] == 'function'){
			  bool = bool && true;
			} else {
			  bool = bool && (i in variable && utils.isEqual(m[i],variable[i]));
			}
		  }
		} else if(!notp){
		  bool = variable == m;
		} else {
		  bool = variable == m;
		}
		return bool;
	  };
	  utils.isset = function(variable){
		return null != variable;
	  };
	  utils.empty = function(variable){
		if(!utils.isset(variable)) return false;
		return variable == null || variable == "" || variable == {} || variable == [] || variable == function(){};
	  };
	  utils.isFun = function(fn){
		return typeof fn == "function";
	  };
	  utils.isNum = function(s){
		return typeof s == "number";
	  }
	  utils.isNull = function(s){
		return typeof s == "null";
	  }
	  utils.isStr = function(s){
		return typeof s == "string";
	  }
	  utils.isBool = function(s){
		return typeof s == "boolean";
	  }
	  utils.isUnd = function(s){
		return typeof s == "undefined";
	  }
	  utils.defineElementGetter = function defineElementGetter(obj, prop, getter,
	  defineHidden,defineGetter) {
		if(!defineHidden) defineHidden = false;
		if(!defineGetter) defineGetter = 1;
		if(defineHidden == "_true"){
		  Object.defineProperty(obj, prop, {
			get: function(){
			  return getter;
			},
			enumerable: true,
		  });
  
		  return;
		} else{}
  
		if (Object.defineProperty && Number(defineGetter) == 1) {
		  Object.defineProperty(obj, prop, {
			get: getter,
			enumerable: defineHidden
		  });
		} else {
		  obj.__defineGetter__(prop, getter);
		}
	  };
	  utils.Template = (function(){
		var ctxUnAtd;
		if (typeof win !== 'undefined') {
		  ctxUnAtd = win;
		} else if (typeof global !== 'undefined') {
		  ctxUnAtd = global;
		} else {
		  ctxUnAtd = undefined;
		}
  
		var At_TemplateContext = ctxUnAtd;
  
		var At_TemplateUtils = {
		  quoteSingleRexExp: new RegExp('\'', 'g'),
		  quoteDoubleRexExp: new RegExp('"', 'g'),
		  isFunction: function isFunction(func) {
			return typeof func === 'function';
		  },
		  escape: function escape(string) {
			if ( string === void 0 ) string = '';
  
			return string
			  .replace(/&/g, '&amp;')
			  .replace(/</g, '&lt;')
			  .replace(/>/g, '&gt;')
			  .replace(/"/g, '&quot;')
			  .replace(/'/g, '&#039;');
		  },
		  helperToSlats: function helperToSlats(string) {
			var quoteDoubleRexExp = At_TemplateUtils.quoteDoubleRexExp;
			var quoteSingleRexExp = At_TemplateUtils.quoteSingleRexExp;
			var helperParts = string.replace(/[{}@}]/g, '').trim().split(' ');
			var slices = [];
			var shiftIndex;
			var i;
			var j;
			for (i = 0; i < helperParts.length; i += 1) {
			  var part = helperParts[i];
			  var blockQuoteRegExp = (void 0);
			  var openingQuote = (void 0);
			  if (i === 0) { slices.push(part); }
			  else if (part.indexOf('"') === 0 || part.indexOf('\'') === 0) {
				blockQuoteRegExp = part.indexOf('"') === 0 ? quoteDoubleRexExp : quoteSingleRexExp;
				openingQuote = part.indexOf('"') === 0 ? '"' : '\'';
				// Plain String
				if (part.match(blockQuoteRegExp).length === 2) {
				  // One word string
				  slices.push(part);
				} else {
				  // Find closed Index
				  shiftIndex = 0;
				  for (j = i + 1; j < helperParts.length; j += 1) {
					part += " " + (helperParts[j]);
					if (helperParts[j].indexOf(openingQuote) >= 0) {
					  shiftIndex = j;
					  slices.push(part);
					  break;
					}
				  }
				  if (shiftIndex) { i = shiftIndex; }
				}
			  } else if (part.indexOf('=') > 0) {
				// Hash
				var hashParts = part.split('=');
				var hashName = hashParts[0];
				var hashContent = hashParts[1];
				if (!blockQuoteRegExp) {
				  blockQuoteRegExp = hashContent.indexOf('"') === 0 ? quoteDoubleRexExp : quoteSingleRexExp;
				  openingQuote = hashContent.indexOf('"') === 0 ? '"' : '\'';
				}
				if (hashContent.match(blockQuoteRegExp).length !== 2) {
				  shiftIndex = 0;
				  for (j = i + 1; j < helperParts.length; j += 1) {
					hashContent += " " + (helperParts[j]);
					if (helperParts[j].indexOf(openingQuote) >= 0) {
					  shiftIndex = j;
					  break;
					}
				  }
				  if (shiftIndex) { i = shiftIndex; }
				}
				var hash = [hashName, hashContent.replace(blockQuoteRegExp, '')];
				slices.push(hash);
			  } else {
				// Plain variable
				slices.push(part);
			  }
			}
			return slices;
		  },
		  stringToBlocks: function stringToBlocks(string) {
			var blocks = [];
			var i;
			var j;
			if (!string) { return []; }
			var stringBlocks = string.split(/({{[^{^}]*}})/);
			for (i = 0; i < stringBlocks.length; i += 1) {
			  var block = stringBlocks[i];
			  if (block === '') { continue; }
			  if (block.indexOf('{{') < 0) {
				blocks.push({
				  type: 'plain',
				  content: block,
				});
			  } else {
				if (block.indexOf('{/') >= 0) {
				  continue;
				}
				block = block
				  .replace(/{{([@/])*([ ])*/, '{{$1')
				  .replace(/([ ])*}}/, '}}');
				if (block.indexOf('{@') < 0 && block.indexOf(' ') < 0 && block.indexOf('else') < 0) {
				  // Simple variable
				  blocks.push({
					type: 'variable',
					contextName: block.replace(/[{}]/g, ''),
				  });
				  continue;
				}
				// Helpers
				var helperSlats = At_TemplateUtils.helperToSlats(block);
				var helperName = helperSlats[0];
				var isPartial = helperName === '>';
				var helperContext = [];
				var helperHash = {};
				for (j = 1; j < helperSlats.length; j += 1) {
				  var slice = helperSlats[j];
				  if (Array.isArray(slice)) {
					// Hash
					helperHash[slice[0]] = slice[1] === 'false' ? false : slice[1];
				  } else {
					helperContext.push(slice);
				  }
				}
  
				if (block.indexOf('{@') >= 0) {
				  // Condition/Helper
				  var helperContent = '';
				  var elseContent = '';
				  var toSkip = 0;
				  var shiftIndex = (void 0);
				  var foundClosed = false;
				  var foundElse = false;
				  var depth = 0;
				  for (j = i + 1; j < stringBlocks.length; j += 1) {
					if (stringBlocks[j].indexOf('{{@') >= 0) {
					  depth += 1;
					}
					if (stringBlocks[j].indexOf('{{/') >= 0) {
					  depth -= 1;
					}
					if (stringBlocks[j].indexOf(("{{@" + helperName)) >= 0) {
					  helperContent += stringBlocks[j];
					  if (foundElse) { elseContent += stringBlocks[j]; }
					  toSkip += 1;
					} else if (stringBlocks[j].indexOf(("{{/" + helperName)) >= 0) {
					  if (toSkip > 0) {
						toSkip -= 1;
						helperContent += stringBlocks[j];
						if (foundElse) { elseContent += stringBlocks[j]; }
					  } else {
						shiftIndex = j;
						foundClosed = true;
						break;
					  }
					} else if (stringBlocks[j].indexOf('else') >= 0 && depth === 0) {
					  foundElse = true;
					} else {
					  if (!foundElse) { helperContent += stringBlocks[j]; }
					  if (foundElse) { elseContent += stringBlocks[j]; }
					}
				  }
				  if (foundClosed) {
					if (shiftIndex) { i = shiftIndex; }
					if (helperName === 'raw') {
					  blocks.push({
						type: 'plain',
						content: helperContent,
					  });
					} else {
					  blocks.push({
						type: 'helper',
						helperName: helperName,
						contextName: helperContext,
						content: helperContent,
						inverseContent: elseContent,
						hash: helperHash,
					  });
					}
				  }
				} else if (block.indexOf(' ') > 0) {
				  if (isPartial) {
					helperName = '_partial';
					if (helperContext[0]) {
					  if (helperContext[0].indexOf('[') === 0) { helperContext[0] = helperContext[0].replace(/[[\]]/g, ''); }
					  else { helperContext[0] = "\"" + (helperContext[0].replace(/"|'/g, '')) + "\""; }
					}
				  }
				  blocks.push({
					type: 'helper',
					helperName: helperName,
					contextName: helperContext,
					hash: helperHash,
				  });
				}
			  }
			}
			return blocks;
		  },
		  parseJsVariable: function parseJsVariable(expression, replace, object) {
			return expression.split(/([+ \-*/^()&=|<>!%:?])/g).reduce(function (arr, part) {
			  if (!part) {
				return arr;
			  }
			  if (part.indexOf(replace) < 0) {
				arr.push(part);
				return arr;
			  }
			  if (!object) {
				arr.push(JSON.stringify(''));
				return arr;
			  }
  
			  var variable = object;
			  if (part.indexOf((replace + ".")) >= 0) {
				part.split((replace + "."))[1].split('.').forEach(function (partName) {
				  if (partName in variable) { variable = variable[partName]; }
				  else { variable = undefined; }
				});
			  }
			  if (
				(typeof variable === 'string')
				|| Array.isArray(variable)
				|| (variable.constructor && variable.constructor === Object)
			  ) {
				variable = JSON.stringify(variable);
			  }
			  if (variable === undefined) { variable = 'undefined'; }
  
			  arr.push(variable);
			  return arr;
			}, []).join('');
  
		  },
		  parseJsParents: function parseJsParents(expression, parents) {
			return expression.split(/([+ \-*^()&=|<>!%:?])/g).reduce(function (arr, part) {
			  if (!part) {
				return arr;
			  }
  
			  if (part.indexOf('../') < 0) {
				arr.push(part);
				return arr;
			  }
  
			  if (!parents || parents.length === 0) {
				arr.push(JSON.stringify(''));
				return arr;
			  }
  
			  var levelsUp = part.split('../').length - 1;
			  var parentData = levelsUp > parents.length ? parents[parents.length - 1] : parents[levelsUp - 1];
  
			  var variable = parentData;
			  var parentPart = part.replace(/..\//g, '');
			  parentPart.split('.').forEach(function (partName) {
				if (typeof variable[partName] !== 'undefined') { variable = variable[partName]; }
				else { variable = 'undefined'; }
			  });
			  if (variable === false || variable === true) {
				arr.push(JSON.stringify(variable));
				return arr;
			  }
			  if (variable === null || variable === 'undefined') {
				arr.push(JSON.stringify(''));
				return arr;
			  }
			  arr.push(JSON.stringify(variable));
			  return arr;
			}, []).join('');
		  },
		  getCompileVar: function getCompileVar(name, ctx, data) {
			if ( data === void 0 ) data = 'data_1';
  
			var variable = ctx;
			var parts;
			var levelsUp = 0;
			var newDepth;
			if (name.indexOf('../') === 0) {
			  levelsUp = name.split('../').length - 1;
			  newDepth = variable.split('_')[1] - levelsUp;
			  variable = "ctx_" + (newDepth >= 1 ? newDepth : 1);
			  parts = name.split('../')[levelsUp].split('.');
			} else if (name.indexOf('@global') === 0) {
			  variable = 'At_Template.global';
			  parts = name.split('@global.')[1].split('.');
			} else if (name.indexOf('@root') === 0) {
			  variable = 'root';
			  parts = name.split('@root.')[1].split('.');
			} else {
			  parts = name.split('.');
			}
			for (var i = 0; i < parts.length; i += 1) {
			  var part = parts[i];
			  if (part.indexOf('@') === 0) {
				var dataLevel = data.split('_')[1];
				if (levelsUp > 0) {
				  dataLevel = newDepth;
				}
				if (i > 0) {
				  variable += "[(data_" + dataLevel + " && data_" + dataLevel + "." + (part.replace('@', '')) + ")]";
				} else {
				  variable = "(data_" + dataLevel + " && data_" + dataLevel + "." + (part.replace('@', '')) + ")";
				}
			  } else if (Number.isFinite ? Number.isFinite(part) : At_TemplateContext.isFinite(part)) {
				variable += "[" + part + "]";
			  } else if (part === 'this' || part.indexOf('this.') >= 0 || part.indexOf('this[') >= 0 || part.indexOf('this(') >= 0) {
				variable = part.replace('this', ctx);
			  } else {
				variable += "." + part;
			  }
			}
			return variable;
		  },
		  getCompiledArguments: function getCompiledArguments(contextArray, ctx, data) {
			var arr = [];
			for (var i = 0; i < contextArray.length; i += 1) {
			  if (/^['"]/.test(contextArray[i])) { arr.push(contextArray[i]); }
			  else if (/^(true|false|\d+)$/.test(contextArray[i])) { arr.push(contextArray[i]); }
			  else {
				arr.push(At_TemplateUtils.getCompileVar(contextArray[i], ctx, data));
			  }
			}
  
			return arr.join(', ');
		  },
		};
  
		/* eslint no-eval: "off" */
  
		var At_TemplateHelpers = {
		  _partial: function _partial(partialName, options) {
			var ctx = this;
			var p = At_TemplateClass.partials[partialName];
			if (!p || (p && !p.template)) { return ''; }
			if (!p.compiled) {
			  p.compiled = new At_TemplateClass(p.template).compile();
			}
			Object.keys(options.hash).forEach(function (hashName) {
			  ctx[hashName] = options.hash[hashName];
			});
			return p.compiled(ctx, options.data, options.root);
		  },
		  escape: function escape(context) {
			if (typeof context === 'undefined' || context === null) { return ''; }
			if (typeof context !== 'string') {
			  error('At_Template: Passed context to "escape" helper should be a string');
			}
			return At_TemplateUtils.escape(context);
		  },
		  if: function if$1(context, options) {
			var ctx = context;
			if (At_TemplateUtils.isFunction(ctx)) { ctx = ctx.call(this); }
			if (ctx) {
			  return options.fn(this, options.data);
			}
  
			return options.inverse(this, options.data);
		  },
		  unless: function unless(context, options) {
			var ctx = context;
			if (At_TemplateUtils.isFunction(ctx)) { ctx = ctx.call(this); }
			if (!ctx) {
			  return options.fn(this, options.data);
			}
  
			return options.inverse(this, options.data);
		  },
		  each: function each(context, options) {
			var ctx = context;
			var ret = '';
			var i = 0;
			if (At_TemplateUtils.isFunction(ctx)) { ctx = ctx.call(this); }
			if (Array.isArray(ctx)) {
			  if (options.hash.reverse) {
				ctx = ctx.reverse();
			  }
			  for (i = 0; i < ctx.length; i += 1) {
				ret += options.fn(ctx[i], { first: i === 0, last: i === ctx.length - 1, index: i });
			  }
			  if (options.hash.reverse) {
				ctx = ctx.reverse();
			  }
			} else {
			  // eslint-disable-next-line
			  for (var key in ctx) {
				i += 1;
				ret += options.fn(ctx[key], { key: key });
			  }
			}
			if (i > 0) { return ret; }
			return options.inverse(this);
		  },
		  with: function with$1(context, options) {
			var ctx = context;
			if (At_TemplateUtils.isFunction(ctx)) { ctx = context.call(this); }
			return options.fn(ctx);
		  },
		  join: function join(context, options) {
			var ctx = context;
			if (At_TemplateUtils.isFunction(ctx)) { ctx = ctx.call(this); }
			return ctx.join(options.hash.delimiter || options.hash.delimeter);
		  },
		  js: function js(expression, options) {
			var data = options.data;
			var func;
			var execute = expression;
			('index first last key').split(' ').forEach(function (prop) {
			  if (typeof data[prop] !== 'undefined') {
				var re1 = new RegExp(("this.@" + prop), 'g');
				var re2 = new RegExp(("@" + prop), 'g');
				execute = execute
				  .replace(re1, JSON.stringify(data[prop]))
				  .replace(re2, JSON.stringify(data[prop]));
			  }
			});
			if (options.root && execute.indexOf('@root') >= 0) {
			  execute = At_TemplateUtils.parseJsVariable(execute, '@root', options.root);
			}
			if (execute.indexOf('@global') >= 0) {
			  execute = At_TemplateUtils.parseJsVariable(execute, '@global', At_TemplateContext.At_Template.global);
			}
			if (execute.indexOf('../') >= 0) {
			  execute = At_TemplateUtils.parseJsParents(execute, options.parents);
			}
			if (execute.indexOf('return') >= 0) {
			  func = "(function(){" + execute + "})";
			} else {
			  func = "(function(){return (" + execute + ")})";
			}
			return eval(func).call(this);
		  },
		  js_if: function js_if(expression, options) {
			var data = options.data;
			var func;
			var execute = expression;
			('index first last key').split(' ').forEach(function (prop) {
			  if (typeof data[prop] !== 'undefined') {
				var re1 = new RegExp(("this.@" + prop), 'g');
				var re2 = new RegExp(("@" + prop), 'g');
				execute = execute
				  .replace(re1, JSON.stringify(data[prop]))
				  .replace(re2, JSON.stringify(data[prop]));
			  }
			});
			if (options.root && execute.indexOf('@root') >= 0) {
			  execute = At_TemplateUtils.parseJsVariable(execute, '@root', options.root);
			}
			if (execute.indexOf('@global') >= 0) {
			  execute = At_TemplateUtils.parseJsVariable(execute, '@global', At_TemplateContext.At_Template.global);
			}
			if (execute.indexOf('../') >= 0) {
			  execute = At_TemplateUtils.parseJsParents(execute, options.parents);
			}
			if (execute.indexOf('return') >= 0) {
			  func = "(function(){" + execute + "})";
			} else {
			  func = "(function(){return (" + execute + ")})";
			}
			var condition = eval(func).call(this);
			if (condition) {
			  return options.fn(this, options.data);
			}
  
			return options.inverse(this, options.data);
		  },
		};
		At_TemplateHelpers.js_compare = At_TemplateHelpers.js_if;
  
		var At_TemplateOptions = {};
		var At_TemplatePartials = {};
  
		var At_TemplateClass = function At_TemplateClass(template) {
		  var t = this;
		  t.template = template;
		};
  
		var staticAccessors = { options: { configurable: true },partials: { configurable: true },helpers: { configurable: true } };
		At_TemplateClass.prototype.compile = function compile (template, depth) {
			if ( template === void 0 ) template = this.template;
			if ( depth === void 0 ) depth = 1;
  
		  var t = this;
		  if (t.compiled) { return t.compiled; }
  
		  if (typeof template !== 'string') {
			error('At_Template: Template must be a string');
		  }
		  var stringToBlocks = At_TemplateUtils.stringToBlocks;
			var getCompileVar = At_TemplateUtils.getCompileVar;
			var getCompiledArguments = At_TemplateUtils.getCompiledArguments;
  
		  var blocks = stringToBlocks(template);
		  var ctx = "ctx_" + depth;
		  var data = "data_" + depth;
		  if (blocks.length === 0) {
			return function empty() { return ''; };
		  }
  
		  function getCompileFn(block, newDepth) {
			if (block.content) { return t.compile(block.content, newDepth); }
			return function empty() { return ''; };
		  }
		  function getCompileInverse(block, newDepth) {
			if (block.inverseContent) { return t.compile(block.inverseContent, newDepth); }
			return function empty() { return ''; };
		  }
  
		  var resultString = '';
		  if (depth === 1) {
			resultString += "(function (" + ctx + ", " + data + ", root) {\n";
		  } else {
			resultString += "(function (" + ctx + ", " + data + ") {\n";
		  }
		  if (depth === 1) {
			resultString += 'function isArray(arr){return Array.isArray(arr);}\n';
			resultString += 'function isFunction(func){return (typeof func === \'function\');}\n';
			resultString += 'function c(val, ctx) {if (typeof val !== "undefined" && val !== null) {if (isFunction(val)) {return val.call(ctx);} else return val;} else return "";}\n';
			resultString += 'root = root || ctx_1 || {};\n';
		  }
		  resultString += 'var r = \'\';\n';
		  var i;
		  for (i = 0; i < blocks.length; i += 1) {
			var block = blocks[i];
			// Plain block
			if (block.type === 'plain') {
			  // eslint-disable-next-line
			  resultString += "r +='" + ((block.content).replace(/\r/g, '\\r').replace(/\n/g, '\\n').replace(/'/g, '\\' + '\'')) + "';";
			  continue;
			}
			var variable = (void 0);
			var compiledArguments = (void 0);
			// Variable block
			if (block.type === 'variable') {
			  variable = getCompileVar(block.contextName, ctx, data);
			  resultString += "r += c(" + variable + ", " + ctx + ");";
			}
			// Helpers block
			if (block.type === 'helper') {
			  var parents = (void 0);
			  if (ctx !== 'ctx_1') {
				var level = ctx.split('_')[1];
				var parentsString = "ctx_" + (level - 1);
				for (var j = level - 2; j >= 1; j -= 1) {
				  parentsString += ", ctx_" + j;
				}
				parents = "[" + parentsString + "]";
			  } else {
				parents = "[" + ctx + "]";
			  }
			  var dynamicHelper = (void 0);
			  if (block.helperName.indexOf('[') === 0) {
				block.helperName = getCompileVar(block.helperName.replace(/[[\]]/g, ''), ctx, data);
				dynamicHelper = true;
			  }
			  if (dynamicHelper || block.helperName in At_TemplateHelpers) {
				compiledArguments = getCompiledArguments(block.contextName, ctx, data);
				resultString += "r += (At_TemplateHelpers" + (dynamicHelper ? ("[" + (block.helperName) + "]") : ("." + (block.helperName))) + ").call(" + ctx + ", " + (compiledArguments && ((compiledArguments + ", "))) + "{hash:" + (JSON.stringify(block.hash)) + ", data: " + data + " || {}, fn: " + (getCompileFn(block, depth + 1)) + ", inverse: " + (getCompileInverse(block, depth + 1)) + ", root: root, parents: " + parents + "});";
			  } else if (block.contextName.length > 0) {
				error(("At_Template: Missing helper: \"" + (block.helperName) + "\""));
			  } else {
				variable = getCompileVar(block.helperName, ctx, data);
				resultString += "if (" + variable + ") {";
				resultString += "if (isArray(" + variable + ")) {";
				resultString += "r += (At_TemplateHelpers.each).call(" + ctx + ", " + variable + ", {hash:" + (JSON.stringify(block.hash)) + ", data: " + data + " || {}, fn: " + (getCompileFn(block, depth + 1)) + ", inverse: " + (getCompileInverse(block, depth + 1)) + ", root: root, parents: " + parents + "});";
				resultString += '}else {';
				resultString += "r += (At_TemplateHelpers.with).call(" + ctx + ", " + variable + ", {hash:" + (JSON.stringify(block.hash)) + ", data: " + data + " || {}, fn: " + (getCompileFn(block, depth + 1)) + ", inverse: " + (getCompileInverse(block, depth + 1)) + ", root: root, parents: " + parents + "});";
				resultString += '}}';
			  }
			}
		  }
		  resultString += '\nreturn r;})';
  
		  if (depth === 1) {
			// eslint-disable-next-line
			t.compiled = eval(resultString);
			return t.compiled;
		  }
		  return resultString;
		};
		staticAccessors.options.get = function () {
		  return At_TemplateOptions;
		};
		staticAccessors.partials.get = function () {
		  return At_TemplatePartials;
		};
		staticAccessors.helpers.get = function () {
		  return At_TemplateHelpers;
		};
  
		Object.defineProperties( At_TemplateClass, staticAccessors );
  
		function At_Template() {
		  var args = [], len = arguments.length;
		  while ( len-- ) args[ len ] = arguments[ len ];
  
		  var template = args[0];
		  var data = args[1];
		  if (args.length === 2) {
			var instance = new At_TemplateClass(template);
			var rendered = instance.compile()(data);
			instance = null;
			return (rendered);
		  }
		  return new At_TemplateClass(template);
		}
		At_Template.registerHelper = function registerHelper(name, fn) {
		  At_TemplateClass.helpers[name] = fn;
		};
		At_Template.unregisterHelper = function unregisterHelper(name) {
		  At_TemplateClass.helpers[name] = undefined;
		  delete At_TemplateClass.helpers[name];
		};
		At_Template.registerPartial = function registerPartial(name, template) {
		  At_TemplateClass.partials[name] = { template: template };
		};
		At_Template.unregisterPartial = function unregisterPartial(name) {
		  if (At_TemplateClass.partials[name]) {
			At_TemplateClass.partials[name] = undefined;
			delete At_TemplateClass.partials[name];
		  }
		};
		At_Template.compile = function compile(template, options) {
		  var instance = new At_TemplateClass(template, options);
		  return instance.compile();
		};
  
		At_Template.options = At_TemplateClass.options;
		At_Template.helpers = At_TemplateClass.helpers;
		At_Template.partials = At_TemplateClass.partials;
  
		function AtTemplate(template,object,data,methods){
		  if(!template) return;
		  if(!object) return;
		  if(!data) data = object;
		  if(!methods) methods = object;
		  var _template = new At_Template(template);
  
  
		  _template.compile(_template.template);
  
		  _template = _template.compiled(object,
			data,methods);
  
		  return _template;
		}
		return AtTemplate;
	  })();
	  utils.isObject =  function isObject(o) {
		return typeof o === 'object' && o !== null && o.constructor && o.constructor === Object;
	  };
	  utils.extend = function extend() {
		var args = [], len$1 = arguments.length;
		while ( len$1-- ) args[ len$1 ] = arguments[ len$1 ];
  
		var deep = true;
		var to;
		var from;
		if (typeof args[0] === 'boolean') {
		  deep = args[0];
		  to = args[1];
		  args.splice(0, 2);
		  from = args;
		} else {
		  to = args[0];
		  args.splice(0, 1);
		  from = args;
		}
		for (var i = 0; i < from.length; i += 1) {
		  var nextSource = args[i];
		  if (nextSource !== undefined && nextSource !== null) {
			var keysArray = Object.keys(Object(nextSource));
			for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
			  var nextKey = keysArray[nextIndex];
			  var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
			  if (desc !== undefined && desc.enumerable) {
				if (!deep) {
				  to[nextKey] = nextSource[nextKey];
				} else if (utils.isObject(to[nextKey]) && utils.isObject(nextSource[nextKey])) {
				  utils.extend(to[nextKey], nextSource[nextKey]);
				} else if (!utils.isObject(to[nextKey]) && utils.isObject(nextSource[nextKey])) {
				  to[nextKey] = {};
				  utils.extend(to[nextKey], nextSource[nextKey]);
				} else {
				  to[nextKey] = nextSource[nextKey];
				}
			  }
			}
		  }
		}
		return to;
	  };
	  utils.AtDom = $ = (function(){
		var AtDom = function AtDom(arr,selector,context) {
		  var self = this;
		  // Create array-like object
		  for (var i = 0; i < arr.length; i += 1) {
			self[i] = arr[i];
		  }
  
		  if(selector){
			self.selector = selector;
		  }
		  if(context){
			self.context = context;
		  }
		  
		  self.length = arr.length;
		  // Return collection with methods
		  return this;
		};
		utils.AtDomConstructor = AtDom;
		function $(selector, context) {
		  var arr = [];
		  var i = 0;
		  if (selector && !context) {
			if (selector instanceof AtDom) {
			  return selector;
			}
		  }
		  if (selector) {
			  // String
			if (typeof selector === 'string') {
			  var els;
			  var tempParent;
			  var html = selector.trim();
			  if (html.indexOf('<') >= 0 && html.indexOf('>') >= 0) {
				var toCreate = 'div';
				if (html.indexOf('<li') === 0) { toCreate = 'ul'; }
				if (html.indexOf('<tr') === 0) { toCreate = 'tbody'; }
				if (html.indexOf('<td') === 0 || html.indexOf('<th') === 0) { toCreate = 'tr'; }
				if (html.indexOf('<tbody') === 0) { toCreate = 'table'; }
				if (html.indexOf('<option') === 0) { toCreate = 'select'; }
				tempParent = doc.createElement(toCreate);
				tempParent.innerHTML = html;
				for (i = 0; i < tempParent.childNodes.length; i += 1) {
				  arr.push(tempParent.childNodes[i]);
				}
			  } else {
				if (!context && selector[0] === '#' && !selector.match(/[ .<>:~]/)) {
				  // Pure ID selector
				  els = [doc.getElementById(selector.trim().split('#')[1])];
				} else {
				  // Other selectors
				  els = (context || doc).querySelectorAll(selector.trim());
				}
				for (i = 0; i < els.length; i += 1) {
				  if (els[i]) { arr.push(els[i]); }
				}
			  }
			} else if (selector.nodeType || selector === win || selector === doc) {
			  // Node/element
			  arr.push(selector);
			} else if (selector.length > 0 && selector[0].nodeType) {
			  // Array of elements or instance of Dom
			  for (i = 0; i < selector.length; i += 1) {
				arr.push(selector[i]);
			  }
			}
		  }
		  return new AtDom(arr,selector,context);
		}
  
		$.fn = AtDom.prototype;
		$.Class = AtDom;
		$.AtDom = AtDom;
  
		function unique(arr) {
		  var uniqueArray = [];
		  for (var i = 0; i < arr.length; i += 1) {
			if (uniqueArray.indexOf(arr[i]) === -1) { uniqueArray.push(arr[i]); }
		  }
		  return uniqueArray;
		}
  
		function requestAnimationFrame(callback) {
		  if (win.requestAnimationFrame) { return win.requestAnimationFrame(callback); }
		  else if (win.webkitRequestAnimationFrame) { return win.webkitRequestAnimationFrame(callback); }
		  return win.setTimeout(callback, 1000 / 60);
		}
		function cancelAnimationFrame(id) {
		  if (win.cancelAnimationFrame) { return win.cancelAnimationFrame(id); }
		  else if (win.webkitCancelAnimationFrame) { return win.webkitCancelAnimationFrame(id); }
		  return win.clearTimeout(id);
		}
  
		// Classes and attributes
		function addClass(className) {
		  if (typeof className === 'undefined') {
			return this;
		  }
		  var classes = className.split(' ');
		  for (var i = 0; i < classes.length; i += 1) {
			for (var j = 0; j < this.length; j += 1) {
			  if (typeof this[j] !== 'undefined' && typeof this[j].classList !== 'undefined') { this[j].classList.add(classes[i]); }
			}
		  }
		  return this;
		}
		function removeClass(className) {
		  var classes = className.split(' ');
		  for (var i = 0; i < classes.length; i += 1) {
			for (var j = 0; j < this.length; j += 1) {
			  if (typeof this[j] !== 'undefined' && typeof this[j].classList !== 'undefined') { this[j].classList.remove(classes[i]); }
			}
		  }
		  return this;
		}
		function hasClass(className) {
		  if (!this[0]) { return false; }
		  return this[0].classList.contains(className);
		}
		function toggleClass(className) {
		  var classes = className.split(' ');
		  for (var i = 0; i < classes.length; i += 1) {
			for (var j = 0; j < this.length; j += 1) {
			  if (typeof this[j] !== 'undefined' && typeof this[j].classList !== 'undefined') { this[j].classList.toggle(classes[i]); }
			}
		  }
		  return this;
		}
		function attr(attrs, value) {
		  var arguments$1 = arguments;
  
		  if (arguments.length === 1 && typeof attrs === 'string') {
			// Get attr
			if (this[0]) { return this[0].getAttribute(attrs); }
			return undefined;
		  }
  
		  // Set attrs
		  for (var i = 0; i < this.length; i += 1) {
			if (arguments$1.length === 2) {
			  // String
			  this[i].setAttribute(attrs, value);
			} else {
			  // Object
			  // eslint-disable-next-line
			  for (var attrName in attrs) {
				this[i][attrName] = attrs[attrName];
				this[i].setAttribute(attrName, attrs[attrName]);
			  }
			}
		  }
		  return this;
		}
		// eslint-disable-next-line
		function removeAttr(attr) {
		  for (var i = 0; i < this.length; i += 1) {
			this[i].removeAttribute(attr);
		  }
		  return this;
		}
		// eslint-disable-next-line
		function prop(props, value) {
		  var arguments$1 = arguments;
  
		  if (arguments.length === 1 && typeof props === 'string') {
			// Get prop
			if (this[0]) { return this[0][props]; }
		  } else {
			// Set props
			for (var i = 0; i < this.length; i += 1) {
			  if (arguments$1.length === 2) {
				// String
				this[i][props] = value;
			  } else {
				// Object
				// eslint-disable-next-line
				for (var propName in props) {
				  this[i][propName] = props[propName];
				}
			  }
			}
			return this;
		  }
		}
		function data(key, value) {
		  var el;
		  if (typeof value === 'undefined') {
			el = this[0];
			// Get value
			if (el) {
			  if (el.atdomElementDataStorage && (key in el.atdomElementDataStorage)) {
				return el.atdomElementDataStorage[key];
			  }
  
			  var dataKey = el.getAttribute(("data-" + key));
			  if (dataKey) {
				return dataKey;
			  }
			  return undefined;
			}
			return undefined;
		  }
  
		  // Set value
		  for (var i = 0; i < this.length; i += 1) {
			el = this[i];
			if (!el.atdomElementDataStorage) { el.atdomElementDataStorage = {}; }
			el.atdomElementDataStorage[key] = value;
		  }
		  return this;
		}
		function removeData(key) {
		  for (var i = 0; i < this.length; i += 1) {
			var el = this[i];
			if (el.atdomElementDataStorage && el.atdomElementDataStorage[key]) {
			  el.atdomElementDataStorage[key] = null;
			  delete el.atdomElementDataStorage[key];
			}
		  }
		}
		function dataset() {
		  var el = this[0];
		  if (!el) { return undefined; }
		  var dataset = {}; // eslint-disable-line
		  if (el.dataset) {
			// eslint-disable-next-line
			for (var dataKey in el.dataset) {
			  dataset[dataKey] = el.dataset[dataKey];
			}
		  } else {
			for (var i = 0; i < el.attributes.length; i += 1) {
			  // eslint-disable-next-line
			  var attr = el.attributes[i];
			  if (attr.name.indexOf('data-') >= 0) {
				dataset[toCamelCase(attr.name.split('data-')[1])] = attr.value;
			  }
			}
		  }
		  // eslint-disable-next-line
		  for (var key in dataset) {
			if (dataset[key] === 'false') { dataset[key] = false; }
			else if (dataset[key] === 'true') { dataset[key] = true; }
			else if (parseFloat(dataset[key]) === dataset[key] * 1) { dataset[key] *= 1; }
		  }
		  return dataset;
		}
		function val(value) {
		  var dom = this;
		  if (typeof value === 'undefined') {
			if (dom[0]) {
			  if (dom[0].multiple && dom[0].nodeName.toLowerCase() === 'select') {
				var values = [];
				for (var i = 0; i < dom[0].selectedOptions.length; i += 1) {
				  values.push(dom[0].selectedOptions[i].value);
				}
				return values;
			  }
			  return dom[0].value;
			}
			return undefined;
		  }
  
		  for (var i$1 = 0; i$1 < dom.length; i$1 += 1) {
			var el = dom[i$1];
			if (Array.isArray(value) && el.multiple && el.nodeName.toLowerCase() === 'select') {
			  for (var j = 0; j < el.options.length; j += 1) {
				el.options[j].selected = value.indexOf(el.options[j].value) >= 0;
			  }
			} else {
			  el.value = value;
			}
		  }
		  return dom;
		}
		// Transforms
		// eslint-disable-next-line
		function transform(transform) {
		  for (var i = 0; i < this.length; i += 1) {
			var elStyle = this[i].style;
			elStyle.webkitTransform = transform;
			elStyle.transform = transform;
		  }
		  return this;
		}
		function transition(duration) {
		  if (typeof duration !== 'string') {
			duration = duration + "ms"; // eslint-disable-line
		  }
		  for (var i = 0; i < this.length; i += 1) {
			var elStyle = this[i].style;
			elStyle.webkitTransitionDuration = duration;
			elStyle.transitionDuration = duration;
		  }
		  return this;
		}
		// Events
		function on() {
		  var assign;
  
		  var args = [], len = arguments.length;
		  while ( len-- ) args[ len ] = arguments[ len ];
		  var eventType = args[0];
		  var targetSelector = args[1];
		  var listener = args[2];
		  var capture = args[3];
		  if (typeof args[1] === 'function') {
			(assign = args, eventType = assign[0], listener = assign[1], capture = assign[2]);
			targetSelector = undefined;
		  }
		  if (!capture) { capture = false; }
  
		  function handleLiveEvent(e) {
			var target = e.target;
			if (!target) { return; }
			var eventData = e.target.atdomEventData || [];
			if (eventData.indexOf(e) < 0) {
			  eventData.unshift(e);
			}
			if ($(target).is(targetSelector)) { listener.apply(target, eventData); }
			else {
			  var parents = $(target).parents(); // eslint-disable-line
			  for (var k = 0; k < parents.length; k += 1) {
				if ($(parents[k]).is(targetSelector)) { listener.apply(parents[k], eventData); }
			  }
			}
		  }
		  function handleEvent(e) {
			var eventData = e && e.target ? e.target.atdomEventData || [] : [];
			if (eventData.indexOf(e) < 0) {
			  eventData.unshift(e);
			}
			listener.apply(this, eventData);
		  }
		  var events = eventType.split(' ');
		  var j;
		  for (var i = 0; i < this.length; i += 1) {
			var el = this[i];
			if (!targetSelector) {
			  for (j = 0; j < events.length; j += 1) {
				var event = events[j];
				if (!el.atdomListeners) { el.atdomListeners = {}; }
				if (!el.atdomListeners[event]) { el.atdomListeners[event] = []; }
				el.atdomListeners[event].push({
				  listener: listener,
				  proxyListener: handleEvent,
				});
				el.addEventListener(event, handleEvent, capture);
			  }
			} else {
			  // Live events
			  for (j = 0; j < events.length; j += 1) {
				var event$1 = events[j];
				if (!el.atdomLiveListeners) { el.atdomLiveListeners = {}; }
				if (!el.atdomLiveListeners[event$1]) { el.atdomLiveListeners[event$1] = []; }
				el.atdomLiveListeners[event$1].push({
				  listener: listener,
				  proxyListener: handleLiveEvent,
				});
				el.addEventListener(event$1, handleLiveEvent, capture);
			  }
			}
		  }
		  return this;
		}
		function off() {
		  var assign;
  
		  var args = [], len = arguments.length;
		  while ( len-- ) args[ len ] = arguments[ len ];
		  var eventType = args[0];
		  var targetSelector = args[1];
		  var listener = args[2];
		  var capture = args[3];
		  if (typeof args[1] === 'function') {
			(assign = args, eventType = assign[0], listener = assign[1], capture = assign[2]);
			targetSelector = undefined;
		  }
		  if (!capture) { capture = false; }
  
		  var events = eventType.split(' ');
		  for (var i = 0; i < events.length; i += 1) {
			var event = events[i];
			for (var j = 0; j < this.length; j += 1) {
			  var el = this[j];
			  var handlers = (void 0);
			  if (!targetSelector && el.atdomListeners) {
				handlers = el.atdomListeners[event];
			  } else if (targetSelector && el.atdomLiveListeners) {
				handlers = el.atdomLiveListeners[event];
			  }
			  if (handlers && handlers.length) {
				for (var k = handlers.length - 1; k >= 0; k -= 1) {
				  var handler = handlers[k];
				  if (listener && handler.listener === listener) {
					el.removeEventListener(event, handler.proxyListener, capture);
					handlers.splice(k, 1);
				  } else if (listener && handler.listener && handler.listener.atdomproxy && handler.listener.atdomproxy === listener) {
					el.removeEventListener(event, handler.proxyListener, capture);
					handlers.splice(k, 1);
				  } else if (!listener) {
					el.removeEventListener(event, handler.proxyListener, capture);
					handlers.splice(k, 1);
				  }
				}
			  }
			}
		  }
		  return this;
		}
		function once() {
		  var assign;
  
		  var args = [], len = arguments.length;
		  while ( len-- ) args[ len ] = arguments[ len ];
		  var dom = this;
		  var eventName = args[0];
		  var targetSelector = args[1];
		  var listener = args[2];
		  var capture = args[3];
		  if (typeof args[1] === 'function') {
			(assign = args, eventName = assign[0], listener = assign[1], capture = assign[2]);
			targetSelector = undefined;
		  }
		  function onceHandler() {
			var eventArgs = [], len = arguments.length;
			while ( len-- ) eventArgs[ len ] = arguments[ len ];
  
			listener.apply(this, eventArgs);
			dom.off(eventName, targetSelector, onceHandler, capture);
			if (onceHandler.atdomproxy) {
			  delete onceHandler.atdomproxy;
			}
		  }
		  onceHandler.atdomproxy = listener;
		  return dom.on(eventName, targetSelector, onceHandler, capture);
		}
		function trigger() {
		  var args = [], len = arguments.length;
		  while ( len-- ) args[ len ] = arguments[ len ];
  
		  var events = args[0].split(' ');
		  var eventData = args[1];
		  for (var i = 0; i < events.length; i += 1) {
			var event = events[i];
			for (var j = 0; j < this.length; j += 1) {
			  var el = this[j];
			  var evt = (void 0);
			  try {
				evt = new win.CustomEvent(event, {
				  detail: eventData,
				  bubbles: true,
				  cancelable: true,
				});
			  } catch (e) {
				evt = doc.createEvent('Event');
				evt.initEvent(event, true, true);
				evt.detail = eventData;
			  }
			  // eslint-disable-next-line
			  el.atdomEventData = args.filter(function (data, dataIndex) { return dataIndex > 0; });
			  el.dispatchEvent(evt);
			  el.atdomEventData = [];
			  delete el.atdomEventData;
			}
		  }
		  return this;
		}
		function transitionEnd(callback) {
		  var events = ['webkitTransitionEnd', 'transitionend'];
		  var dom = this;
		  var i;
		  function fireCallBack(e) {
			/* jshint validthis:true */
			if (e.target !== this) { return; }
			callback.call(this, e);
			for (i = 0; i < events.length; i += 1) {
			  dom.off(events[i], fireCallBack);
			}
		  }
		  if (callback) {
			for (i = 0; i < events.length; i += 1) {
			  dom.on(events[i], fireCallBack);
			}
		  }
		  return this;
		}
		function animationEnd(callback) {
		  var events = ['webkitAnimationEnd', 'animationend'];
		  var dom = this;
		  var i;
		  function fireCallBack(e) {
			if (e.target !== this) { return; }
			callback.call(this, e);
			for (i = 0; i < events.length; i += 1) {
			  dom.off(events[i], fireCallBack);
			}
		  }
		  if (callback) {
			for (i = 0; i < events.length; i += 1) {
			  dom.on(events[i], fireCallBack);
			}
		  }
		  return this;
		}
		// Sizing/Styles
		function width() {
		  if (this[0] === win) {
			return win.innerWidth;
		  }
  
		  if (this.length > 0) {
			return parseFloat(this.css('width'));
		  }
  
		  return null;
		}
		function outerWidth(includeMargins) {
		  if (this.length > 0) {
			if (includeMargins) {
			  // eslint-disable-next-line
			  var styles = this.styles();
			  return this[0].offsetWidth + parseFloat(styles.getPropertyValue('margin-right')) + parseFloat(styles.getPropertyValue('margin-left'));
			}
			return this[0].offsetWidth;
		  }
		  return null;
		}
		function height() {
		  if (this[0] === win) {
			return win.innerHeight;
		  }
  
		  if (this.length > 0) {
			return parseFloat(this.css('height'));
		  }
  
		  return null;
		}
		function outerHeight(includeMargins) {
		  if (this.length > 0) {
			if (includeMargins) {
			  // eslint-disable-next-line
			  var styles = this.styles();
			  return this[0].offsetHeight + parseFloat(styles.getPropertyValue('margin-top')) + parseFloat(styles.getPropertyValue('margin-bottom'));
			}
			return this[0].offsetHeight;
		  }
		  return null;
		}
		function offset() {
		  if (this.length > 0) {
			var el = this[0];
			var box = el.getBoundingClientRect();
			var body = doc.body;
			var clientTop = el.clientTop || body.clientTop || 0;
			var clientLeft = el.clientLeft || body.clientLeft || 0;
			var scrollTop = el === win ? win.scrollY : el.scrollTop;
			var scrollLeft = el === win ? win.scrollX : el.scrollLeft;
			return {
			  top: (box.top + scrollTop) - clientTop,
			  left: (box.left + scrollLeft) - clientLeft,
			};
		  }
  
		  return null;
		}
		function hide() {
		  for (var i = 0; i < this.length; i += 1) {
			this[i].style.display = 'none';
		  }
		  return this;
		}
		function show() {
		  for (var i = 0; i < this.length; i += 1) {
			var el = this[i];
			if (el.style.display === 'none') {
			  el.style.display = '';
			}
			if (win.getComputedStyle(el, null).getPropertyValue('display') === 'none') {
			  // Still not visible
			  el.style.display = 'block';
			}
		  }
		  return this;
		}
		function styles() {
		  if (this[0]) { return win.getComputedStyle(this[0], null); }
		  return {};
		}
		function css(props, value) {
		  var i;
		  if (arguments.length === 1) {
			if (typeof props === 'string') {
			  if (this[0]) { return win.getComputedStyle(this[0], null).getPropertyValue(props); }
			} else {
			  for (i = 0; i < this.length; i += 1) {
				// eslint-disable-next-line
				for (var prop in props) {
				  this[i].style[prop] = props[prop];
				}
			  }
			  return this;
			}
		  }
		  if (arguments.length === 2 && typeof props === 'string') {
			for (i = 0; i < this.length; i += 1) {
			  this[i].style[props] = value;
			}
			return this;
		  }
		  return this;
		}
  
		// Dom manipulation
		function toArray() {
		  var arr = [];
		  for (var i = 0; i < this.length; i += 1) {
			arr.push(this[i]);
		  }
		  return arr;
		}
		// Iterate over the collection passing elements to `callback`
		function each(callback) {
		  // Don't bother continuing without a callback
		  if (!callback) { return this; }
		  // Iterate over the current collection
		  for (var i = 0; i < this.length; i += 1) {
			// If the callback returns false
			if (callback.call(this[i], i, this[i]) === false) {
			  // End the loop early
			  return this;
			}
		  }
		  // Return `this` to allow chained DOM operations
		  return this;
		}
		function forEach(callback) {
		  // Don't bother continuing without a callback
		  if (!callback) { return this; }
		  // Iterate over the current collection
		  for (var i = 0; i < this.length; i += 1) {
			// If the callback returns false
			if (callback.call(this[i], this[i], i) === false) {
			  // End the loop early
			  return this;
			}
		  }
		  // Return `this` to allow chained DOM operations
		  return this;
		}
		function filter(callback) {
		  var matchedItems = [];
		  var dom = this;
		  for (var i = 0; i < dom.length; i += 1) {
			if (callback.call(dom[i], i, dom[i])) { matchedItems.push(dom[i]); }
		  }
		  return new AtDom(matchedItems);
		}
		function map(callback) {
		  var modifiedItems = [];
		  var dom = this;
		  for (var i = 0; i < dom.length; i += 1) {
			modifiedItems.push(callback.call(dom[i], i, dom[i]));
		  }
		  return new AtDom(modifiedItems);
		}
		// eslint-disable-next-line
		function html(html) {
		  if (typeof html === 'undefined') {
			return this[0] ? this[0].innerHTML : undefined;
		  }
  
		  for (var i = 0; i < this.length; i += 1) {
			this[i].innerHTML = html;
		  }
		  return this;
		}
		// eslint-disable-next-line
		function text(text) {
		  if (typeof text === 'undefined') {
			if (this[0]) {
			  return this[0].textContent.trim();
			}
			return null;
		  }
  
		  for (var i = 0; i < this.length; i += 1) {
			this[i].textContent = text;
		  }
		  return this;
		}
		function is(selector) {
		  var el = this[0];
		  var compareWith;
		  var i;
		  if (!el || typeof selector === 'undefined') { return false; }
		  if (typeof selector === 'string') {
			if (el.matches) { return el.matches(selector); }
			else if (el.webkitMatchesSelector) { return el.webkitMatchesSelector(selector); }
			else if (el.msMatchesSelector) { return el.msMatchesSelector(selector); }
  
			compareWith = $(selector);
			for (i = 0; i < compareWith.length; i += 1) {
			  if (compareWith[i] === el) { return true; }
			}
			return false;
		  } else if (selector === doc) { return el === doc; }
		  else if (selector === win) { return el === win; }
  
		  if (selector.nodeType || selector instanceof AtDom) {
			compareWith = selector.nodeType ? [selector] : selector;
			for (i = 0; i < compareWith.length; i += 1) {
			  if (compareWith[i] === el) { return true; }
			}
			return false;
		  }
		  return false;
		}
		function indexOf(el) {
		  for (var i = 0; i < this.length; i += 1) {
			if (this[i] === el) { return i; }
		  }
		  return -1;
		}
		function index() {
		  var child = this[0];
		  var i;
		  if (child) {
			i = 0;
			// eslint-disable-next-line
			while ((child = child.previousSibling) !== null) {
			  if (child.nodeType === 1) { i += 1; }
			}
			return i;
		  }
		  return undefined;
		}
		// eslint-disable-next-line
		function eq(index) {
		  if (typeof index === 'undefined') { return this; }
		  var length = this.length;
		  var returnIndex;
		  if (index > length - 1) {
			return new AtDom([]);
		  }
		  if (index < 0) {
			returnIndex = length + index;
			if (returnIndex < 0) { return new AtDom([]); }
			return new AtDom([this[returnIndex]]);
		  }
		  return new AtDom([this[index]]);
		}
		function append() {
		  var args = [], len = arguments.length;
		  while ( len-- ) args[ len ] = arguments[ len ];
  
		  var newChild;
  
		  for (var k = 0; k < args.length; k += 1) {
			newChild = args[k];
			for (var i = 0; i < this.length; i += 1) {
			  if (typeof newChild === 'string') {
				var tempDiv = doc.createElement('div');
				tempDiv.innerHTML = newChild;
				while (tempDiv.firstChild) {
				  this[i].appendChild(tempDiv.firstChild);
				}
			  } else if (newChild instanceof AtDom) {
				for (var j = 0; j < newChild.length; j += 1) {
				  this[i].appendChild(newChild[j]);
				}
			  } else {
				this[i].appendChild(newChild);
			  }
			}
		  }
  
		  return this;
		}
		// eslint-disable-next-line
		function appendTo(parent) {
		  $(parent).append(this);
		  return this;
		}
		function prepend(newChild) {
		  var i;
		  var j;
		  for (i = 0; i < this.length; i += 1) {
			if (typeof newChild === 'string') {
			  var tempDiv = doc.createElement('div');
			  tempDiv.innerHTML = newChild;
			  for (j = tempDiv.childNodes.length - 1; j >= 0; j -= 1) {
				this[i].insertBefore(tempDiv.childNodes[j], this[i].childNodes[0]);
			  }
			} else if (newChild instanceof AtDom) {
			  for (j = 0; j < newChild.length; j += 1) {
				this[i].insertBefore(newChild[j], this[i].childNodes[0]);
			  }
			} else {
			  this[i].insertBefore(newChild, this[i].childNodes[0]);
			}
		  }
		  return this;
		}
		// eslint-disable-next-line
		function prependTo(parent) {
		  $(parent).prepend(this);
		  return this;
		}
		function insertBefore(selector) {
		  var before = $(selector);
		  for (var i = 0; i < this.length; i += 1) {
			if (before.length === 1) {
			  before[0].parentNode.insertBefore(this[i], before[0]);
			} else if (before.length > 1) {
			  for (var j = 0; j < before.length; j += 1) {
				before[j].parentNode.insertBefore(this[i].cloneNode(true), before[j]);
			  }
			}
		  }
		}
		function insertAfter(selector) {
		  var after = $(selector);
		  for (var i = 0; i < this.length; i += 1) {
			if (after.length === 1) {
			  after[0].parentNode.insertBefore(this[i], after[0].nextSibling);
			} else if (after.length > 1) {
			  for (var j = 0; j < after.length; j += 1) {
				after[j].parentNode.insertBefore(this[i].cloneNode(true), after[j].nextSibling);
			  }
			}
		  }
		}
		function next(selector) {
		  if (this.length > 0) {
			if (selector) {
			  if (this[0].nextElementSibling && $(this[0].nextElementSibling).is(selector)) {
				return new AtDom([this[0].nextElementSibling]);
			  }
			  return new AtDom([]);
			}
  
			if (this[0].nextElementSibling) { return new AtDom([this[0].nextElementSibling]); }
			return new AtDom([]);
		  }
		  return new AtDom([]);
		}
		function nextAll(selector) {
		  var nextEls = [];
		  var el = this[0];
		  if (!el) { return new AtDom([]); }
		  while (el.nextElementSibling) {
			var next = el.nextElementSibling; // eslint-disable-line
			if (selector) {
			  if ($(next).is(selector)) { nextEls.push(next); }
			} else { nextEls.push(next); }
			el = next;
		  }
		  return new AtDom(nextEls);
		}
		function prev(selector) {
		  if (this.length > 0) {
			var el = this[0];
			if (selector) {
			  if (el.previousElementSibling && $(el.previousElementSibling).is(selector)) {
				return new AtDom([el.previousElementSibling]);
			  }
			  return new AtDom([]);
			}
  
			if (el.previousElementSibling) { return new AtDom([el.previousElementSibling]); }
			return new AtDom([]);
		  }
		  return new AtDom([]);
		}
		function prevAll(selector) {
		  var prevEls = [];
		  var el = this[0];
		  if (!el) { return new AtDom([]); }
		  while (el.previousElementSibling) {
			var prev = el.previousElementSibling; // eslint-disable-line
			if (selector) {
			  if ($(prev).is(selector)) { prevEls.push(prev); }
			} else { prevEls.push(prev); }
			el = prev;
		  }
		  return new AtDom(prevEls);
		}
		function siblings(selector) {
		  return this.nextAll(selector).add(this.prevAll(selector));
		}
		function parent(selector) {
		  var parents = []; // eslint-disable-line
		  for (var i = 0; i < this.length; i += 1) {
			if (this[i].parentNode !== null) {
			  if (selector) {
				if ($(this[i].parentNode).is(selector)) { parents.push(this[i].parentNode); }
			  } else {
				parents.push(this[i].parentNode);
			  }
			}
		  }
		  return $(unique(parents));
		}
		function parents(selector) {
		  var parents = []; // eslint-disable-line
		  for (var i = 0; i < this.length; i += 1) {
			var parent = this[i].parentNode; // eslint-disable-line
			while (parent) {
			  if (selector) {
				if ($(parent).is(selector)) { parents.push(parent); }
			  } else {
				parents.push(parent);
			  }
			  parent = parent.parentNode;
			}
		  }
		  return $(unique(parents));
		}
		function closest(selector) {
		  var closest = this; // eslint-disable-line
		  if (typeof selector === 'undefined') {
			return new AtDom([]);
		  }
		  if (!closest.is(selector)) {
			closest = closest.parents(selector).eq(0);
		  }
		  return closest;
		}
		function find(selector) {
		  var foundElements = [];
		  for (var i = 0; i < this.length; i += 1) {
			var found = this[i].querySelectorAll(selector);
			for (var j = 0; j < found.length; j += 1) {
			  foundElements.push(found[j]);
			}
		  }
		  return new AtDom(foundElements);
		}
		function children(selector) {
		  var children = []; // eslint-disable-line
		  for (var i = 0; i < this.length; i += 1) {
			var childNodes = this[i].childNodes;
  
			for (var j = 0; j < childNodes.length; j += 1) {
			  if (!selector) {
				if (childNodes[j].nodeType === 1) { children.push(childNodes[j]); }
			  } else if (childNodes[j].nodeType === 1 && $(childNodes[j]).is(selector)) {
				children.push(childNodes[j]);
			  }
			}
		  }
		  return new AtDom(unique(children));
		}
		function remove() {
		  for (var i = 0; i < this.length; i += 1) {
			if (this[i].parentNode) { this[i].parentNode.removeChild(this[i]); }
		  }
		  return this;
		}
		function detach() {
		  return this.remove();
		}
		function add() {
		  var args = [], len = arguments.length;
		  while ( len-- ) args[ len ] = arguments[ len ];
  
		  var dom = this;
		  var i;
		  var j;
		  for (i = 0; i < args.length; i += 1) {
			var toAdd = $(args[i]);
			for (j = 0; j < toAdd.length; j += 1) {
			  dom[dom.length] = toAdd[j];
			  dom.length += 1;
			}
		  }
		  return dom;
		}
		function empty() {
		  for (var i = 0; i < this.length; i += 1) {
			var el = this[i];
			if (el.nodeType === 1) {
			  for (var j = 0; j < el.childNodes.length; j += 1) {
				if (el.childNodes[j].parentNode) {
				  el.childNodes[j].parentNode.removeChild(el.childNodes[j]);
				}
			  }
			  el.textContent = '';
			}
		  }
		  return this;
		}
  
		var Methods = /*#__PURE__*/Object.freeze({
		  addClass: addClass,
		  removeClass: removeClass,
		  hasClass: hasClass,
		  toggleClass: toggleClass,
		  attr: attr,
		  removeAttr: removeAttr,
		  prop: prop,
		  data: data,
		  removeData: removeData,
		  dataset: dataset,
		  val: val,
		  transform: transform,
		  transition: transition,
		  on: on,
		  off: off,
		  once: once,
		  trigger: trigger,
		  transitionEnd: transitionEnd,
		  animationEnd: animationEnd,
		  width: width,
		  outerWidth: outerWidth,
		  height: height,
		  outerHeight: outerHeight,
		  offset: offset,
		  hide: hide,
		  show: show,
		  styles: styles,
		  css: css,
		  toArray: toArray,
		  each: each,
		  forEach: forEach,
		  filter: filter,
		  map: map,
		  html: html,
		  text: text,
		  is: is,
		  indexOf: indexOf,
		  index: index,
		  eq: eq,
		  append: append,
		  appendTo: appendTo,
		  prepend: prepend,
		  prependTo: prependTo,
		  insertBefore: insertBefore,
		  insertAfter: insertAfter,
		  next: next,
		  nextAll: nextAll,
		  prev: prev,
		  prevAll: prevAll,
		  siblings: siblings,
		  parent: parent,
		  parents: parents,
		  closest: closest,
		  find: find,
		  children: children,
		  remove: remove,
		  detach: detach,
		  add: add,
		  empty: empty
		});
  
		function scrollTo() {
		  var assign;
  
		  var args = [], len = arguments.length;
		  while ( len-- ) args[ len ] = arguments[ len ];
		  var left = args[0];
		  var top = args[1];
		  var duration = args[2];
		  var easing = args[3];
		  var callback = args[4];
		  if (args.length === 4 && typeof easing === 'function') {
			callback = easing;
			(assign = args, left = assign[0], top = assign[1], duration = assign[2], callback = assign[3], easing = assign[4]);
		  }
		  if (typeof easing === 'undefined') { easing = 'swing'; }
  
		  return this.each(function animate() {
			var el = this;
			var currentTop;
			var currentLeft;
			var maxTop;
			var maxLeft;
			var newTop;
			var newLeft;
			var scrollTop; // eslint-disable-line
			var scrollLeft; // eslint-disable-line
			var animateTop = top > 0 || top === 0;
			var animateLeft = left > 0 || left === 0;
			if (typeof easing === 'undefined') {
			  easing = 'swing';
			}
			if (animateTop) {
			  currentTop = el.scrollTop;
			  if (!duration) {
				el.scrollTop = top;
			  }
			}
			if (animateLeft) {
			  currentLeft = el.scrollLeft;
			  if (!duration) {
				el.scrollLeft = left;
			  }
			}
			if (!duration) { return; }
			if (animateTop) {
			  maxTop = el.scrollHeight - el.offsetHeight;
			  newTop = Math.max(Math.min(top, maxTop), 0);
			}
			if (animateLeft) {
			  maxLeft = el.scrollWidth - el.offsetWidth;
			  newLeft = Math.max(Math.min(left, maxLeft), 0);
			}
			var startTime = null;
			if (animateTop && newTop === currentTop) { animateTop = false; }
			if (animateLeft && newLeft === currentLeft) { animateLeft = false; }
			function render(time) {
			  if ( time === void 0 ) time = new Date().getTime();
  
			  if (startTime === null) {
				startTime = time;
			  }
			  var progress = Math.max(Math.min((time - startTime) / duration, 1), 0);
			  var easeProgress = easing === 'linear' ? progress : (0.5 - (Math.cos(progress * Math.PI) / 2));
			  var done;
			  if (animateTop) { scrollTop = currentTop + (easeProgress * (newTop - currentTop)); }
			  if (animateLeft) { scrollLeft = currentLeft + (easeProgress * (newLeft - currentLeft)); }
			  if (animateTop && newTop > currentTop && scrollTop >= newTop) {
				el.scrollTop = newTop;
				done = true;
			  }
			  if (animateTop && newTop < currentTop && scrollTop <= newTop) {
				el.scrollTop = newTop;
				done = true;
			  }
			  if (animateLeft && newLeft > currentLeft && scrollLeft >= newLeft) {
				el.scrollLeft = newLeft;
				done = true;
			  }
			  if (animateLeft && newLeft < currentLeft && scrollLeft <= newLeft) {
				el.scrollLeft = newLeft;
				done = true;
			  }
  
			  if (done) {
				if (callback) { callback(); }
				return;
			  }
			  if (animateTop) { el.scrollTop = scrollTop; }
			  if (animateLeft) { el.scrollLeft = scrollLeft; }
			  requestAnimationFrame(render);
			}
			requestAnimationFrame(render);
		  });
		}
		// scrollTop(top, duration, easing, callback) {
		function scrollTop() {
		  var assign;
  
		  var args = [], len = arguments.length;
		  while ( len-- ) args[ len ] = arguments[ len ];
		  var top = args[0];
		  var duration = args[1];
		  var easing = args[2];
		  var callback = args[3];
		  if (args.length === 3 && typeof easing === 'function') {
			(assign = args, top = assign[0], duration = assign[1], callback = assign[2], easing = assign[3]);
		  }
		  var dom = this;
		  if (typeof top === 'undefined') {
			if (dom.length > 0) { return dom[0].scrollTop; }
			return null;
		  }
		  return dom.scrollTo(undefined, top, duration, easing, callback);
		}
		function scrollLeft() {
		  var assign;
  
		  var args = [], len = arguments.length;
		  while ( len-- ) args[ len ] = arguments[ len ];
		  var left = args[0];
		  var duration = args[1];
		  var easing = args[2];
		  var callback = args[3];
		  if (args.length === 3 && typeof easing === 'function') {
			(assign = args, left = assign[0], duration = assign[1], callback = assign[2], easing = assign[3]);
		  }
		  var dom = this;
		  if (typeof left === 'undefined') {
			if (dom.length > 0) { return dom[0].scrollLeft; }
			return null;
		  }
		  return dom.scrollTo(left, undefined, duration, easing, callback);
		}
  
		var Scroll = /*#__PURE__*/Object.freeze({
		  scrollTo: scrollTo,
		  scrollTop: scrollTop,
		  scrollLeft: scrollLeft
		});
  
		function animate(initialProps, initialParams) {
		  var els = this;
		  var a = {
			props: Utils.extend({}, initialProps),
			params: Utils.extend({
			  duration: 300,
			  easing: 'swing', // or 'linear'
			  /* Callbacks
			  begin(elements)
			  complete(elements)
			  progress(elements, complete, remaining, start, tweenValue)
			  */
			}, initialParams),
  
			elements: els,
			animating: false,
			que: [],
  
			easingProgress: function easingProgress(easing, progress) {
			  if (easing === 'swing') {
				return 0.5 - (Math.cos(progress * Math.PI) / 2);
			  }
			  if (typeof easing === 'function') {
				return easing(progress);
			  }
			  return progress;
			},
			stop: function stop() {
			  if (a.frameId) {
				cancelAnimationFrame(a.frameId);
			  }
			  a.animating = false;
			  a.elements.each(function (index, el) {
				var element = el;
				delete element.atdomAnimateInstance;
			  });
			  a.que = [];
			},
			done: function done(complete) {
			  a.animating = false;
			  a.elements.each(function (index, el) {
				var element = el;
				delete element.atdomAnimateInstance;
			  });
			  if (complete) { complete(els); }
			  if (a.que.length > 0) {
				var que = a.que.shift();
				a.animate(que[0], que[1]);
			  }
			},
			animate: function animate(props, params) {
			  if (a.animating) {
				a.que.push([props, params]);
				return a;
			  }
			  var elements = [];
  
			  // Define & Cache Initials & Units
			  a.elements.each(function (index, el) {
				var initialFullValue;
				var initialValue;
				var unit;
				var finalValue;
				var finalFullValue;
  
				if (!el.atdomAnimateInstance) { a.elements[index].atdomAnimateInstance = a; }
  
				elements[index] = {
				  container: el,
				};
				Object.keys(props).forEach(function (prop) {
				  initialFullValue = win.getComputedStyle(el, null).getPropertyValue(prop).replace(',', '.');
				  initialValue = parseFloat(initialFullValue);
				  unit = initialFullValue.replace(initialValue, '');
				  finalValue = parseFloat(props[prop]);
				  finalFullValue = props[prop] + unit;
				  elements[index][prop] = {
					initialFullValue: initialFullValue,
					initialValue: initialValue,
					unit: unit,
					finalValue: finalValue,
					finalFullValue: finalFullValue,
					currentValue: initialValue,
				  };
				});
			  });
  
			  var startTime = null;
			  var time;
			  var elementsDone = 0;
			  var propsDone = 0;
			  var done;
			  var began = false;
  
			  a.animating = true;
  
			  function render() {
				time = new Date().getTime();
				var progress;
				var easeProgress;
				// let el;
				if (!began) {
				  began = true;
				  if (params.begin) { params.begin(els); }
				}
				if (startTime === null) {
				  startTime = time;
				}
				if (params.progress) {
				  // eslint-disable-next-line
				  params.progress(els, Math.max(Math.min((time - startTime) / params.duration, 1), 0), ((startTime + params.duration) - time < 0 ? 0 : (startTime + params.duration) - time), startTime);
				}
  
				elements.forEach(function (element) {
				  var el = element;
				  if (done || el.done) { return; }
				  Object.keys(props).forEach(function (prop) {
					if (done || el.done) { return; }
					progress = Math.max(Math.min((time - startTime) / params.duration, 1), 0);
					easeProgress = a.easingProgress(params.easing, progress);
					var ref = el[prop];
					var initialValue = ref.initialValue;
					var finalValue = ref.finalValue;
					var unit = ref.unit;
					el[prop].currentValue = initialValue + (easeProgress * (finalValue - initialValue));
					var currentValue = el[prop].currentValue;
  
					if (
					  (finalValue > initialValue && currentValue >= finalValue) ||
					  (finalValue < initialValue && currentValue <= finalValue)) {
					  el.container.style[prop] = finalValue + unit;
					  propsDone += 1;
					  if (propsDone === Object.keys(props).length) {
						el.done = true;
						elementsDone += 1;
					  }
					  if (elementsDone === elements.length) {
						done = true;
					  }
					}
					if (done) {
					  a.done(params.complete);
					  return;
					}
					el.container.style[prop] = currentValue + unit;
				  });
				});
				if (done) { return; }
				// Then call
				a.frameId = requestAnimationFrame(render);
			  }
			  a.frameId = requestAnimationFrame(render);
			  return a;
			},
		  };
  
		  if (a.elements.length === 0) {
			return els;
		  }
  
		  var animateInstance;
		  for (var i = 0; i < a.elements.length; i += 1) {
			if (a.elements[i].atdomAnimateInstance) {
			  animateInstance = a.elements[i].atdomAnimateInstance;
			} else { a.elements[i].atdomAnimateInstance = a; }
		  }
		  if (!animateInstance) {
			animateInstance = a;
		  }
  
		  if (initialProps === 'stop') {
			animateInstance.stop();
		  } else {
			animateInstance.animate(a.props, a.params);
		  }
  
		  return els;
		}
  
		function stop() {
		  var els = this;
		  for (var i = 0; i < els.length; i += 1) {
			if (els[i].atdomAnimateInstance) {
			  els[i].atdomAnimateInstance.stop();
			}
		  }
		}
  
		var Animate = /*#__PURE__*/Object.freeze({
		  animate: animate,
		  stop: stop
		});
  
		var noTrigger = ('resize scroll').split(' ');
		function eventShortcut(name) {
		  var ref;
  
		  var args = [], len = arguments.length - 1;
		  while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];
		  if (typeof args[0] === 'undefined') {
			for (var i = 0; i < this.length; i += 1) {
			  if (noTrigger.indexOf(name) < 0) {
				if (name in this[i]) { this[i][name](); }
				else {
				  $(this[i]).trigger(name);
				}
			  }
			}
			return this;
		  }
		  return (ref = this).on.apply(ref, [ name ].concat( args ));
		}
  
		function click() {
		  var args = [], len = arguments.length;
		  while ( len-- ) args[ len ] = arguments[ len ];
  
		  return eventShortcut.bind(this).apply(void 0, [ 'click' ].concat( args ));
		}
		function blur() {
		  var args = [], len = arguments.length;
		  while ( len-- ) args[ len ] = arguments[ len ];
  
		  return eventShortcut.bind(this).apply(void 0, [ 'blur' ].concat( args ));
		}
		function focus() {
		  var args = [], len = arguments.length;
		  while ( len-- ) args[ len ] = arguments[ len ];
  
		  return eventShortcut.bind(this).apply(void 0, [ 'focus' ].concat( args ));
		}
		function focusin() {
		  var args = [], len = arguments.length;
		  while ( len-- ) args[ len ] = arguments[ len ];
  
		  return eventShortcut.bind(this).apply(void 0, [ 'focusin' ].concat( args ));
		}
		function focusout() {
		  var args = [], len = arguments.length;
		  while ( len-- ) args[ len ] = arguments[ len ];
  
		  return eventShortcut.bind(this).apply(void 0, [ 'focusout' ].concat( args ));
		}
		function keyup() {
		  var args = [], len = arguments.length;
		  while ( len-- ) args[ len ] = arguments[ len ];
  
		  return eventShortcut.bind(this).apply(void 0, [ 'keyup' ].concat( args ));
		}
		function keydown() {
		  var args = [], len = arguments.length;
		  while ( len-- ) args[ len ] = arguments[ len ];
  
		  return eventShortcut.bind(this).apply(void 0, [ 'keydown' ].concat( args ));
		}
		function keypress() {
		  var args = [], len = arguments.length;
		  while ( len-- ) args[ len ] = arguments[ len ];
  
		  return eventShortcut.bind(this).apply(void 0, [ 'keypress' ].concat( args ));
		}
		function submit() {
		  var args = [], len = arguments.length;
		  while ( len-- ) args[ len ] = arguments[ len ];
  
		  return eventShortcut.bind(this).apply(void 0, [ 'submit' ].concat( args ));
		}
		function change() {
		  var args = [], len = arguments.length;
		  while ( len-- ) args[ len ] = arguments[ len ];
  
		  return eventShortcut.bind(this).apply(void 0, [ 'change' ].concat( args ));
		}
		function mousedown() {
		  var args = [], len = arguments.length;
		  while ( len-- ) args[ len ] = arguments[ len ];
  
		  return eventShortcut.bind(this).apply(void 0, [ 'mousedown' ].concat( args ));
		}
		function mousemove() {
		  var args = [], len = arguments.length;
		  while ( len-- ) args[ len ] = arguments[ len ];
  
		  return eventShortcut.bind(this).apply(void 0, [ 'mousemove' ].concat( args ));
		}
		function mouseup() {
		  var args = [], len = arguments.length;
		  while ( len-- ) args[ len ] = arguments[ len ];
  
		  return eventShortcut.bind(this).apply(void 0, [ 'mouseup' ].concat( args ));
		}
		function mouseenter() {
		  var args = [], len = arguments.length;
		  while ( len-- ) args[ len ] = arguments[ len ];
  
		  return eventShortcut.bind(this).apply(void 0, [ 'mouseenter' ].concat( args ));
		}
		function mouseleave() {
		  var args = [], len = arguments.length;
		  while ( len-- ) args[ len ] = arguments[ len ];
  
		  return eventShortcut.bind(this).apply(void 0, [ 'mouseleave' ].concat( args ));
		}
		function mouseout() {
		  var args = [], len = arguments.length;
		  while ( len-- ) args[ len ] = arguments[ len ];
  
		  return eventShortcut.bind(this).apply(void 0, [ 'mouseout' ].concat( args ));
		}
		function mouseover() {
		  var args = [], len = arguments.length;
		  while ( len-- ) args[ len ] = arguments[ len ];
  
		  return eventShortcut.bind(this).apply(void 0, [ 'mouseover' ].concat( args ));
		}
		function touchstart() {
		  var args = [], len = arguments.length;
		  while ( len-- ) args[ len ] = arguments[ len ];
  
		  return eventShortcut.bind(this).apply(void 0, [ 'touchstart' ].concat( args ));
		}
		function touchend() {
		  var args = [], len = arguments.length;
		  while ( len-- ) args[ len ] = arguments[ len ];
  
		  return eventShortcut.bind(this).apply(void 0, [ 'touchend' ].concat( args ));
		}
		function touchmove() {
		  var args = [], len = arguments.length;
		  while ( len-- ) args[ len ] = arguments[ len ];
  
		  return eventShortcut.bind(this).apply(void 0, [ 'touchmove' ].concat( args ));
		}
		function resize() {
		  var args = [], len = arguments.length;
		  while ( len-- ) args[ len ] = arguments[ len ];
  
		  return eventShortcut.bind(this).apply(void 0, [ 'resize' ].concat( args ));
		}
		function scroll() {
		  var args = [], len = arguments.length;
		  while ( len-- ) args[ len ] = arguments[ len ];
  
		  return eventShortcut.bind(this).apply(void 0, [ 'scroll' ].concat( args ));
		}
  
		var eventShortcuts = /*#__PURE__*/Object.freeze({
		  click: click,
		  blur: blur,
		  focus: focus,
		  focusin: focusin,
		  focusout: focusout,
		  keyup: keyup,
		  keydown: keydown,
		  keypress: keypress,
		  submit: submit,
		  change: change,
		  mousedown: mousedown,
		  mousemove: mousemove,
		  mouseup: mouseup,
		  mouseenter: mouseenter,
		  mouseleave: mouseleave,
		  mouseout: mouseout,
		  mouseover: mouseover,
		  touchstart: touchstart,
		  touchend: touchend,
		  touchmove: touchmove,
		  resize: resize,
		  scroll: scroll
		});
  
		[Methods, Scroll, Animate, eventShortcuts].forEach(function (group) {
		  Object.keys(group).forEach(function (methodName) {
			$.fn[methodName] = group[methodName];
		  });
		});
		$.fn.extend = $.extend = utils.extend;
		return $;
	  })();
	  utils.serializeObject = function serializeObject(obj, parents) {
		if ( parents === void 0 ) parents = [];
  
		if (typeof obj === 'string') { return obj; }
		var resultArray = [];
		var separator = '&';
		var newParents;
		function varName(name) {
		  if (parents.length > 0) {
			var parentParts = '';
			for (var j = 0; j < parents.length; j += 1) {
			  if (j === 0) { parentParts += parents[j]; }
			  else { parentParts += "[" + (encodeURIComponent(parents[j])) + "]"; }
			}
			return (parentParts + "[" + (encodeURIComponent(name)) + "]");
		  }
		  return encodeURIComponent(name);
		}
		function varValue(value) {
		  return encodeURIComponent(value);
		}
		Object.keys(obj).forEach(function (prop) {
		  var toPush;
		  if (Array.isArray(obj[prop])) {
			toPush = [];
			for (var i = 0; i < obj[prop].length; i += 1) {
			  if (!Array.isArray(obj[prop][i]) && typeof obj[prop][i] === 'object') {
				newParents = parents.slice();
				newParents.push(prop);
				newParents.push(String(i));
				toPush.push(utils.serializeObject(obj[prop][i], newParents));
			  } else {
				toPush.push(((varName(prop)) + "[]=" + (varValue(obj[prop][i]))));
			  }
			}
			if (toPush.length > 0) { resultArray.push(toPush.join(separator)); }
		  } else if (obj[prop] === null || obj[prop] === '') {
			resultArray.push(((varName(prop)) + "="));
		  } else if (typeof obj[prop] === 'object') {
			// Object, convert to named array
			newParents = parents.slice();
			newParents.push(prop);
			toPush = utils.serializeObject(obj[prop], newParents);
			if (toPush !== '') { resultArray.push(toPush); }
		  } else if (typeof obj[prop] !== 'undefined' && obj[prop] !== '') {
			// Should be string or plain value
			resultArray.push(((varName(prop)) + "=" + (varValue(obj[prop]))));
		  } else if (obj[prop] === '') { resultArray.push(varName(prop)); }
		});
		return resultArray.join(separator);
	  };
	  utils.request = (function(){
		var globals = {};
		var jsonpRequests = 0;
		function Request(requestOptions){
		  var globalsNoCallbacks = utils.extend({}, globals);
		  ('beforeCreate beforeOpen beforeSend error complete success statusCode').split(' ').forEach(function (callbackName) {
			delete globalsNoCallbacks[callbackName];
		  });
		  var defaults = utils.extend({
			url: win.location.toString(),
			method: 'GET',
			data: false,
			async: true,
			cache: true,
			user: '',
			password: '',
			headers: {},
			xhrFields: {},
			statusCode: {},
			processData: true,
			dataType: 'text',
			contentType: 'application/x-www-form-urlencoded',
			timeout: 0,
		  }, globalsNoCallbacks);
  
		  var options = utils.extend({}, defaults, requestOptions);
		  var proceedRequest;
  
		  // Function to run XHR callbacks and events
		  function fireCallback(callbackName) {
			var data = [], len = arguments.length - 1;
			while ( len-- > 0 ) data[ len ] = arguments[ len + 1 ];
  
			/*
			  Callbacks:
			  beforeCreate (options),
			  beforeOpen (xhr, options),
			  beforeSend (xhr, options),
			  error (xhr, status, message),
			  complete (xhr, stautus),
			  success (response, status, xhr),
			  statusCode ()
			*/
			var globalCallbackValue;
			var optionCallbackValue;
			if (globals[callbackName]) {
			  globalCallbackValue = globals[callbackName].apply(globals, data);
			}
			if (options[callbackName]) {
			  optionCallbackValue = options[callbackName].apply(options, data);
			}
			if (typeof globalCallbackValue !== 'boolean') { globalCallbackValue = true; }
			if (typeof optionCallbackValue !== 'boolean') { optionCallbackValue = true; }
			return (globalCallbackValue && optionCallbackValue);
		  }
  
		  // Before create callback
		  proceedRequest = fireCallback('beforeCreate', options);
		  if (proceedRequest === false) { return undefined; }
  
		  // For $ guys
		  if (options.type) { options.method = options.type; }
  
		  // Parameters Prefix
		  var paramsPrefix = options.url.indexOf('?') >= 0 ? '&' : '?';
  
		  // UC method
		  var method = options.method.toUpperCase();
  
		  // Data to modify GET URL
		  if ((method === 'GET' || method === 'HEAD' || method === 'OPTIONS' || method === 'DELETE') && options.data) {
			var stringData;
			if (typeof options.data === 'string') {
			  // Should be key=value string
			  if (options.data.indexOf('?') >= 0) { stringData = options.data.split('?')[1]; }
			  else { stringData = options.data; }
			} else {
			  // Should be key=value object
			  stringData = utils.serializeObject(options.data);
			}
			if (stringData.length) {
			  options.url += paramsPrefix + stringData;
			  if (paramsPrefix === '?') { paramsPrefix = '&'; }
			}
		  }
  
		  // JSONP
		  if (options.dataType === 'json' && options.url.indexOf('callback=') >= 0) {
			var callbackName = "f7jsonp_" + (Date.now() + ((jsonpRequests += 1)));
			var abortTimeout;
			var callbackSplit = options.url.split('callback=');
			var requestUrl = (callbackSplit[0]) + "callback=" + callbackName;
			if (callbackSplit[1].indexOf('&') >= 0) {
			  var addVars = callbackSplit[1].split('&').filter(function (el) { return el.indexOf('=') > 0; }).join('&');
			  if (addVars.length > 0) { requestUrl += "&" + addVars; }
			}
  
			// Create script
			var script = doc.createElement('script');
			script.type = 'text/javascript';
			script.onerror = function onerror() {
			  clearTimeout(abortTimeout);
			  fireCallback('error', null, 'scripterror', 'scripterror');
			  fireCallback('complete', null, 'scripterror');
			};
			script.src = requestUrl;
  
			// Handler
			win[callbackName] = function jsonpCallback(data) {
			  clearTimeout(abortTimeout);
			  fireCallback('success', data);
			  script.parentNode.removeChild(script);
			  script = null;
			  delete win[callbackName];
			};
			doc.querySelector('head').appendChild(script);
  
			if (options.timeout > 0) {
			  abortTimeout = setTimeout(function () {
				script.parentNode.removeChild(script);
				script = null;
				fireCallback('error', null, 'timeout', 'timeout');
			  }, options.timeout);
			}
  
			return undefined;
		  }
  
		  // Cache for GET/HEAD requests
		  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS' || method === 'DELETE') {
			if (options.cache === false) {
			  options.url += paramsPrefix + "_nocache" + (Date.now());
			}
		  }
  
		  // Create XHR
		  var xhr = new XMLHttpRequest();
  
		  // Save Request URL
		  xhr.requestUrl = options.url;
		  xhr.requestParameters = options;
  
		  // Before open callback
		  proceedRequest = fireCallback('beforeOpen', xhr, options);
		  if (proceedRequest === false) { return xhr; }
  
		  // Open XHR
		  xhr.open(method, options.url, options.async, options.user, options.password);
  
		  // Create POST Data
		  var postData = null;
  
		  if ((method === 'POST' || method === 'PUT' || method === 'PATCH') && options.data) {
			if (options.processData) {
			  var postDataInstances = [ArrayBuffer, Blob, Document, FormData];
			  // Post Data
			  if (postDataInstances.indexOf(options.data.constructor) >= 0) {
				postData = options.data;
			  } else {
				// POST Headers
				var boundary = "---------------------------" + (Date.now().toString(16));
  
				if (options.contentType === 'multipart/form-data') {
				  xhr.setRequestHeader('Content-Type', ("multipart/form-data; boundary=" + boundary));
				} else {
				  xhr.setRequestHeader('Content-Type', options.contentType);
				}
				postData = '';
				var data$1 = utils.serializeObject(options.data);
				if (options.contentType === 'multipart/form-data') {
				  data$1 = data$1.split('&');
				  var newData = [];
				  for (var i = 0; i < data$1.length; i += 1) {
					newData.push(("Content-Disposition: form-data; name=\"" + (data$1[i].split('=')[0]) + "\"\r\n\r\n" + (data$1[i].split('=')[1]) + "\r\n"));
				  }
				  postData = "--" + boundary + "\r\n" + (newData.join(("--" + boundary + "\r\n"))) + "--" + boundary + "--\r\n";
				} else if (options.contentType === 'application/json') {
				  postData = JSON.stringify(options.data);
				} else {
				  postData = data$1;
				}
			  }
			} else {
			  postData = options.data;
			  xhr.setRequestHeader('Content-Type', options.contentType);
			}
		  }
		  if (options.dataType === 'json' && (!options.headers || !options.headers.Accept)) {
			xhr.setRequestHeader('Accept', 'application/json');
		  }
  
		  // Additional headers
		  if (options.headers) {
			Object.keys(options.headers).forEach(function (headerName) {
			  if (typeof options.headers[headerName] === 'undefined') { return; }
			  xhr.setRequestHeader(headerName, options.headers[headerName]);
			});
		  }
  
		  // Check for crossDomain
		  if (typeof options.crossDomain === 'undefined') {
			// eslint-disable-next-line
			options.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(options.url) && RegExp.$2 !== win.location.host;
		  }
  
		  if (!options.crossDomain) {
			xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		  }
  
		  if (options.xhrFields) {
			utils.extend(xhr, options.xhrFields);
		  }
  
  
		  // Handle XHR
		  xhr.onload = function onload() {
			if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 0) {
			  var responseData;
			  if (options.dataType === 'json') {
				var parseError;
				try {
				  responseData = JSON.parse(xhr.responseText);
				} catch (err) {
				  parseError = true;
				}
				if (!parseError) {
				  fireCallback('success', responseData, xhr.status, xhr);
				} else {
				  fireCallback('error', xhr, 'parseerror', 'parseerror');
				}
			  } else {
				responseData = xhr.responseType === 'text' || xhr.responseType === '' ? xhr.responseText : xhr.response;
				fireCallback('success', responseData, xhr.status, xhr);
			  }
			} else {
			  fireCallback('error', xhr, xhr.status, xhr.statusText);
			}
			if (options.statusCode) {
			  if (globals.statusCode && globals.statusCode[xhr.status]) { globals.statusCode[xhr.status](xhr); }
			  if (options.statusCode[xhr.status]) { options.statusCode[xhr.status](xhr); }
			}
			fireCallback('complete', xhr, xhr.status);
			_atEv.trigger('xhr',xhr);
		  };
  
		  xhr.onerror = function onerror() {
			fireCallback('error', xhr, xhr.status, xhr.status);
			fireCallback('complete', xhr, 'error');
		  };
  
		  // Timeout
		  if (options.timeout > 0) {
			xhr.timeout = options.timeout;
			xhr.ontimeout = function () {
			  fireCallback('error', xhr, 'timeout', 'timeout');
			  fireCallback('complete', xhr, 'timeout');
			};
		  }
  
		  // Ajax start callback
		  proceedRequest = fireCallback('beforeSend', xhr, options);
		  if (proceedRequest === false) { return xhr; }
  
		  // Send XHR
		  xhr.send(postData);
  
		  // Return XHR object
		  return xhr;
		};
  
		function RequestShortcut(method) {
		  var assign, assign$1;
  
		  var args = [], len = arguments.length - 1;
		  while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];
		  var ref = [];
		  var url = ref[0];
		  var data = ref[1];
		  var success = ref[2];
		  var error = ref[3];
		  var dataType = ref[4];
		  if (typeof args[1] === 'function') {
			(assign = args, url = assign[0], success = assign[1], error = assign[2], dataType = assign[3]);
		  } else {
			(assign$1 = args, url = assign$1[0], data = assign$1[1], success = assign$1[2], error = assign$1[3], dataType = assign$1[4]);
		  }
		  [success, error].forEach(function (callback) {
			if (typeof callback === 'string') {
			  dataType = callback;
			  if (callback === success) { success = undefined; }
			  else { error = undefined; }
			}
		  });
		  dataType = dataType || (method === 'json' || method === 'postJSON' ? 'json' : undefined);
		  var requestOptions = {
			url: url,
			method: method === 'post' || method === 'postJSON' ? 'POST' : 'GET',
			data: data,
			success: success,
			error: error,
			dataType: dataType,
		  };
		  if (method === 'postJSON') {
			utils.extend(requestOptions, {
			  contentType: 'application/json',
			  processData: false,
			  crossDomain: true,
			  data: typeof data === 'string' ? data : JSON.stringify(data),
			});
		  }
		  return Request(requestOptions);
		}
		function RequestShortcutPromise(method) {
		  var args = [], len = arguments.length - 1;
		  while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];
  
		  var url = args[0];
		  var data = args[1];
		  var dataType = args[2];
		  return new Promise(function (resolve, reject) {
			RequestShortcut(
			  method,
			  url,
			  data,
			  function (responseData, status, xhr) {
				resolve({ data: responseData, status: status, xhr: xhr });
			  },
			  function (xhr, status, message) {
				// eslint-disable-next-line
				reject({ xhr: xhr, status: status, message: message });
			  },
			  dataType
			);
		  });
		}
  
		utils.extend(Request, {
		  get: function () {
			var args = [], len = arguments.length;
			while ( len-- ) args[ len ] = arguments[ len ];
  
			return RequestShortcut.apply(void 0, [ 'get' ].concat( args ));
		},
		  post: function () {
			var args = [], len = arguments.length;
			while ( len-- ) args[ len ] = arguments[ len ];
  
			return RequestShortcut.apply(void 0, [ 'post' ].concat( args ));
		},
		  json: function () {
			var args = [], len = arguments.length;
			while ( len-- ) args[ len ] = arguments[ len ];
  
			return RequestShortcut.apply(void 0, [ 'json' ].concat( args ));
		},
		  getJSON: function () {
			var args = [], len = arguments.length;
			while ( len-- ) args[ len ] = arguments[ len ];
  
			return RequestShortcut.apply(void 0, [ 'json' ].concat( args ));
		},
		  postJSON: function () {
			var args = [], len = arguments.length;
			while ( len-- ) args[ len ] = arguments[ len ];
  
			return RequestShortcut.apply(void 0, [ 'postJSON' ].concat( args ));
		},
		});
  
		Request.promise = function requestPromise(requestOptions) {
		  return new Promise(function (resolve, reject) {
			Request(utils.extend(requestOptions, {
			  success: function success(data, status, xhr) {
				resolve({ data: data, status: status, xhr: xhr });
			  },
			  error: function error(xhr, status, message) {
				// eslint-disable-next-line
				reject({ xhr: xhr, status: status, message: message });
			  },
			}));
		  });
		};
		utils.extend(Request.promise, {
		  get: function () {
			var args = [], len = arguments.length;
			while ( len-- ) args[ len ] = arguments[ len ];
  
			return RequestShortcutPromise.apply(void 0, [ 'get' ].concat( args ));
		},
		  post: function () {
			var args = [], len = arguments.length;
			while ( len-- ) args[ len ] = arguments[ len ];
  
			return RequestShortcutPromise.apply(void 0, [ 'post' ].concat( args ));
		},
		  json: function () {
			var args = [], len = arguments.length;
			while ( len-- ) args[ len ] = arguments[ len ];
  
			return RequestShortcutPromise.apply(void 0, [ 'json' ].concat( args ));
		},
		  getJSON: function () {
			var args = [], len = arguments.length;
			while ( len-- ) args[ len ] = arguments[ len ];
  
			return RequestShortcutPromise.apply(void 0, [ 'json' ].concat( args ));
		},
		  postJSON: function () {
			var args = [], len = arguments.length;
			while ( len-- ) args[ len ] = arguments[ len ];
  
			return RequestShortcutPromise.apply(void 0, [ 'postJSON' ].concat( args ));
		},
		});
  
		Request.setup = function setup(options) {
		  if (options.type && !options.method) {
			utils.extend(options, { method: options.type });
		  }
		  utils.extend(globals, options);
		};
		return Request;
	  })();
	  utils.fetch = (function(){
		var Request = utils.request;
		var isFun = function isFunction(func) {
		  return typeof func === 'function';
		};
		function Fetch(opts,su,err){
		  if(typeof opts != "string" && 
			typeof opts != "object" || opts instanceof Array) return null;
		  var r,s,t,u;
		  if(typeof opts == "string"){
			s = opts;
			var opts = {};
			opts.url = s;
		  }
		  if(su && isFun(su)) opts.success = su;
		  if(err && isFun(err)) opts.error = err;
		  r = Request(opts);
		  return r;
		}
		return Fetch;
	  })();
	  utils.merge = function merge() {
		var args = [], len$1 = arguments.length;
		while ( len$1-- ) args[ len$1 ] = arguments[ len$1 ];
  
		var to = args[0];
		args.splice(0, 1);
		var from = args;
  
		for (var i = 0; i < from.length; i += 1) {
		  var nextSource = args[i];
		  if (nextSource !== undefined && nextSource !== null) {
			var keysArray = Object.keys(Object(nextSource));
			for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
			  var nextKey = keysArray[nextIndex];
			  var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
			  if (desc !== undefined && desc.enumerable) {
				to[nextKey] = nextSource[nextKey];
			  }
			}
		  }
		}
		return to;
	  };
	  utils.cookie = utils.cookieConfig = function (key, value, options) {
  
		// write
		if (value !== undefined) {
		  options = Utils.extend({}, utils.cookieConfig.defaults, options);
  
		  if (value === null) {
			options.expires = -1;
		  }
  
		  if (typeof options.expires === 'number') {
			var days = options.expires, t = options.expires = new Date();
			t.setDate(t.getDate() + days);
		  }
  
		  value = utils.cookieConfig.json ? JSON.stringify(value) : String(value);
  
		  return (doc.cookie = [
			encodeURIComponent(key), '=', utils.cookieConfig.raw ? value : encodeURIComponent(value),
			options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
			options.path    ? '; path=' + options.path : '',
			options.domain  ? '; domain=' + options.domain : '',
			options.secure  ? '; secure' : ''
		  ].join(''));
		}
  
		// read
		var decode = utils.cookieConfig.raw ? raw : decoded;
		var cookies = doc.cookie.split('; ');
		for (var i = 0, l = cookies.length; i < l; i++) {
		  var parts = cookies[i].split('=');
		  if (decode(parts.shift()) === key) {
			var cookie = decode(parts.join('='));
			return utils.cookieConfig.json ? JSON.parse(cookie) : cookie;
		  }
		}
		_atEv.trigger('cookie',{key: key,val: value});
		return null;
	  }
	  utils.cookieConfig.defaults = {};
	  utils.removeCookie = function (key, options) {
		if (utils.cookie(key) !== null) {
		  utils.cookie(key, null, options);
		  return true;
		}
		return false;
	  };
	  utils.obj = new (function AtObject(){});
	  utils.num = new (function AtNumber(){});
	  utils.bool = new (function AtBoolean(){});
	  utils.str = new (function AtString(){});
	  utils.arr = new (function AtArray(){});
	  utils.str.words = function(str){
		if(!utils.isStr(str)) return;
		if(!str.match(' ')) return str;
		return str.split(' ');
	  };
	  utils.str.camelCase = function(str){
		if(!utils.isStr(str)) return;
		return toCamelCase(toKebabCase(str));
	  };
	  utils.str.kebabCase = function(str){
		if(!utils.isStr(str)) return;
		return toKebabCase(str);
	  };
	  utils.str.snakeCase = function(str){
		if(!utils.isStr(str)) return;
		return toSnakeCase(str);
	  };
	  utils.str.swapCase = function(str){
		if(!utils.isStr(str)) return;
		return toSwapCase(str);
	  };
	  utils.str.capitalize = function(str,restToLower){
		return capitalize(str,restToLower);
	  };
	  utils.str.titleCase = function(str,noSplit){
		return toTitleCase(str,noSplit);
	  };
	  utils.arr.forEach = forEachArr;
	  utils.arr.find = findArr;
	  utils.arr.filter = filterArr;
	  utils.obj.assign = utils.extend;
	  utils.obj.isLastProp = function(obj,prop){
		if(!obj || !prop || !prop in obj || 
		  typeof obj != "object") return false;
		var a = Object.keys(obj);
		if(a.pop() == prop){
		  return true;
		} else {
		  return false;
		}
	  };
	  utils.obj.isFirstProp = function(obj,prop){
		if(!obj || !prop || !prop in obj || 
		  typeof obj != "object") return false;
		var a = Object.keys(obj);
		if(a.shift() == prop){
		  return true;
		} else {
		  return false;
		}
	  };
	  utils.obj.isAtIndex = function(obj,prop,ind){
		if(!obj || !prop || !prop in obj || 
		  typeof obj != "object" || !ind || isNaN(ind)) return false;
		var a = Object.keys(obj);
		if(a[ind] == prop){
		  return true;
		} else {
		  return false;
		}
	  };
	  utils.indexOf = function(obj,prop){
		if(!obj || !prop) return null;
		var ind = [prop,null];
		if(!obj instanceof Array && (typeof obj == "object" || typeof obj == "function")){
		  var i = 1,a = Object.keys(obj);
		  for (var i = 0; i < a.length; i++) {
			if(a[i] == prop){
			  ind = [i,obj[a[i]]];
			}
		  }
		} else if(obj instanceof Array && typeof obj == "object"){
		  obj = Object.fromEntries(obj);
		  if(prop in obj){
			ind = [prop,obj[prop]];
		  } else {
			ind = [prop,null];
		  }
		} else if(typeof obj == "string"){
		  ind = [obj.indexOf(prop),prop];
		} else if(typeof obj == "boolean" || typeof obj == "number"){
		  var a = obj == prop;
		  ind = [Number(a),prop];
		} else {
		  ind = [0,0];
		}
		return ind;
	  };
	  utils.obj.lastProp = function(obj){
		if(!obj || typeof obj != "object") return false;
		var a = Object.keys(obj);
		if(a.pop() in obj){
		  return [a.pop(),obj[a.pop()]];
		} else {
		  return false;
		}
	  };
	  utils.obj.firstProp = function(obj){
		if(!obj || typeof obj != "object") return false;
		var a = Object.keys(obj);
		if(a.shift() in obj){
		  return [a.shift(),obj[a.shift()]];
		} else {
		  return false;
		}
	  };
	})();
  
  
	// +++ 
	// + Config
	// +++
  
	if(!scr) return null;
	if(scr){
	  var provider = (function(){
		var $s = $(scr);
		var config = $s.attr('@provide');
		if(!config){
		  error('The script tag that called this script has no attribute "@provide". '+
		  "if you want you can put \"@provide=\"@all\"\", \n"+
		  "example: <script src=\"/path/to/at.js\" @provide=\"@all\"></script>");
		}
		var provided = provide(config);
		if(provided[0] == "error"){
		  error(provided[1]);
		} else {
		  return provided[1];
		}
	  })();
	  var pr = function(str){
		return provider.indexOf(str);
	  }
	}
  
  
	// +++ 
	// + At constructor init
	// +++
  
  
  
	At = function At(){
	  var at = this;
	  at.win = win;
	  at.doc = doc;
	  at.script = scr;
	  at.version = "1.0.0";
	  at.path = currentPath;
	  at.jsFileName = scrName;
	  at.jsFilePath = scrPath;
	  at.jsFileUrl = scrUrl;
	  at.provided = provider;
	  __construct(at);
	}
  
	function AtModules(){
	  this[0] = {};
	  this[1] = [];
	  this[2] = {
		keys: [],
		values: [],
	  };
	}
	AtModules.prototype = new (function Mods(){
	  var m = this;
	  m.loadMods = function(){
		var mods = this;
		mods[1] = [];
		mods[2] = {};
		mods[2].keys = [];
		mods[2].values = [];
  
		for(var mod in mods[0]){
		  mods[1].push({
			key: mod,
			value: mods[0][mod]
		  });
		  mods[2].values.push(mods[0][mod]);
		}
		mods[2].keys = Object.keys(mods[0]);
	  }
	  m.add = function(key,val){
		var mods = this;
		mods[0][key] = val;
		mods.loadMods();
		return mods[0][key];
	  };
	  m.find = function(key){
		var mods = this;
		return key in mods[0];
	  };
	  m.get = function(key){
		var mods = this;
		if(mods.find(key)){
		  return mods[0][key];
		} else {
		  return false;
		}
	  };
	  m.del = function(){
		var mods = this;
		if(mods.find(key)){
		  delete mods[0];
		  mods.loadMods();
		  return true;
		} else {
		  return false;
		}
	  };
	})();
  
  
	var _at = At.prototype = new (function AtRoot(){
	  var proto = this,at = this;
	  proto.exists = function(prop){
		var t = this || at;
		if(typeof prop != "string") return null;
		return t[prop] ? true : false;
	  };
	  if(!pr('all') && !pr('mm')) return;
	  var modules = new AtModules();
	  proto.return  = function(mod){
		var _at = this;
		if(modules.find(mod)){
		  return modules.get(mod);
		} else if(_at[mod]){
		  return _at[mod];
		} else {
		  return null;
		}
	  };
	  proto.import = function(){
		var arr = arguments;
		var path = getPath(document.currentScript.src);
		for (var i = 0; i < arr.length; i++) {
		  var sc = arr[i];
		  if(typeof sc != "string") continue;
		  var script = doc.createElement('script');
		  script.src = path+sc;
		  doc.head.appendChild(script);
		}
	  };
	  proto.import.css = function(){
		var arr = arguments;
		var path = getPath(document.currentScript.src);
		for (var i = 0; i < arr.length; i++) {
		  var link = arr[i];
		  if(typeof sc != "string") continue;
		  var link = doc.createElement('link');
		  Utils.AtDom(link).attr({
			href: path+link,
			rel: 'stylesheet'
		  });
		  doc.head.appendChild(link);
		}
	  };
	  window.imports = proto.import;
	  proto.require = function(mod,from){
		var m = proto.return(mod);
		if(m == null && from){
		  proto.import(from);
		}
		m = proto.return(mod);
		return m;
	  };
	  if(!window.require){
		window.require = proto.require;
	  }
	  proto.append = function(mod,fn){
		modules.add(mod,fn);
		return proto.return(mod);
	  }
	  proto.remove = function(mod){
		modules.del(mod);
		return [true,modules.get(mod)];
	  }
	  proto.define = proto.module = function(mod,dep,fn){
		if(!dep || !dep instanceof Array) dep = [];
		if(!fn || typeof fn != "function") return;
		if(!mod || typeof mod != "string") return;
		var deps = [proto.require,proto.define,proto.import];
		for (var i = 0; i < dep.length; i++) {
		  var d = proto.return(dep[i]);
		  deps.push(d);
		}
		var modf = fn.apply(at,deps);
		if(!modf) return;
		proto.append(mod,modf);
		return proto.return(mod);
	  };
	  if(!window.define){
		window.define = proto.define;
	  }
	  proto.extends = function(cls,key){
		var proto = at.__proto__.__proto__;
		if(!cls || !Utils.isFun(cls)){
		  err('The Class Given is not a Function');
		  return new TypeError('The Class Given is not a Function');
		}
		var nm = cls.name ? cls.name : (key ? key : null);
		if(!nm || !Utils.isStr(nm)){
		  err('The Name of the Class Given is not a valid string');
		  return new TypeError('The Name of the Class Given is not a valid string');
		}
		if(nm[0] == "@" || nm[0] == "$"){
		  return Utils.defineElementGetter(proto,nm.replace(/@/g,'$'),function ExtendedFunction(){
			return cls;
		  });
		} else {
		  return (_createClass)(proto,null,[{
			"key": nm,
			"enumerable": true,
			"value": cls
		  }]);
		}
	  };
	})();
  
	var __at = At.prototype.__proto__.__proto__ = new (function AtMods(){
	  var proto = this;
	  proto.addProps = function(){
		for (var i = 0; i < arguments.length; i++) {
		  var prop = arguments[i];
		  if(prop.value){
			_createClass(proto,null,[prop]);
		  }
		}
	  };
	}); 
  
	var ___at = At.prototype.__proto__.__proto__.__proto__.__proto__ = new (function AtUtils(){
	  var proto = this,
		  winUtils = ['isFun','isNum','isStr','isNull','isUnd','empty','isset'],
		  utils = ['isEqual','obj','num','str','bool','arr','indexOf'].concat(winUtils);
	  if(pr('utils') || pr('all')){
		utils.forEach(function(util){
		  proto[util] = Utils[util];
		});
  
		winUtils.forEach(function(util){
		  window[util] = Utils[util];
		});
  
		Array.prototype.append = Array.prototype.push;
		Array.prototype.prepend = Array.prototype.unshift;
  
		String.prototype.equals = Number.prototype.equals = 
		Boolean.prototype.equals = Array.prototype.equals = function isEqual(variable){
		  return Utils.isEqual(this,variable);
		}
  
		String.prototype.capitalize = function(restToLower){
		  return Utils.str.capitalize(this.valueOf(),restToLower);
		};
		String.prototype.camelCase = function(){
		  return Utils.str.camelCase(this.valueOf());
		};
		String.prototype.kebabCase = function(){
		  return Utils.str.kebabCase(this.valueOf());
		};
		String.prototype.swapCase = function(){
		  return Utils.str.swapCase(this.valueOf());
		};
		String.prototype.titleCase = function(noSplit){
		  return Utils.str.titleCase(this.valueOf(),noSplit);
		};
  
	  }
	})();
  
	var _atModel = At.prototype.__proto__.__proto__.__proto__.__proto__.__proto__.__proto__ = new (function AtModel(){
	  var model = this;
	  if(pr('model') || pr('all')){
		model['[[At]]'] = {
		  fileTypes: {
			html: "application/html",
			css: "stylesheet/css",
			js: "application/javascript",
			xml: "application/xml",
			xquery: "application/xquery",
			php: "application/x-httpd-php",
		  },
		};
		model['[[Symbols]]'] = Symbols;
		model.getModel = function (){
		  var at = this; 
		  var model = 'At\n.\n';
		  for(var prop in at){
			var tabs = "";
			var _p = _AT[prop];
			var pl = '├── ';
			var cn = _p.constructor.name;
			var cs = (function(){
			  if(cn == "Function"){
				var symb = Symbols[5][0];
				return " "+symb;
			  } else if (cn == "String"){
				if(_p.length < 10){
				  return ": "+_p;
				} else {
				  return " (str)";
				}
			  } else if (cn == "Boolean"){
				return ": "+_p;
			  } else if (cn == "Number"){
				if(_p < 100000){
				  return ": "+_p;
				} else {
				  return " (num)";
				}
			  } else if(cn == "Object"){
				return " {...}";
			  } else if(cn == "Array"){
				if(_p.length < 4){
				  return _p;
				} else {
				  return " [...]";
				}
			  } else {
				return " <"+cn+">";
			  }
			})();
			function isLast(obj){
			  var h = Utils.obj.isLastProp(obj,prop);
			  pl = '├── ';
			  if(h){
				cs = cs + "\n"+tabs+"└── :root <"+obj.__proto__.__proto__.constructor.name+">";
			  }
			}
			if(prop in at.__proto__.__proto__.__proto__.__proto__.__proto__.__proto__.__proto__.__proto__.__proto__){
			  tabs = "\t\t\t\t\t";
			  isLast(at.__proto__.__proto__.__proto__.__proto__.__proto__.__proto__.__proto__.__proto__.__proto__);
			} else if(prop in at.__proto__.__proto__.__proto__.__proto__.__proto__.__proto__.__proto__){
			  tabs = "\t\t\t\t";
			  isLast(at.__proto__.__proto__.__proto__.__proto__.__proto__.__proto__.__proto__);
			} else if(prop in at.__proto__.__proto__.__proto__.__proto__.__proto__){
			  tabs = "\t\t\t";
			  isLast(at.__proto__.__proto__.__proto__.__proto__.__proto__);
			} else if(prop in at.__proto__.__proto__.__proto__){
			  tabs = "\t\t";
			  isLast(at.__proto__.__proto__.__proto__);
			} else if(prop in at.__proto__){
			  tabs = "\t";
			  isLast(at.__proto__);
			} else {
			  tabs += '';
			  isLast(at);
			}
			model += (tabs+pl+prop+cs+"\n");
		  }
		  return model;
		};
	  };
	})();
  
	var _atEv = At.prototype
	.__proto__.__proto__.__proto__.__proto__
	.__proto__.__proto__.__proto__.__proto__ = new (function AtEvents(){
	  var evt = this;
	  if(pr('events') || pr('all')){
		evt.addEventListener = evt.on = function AddEventListener(evt,cb){
		  var at = this;
		  return $(atEl).on('at:'+evt,cb);
		};
		evt.removeEventListener = evt.off = function RemoveEventListener(evt){
		  var at = this;
		  return $(atEl).off('at:'+evt);
		};
		evt.trigger = evt.dispatchEvent = function FireEvent(event, eventData){
		  var at = this;
		  return $(atEl).trigger('at:'+event,eventData);
		};
	  } else {
		evt.trigger = evt.dispatchEvent = function FireEvent(event, eventData){
		  return null;
		};
	  }
	})();
  
	_createClass(_atEv.__proto__,null,[
	  {
		"key": "getUid",
		"value": function getUid(nm){
		  var key = "at";
		  if(nm && typeof nm == "string") key = nm;
		  uid = key+String(uid_index);
		  uid_index++;
		  return uid;
		}
	  },
	  {
		"key": "valueOf",
		"value": function(){return _atEv.getUid();}
	  },
	  {
		"key": "toString",
		"value": function(){return this.getModel()}
	  }
	]);
  
	// +++
	// + Modules
	// +++
  
	var modsprovider = provider['mods'] || pr('mods');
  
	if(pr('all') || modsprovider){
  
	__at.addProps({
	  "key": "dom",
	  "enumerable": true,
	  "value":$
	},{
	  "key": "LSM",
	  "enumerable": true,
	  "value": modulr(['lsm'],modsprovider,function(){
		function LSM(name){
		  var self = this;
		  if(self == null){
			self = {};
		  }
  
		  self.name = name ? name : (doc.title ? doc.title : 'LSMjs_'+randFrom(1000,9999));
		  self.init()
		}
		LSM.prototype = {
		  init: function(){
			var that = this,
				options = that.options,
				Methods,name,Settings = options;
  
			function getLocalStorage(){
			  return that.LS;
			}
  
			getLocalStorage();
  
			name = that.name;
			_atEv.trigger('lsm:init',name);
		  },
  
		  defineLSG(){
			var that = this,
			  name = that.name;
  
			if(localStorage.getItem(name) == null){
			  var newLSMObject = JP(JT({name:name}));
			  localStorage.setItem(name,JT(newLSMObject));
			}
		  },
  
		  new: function(res,val){
			var that = this,
			  name = that.name;
  
			that.defineLSG();
  
			var updateLSMObject = JSON.parse(localStorage.getItem(name));
  
			if(typeof res == "object" && res instanceof Array == false){
			  for(var ids in res){
				updateLSMObject[ids] = res[ids];
				_atEv.trigger('lsm:set',{name:name,key:ids,val:res[ids]});
			  }
			} else {
			  updateLSMObject[res] = val;
			  _atEv.trigger('lsm:set',{name:name,key:res,val:val});
			}
  
			localStorage.setItem(name,JT(updateLSMObject));
		  },
  
		  set: function(res,val){
			var that = this;
  
			that.new(res,val);
		  },
  
		  get: function(){
			var that = this,
			  name = that.name,ret,_ret,
			  args = toArray(arguments),
			  res = args[0];
  
			if(args[1]){
			  args.shift();
			} else {
			  args = null;
			}
  
			var values = args;
  
  
			that.defineLSG();
  
			//localStorage[name].unshift(res);
  
			var getFromLSMObject = JSON.parse(localStorage.getItem(name));
  
			//if(!res && !index) return getFromLSMObject;
  
			if(res !== null){
			  ret = getFromLSMObject[res];
			} else{}
  
			if(values){
			  _ret = toArray(values);
			  _ret.forEach(function(prop){
				ret = ret[prop];
			  });
			} else {
			  ret = getFromLSMObject[res];
			}
  
			return ret;
		  },
  
		  getAll: function(){
			var that = this,
			  name = that.name;
			var getFromLSMObject = JSON.parse(localStorage.getItem(name));
			return getFromLSMObject;
		  },
  
		  remove: function(res){
			var that = this,
			  name = that.name;
  
			that.defineLSG();
  
			var updateLSMObject = JSON.parse(localStorage.getItem(name));
  
			delete updateLSMObject[res];
  
			localStorage.setItem(name,JT(updateLSMObject));
			_atEv.trigger('lsm:remove',{name:name,key:res});
		  },
  
		  delete: function(item){
			var that = this;
			that.remove(item)
		  },
  
		  clone: function(item1,item2){
			var that = this,
			  name = that.name;
  
			var itVal = that.get(item1);
  
			that.set(item2,itVal);
			_atEv.trigger('lsm:clone',{name:name,item1:item1,item2:item2});
		  },
  
		  rename: function(item1,item2){
			var that = this,
			  name = that.name;
  
			that.clone(item1,item2);
			that.remove(item1);
			_atEv.trigger('lsm:rename',{name:name});
		  },
  
		  saveForm: function(el,options){
			var that = this,
				that_name = that.name + '_form',
				$el = $(el),
				defaults = {
				  exclude: ':password, input[type="hidden"], :file, .disable_save',
				  include: null,
				  formName: that_name,
				  addPathToName: false,
				  addPathLength: -255,
				  loadInputs: true,
				  sameNameSeparator: '___',
				  resetOnSubmit: true
				},
				settings = Utils.extend({},defaults, options);
  
			  var _elementList = [];
			  var _loadingList = {};
			  var _formName = '';
  
			  var $plugin = that.saveForm;
  
			  $plugin.setFormName = function() {
				var $form = $el;
				_formName =
					settings.formName !== undefined
						? settings.formName
						: $form.attr('id') !== undefined
						? $form.attr('id')
						: $form.attr('name') !== undefined
						? $form.attr('name')
						: undefined;
				if (_formName == undefined) {
					var formIndex = $('form').index($form);
					if (formIndex !== -1) {
						_formName =
							win.location.pathname +
							'_formindex_' +
							formIndex;
					} else {
						return false;
					}
				}
				if (settings.addPathToName === true) {
					_formName =
						_formName +
						'___' +
						win.location.pathname.slice(
							settings.addPathLength
						);
				}
				return true;
			};
  
			$plugin.setFormName();
  
			var $5 = 'SaveForm_'+_formName;
  
			if(that.get($5) == undefined){
			  that.set($5,{})
			} else {}
  
			$plugin.set = function(name,val){
  
			  var EJ = that.get($5);
  
			  EJ[name] = val;
  
			  that.set($5,EJ);
  
			};
  
			$plugin.get = function(name){
  
			  var TOBJ = that.get($5);
  
			  TOBJ = TOBJ[name];
  
			  return TOBJ
  
			};
  
			$plugin.remove = function(name){
  
			  var TOBJ = that.get($5);
  
			  delete TOBJp[name];
  
			};
  
			$plugin.addElement = function(element) {
				var $element = $(element);
				if ($element.is(settings.exclude)) {
					return;
				}
				if (
					settings.include !== null &&
					!$element.is(settings.include)
				) {
					return;
				}
					var name = $plugin.getName(element),
					callbackMatch = undefined;
				if($plugin.callbacks.length > 0) {
					$.each($plugin.callbacks, function(index, callback) {
						if(callback.match(element)) {
							callbackMatch = callback;
							return false;
						}
					});
				}
				if (name) {
					$element
						.on('input',function(e) {
							$plugin.storeElement(e);
						})
						.keyup(
							debounce(function(e) {
								$plugin.storeElement(e);
							}, 500)
						);
  
					if (_loadingList[name] === undefined) {
						_loadingList[name] = 0;
					} else {
						// If another element is found with the same name that isn't a radio group,
						// add multiple data to differentiate the field
						if (!$element.is(':radio')) {
							_loadingList[name]++;
  
							$.data(
								element,
								'multiple',
								_loadingList[name]
							);
							name =
								name +
								settings.sameNameSeparator +
								_loadingList[name];
						}
					}
					if (_elementList.indexOf(name) === -1) {
						_elementList.push(name);
					}
					if (settings.loadInputs === true) {
						if (callbackMatch && callbackMatch.loadElement) {
							callbackMatch.loadElement(element, $plugin);
						} else {
							$plugin.loadElement(element);
						}
					}
				}
			};
  
			$plugin.loadElement = function(element) {
			  var $element = $(element),
				  name = this.getName(element),
				  value = $plugin.get(name);
			  if (value !== null) {
				  value = value;
				  if ($element.is(':checkbox')) {
					  $element.prop('checked', value).change();
				  } else if ($element.is(':radio')) {
					  if (value == $element.val()) {
						  $element.prop('checked', true).change();
					  }
				  } else {
					  $element.val(value).change();
				  }
			  }
			};
  
			$plugin.storeElement= function(event) {
				var name = $plugin.getName(event.target),
					$element = $(event.target),
					value;
				if ($(event.target).is(':checkbox')) {
					value = $element.prop('checked');
				} else {
					value = $element.val();
				}
				$plugin.set(name,value);
			};
  
			$plugin.storeElementList= function() {
				$plugin.set(
					'elementList_' + _formName,
					_elementList
				);
			};
  
			$plugin.clearElementList= function() {
				$plugin.remove('elementList_' + _formName);
			};
  
			$plugin.getName= function(element) {
				var $element = $(element);
				// Set by name first to allow radio groups to function, then id
				var elName =
					$element.attr('name') !== undefined
						? $element.attr('name')
						: $element.attr('id') !== undefined
						? $element.attr('id')
						: undefined;
				if (elName === undefined) {
					return undefined;
				}
				return (
					_formName +
					'_' +
					elName +
					($.data(element, 'multiple') !== undefined
						? settings.sameNameSeparator +
						  $.data(element, 'multiple')
						: '')
				);
			}
  
			$plugin.callbacks = [];
  
			$plugin.addCallback = function(callback) {
			  $plugin.callbacks.push(callback);
			};
  
			$plugin.getElementList = function(savedFormName) {
			  return (
						$plugin.get('elementList_' + savedFormName)
					|| []
				);
			};
  
			$plugin.clearStorage = function(savedFormName) {
				var elements = $plugin.getElementList(savedFormName);
				if (elements.length > 0) {
					$.each(elements, function(key, value) {
						$plugin.remove(value);
					});
					return true;
				}
			}
  
  
			if (!$plugin.setFormName()) {
				return;
			}
			_elementList = $plugin.getElementList(_formName);
			$el.find(':input')
				.each(function() {
					$plugin.addElement(this);
				});
			$plugin.storeElementList();
			if (settings.resetOnSubmit === true) {
				$el.submit(function() {
					$plugin.clearStorage($plugin._formName);
				});
			}
  
			function debounce(func, wait, immediate) {
			  var timeout, args, context, timestamp, result;
			  if (null == wait) wait = 100;
  
			  function later() {
				  var last = Date.now() - timestamp;
  
				  if (last < wait && last >= 0) {
					  timeout = setTimeout(later, wait - last);
				  } else {
					  timeout = null;
					  if (!immediate) {
						  result = func.apply(context, args);
						  context = args = null;
					  }
				  }
			  }
  
			  var debounced = function() {
				  context = this;
				  args = arguments;
				  timestamp = Date.now();
				  var callNow = immediate && !timeout;
				  if (!timeout) timeout = setTimeout(later, wait);
				  if (callNow) {
					  result = func.apply(context, args);
					  context = args = null;
				  }
				  return result;
			  };
			  debounced.clear = function() {
				  if (timeout) {
					  clearTimeout(timeout);
					  timeout = null;
				  }
			  };
			  debounced.flush = function() {
				  if (timeout) {
					  result = func.apply(context, args);
					  context = args = null;
  
					  clearTimeout(timeout);
					  timeout = null;
				  }
			  };
  
			  return debounced;
			}
		  },
		};
		return LSM;
	  })
	},{
	  "key": "cookie",
	  "enumerable": true, 
	  "value": modulr(['cookies'],modsprovider,function(){
		var proto = {
		  new: function(name,values,config){
			var that = this,
				self = that.self,
				globalOptions = that.options;
  
			var options = Utils.extend({}, globalOptions, config);
			Utils.cookie( name, JSON.stringify(values), options );
		  },
  
		  check: function(name){
			var that = this,
				self = that.self,
				globalOptions = that.options;
  
			if ( name !== null && name !== undefined ) {
			  var get_mc = Utils.cookie(name);
			  if ( get_mc === null ) {
				that.outputmethod('No cookie.');
				return false;
			  };
			  return true;
			} else {
			  that.outputmethod('No cookie selected.');
			  return false; 
			};
  
		  },
  
		  verify: function(name){
			var that = this,
				self = that.self,
				globalOptions = that.options;
  
			if ( name !== null && name !== undefined ) {
			  var get_mc = Utils.cookie(name);
			  if ( get_mc === null ) {
				that.outputmethod('No cookie.');
				return false;
			  };
			  if ( Utils.isEmptyObject(get_mc) ) {
				that.outputmethod('Invalid values.');
				return false;
			  }
			  try{
				JSON.parse(get_mc);
			  } catch (e) {
				that.outputmethod('Not JSON.');
				return false;
			  }
			  return true;
			} else {
			  that.outputmethod('No cookie selected.');
			  return false; 
			};
		  },
  
		  check_index: function (name, index_s) {
			var get_mc = this.read_JSON(name);
			var check = null;
			$.each( get_mc, function(index,value){
			  if ( index_s === index ) {
				check = "ok";
			  };
			});
			if ( check === null ) {
			  return false;
			} else {
			  return true;
			};
		  },
  
		  read_values: function (name) {
			if ( !this.verify(name) ) {
			  return false;
			} else {
			  return Utils.cookie(name);
			};
		  },
		  
		  read_indexes: function (name) {
			var get_mc = this.read_JSON(name);
			var check = [];
			$.each( get_mc, function(index,value){
			  check.push( index );
			});
			return check;
		  },
		
		  read_JSON: function (name) {
			if ( !this.verify(name) ) {
			  return false;
			} else {
			  return JSON.parse(Utils.cookie(name));
			
			};
		  },
		  
		  read_value: function (name, index_s) {
			var get_mc = this.read_JSON(name);
			var check = null;
			$.each( get_mc, function(index,value){
			  if ( index_s == index ) {
				check = value;
			  };
			});
			if ( check === null ) {
			  return false;
			} else {
			  return check;
			};
		  },
		  
		  replace_value: function (name, index_s, new_value, config) {
			var get_mc = this.read_JSON(name),field;
			var check = [];
			$.each( get_mc, function(index,value){
			  field = "\"" + index + "\": \"" + value + "\"";
			  if ( index_s === index ) {
				field = "\"" + index + "\": \"" + new_value + "\"";
				check.push( field );
			  } else {
				check.push( field );
			  };
			});
			check = "{" + check.join(", ") + "}";
			var ocheck = {};
			ocheck = JSON.stringify(check);
			var options = Utils.extend({}, this.options, config);
			Utils.removeCookie(name);
			Utils.cookie( name, JSON.parse(ocheck), options );
		  },
		  
		  add_value: function (name, new_index, new_value, config) {
			var get_mc = this.read_JSON(name),field;
			var check = [];
			$.each( get_mc, function(index,value){
			  field = "\"" + index + "\": \"" + value + "\"";
			  check.push( field );
			});
			check.push("\"" + new_index + "\": \"" + new_value + "\"");
			check = "{" + check.join(", ") + "}";
			var ocheck = {};
			ocheck = JSON.stringify(check);
			var options = Utils.extend({}, this.options, config);
			Utils.removeCookie(name);
			Utils.cookie( name, JSON.parse(ocheck), options );
		  },
		  
		  remove_value: function (name, remove_index, config) {
			var get_mc = this.read_JSON(name),field;
			var check = [];
			$.each( get_mc, function(index,value){
			  field = "\"" + index + "\": \"" + value + "\"";
			  if ( remove_index !== index ) {
				check.push( field );
			  };
			});
			check = "{" + check.join(", ") + "}";
			var ocheck = {};
			ocheck = JSON.stringify(check);
			var options = Utils.extend({}, this.options, config);
			Utils.removeCookie(name);
			Utils.cookie( name, JSON.parse(ocheck), options );
		  }
		};
		function Cookies(op){
		  var opts = Utils.extend({},{
			expires: 100,
			path: "/"
		  },op); 
		  this.options = opts;
		}
		Cookies.prototype = proto;
		return Cookies;
	  })
	},{
	  "key": "template",
	  "enumerable": true, 
	  "value": Utils.Template
	},{
	  "key": "ctx",
	  "enumerable": true, 
	  "value": modulr(['ctx'],modsprovider,function(){
		function CTX(name){
		  var ctx = this;
		  ctx.methods = new (function Methods(){})();
		  ctx.data = new (function Data(){})();
		  ctx.name = name;
		  _atEv.trigger('ctx:init',{name: name,ctx: ctx});
		  CTX.contexts[name] = ctx;
		}
		CTX.contexts = new (function ContextManager(){})();
		CTX.prototype = new (function TemplateContext(){
		  var ctx = this;
		  ctx.setd = function(key,val){
			var ctx = this;
			if(typeof key == "object" && key instanceof Array == false){
			  for(var ids in key){
				ctx.data[ids] = key[ids];
			  }
			} else {
			  ctx.data[key] = val;
			}
		  };
		  ctx.getd = function(key){
			var ctx = this;
			return ctx.data[key];
		  };
		  ctx.deld = function(key){
			var ctx = this;
			delete ctx.data[key];
		  };
		  ctx.setm = function(key,val){
			var ctx = this;
			if(typeof key == "object" && key instanceof Array == false){
			  for(var ids in key){
				ctx.methods[ids] = key[ids];
			  }
			} else {
			  ctx.methods[key] = val;
			}
		  };
		  ctx.getm = function(key){
			var ctx = this;
			return ctx.methods[key];
		  };
		  ctx.delm = function(key){
			var ctx = this;
			delete ctx.methods[key];
		  };
		  ctx.compileEl = function(el,baseCtx){
			var $el = $(el);
			var attrs = el.attributes;
			Array.prototype.forEach.call(attrs, function (attr) {
			  var nm = attr.name.toLowerCase();
			  var val = attr.value;
			  var ptrn = /^@at\:\w+/gi;
			  if(ptrn.test(nm)){
				el['@atCtx'] = baseCtx;
				var evt = nm.replace(/@at:/g,'');
				var stop = false;
				var prevent = false;
				var once = false;
				if (evt.indexOf('.') >= 0) {
				  evt.split('.').forEach(function (eventNamePart, eventNameIndex) {
					if (eventNameIndex === 0) { evt = eventNamePart; }
					else {
					  if (eventNamePart === 'stop') { stop = true; }
					  if (eventNamePart === 'prevent') { prevent = true; }
					  if (eventNamePart === 'once') { once = true; }
					}
				  });
				}
				$el.on(evt,
				ctx.compileEl.getEventHandler(val,baseCtx.methods,{
				  stop: stop,
				  prevent: prevent,
				  once: once
				},baseCtx));
			  }
			});
		  };
		  ctx.compileEl.getEventHandler = function getEventHandler(
			handlerString, context, ref, baseCtx) {
			if ( ref === void 0 ) ref = {};
			var stop = ref.stop;
			var prevent = ref.prevent;
			var once = ref.once;
  
			var fired = false;
			var methodName;
			var method;
			var needMethodBind = true;
  
			if (handlerString.indexOf('(') < 0) {
			  methodName = handlerString;
			} else {
			  methodName = handlerString.split('(')[0];
			}
			if (methodName.indexOf('.') >= 0) {
			  methodName.split('.').forEach(function (path, pathIndex) {
				if (pathIndex === 0 && path === 'this') { return; }
				if (pathIndex === 0 && path === 'window') {
				  // eslint-disable-next-line
				  method = win;
				  needMethodBind = false;
				  return;
				}
				if (!method) { method = context; }
				if (method[path]) { method = method[path]; }
				else {
				  warn(("Context doesn't have method \"" + (methodName.split('.').slice(0, pathIndex + 1).join('.')) + "\""));
				  return;
				}
			  });
			} else {
			  if (!context[methodName]) {
				warn(("Context doesn't have method \"" + methodName + "\""));
				return;
			  }
			  method = context[methodName];
			}
			if (needMethodBind) {
			  method = method.bind(context);
			}
  
			function handler() {
			  var that = this;
			  var args = [], len = arguments.length;
			  while ( len-- ) args[ len ] = arguments[ len ];
  
			  var e = args[0];
			  var customArgs = [];
			  if (once && fired) { return; }
			  if (stop) { e.stopPropagation(); }
			  if (prevent) { e.preventDefault(); }
			  fired = true;
			  if (handlerString.indexOf('(') < 0) {
				customArgs = args;
			  } else {
				var handlerArguments = handlerString
				  .split('(')[1]
				  .split(')')[0]
				  .replace(/'[^']*'|"[^"]*"/g, function (a) { return a.replace(/,/g, '<_comma_>'); })
				  .split(',')
				  .map(function (a) { return a.replace(/<_comma_>/g, ','); });
				handlerArguments.forEach(function (argument) {
				  var arg = argument.trim();
				  // eslint-disable-next-line
				  if (!isNaN(arg)) { arg = parseFloat(arg); }
				  else if (arg === 'true') { arg = true; }
				  else if (arg === 'false') { arg = false; }
				  else if (arg === 'null') { arg = null; }
				  else if (arg === 'undefined') { arg = undefined; }
				  else if (arg === '@el') { arg = that; }
				  else if (arg === 'this') { arg = baseCtx; }
				  else if (arg[0] === '"') { arg = arg.replace(/"/g, ''); }
				  else if (arg[0] === '\'') { arg = arg.replace(/'/g, ''); }
				  else if (arg.indexOf('.') > 0) {
					var deepArg;
					arg.split('.').forEach(function (path) {
					  if (!deepArg) { deepArg = context; }
					  deepArg = deepArg[path];
					});
					arg = deepArg;
				  } else {
					arg = context[arg];
				  }
				  customArgs.push(arg);
				});
			  }
			  method.apply(baseCtx, customArgs);
			}
  
			return handler;
		  };
		  ctx.fire = function(el){
			var ctx = this;
			var $el = el ? Utils.validateElement(el) : $('.at-template[ctx="'+ctx.name+'"]');
			$el.each(function(){
			  var el = this,
				  $el = $(this),
				  $untemplated = $el.html(),
				  $db = CTX.contexts[ctx.name];
			  if(!el.oldhtml){
				el.oldhtml = $untemplated;
			  }
			  var templated = Utils.Template(el.oldhtml,
			  $db.data,$db.data,$db.methods);
			  $el.html(templated);
			  el.newhtml = templated;
			  var $elOld = $('<div />');
			  $elOld.html(el.newhtml);
			  if($el.find('*').length > $elOld.find('*').length){
				el.oldhtml = $untemplated;
			  }
			  el['@atCtx'] = $db;
			  $el.find('*').each(function(){
				ctx.compileEl(this,$db);
			  });
			  _atEv.trigger('ctx:fire',{name: ctx.name,ctx: $db});
			});
		  };
		  ctx.reloadCtx = function(el){
			var ctx = this;
			var $el = el ? Utils.validateElement(el) : null;
			ctx.fire($el);
		  };
		  ctx.getTmp = function(){
			var ctx = this;
			return CTX.contexts[ctx.name];
		  }
		});
		return CTX;
	  })
	},{
	  "key": "fetch",
	  "enumerable": true, 
	  "value": modulr(['http','request'],modsprovider,function(){
		return Utils.fetch;
	  })
	},{
	  "key": "browser",
	  "enumerable": true, 
	  "value": modulr(['bi','browser'],modsprovider,function(){
		function Version (version) {
		  this.original = null;
		  this.major = null;
		  this.minor = null;
		  this.build = null;
		  this.revision = null;
		  this.initialize(version);
		};
		Version.prototype.initialize = function (version) {
		  var arr = version.split('.');
		  this.original = version;
		  this.major = (arr && arr[0]) ? parseInt(arr[0], 10) : null;
		  this.minor = (arr && arr[1]) ? parseInt(arr[1], 10) : null;
		  this.build = (arr && arr[2]) ? parseInt(arr[2], 10) : null;
		  this.revision = (arr && arr[3]) ? parseInt(arr[3], 10) : null;
		};
		Version.prototype.isEqual = function (major, minor, build, revision) {
		  if (typeof major !== 'number') {
			  return false;
		  }
		  if (typeof minor !== 'number') {
			  return (this.major === major);
		  }
		  if (typeof build !== 'number') {
			  return (this.major === major && this.minor === minor);
		  }
		  if (typeof revision !== 'number') {
			  return (this.major === major && this.minor === minor && this.build === build);
		  }
		  return (this.major === major && this.minor === minor &&
				  this.build === build && this.revision === revision);
		};
		Version.prototype.isOrLess = function (major, minor, build, revision) {
		  if (typeof major !== 'number') {
			  return false;
		  }
		  if (this.major !== major) {
			  return (this.major < major);
		  }
		  if (typeof minor !== 'number') {
			  return true;
		  }
		  if (this.minor !== minor) {
			  return (this.minor < minor);
		  }
		  if (typeof build !== 'number') {
			  return true;
		  }
		  if (this.build !== build) {
			  return (this.build < build);
		  }
		  if (typeof revision !== 'number') {
			  return true;
		  }
		  if (this.revision !== revision) {
			  return (this.revision < revision);
		  }
		  return true;
		};
		Version.prototype.isLessThan = function (major, minor, build, revision) {
		  if (typeof major !== 'number') {
			  return false;
		  }
		  if (this.major !== major) {
			  return (this.major < major);
		  }
		  if (typeof minor !== 'number') {
			  return false;
		  }
		  if (this.minor !== minor) {
			  return (this.minor < minor);
		  }
		  if (typeof build !== 'number') {
			  return false;
		  }
		  if (this.build !== build) {
			  return (this.build < build);
		  }
		  if (typeof revision !== 'number') {
			  return false;
		  }
		  if (this.revision !== revision) {
			  return (this.revision < revision);
		  }
		  return false;
		};
		Version.prototype.isOrMore = function (major, minor, build, revision) {
		  if (typeof major !== 'number') {
			  return false;
		  }
		  if (this.major !== major) {
			  return (this.major > major);
		  }
		  if (typeof minor !== 'number') {
			  return true;
		  }
		  if (this.minor !== minor) {
			  return (this.minor > minor);
		  }
		  if (typeof build !== 'number') {
			  return true;
		  }
		  if (this.build !== build) {
			  return (this.build > build);
		  }
		  if (typeof revision !== 'number') {
			  return true;
		  }
		  if (this.revision !== revision) {
			  return (this.revision > revision);
		  }
		  return true;
		};
		Version.prototype.isMoreThan = function (major, minor, build, revision) {
		  if (typeof major !== 'number') {
			  return false;
		  }
		  if (this.major !== major) {
			  return (this.major > major);
		  }
		  if (typeof minor !== 'number') {
			  return false;
		  }
		  if (this.minor !== minor) {
			  return (this.minor > minor);
		  }
		  if (typeof build !== 'number') {
			  return false;
		  }
		  if (this.build !== build) {
			  return (this.build > build);
		  }
		  if (typeof revision !== 'number') {
			  return false;
		  }
		  if (this.revision !== revision) {
			  return (this.revision > revision);
		  }
		  return false;
		};
		Version.prototype.toString = function () {
			return this.original;
		};
		function _BrowserInfo(){
		  this.original = '';
		  this.version = null;
		  this.initialize(win.navigator.userAgent);
  
		};
		_BrowserInfo.prototype.initialize = function (userAgent) {
		  var array;
		  var browser = '';
		  var engine = '';
		  var architecture = '';
		  var version = null;
		  userAgent = userAgent.toLowerCase();
  
		  if (userAgent.indexOf('opera') >= 0 || userAgent.lastIndexOf('opr') >= 0) {
			  if (userAgent.indexOf('opera mini') >= 0) {
				  browser = 'operamini';
				  array = /opera mini\/([\d\.]+)/.exec(userAgent);
				  version = (array) ? array[1] : '';
			  } else if (userAgent.indexOf('opera mobi') >= 0) {
				  browser = 'operamobile';
				  array = /version\/([\d\.]+)/.exec(userAgent);
				  version = (array) ? array[1] : '';
			  } else {
				  browser = 'opera';
				  array = /version\/([\d\.]+)/.exec(userAgent);
				  if (array) {
					  version = array[1];
				  } else{
					  array = /(?:opera|opr)[\s\/]+([\d\.]+)/.exec(userAgent);
					  version = (array) ? array[1] : '';
				  }
			  }
		  } else if (userAgent.indexOf('edge') >= 0 || userAgent.indexOf('edg') >= 0) {
			  browser = 'edge';
			  array = /(edge|edg)\/([\d\.]+)/.exec(userAgent);
			  version = (array) ? array[2] : '';
		  } else if (userAgent.indexOf('msie') >= 0 || userAgent.indexOf('trident') >= 0) {
			  browser = 'msie';
			  array = /(msie|rv:?)\s?([\d\.]+)/.exec(userAgent);
			  version = (array) ? array[2] : '';
		  } else if (userAgent.indexOf('firefox') >= 0) {
			  browser = 'firefox';
			  array = /firefox\/([\d\.]+)/.exec(userAgent);
			  version = (array) ? array[1] : '';
		  } else if (userAgent.indexOf('chrome') >= 0 || userAgent.indexOf('crios') >= 0) {
			  browser = 'chrome';
			  array = /[chrome|crios]\/([\d\.]+)/.exec(userAgent);
			  version = (array) ? array[1] : '';
		  } else if (userAgent.indexOf('android') >= 0) {
			  browser = 'browser';
			  array = /version\/([\d\.]+)/.exec(userAgent);
			  version = (array) ? array[1] : '';
		  } else if (userAgent.indexOf('silk') >= 0) {
			  browser = 'silk';
			  array = /silk\/([\d\.]*)/.exec(userAgent);
			  version = (array) ? array[1] : '';
		  } else if (userAgent.indexOf('mercury') >= 0) {
			  browser = 'mercury';
			  array = /mercury\/([\d\.]+)/.exec(userAgent);
			  version = (array) ? array[1] : '';
		  } else if (userAgent.indexOf('safari') >= 0) {
			  browser = 'safari';
			  array = /version\/([\d\.]+)/.exec(userAgent);
			  version = (array) ? array[1] : '';
		  } else {
			  browser = 'unknown';
			  version = '';
		  }
  
		  if (userAgent.indexOf('edge') >= 0) {
			  engine = 'edge';
		  } else if (userAgent.indexOf('webkit') >= 0) {
			  engine = 'webkit';
		  } else  if (userAgent.indexOf('trident') >= 0) {
			  engine = 'trident';
		  } else if (userAgent.indexOf('presto') >= 0) {
			  engine = 'presto';
		  } else if (userAgent.indexOf('khtml') >= 0) {
			  engine = 'khtml';
		  } else if (userAgent.indexOf('gecko') >= 0) {
			  engine = 'gecko';
		  } else {
			  engine = 'unknown';
		  }
  
		  if (userAgent.indexOf('arm') >= 0) {
			  architecture = 'arm';
		  } else if (userAgent.indexOf('win64') >= 0) {
			  if (userAgent.indexOf('ia64') >= 0) {
				  architecture = 'ia64';
			  } else {
				  architecture = 'x64';
			  }
		  } else {
			  architecture = 'x86';
		  }
  
		  this.original = browser;
		  this[browser] = true;
		  this[engine] = true;
		  this[architecture] = true;
		  this.version = (!win.__BACKWARD_COMPATIBILITY_ENABLED) ? new Version(version) : version;
  
		};
  
		_BrowserInfo.prototype.is = function (type) {
  
			return (typeof type === 'string') && (type.toLowerCase() === this.original);
  
		};
  
		function PlatformInfo() {
		  this.original = '';
		  this.initialize(win.navigator.userAgent);
  
		};
  
		PlatformInfo.prototype.initialize = function (userAgent) {
		  var type = '';
		  var platform = '';
		  var architecture = '';
		  var version = '';
		  var result = null;
		  var mobile = /iphone|ipod|ipad|android|windows phone|silk|blackberry|symbian|mobile/;
		  var pc = /windows|mac|linux/;
		  var array;
		  userAgent = userAgent.toLowerCase();
  
		  result = mobile.exec(userAgent);
		  if (result) {
			  if (userAgent.indexOf('silk') >= 0) {
				  type = 'tablet';
				  platform = 'android';
			  } else {
				  if ((userAgent.indexOf('android') >= 0 && userAgent.indexOf('mobile') < 0) ||
					  (userAgent.indexOf('ipad') >= 0)) {
					  type = 'tablet';
				  } else {
					type = 'mobile';
				  }
				  platform = result[0].replace(' ', '');
			  }
		  } else {
			  if (userAgent.indexOf('windows') >= 0) {
				  type = 'pc';
				  platform = 'windows';
				  array = /windows nt ([\d\.]+)/.exec(userAgent);
				  version = (array) ? array[1] : '';
				  if (userAgent.indexOf('arm') >= 0) {
					  architecture = 'arm';
				  } else if (userAgent.indexOf('win64') >= 0) {
					  if (userAgent.indexOf('ia64') >= 0) {
						  architecture = 'ia64';
					  } else {
						  architecture = 'x64';
					  }
				  } else if (userAgent.indexOf('wow64') >= 0) {
					  architecture = 'x64';
				  } else {
					  architecture = 'x86';
				  }
			  } else if (userAgent.indexOf('mac') >= 0) {
				  type = 'pc';
				  platform = 'mac';
				  architecture = 'unknown';
			  } else if (userAgent.indexOf('linux') >= 0) {
				  type = 'pc';
				  platform = 'linux';
				  architecture = 'unknown';
			  } else {
				  type = 'unknown';
				  platform = 'unknown';
				  architecture = 'unknown';
			  }
		  }
		  this.type = type;
		  this.original = platform;
		  this[type] = true;
		  this[platform] = true;
		  this[architecture] = true;
		  this.version = new Version(version);
		};
  
		PlatformInfo.prototype.is = function (name) {
		  if (typeof name === 'string') {
			  name = name.toLowerCase();
			  return ((name === this.original) || (name === this.type));
		  } else {
			  return false;
		  }
		};
		function BrowserInfo(){
		  var Browser = new _BrowserInfo(),
		  Platform = new PlatformInfo();
		  var obj = new (function BrowserInfo(){})();
		  obj.browser = Browser.original;
		  obj.version = Browser.version.original;
		  obj.build = Browser.version.build;
		  obj.platform = Platform.original;
		  obj.isBrowser = Browser.is;
		  obj.isPlatform = Platform.is;
		  obj.isVersion = Browser.version;
		  obj.device = (function(){
			var platform = win.navigator.platform;
			var ua = win.navigator.userAgent;
  
			var device = {
			  ios: false,
			  android: false,
			  androidChrome: false,
			  desktop: false,
			  iphone: false,
			  ipod: false,
			  ipad: false,
			  edge: false,
			  ie: false,
			  firefox: false,
			  macos: false,
			  windows: false,
			  cordova: !!(win.cordova || win.phonegap),
			  phonegap: !!(win.cordova || win.phonegap),
			  electron: false,
			  nwjs: false,
			};
  
			var screenWidth = win.screen.width;
			var screenHeight = win.screen.height;
  
			var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/); // eslint-disable-line
			var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
			var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
			var iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
			var ie = ua.indexOf('MSIE ') >= 0 || ua.indexOf('Trident/') >= 0;
			var edge = ua.indexOf('Edge/') >= 0;
			var firefox = ua.indexOf('Gecko/') >= 0 && ua.indexOf('Firefox/') >= 0;
			var windows = platform === 'Win32';
			var electron = ua.toLowerCase().indexOf('electron') >= 0;
			var nwjs = typeof nw !== 'undefined' && typeof process !== 'undefined' && typeof process.versions !== 'undefined' && typeof process.versions.nw !== 'undefined';
			var macos = platform === 'MacIntel';
  
			// iPadOs 13 fix
			var iPadScreens = [
			  '1024x1366',
			  '1366x1024',
			  '834x1194',
			  '1194x834',
			  '834x1112',
			  '1112x834',
			  '768x1024',
			  '1024x768' ];
			if (!ipad
			  && macos
			  && Support.touch
			  && iPadScreens.indexOf((screenWidth + "x" + screenHeight)) >= 0
			) {
			  ipad = ua.match(/(Version)\/([\d.]+)/);
			  if (!ipad) { ipad = [0, 1, '13_0_0']; }
			  macos = false;
			}
  
			device.ie = ie;
			device.edge = edge;
			device.firefox = firefox;
  
			// Android
			if (android && !windows) {
			  device.os = 'android';
			  device.osVersion = android[2];
			  device.android = true;
			  device.androidChrome = ua.toLowerCase().indexOf('chrome') >= 0;
			}
			if (ipad || iphone || ipod) {
			  device.os = 'ios';
			  device.ios = true;
			}
			// iOS
			if (iphone && !ipod) {
			  device.osVersion = iphone[2].replace(/_/g, '.');
			  device.iphone = true;
			}
			if (ipad) {
			  device.osVersion = ipad[2].replace(/_/g, '.');
			  device.ipad = true;
			}
			if (ipod) {
			  device.osVersion = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
			  device.ipod = true;
			}
			// iOS 8+ changed UA
			if (device.ios && device.osVersion && ua.indexOf('Version/') >= 0) {
			  if (device.osVersion.split('.')[0] === '10') {
				device.osVersion = ua.toLowerCase().split('version/')[1].split(' ')[0];
			  }
			}
  
			// Webview
			device.webView = !!((iphone || ipad || ipod) && (ua.match(/.*AppleWebKit(?!.*Safari)/i) || win.navigator.standalone))
			  || (win.matchMedia && win.matchMedia('(display-mode: standalone)').matches);
			device.webview = device.webView;
			device.standalone = device.webView;
  
			// Desktop
			device.desktop = !(device.ios || device.android) || electron || nwjs;
			if (device.desktop) {
			  device.electron = electron;
			  device.nwjs = nwjs;
			  device.macos = macos;
			  device.windows = windows;
			  if (device.macos) {
				device.os = 'macos';
			  }
			  if (device.windows) {
				device.os = 'windows';
			  }
			}
  
			// Pixel Ratio
			device.pixelRatio = win.devicePixelRatio || 1;
  
			// Color Scheme
			var DARK = '(prefers-color-scheme: dark)';
			var LIGHT = '(prefers-color-scheme: light)';
			device.prefersColorScheme = function prefersColorTheme() {
			  var theme = 'light';
			  if (win.matchMedia && win.matchMedia(LIGHT).matches) {
				theme = 'light';
			  }
			  if (win.matchMedia && win.matchMedia(DARK).matches) {
				theme = 'dark';
			  }
			  return theme;
			};
  
			// Export object
			return device;
		  })();
		  return obj;
		};
		return BrowserInfo;
	  })
	},{
	  "key": "randFrom",
	  "enumerable": true, 
	  "value": randFrom
	},{
	  "key": "pickRandom",
	  "enumerable": true, 
	  "value": pickRandom
	},{
	  "key": "fileInput",
	  "enumerable": true, 
	  "value": fileInput
	},{
	  "key": "get",
	  "enumerable": true,
	  "getter": true,
	  "value": modulr(['any'],modsprovider,function(){
		function ATProp(){
		  var at = this;
		  var args = toArray(arguments),a,b;
		  a = args[0];
		  b = args[0];
		  if(typeof a == "function"){
			return at.extends(a);
		  }
		  if(typeof a == "object" && a instanceof Array){
			for(var i in a){
			  at.append("array_"+_atEv.getUid(),a[i]);
			}
			return at;
		  }
		  if(typeof a == "object"){
			for(var i in a){
			  at.append(i,a[i]);
			}
			return at;
		  }
		  if(args.length == 1){
			if(a in at){
			  return at[a];
			}
		  }
		  if(args && a in at && typeof at[a] == "function"){
			args.shift();
			return at[a].apply(at,args);
		  }
		  if(a in at){
			return at[a];
		  }
		  if(args.length > 1 && typeof a == "string"){
			var p = [];
			args.forEach(function(arg){
			  if(typeof arg != "string") return;
			  if(arg in at){
				p.push(at[arg]);
			  }
			});
			return p;
		  }
		  return at;
		}
		return ATProp;
	  })
	},{
	  "key": "engine",
	  "enumerable": true,
	  "value": modulr(['any'],modsprovider,function(){
		function fire(engine,resolve,reject){
		  var scope = {};
		  scope.data = engine.ctx.data;
		  scope.methods = engine.ctx.methods;
		  engine.cb.call(engine,scope.data,scope.methods);
		  engine.ctx.fire(engine.el);
		  resolve();
		};
		function Engine(name,el,fn){
		  if(!name || !el || !fn
			|| typeof fn != "function") return;
		  var $el = Utils.validateElement(el),rn = this;
		  rn.el = $el;
		  rn.ctx = new at.ctx(name);
		  rn.cb = fn;
		  rn.promise = new Promise(function(resolve,reject){
			fire(rn,resolve,reject);
		  });
		}
		Engine.prototype = {
		  done: function EngineLoaded(cb){
			this.promise.then(cb);
			delete this.promise;
		  },
		  reload: function ReloadEngine(){
			this.ctx.reloadCtx(this.el);
		  },
		  $setState: function SetStae(state,d){
			if(!state || typeof state != "object") return;
			if(d && d == "methods"){
			  this.ctx.setm(state);
			} else {
			  this.ctx.setd(state);
			}
			this.reload();
		  },
		  events: function EventListeners(){
			var el = this.el,obj = {},i = 0;
			el.find('*').each(function(){
			  var $ths = $(this),
				  ths = this;
			  if(ths.atdomListeners){
				obj[i] = [ths,ths.atdomListeners];
				i++;
			  }
			});
			return obj;
		  },
		  stateX: function StateX(){
			var a = this;
			for (var i = 0; i < arguments.length; i++) {
			  var s = arguments[i];
			  if(typeof s == "object"){
				if(s.type && s.type == "method"){
				  a.ctx.setm(s.key,s.val);
				} else {
				  a.ctx.setd(s.key,s.val);
				}
			  }
			}
		  },
		  destroy: function(){
			this.el.html(this.ctx.oldhtml);
		  }
		};
		return function EngineStarter(name,el,fn){
		  return new Engine(name,el,fn);
		};
	  })
	},{
	  'key': "customEl",
	  "enumerable": true,
	  "value": modulr(['any'],modsprovider,function(){
		var atElopts = {
		  connected: function(){},
		  disconnected: function(){},
		  attrChanged: function(){},
		  extends: false
		};
		function AtEl(name,options){
		  this.name = name;
		  var opts = Utils.extend({}, atElopts, options);
		  this.opts = opts;
		  this.create();
		}
		AtEl.defaults = atElopts;
		AtEl.prototype = {
		  "create": function(){
			var e = this,
				o = this.opts,n = this.name;
			if(window["@at:el_"+n]) return;
			var elnm = capitalize(o.extends);
			var ec = o.extends ? window["HTML"+elnm+"Element"] : HTMLElement;
			if(ec == null) {o.extends = false;ec = HTMLElement};
			var opts = {};
			if(o.extends) opts.extends = o.extends.toLowerCase();
			try{
			  class b extends ec{
				constructor(){
				  super();
				};
				connectedCallback(){
				  o.connected.call(this);
				};
				disconnectedCallback(){
				  o.disconnected.call(this);
				};
				attributeChangedCallback(a,b,c){
				  o.attrChanged.call(this,a,b,c);
				};
			  }
			  if($(n).length){
				$(n).each(function(){
				  customElements.upgrade(this,b,opts);
				});
			  }
			  customElements.define(n,b,opts);
			  window["@at:el_"+n] = b;
			} catch(e){
			  var proto = Object.create(ec.prototype);
			  proto.createdCallback = function(){
				o.connected.call(this);
			  }
			  proto.deatachedCallback = function(){
				o.disconnected.call(this);
			  }
			  proto.attributeChangedCallback = function(a,b,c){
				o.disconnected.call(this,a,b,c);
			  }
			  opts.prototype = proto;
			  window["@at:el_"+n] = document.registerElement(n,opts);
			}
		  }
		}
		return AtEl;
	  }) 
	});
  
	} else {}
	
	delete __at.addProps;
	
	// +++ 
	// + Export
	// +++
  
	/*_AT = function(){
	  var at = new At();
	  return AT_prop.apply(at,arguments);
	};
	_AT.toString = function(){
	  return _AT().toString();
	}
	_AT.__proto__.__proto__ = _AT();*/
  
	_AT = new At();
	var keys = [];
	for(var i in _AT){
	  keys.push(i); 
	}
  
	_AT.keys = window.Set ? new Set(keys) : keys;
  
	_createClass(_AT.keys,null,[{
	  "key": "find",
	  "value": function(str){
		if(typeof str != "string") return null;
		var keys = _AT.keys;
		var fnd = [];
		forEachArr(keys,function(key){
		  if(key.toLowerCase().match(str.toLowerCase())){
			fnd.push(key);
		  }
		});
		return fnd.length > 0 ? fnd : null;
	  }
	}]);
  
	return _AT;
  })));