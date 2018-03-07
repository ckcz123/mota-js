editor_multi = function(){

var editor_multi = {};

var codeEditor = CodeMirror.fromTextArea(document.getElementById("multiLineCode"), {
  lineNumbers: true,
  matchBrackets: true,
  lineWrapping: true,
  continueComments: "Enter",
  extraKeys: {"Ctrl-Q": "toggleComment"}
});

editor_multi.id='';

editor_multi.show = function(){document.getElementById('left7').style='';}
editor_multi.hide = function(){document.getElementById('left7').style='z-index:-1;opacity: 0;';}


editor_multi.import = function(id_){
  var thisTr = document.getElementById(id_);
  if(!thisTr)return;
  var input = thisTr.children[2].children[0].children[0];
  var field = thisTr.children[0].getAttribute('title');
  var type = input.value && (input.value.slice(0,11)==='"function (');
  if(!type)return;
  editor_multi.id=id_;
  codeEditor.setValue(JSON.parse(input.value)||'');
  editor_multi.show();
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
    input.value = JSON.stringify(value);
    editor_multi.hide();
    input.onchange();
  }
  setvalue(codeEditor.getValue()||'');
}

var multiLineArgs=[null,null,null];
editor_multi.multiLineEdit = function(value,b,f,callback){
  editor_multi.id='callFromBlockly';
  codeEditor.setValue(value.split('\\n').join('\n')||'');
  multiLineArgs[0]=b;
  multiLineArgs[1]=f;
  multiLineArgs[2]=callback;
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