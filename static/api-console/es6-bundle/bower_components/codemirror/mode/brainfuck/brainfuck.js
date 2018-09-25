(function(mod){if("object"==typeof exports&&"object"==typeof module)mod(require("../../lib/codemirror"));else if("function"==typeof define&&define.amd)define(["../../lib/codemirror"],mod);else mod(CodeMirror)})(function(CodeMirror){"use strict";var reserve="><+-.,[]".split("");CodeMirror.defineMode("brainfuck",function(){return{startState:function(){return{commentLine:!1,left:0,right:0,commentLoop:!1}},token:function(stream,state){if(stream.eatSpace())return null;if(stream.sol()){state.commentLine=!1}var ch=stream.next().toString();if(-1!==reserve.indexOf(ch)){if(!0===state.commentLine){if(stream.eol()){state.commentLine=!1}return"comment"}if("]"===ch||"["===ch){if("["===ch){state.left++}else{state.right++}return"bracket"}else if("+"===ch||"-"===ch){return"keyword"}else if("<"===ch||">"===ch){return"atom"}else if("."===ch||","===ch){return"def"}}else{state.commentLine=!0;if(stream.eol()){state.commentLine=!1}return"comment"}if(stream.eol()){state.commentLine=!1}}}});CodeMirror.defineMIME("text/x-brainfuck","brainfuck")});