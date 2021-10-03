HTML5长方形样板V2.8.2帮助文档
作者：小秋橙

您好，欢迎使用笔者魔改出的V2.8.2长方形版！
您或许早已发现，小艾制作的样板中，玩家的【视野】（不包括状态栏和底部工具栏）永远是【正方形】（如13*13样板是416*416像素，15*15样板是480*480像素）。
这个13或15，定义在libs文件夹的core.js文件中：
/*
    this.__SIZE__ = 13;
    this.__PIXELS__ = this.__SIZE__ * 32;
    this.__HALF_SIZE__ = Math.floor(this.__SIZE__ / 2);
*/
这个core.__SIZE__会同时作用于编辑器和游戏中，在之前的版本中，这个值在修改后编辑器会炸。而V2.8.2中可以任意修改了，同时“虚拟键盘、浏览地图提示、确认框”这三个场合对该值为偶数的情况进行了适配。
另外您会发现上述第二行代码中出现了常数32，这代表每个格子的边长（像素）。随着高清UI（特别是V2.8.2高清显伤）的出现，32*32大小的素材显得越发模糊，而RPG Maker MV/MZ的尺寸已经变为了48*48，
这在wdmota.com的两部RMMV魔塔（妖神纪、盖伦排位记）中可见一斑。因此笔者后续打算将样板中到处出现的32整理成和core.__SIZE__一样的引用，从而作者只需修改一处，就能使用更大尺寸的素材了。

使用说明：
1. 如需修改游戏中的视野宽高，请直接修改main.js文件（用记事本打开）的this.width和this.height即可，默认为17*13，复刻RMXP魔塔可改为20*15，如需改为正方形，请直接改为相等的数。
2. 编辑器的视野宽高，依然和正方形样板一样由core.__SIZE__指定，且可以和游戏中不同（根据main.mode判定，这一技巧在正方形样板也适用），编辑器中默认为15*15，可以自行修改libs文件夹的core.js文件。
3. 相比笔者上个月制作的V2.8.1长方形样板，现在编辑器的大地图模式可以正常使用了，同时取消了新建楼层/修改楼层尺寸时的宽高下限，请自行注意。
4. 相比V2.8.1长方形样板的“默认状态栏、地图状态栏”两个版本，本样板将这两种版本合并，用全塔属性的系统开关“自绘状态栏”statusCanvas控制，另外现在F7调试模式可以再次按F7关闭了（防止误按开启）。
5. 开启“自绘状态栏”后，横屏底部工具栏也将强制开启，横屏左侧的状态栏将彻底隐藏（同时意味着老黄鸡的“边测边改”扩展功能失效），并将在最右侧绘制状态栏（横向大地图中勇士走到最右侧时则会画在最左侧）。
6. 横屏的自绘状态栏改由公共事件实现（使用uievent图层），这大大方便了不会脚本的作者。为了不打断寻路，该事件会被笔者的“事件一键转脚本”插件转换成脚本再执行。
7. 横屏的自绘状态栏因为是画在地图上，且z值笔者默认设为66，因此会覆盖显伤，会被动画、天气、色调等覆盖，这完美还原了RPG Maker中的效果，还可以随时隐藏来进行沉浸式剧情演出/CG展示，多香～
8. 横向大地图中的横屏自绘状态栏默认会添加75%的半透明背景（公共事件内容，可以修改）。横向非大地图中，“中心对称飞行器”的目标点进行了特殊适配，依然以正方形为准（这也是为什么状态栏不画在左侧）。
9. 竖屏的自绘状态栏依然由脚本实现，V2.8.2支持预览，本长方形样板中默认预览竖屏。读档到没有背景音乐的楼层时，将暂停读档前的背景音乐，笔者还增加了一张竖屏标题背景图（横屏的也换了张大的）。
10.本样板新增了“录像自助精修、整数输入面板美化（公共事件实现并保证录像不变，也使用uievent图层）、事件一键转脚本”三个插件，且默认的整数输入事件也支持负整数了，怪物手册详情页改为用winskin绘制。
11.删除了MT0层，样板0层和样板1层改为17*13，最右侧四列仿照RMXP魔塔样板7630，用magictower.png中的图块拼出了一个带边框的灰色区域作为横屏自绘状态栏的背景。
12.修复了雾天图片256*256大小覆盖不全较大视野的bug，现在该图片在大视野中会自动放大了。点击难度标签切换到数字键的功能在录像回放时也可用了，笔者还给样板的绝大部分系统drawTip增加了图标。
13.“缩略图绘制”的options参数中，现在size表示的是绘制结果占整个视野的比例了。范围在0到1。如楼传为0.75，SL界面为0.3。且对编辑器进行了特判，编辑器中保持正方形。

