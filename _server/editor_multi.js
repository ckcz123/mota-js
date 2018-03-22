editor_multi = function(){

var editor_multi = {};

var codeEditor = CodeMirror.fromTextArea(document.getElementById("multiLineCode"), {
  lineNumbers: true,
  matchBrackets: true,
  indentUnit: 4,
  tabSize: 4,
  indentWithTabs: true,
  smartIndent: true,
  mode: {name: "javascript", globalVars: true, localVars: true},
  lineWrapping: true,
  continueComments: "Enter",
  gutters: ["CodeMirror-lint-markers"],
  lint: true,
  autocomplete: true,
  extraKeys: {"Ctrl-Q": "toggleComment"},
});

codeEditor.on("keyup", function (cm, event) {
  if (codeEditor.getOption("autocomplete") && (event.keyCode >= 65 && event.keyCode<=90) || (event.keyCode>=49 && event.keyCode<=57) || event.keyCode==190) {
    try {
      CodeMirror.commands.autocomplete(cm, null, {completeSingle: false});
    } catch (e) {}
  }
});

editor_multi.id='';
editor_multi.isString=false;
editor_multi.lintAutocomplete=false;

editor_multi.show = function(){
  if(typeof(selectBox)!==typeof(undefined))selectBox.isSelected = false;
  var valueNow = codeEditor.getValue();
  //try{eval('function _asdygakufyg_() { return '+valueNow+'\n}');editor_multi.lintAutocomplete=true;}catch(ee){}
  if(valueNow.slice(0,8)==='function')editor_multi.lintAutocomplete=true;
  editor_multi.setLint();
  document.getElementById('left7').style='';
}
editor_multi.hide = function(){document.getElementById('left7').style='z-index:-1;opacity: 0;';}
editor_multi.setLint = function() {
  codeEditor.setOption("lint", editor_multi.lintAutocomplete);
  codeEditor.setOption("autocomplete", editor_multi.lintAutocomplete);
  document.getElementById("lintCheckbox").checked = editor_multi.lintAutocomplete;
}
editor_multi.toggerLint = function() {
  editor_multi.lintAutocomplete = document.getElementById("lintCheckbox").checked;
  editor_multi.setLint();
}

editor_multi.indent = function(field){
  if(typeof(editor)!==typeof(undefined) && editor && editor.mode && editor.mode.indent)return editor.mode.indent(field);
  return '\t';
}

editor_multi.import = function(id_,args){
  var thisTr = document.getElementById(id_);
  if(!thisTr)return false;
  var input = thisTr.children[2].children[0].children[0];
  var field = thisTr.children[0].getAttribute('title');
  var comment = thisTr.children[1].getAttribute('title');
  if(!input.type || input.type!=='textarea')return false;
  editor_multi.id=id_;
  editor_multi.isString=false;
  editor_multi.lintAutocomplete=false;
  if(args.lint===true)editor_multi.lintAutocomplete=true;
  if(field.indexOf('Effect') !== -1)editor_multi.lintAutocomplete=true;
  if(input.value.slice(0,1)==='"'){
    editor_multi.isString=true;
    codeEditor.setValue(JSON.parse(input.value)||'');
  } else {
    var num = editor_multi.indent(field);
    eval('var tobj='+(input.value||'null'));
    var tmap={};
    var tstr = JSON.stringify(tobj,function(k,v){if(typeof(v)===typeof('') && v.slice(0,8)==='function'){var id_ = editor.guid();tmap[id_]=v.toString();return id_;}else return v},num);
    for(var id_ in tmap){
      tstr = tstr.replace('"'+id_+'"',tmap[id_])
    }
    codeEditor.setValue(tstr||'');
  }
  editor_multi.show();
  return true;
}

editor_multi.cancel = function(){
  editor_multi.hide();
  editor_multi.id='';
  multiLineArgs=[null,null,null];
}

editor_multi.confirm =  function (){
  if(!editor_multi.id){
    editor_multi.id='';
    return;
  }
  if(editor_multi.id==='callFromBlockly'){
    editor_multi.id='';
    editor_multi.multiLineDone();
    return;
  }
  var setvalue = function(value){
    var thisTr = document.getElementById(editor_multi.id);
    editor_multi.id='';
    var input = thisTr.children[2].children[0].children[0];
    if(editor_multi.isString){
      input.value = JSON.stringify(value);
    } else {
      eval('var tobj='+(value||'null'));
      var tmap={};
      var tstr = JSON.stringify(tobj,function(k,v){if(v instanceof Function){var id_ = editor.guid();tmap[id_]=v.toString();return id_;}else return v},4);
      for(var id_ in tmap){
        tstr = tstr.replace('"'+id_+'"',JSON.stringify(tmap[id_]))
      }
      input.value = tstr;
    }
    editor_multi.hide();
    input.onchange();
  }
  setvalue(codeEditor.getValue()||'');
}

var multiLineArgs=[null,null,null];
editor_multi.multiLineEdit = function(value,b,f,args,callback){
  editor_multi.id='callFromBlockly';
  codeEditor.setValue(value.split('\\n').join('\n')||'');
  multiLineArgs[0]=b;
  multiLineArgs[1]=f;
  multiLineArgs[2]=callback;
  editor_multi.lintAutocomplete=Boolean(args.lint);
  editor_multi.show();
}
editor_multi.multiLineDone = function(){
  editor_multi.hide();
  if(!multiLineArgs[0] || !multiLineArgs[1] || !multiLineArgs[2])return;
  var newvalue = codeEditor.getValue()||'';
  multiLineArgs[2](newvalue,multiLineArgs[0],multiLineArgs[1])
}

return editor_multi;
}
//editor_multi=editor_multi();