(function(mod){if("object"==("undefined"===typeof exports?"undefined":babelHelpers.typeof(exports))&&"object"==("undefined"===typeof module?"undefined":babelHelpers.typeof(module)))mod(require("../../lib/codemirror"));else if("function"==typeof define&&define.amd)define(["../../lib/codemirror"],mod);else mod(CodeMirror)})(function(CodeMirror){"use strict";CodeMirror.defineMode("commonlisp",function(config){var specialForm=/^(block|let*|return-from|catch|load-time-value|setq|eval-when|locally|symbol-macrolet|flet|macrolet|tagbody|function|multiple-value-call|the|go|multiple-value-prog1|throw|if|progn|unwind-protect|labels|progv|let|quote)$/,assumeBody=/^with|^def|^do|^prog|case$|^cond$|bind$|when$|unless$/,numLiteral=/^(?:[+\-]?(?:\d+|\d*\.\d+)(?:[efd][+\-]?\d+)?|[+\-]?\d+(?:\/[+\-]?\d+)?|#b[+\-]?[01]+|#o[+\-]?[0-7]+|#x[+\-]?[\da-f]+)/,symbol=/[^\s'`,@()\[\]";]/,type;function readSym(stream){var ch;while(ch=stream.next()){if("\\"==ch)stream.next();else if(!symbol.test(ch)){stream.backUp(1);break}}return stream.current()}function base(stream,state){if(stream.eatSpace()){type="ws";return null}if(stream.match(numLiteral))return"number";var ch=stream.next();if("\\"==ch)ch=stream.next();if("\""==ch)return(state.tokenize=inString)(stream,state);else if("("==ch){type="open";return"bracket"}else if(")"==ch||"]"==ch){type="close";return"bracket"}else if(";"==ch){stream.skipToEnd();type="ws";return"comment"}else if(/['`,@]/.test(ch))return null;else if("|"==ch){if(stream.skipTo("|")){stream.next();return"symbol"}else{stream.skipToEnd();return"error"}}else if("#"==ch){var ch=stream.next();if("("==ch){type="open";return"bracket"}else if(/[+\-=\.']/.test(ch))return null;else if(/\d/.test(ch)&&stream.match(/^\d*#/))return null;else if("|"==ch)return(state.tokenize=inComment)(stream,state);else if(":"==ch){readSym(stream);return"meta"}else if("\\"==ch){stream.next();readSym(stream);return"string-2"}else return"error"}else{var name=readSym(stream);if("."==name)return null;type="symbol";if("nil"==name||"t"==name||":"==name.charAt(0))return"atom";if("open"==state.lastType&&(specialForm.test(name)||assumeBody.test(name)))return"keyword";if("&"==name.charAt(0))return"variable-2";return"variable"}}function inString(stream,state){var escaped=!1,next;while(next=stream.next()){if("\""==next&&!escaped){state.tokenize=base;break}escaped=!escaped&&"\\"==next}return"string"}function inComment(stream,state){var next,last;while(next=stream.next()){if("#"==next&&"|"==last){state.tokenize=base;break}last=next}type="ws";return"comment"}return{startState:function startState(){return{ctx:{prev:null,start:0,indentTo:0},lastType:null,tokenize:base}},token:function token(stream,state){if(stream.sol()&&"number"!=typeof state.ctx.indentTo)state.ctx.indentTo=state.ctx.start+1;type=null;var style=state.tokenize(stream,state);if("ws"!=type){if(null==state.ctx.indentTo){if("symbol"==type&&assumeBody.test(stream.current()))state.ctx.indentTo=state.ctx.start+config.indentUnit;else state.ctx.indentTo="next"}else if("next"==state.ctx.indentTo){state.ctx.indentTo=stream.column()}state.lastType=type}if("open"==type)state.ctx={prev:state.ctx,start:stream.column(),indentTo:null};else if("close"==type)state.ctx=state.ctx.prev||state.ctx;return style},indent:function indent(state){var i=state.ctx.indentTo;return"number"==typeof i?i:state.ctx.start+1},closeBrackets:{pairs:"()[]{}\"\""},lineComment:";;",blockCommentStart:"#|",blockCommentEnd:"|#"}});CodeMirror.defineMIME("text/x-common-lisp","commonlisp")});