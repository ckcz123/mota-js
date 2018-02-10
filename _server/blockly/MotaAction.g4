grammar MotaAction;

//===============parser===============

//事件  程序入口之一
event_m
    :   actionList
    ;

//动作集合
actionList
    :   (statement|Newline)+ 
    ;


//为了避免关键字冲突,全部加了_s
//动作
statement
    :   text_s
    |   tip_s
    |   show_s
    |   hide_s
    |   move_s
    |   moveHero_s
    |   changeFloor_s
    |   changePos_s
    |   setFg_s
    |   openDoor_s
    |   openShop_s
    |   disableShop_s
    |   battle_s
    |   trigger_s
    |   playSound_s
    |   playBgm_s
    |   pauseBgm_s
    |   resumeBgm_s
    |   setValue_s
    |   if_s
    |   choices_s
    |   win_s
    |   lose_s
    |   function_s
    |   update_s
    |   sleep_s
    |   revisit_s
    |   exit_s
    ;

text_s
    :   '显示文章' ':' EvalString Newline
    |   ('标题' EvalString)? ('图像' IdString)? ':' EvalString Newline
    ;

tip_s
    :   '显示提示' ':' EvalString Newline
    ;

setValue_s
    :   '变量操作' ':' '名称' EvalString '值' EvalString Newline
    ;

show_s
    :   '显示事件' INT ',' INT ('楼层' IdString)? ('动画时间' INT)? Newline
    ;

hide_s
    :   '隐藏事件' (INT ',' INT)? ('楼层' IdString)? ('动画时间' INT)? Newline
    ;

trigger_s
    :   '触发事件' INT ',' INT  Newline
    ;

revisit_s
    :   '重启当前事件' Newline
    ;

exit_s
    :   '立刻结束当前事件' Newline
    ;

update_s
    :   '更新状态栏和地图显伤' Newline
    ;

sleep_s
    :   '等待' INT '毫秒' Newline
    ;

battle_s
    :   '强制战斗' IdString Newline
    ;

openDoor_s
    :   '开门' INT ',' INT ('楼层' IdString)? Newline
    ;

changeFloor_s
    :   '楼层切换' IdString INT ',' INT ('上'|'下'|'左'|'右')? ('动画时间' INT)? Newline
    ;

changePos_s
    :   '位置切换' INT ',' INT ('上'|'下'|'左'|'右')? Newline
    |   '勇士转向' ('上'|'下'|'左'|'右') Newline
    ;

openShop_s
    :   '打开全局商店' IdString Newline
    ;

disableShop_s
    :   '禁用全局商店' IdString Newline
    ;

setFg_s
    :   '更改画面色调' NUMBER ',' NUMBER ',' NUMBER (',' NUMBER)? ('动画时间' INT)? Newline
    |   '恢复画面色调' ('动画时间' INT)? Newline
    ;

move_s
    :   '移动事件' (INT ',' INT)? ('动画时间' INT)? '立刻消失'? (('上'|'下'|'左'|'右') INT?)+ Newline
    ;

moveHero_s
    :   '移动勇士' ('动画时间' INT)? (('上'|'下'|'左'|'右') INT?)+ Newline
    ;

playBgm_s
    :   '播放背景音乐' EvalString Newline
    ;

pauseBgm_s
    :   '暂停背景音乐' Newline
    ;

resumeBgm_s
    :   '恢复背景音乐' Newline
    ;

playSound_s
    :   '播放音效' EvalString Newline
    ;

win_s
    :   '游戏胜利' EvalString Newline
    ;

lose_s
    :   '游戏失败' EvalString Newline
    ;

if_s
    :   '条件分歧' ':' EvalString Newline actionList '条件失败' ':' Newline actionList '分歧结束' Newline
    ;

choices_s
    :   '选项开始' EvalString Newline choicesContext+ '选项结束' Newline
    ;

choicesContext
    :   '选项文字' EvalString Newline actionList
    ;

function_s
    :   '自定义脚本' Newline .*? Newline '自定义结束' Newline
    ;

//===============lexer===============

NUMBER
    :   '-'? INT '.' INT EXP?   // 1.35, 1.35E-9, 0.3, -4.5
    |   '-'? INT EXP            // 1e10 -3e4
    |   '-'? INT                // -3, 45
    ;

INT :   '0' | '1'..'9' '0'..'9'* ; // no leading zeros

fragment EXP :   [Ee] [+\-]? INT ; // \- since - means "range" inside [...]

IdString
    :   [a-zA-Z_][0-9a-zA-Z_\-]*
    ;

EvalString
    :   (ESC_str | ~[\\])*?
    ;

fragment ESC_str : '\\' ([\\/bfnrt] | UNICODE) ;
fragment UNICODE : 'u' HEX HEX HEX HEX ;
fragment HEX : [0-9a-fA-F] ;

//===

WhiteSpace
    :   [ \t]+ -> skip
    ;

Newline
    :   ('\r' '\n'?| '\n') -> skip
    ;

BlockComment
    :   '/*' .*? '*/' -> skip
    ;

LineComment
    :   '//' ~[\r\n]* -> skip
    ;