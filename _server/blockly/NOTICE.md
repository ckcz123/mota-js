# NOTICE
files 
`blockly_compressed.js`
`blocks_compressed.js`
`javascript_compressed.js`
`zh-hans.js`
`media/*` 
copyed from  
https://github.com/google/blockly.git


### diff in blockly code
blocks_compressed.js  
line 44 ~ 48
```javascript
// change by zhaouv @ logic_compare output : "Boolean" -> null
colour:"%{BKY_LOGIC_HUE}",tooltip:"%{BKYCONTROLS_IF_TOOLTIP_2}",helpUrl:"%{BKY_CONTROLS_IF_HELPURL}",extensions:["controls_if_tooltip"]},{type:"logic_compare",message0:"%1 %2 %3",args0:[{type:"input_value",name:"A"},{type:"field_dropdown",name:"OP",options:[["=","EQ"],["\u2260","NEQ"],["<","LT"],["\u2264","LTE"],[">","GT"],["\u2265","GTE"]]},{type:"input_value",name:"B"}],inputsInline:!0,output:null,colour:"%{BKY_LOGIC_HUE}",helpUrl:"%{BKY_LOGIC_COMPARE_HELPURL}",extensions:["logic_compare",
// change by zhaouv @ logic_operation output,check : "Boolean" -> null
// change by zhaouv @ logic_negate output,check : "Boolean" -> null
"logic_op_tooltip"]},{type:"logic_operation",message0:"%1 %2 %3",args0:[{type:"input_value",name:"A",check:null},{type:"field_dropdown",name:"OP",options:[["%{BKY_LOGIC_OPERATION_AND}","AND"],["%{BKY_LOGIC_OPERATION_OR}","OR"]]},{type:"input_value",name:"B",check:null}],inputsInline:!0,output:null,colour:"%{BKY_LOGIC_HUE}",helpUrl:"%{BKY_LOGIC_OPERATION_HELPURL}",extensions:["logic_op_tooltip"]},{type:"logic_negate",message0:"%{BKY_LOGIC_NEGATE_TITLE}",args0:[{type:"input_value",name:"BOOL",
```