接档说明：
1. 从正方形样板接档时，要注意project文件夹中对SIZE、HSIZE、PIXEL、LAST等常量的引用，都要对应修改为长方形样板的常量。
2. 从正方形样板接档时，如需使用“自绘状态栏”，需要添加“自绘状态栏（横屏专用）”公共事件，并手动修改“脚本编辑”的“自绘状态栏”函数，即core.ui.uidata.drawStatusBar()
3. 本长方形样板不保证“物品分类”和“自绘标题界面居中”这两个插件依然可用，事实上后者在自绘状态栏的情况下已经不需要了。
4. 极端情况下，您可能想制作51层魔塔或《永不复还》那样的左右双状态栏，此时只要在“脚本编辑”的“自绘状态栏”函数中去掉系统开关的判定而强制执行公共事件，并绘制需要的内容即可。

后续开发计划：
1. 目前长方形样板的横屏“自绘状态栏”公共事件占用的是uievent图层，可能和作者自己的UI绘制事件（如天赋树、技能树、装备合成、回合制战斗）相冲突，笔者将尝试修改事件编译功能使其支持一个独立的图层。
2. 目前长方形样板对竖屏的支持还是不太好，体现在宽度过大点不准等方面。因此笔者将尝试修复ad的强制横屏插件，看看能不能用于长方形样板。同时笔者将尝试研究编辑器中的视野能否也改为长方形，与游戏中统一。
3. 小艾和杨子默决定仿照RPG Maker数据库的“用语”一栏，将样板中用到的各种文案整理到一个文件中以供作者修改（现有的core.getStatusLabel()函数的加强版），笔者将负责这一整理工作。
4. 如前所述，争取将到处写死的格子尺寸常数32整理成引用，从而制作支持48*48等其他尺寸的样板版本。

而在长方形样板中，笔者将core.js的上述三行代码改为了：
/*
    this.__WIDTH__ = main.width; // 宽高直接引用main.js
    this.__HEIGHT__ = main.height;
    this.__UNIT__ = 32; // 定义每格的像素尺寸并引用，而不是写死32，为RMMV和RMMZ的48*48素材做准备
    this.__PX_WIDTH__ = this.__WIDTH__ * this.__UNIT__;
    this.__PX_HEIGHT__ = this.__HEIGHT__ * this.__UNIT__;
    this.__HALF_WIDTH__ = Math.floor(this.__WIDTH__ / 2);
    this.__HALF_HEIGHT__ = Math.floor(this.__HEIGHT__ / 2);

    this.__SIZE__ = main.mode == 'editor' ? 15 : 13; // V2.8.2起，编辑器和运行时可以指定不同的视野大小了
    this.__PIXELS__ = this.__SIZE__ * this.__UNIT__;
    this.__HALF_SIZE__ = Math.floor(this.__SIZE__ / 2);
*/
同时在main.js中写了如下代码：
/*
    this.version = "2.8.2"; // 游戏版本号；如果更改了游戏内容建议修改此version以免造成缓存问题。
    this.width = 17; // 运行时视野横向宽度的格子数，会被libs\core.js直接引用，可任意修改
    this.height = 13; // 运行时视野纵向高度的格子数，会被libs\core.js直接引用，可任意修改
    this.useCompress = false; // 是否使用压缩文件
*/
也就是将原本的“正方形边长”及其相关量，都拆分成了“长方形宽高”及其相关量，并修改了全部的引用。例如libs文件夹的actions.js和ui.js中，X_LAST和Y_LAST分别表示视野的最右侧一列和最下面一行格子。
function actions() {
    this._init();
    this.WIDTH = core.__WIDTH__;
    this.HEIGHT = core.__HEIGHT__;
    this.H_WIDTH = core.__HALF_WIDTH__;
    this.H_HEIGHT = core.__HALF_HEIGHT__;
    this.X_LAST = this.WIDTH - 1;
    this.Y_LAST = this.HEIGHT - 1;

    this.SIZE = core.__SIZE__;
    this.HSIZE = core.__HALF_SIZE__;
    this.LAST = this.SIZE - 1;
    this.CHOICES_LEFT = 5; // choices
    this.CHOICES_RIGHT = this.LAST - this.CHOICES_LEFT;

    this.CHOICES_LEFT = Math.ceil(core.__WIDTH__ / 3);
    this.CHOICES_RIGHT = this.X_LAST - this.CHOICES_LEFT;
}
function ui() {
    this._init();
    // for convenience
    this.WIDTH = core.__WIDTH__;
    this.HEIGHT = core.__HEIGHT__;
    this.H_WIDTH = core.__HALF_WIDTH__;
    this.H_HEIGHT = core.__HALF_HEIGHT__;
    this.X_LAST = this.WIDTH - 1;
    this.Y_LAST = this.HEIGHT - 1;
    this.PX_WIDTH = core.__PX_WIDTH__;
    this.PX_HEIGHT = core.__PX_HEIGHT__;
    this.HALF_PX = this.PX_WIDTH / 2;
    this.HALF_PY = this.PX_HEIGHT / 2;

    this.SIZE = core.__SIZE__;
    this.HSIZE = core.__HALF_SIZE__;
    this.LAST = this.SIZE - 1;
    this.PIXEL = core.__PIXELS__;
    this.HPIXEL = this.PIXEL / 2;
}