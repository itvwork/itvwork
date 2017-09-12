(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.wangEditor = factory());
}(this, (function () { 'use strict';

/*
    poly-fill
*/

var polyfill = function () {

    // Object.assign
    if (typeof Object.assign != 'function') {
        Object.assign = function (target, varArgs) {
            // .length of function is 2
            if (target == null) {
                // TypeError if undefined or null
                throw new TypeError('Cannot convert undefined or null to object');
            }

            var to = Object(target);

            for (var index = 1; index < arguments.length; index++) {
                var nextSource = arguments[index];

                if (nextSource != null) {
                    // Skip over if undefined or null
                    for (var nextKey in nextSource) {
                        // Avoid bugs when hasOwnProperty is shadowed
                        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }
            return to;
        };
    }
};

/*
    DOM 操作 API
*/

// 根据 html 代码片段创建 dom 对象
function createElemByHTML(html) {
    var div = void 0;
    div = document.createElement('div');
    div.innerHTML = html;
    return div.children;
}

// 是否是 DOM List
function isDOMList(selector) {
    if (!selector) {
        return false;
    }
    if (selector instanceof HTMLCollection || selector instanceof NodeList) {
        return true;
    }
    return false;
}

// 封装 document.querySelectorAll
function querySelectorAll(selector) {
    var result = document.querySelectorAll(selector);
    if (isDOMList(result)) {
        return result;
    } else {
        return [result];
    }
}

// 创建构造函数
function DomElement(selector) {
    if (!selector) {
        return;
    }

    // selector 本来就是 DomElement 对象，直接返回
    if (selector instanceof DomElement) {
        return selector;
    }

    this.selector = selector;

    // 根据 selector 得出的结果（如 DOM，DOM List）
    var selectorResult = [];
    if (selector.nodeType === 1) {
        // 单个 DOM 节点
        selectorResult = [selector];
    } else if (isDOMList(selector)) {
        // DOM List
        selectorResult = selector;
    } else if (typeof selector === 'string') {
        // 字符串
        selector = selector.replace('/\n/mg', '').trim();
        if (selector.indexOf('<') === 0) {
            // 如 <div>
            selectorResult = createElemByHTML(selector);
        } else {
            // 如 #id .class
            selectorResult = querySelectorAll(selector);
        }
    }

    var length = selectorResult.length;
    if (!length) {
        // 空数组
        return this;
    }

    // 加入 DOM 节点
    var i = void 0;
    for (i = 0; i < length; i++) {
        this[i] = selectorResult[i];
    }
    this.length = length;
}

// 修改原型
DomElement.prototype = {
    constructor: DomElement,

    // 类数组，forEach
    forEach: function forEach(fn) {
        var i = void 0;
        for (i = 0; i < this.length; i++) {
            var elem = this[i];
            var result = fn.call(elem, elem, i);
            if (result === false) {
                break;
            }
        }
        return this;
    },

    // 获取第几个元素
    get: function get(index) {
        var length = this.length;
        if (index >= length) {
            index = index % length;
        }
        return $(this[index]);
    },

    // 第一个
    first: function first() {
        return this.get(0);
    },

    // 最后一个
    last: function last() {
        var length = this.length;
        return this.get(length - 1);
    },

    // 绑定事件
    on: function on(type, selector, fn) {
        // selector 不为空，证明绑定事件要加代理
        if (!fn) {
            fn = selector;
            selector = null;
        }

        // type 是否有多个
        var types = [];
        types = type.split(/\s+/);

        return this.forEach(function (elem) {
            types.forEach(function (type) {
                if (!type) {
                    return;
                }

                if (!selector) {
                    // 无代理
                    elem.addEventListener(type, fn, false);
                    return;
                }

                // 有代理
                elem.addEventListener(type, function (e) {
                    var target = e.target;
                    if (target.matches(selector)) {
                        fn.call(target, e);
                    }
                }, false);
            });
        });
    },

    // 取消事件绑定
    off: function off(type, fn) {
        return this.forEach(function (elem) {
            elem.removeEventListener(type, fn, false);
        });
    },

    // 获取/设置 属性
    attr: function attr(key, val) {
        if (val == null) {
            // 获取值
            return this[0].getAttribute(key);
        } else {
            // 设置值
            return this.forEach(function (elem) {
                elem.setAttribute(key, val);
            });
        }
    },

    // 添加 class
    addClass: function addClass(className) {
        if (!className) {
            return this;
        }
        return this.forEach(function (elem) {
            var arr = void 0;
            if (elem.className) {
                // 解析当前 className 转换为数组
                arr = elem.className.split(/\s/);
                arr = arr.filter(function (item) {
                    return !!item.trim();
                }
                // 添加 class
                );if (arr.indexOf(className) < 0) {
                    arr.push(className);
                }
                // 修改 elem.class
                elem.className = arr.join(' ');
            } else {
                elem.className = className;
            }
        });
    },

    // 删除 class
    removeClass: function removeClass(className) {
        if (!className) {
            return this;
        }
        return this.forEach(function (elem) {
            var arr = void 0;
            if (elem.className) {
                // 解析当前 className 转换为数组
                arr = elem.className.split(/\s/);
                arr = arr.filter(function (item) {
                    item = item.trim
                    // 删除 class
                    ();if (!item || item === className) {
                        return false;
                    }
                    return true;
                }
                // 修改 elem.class
                );elem.className = arr.join(' ');
            }
        });
    },

    // 修改 css
    css: function css(key, val) {
        var currentStyle = key + ':' + val + ';';
        return this.forEach(function (elem) {
            var style = (elem.getAttribute('style') || '').trim();
            var styleArr = void 0,
                resultArr = [];
            if (style) {
                // 将 style 按照 ; 拆分为数组
                styleArr = style.split(';');
                styleArr.forEach(function (item) {
                    // 对每项样式，按照 : 拆分为 key 和 value
                    var arr = item.split(':').map(function (i) {
                        return i.trim();
                    });
                    if (arr.length === 2) {
                        resultArr.push(arr[0] + ':' + arr[1]);
                    }
                }
                // 替换或者新增
                );resultArr = resultArr.map(function (item) {
                    if (item.indexOf(key) === 0) {
                        return currentStyle;
                    } else {
                        return item;
                    }
                });
                if (resultArr.indexOf(currentStyle) < 0) {
                    resultArr.push(currentStyle);
                }
                // 结果
                elem.setAttribute('style', resultArr.join('; '));
            } else {
                // style 无值
                elem.setAttribute('style', currentStyle);
            }
        });
    },

    // 显示
    show: function show() {
        return this.css('display', 'block');
    },

    // 隐藏
    hide: function hide() {
        return this.css('display', 'none');
    },

    // 获取子节点
    children: function children() {
        var elem = this[0];
        if (!elem) {
            return null;
        }

        return $(elem.children);
    },

    // 增加子节点
    append: function append($children) {
        return this.forEach(function (elem) {
            $children.forEach(function (child) {
                elem.appendChild(child);
            });
        });
    },

    // 移除当前节点
    remove: function remove() {
        return this.forEach(function (elem) {
            if (elem.remove) {
                elem.remove();
            } else {
                var parent = elem.parentElement;
                parent.removeChild(elem);
            }
        });
    },

    // 是否包含某个子节点
    isContain: function isContain($child) {
        var elem = this[0];
        var child = $child[0];
        return elem.contains(child);
    },

    // 尺寸数据
    getSizeData: function getSizeData() {
        var elem = this[0];
        return elem.getBoundingClientRect // 可得到 bottom height left right top width 的数据
        ();
    },

    // 封装 nodeName
    getNodeName: function getNodeName() {
        var elem = this[0];
        return elem.nodeName;
    },

    // 从当前元素查找
    find: function find(selector) {
        var elem = this[0];
        return $(elem.querySelectorAll(selector));
    },

    // 获取当前元素的 text
    text: function text(val) {
        if (!val) {
            // 获取 text
            var elem = this[0];
            return elem.innerHTML.replace(/<.*?>/g, function () {
                return '';
            });
        } else {
            // 设置 text
            return this.forEach(function (elem) {
                elem.innerHTML = val;
            });
        }
    },

    // 获取 html
    html: function html(value) {
        var elem = this[0];
        if (value == null) {
            return elem.innerHTML;
        } else {
            elem.innerHTML = value;
            return this;
        }
    },

    // 获取 value
    val: function val() {
        var elem = this[0];
        return elem.value.trim();
    },

    // focus
    focus: function focus() {
        return this.forEach(function (elem) {
            elem.focus();
        });
    },

    // parent
    parent: function parent() {
        var elem = this[0];
        return $(elem.parentElement);
    },

    // parentUntil 找到符合 selector 的父节点
    parentUntil: function parentUntil(selector, _currentElem) {
        var results = document.querySelectorAll(selector);
        var length = results.length;
        if (!length) {
            // 传入的 selector 无效
            return null;
        }

        var elem = _currentElem || this[0];
        if (elem.nodeName === 'BODY') {
            return null;
        }

        var parent = elem.parentElement;
        var i = void 0;
        for (i = 0; i < length; i++) {
            if (parent === results[i]) {
                // 找到，并返回
                return $(parent);
            }
        }

        // 继续查找
        return this.parentUntil(selector, parent);
    },

    // 判断两个 elem 是否相等
    equal: function equal($elem) {
        if ($elem.nodeType === 1) {
            return this[0] === $elem;
        } else {
            return this[0] === $elem[0];
        }
    },

    // 将该元素插入到某个元素前面
    insertBefore: function insertBefore(selector) {
        var $referenceNode = $(selector);
        var referenceNode = $referenceNode[0];
        if (!referenceNode) {
            return this;
        }
        return this.forEach(function (elem) {
            var parent = referenceNode.parentNode;
            parent.insertBefore(elem, referenceNode);
        });
    },

    // 将该元素插入到某个元素后面
    insertAfter: function insertAfter(selector) {
        var $referenceNode = $(selector);
        var referenceNode = $referenceNode[0];
        if (!referenceNode) {
            return this;
        }
        return this.forEach(function (elem) {
            var parent = referenceNode.parentNode;
            if (parent.lastChild === referenceNode) {
                // 最后一个元素
                parent.appendChild(elem);
            } else {
                // 不是最后一个元素
                parent.insertBefore(elem, referenceNode.nextSibling);
            }
        });
    }

    // new 一个对象
};function $(selector) {
    return new DomElement(selector);
}

/*
    配置信息
*/

var config = {

    // 默认菜单配置
    menus: ['head', 'bold', 'italic', 'underline', 'strikeThrough', 'foreColor', 'backColor', 'link', 'list', 'justify', 'quote', 'emoticon', 'image', 'table', 'video', 'code', 'undo', 'redo'],

    // 是否开启 debug 模式（debug 模式下错误会 throw error 形式抛出）
    debug: false,

    // 是否显示添加网络图片的 tab
    showLinkImg: true,

    // 默认上传图片 max size: 5M
    uploadImgMaxSize: 5 * 1024 * 1024,

    // 上传图片，是否显示 base64 格式
    uploadImgShowBase64: false,

    // 上传图片，server 地址（如果有值，则 base64 格式的配置则失效）
    // uploadImgServer: '/upload',

    // 上传图片的自定义参数
    uploadImgParams: {
        // token: 'abcdef12345'
    },

    // 上传图片的自定义header
    uploadImgHeaders: {
        // 'Accept': 'text/x-json'
    },

    // 配置 XHR withCredentials
    withCredentials: false,

    // 自定义上传图片超时时间 ms
    uploadImgTimeout: 5000,

    // 上传图片 hook
    uploadImgHooks: {
        before: function before(xhr, editor, files) {},
        success: function success(xhr, editor, result) {},
        fail: function fail(xhr, editor, result) {},
        error: function error(xhr, editor) {},
        timeout: function timeout(xhr, editor) {}
    }
};

/*
    工具
*/

// 和 UA 相关的属性
var UA = {
    _ua: navigator.userAgent,

    // 是否 webkit
    isWebkit: function isWebkit() {
        var reg = /webkit/i;
        return reg.test(this._ua);
    }

    // 遍历对象
};function objForEach(obj, fn) {
    var key = void 0,
        result = void 0;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            result = fn.call(obj, key, obj[key]);
            if (result === false) {
                break;
            }
        }
    }
}

// 遍历类数组
function arrForEach(fakeArr, fn) {
    var i = void 0,
        item = void 0,
        result = void 0;
    var length = fakeArr.length || 0;
    for (i = 0; i < length; i++) {
        item = fakeArr[i];
        result = fn.call(fakeArr, item, i);
        if (result === false) {
            break;
        }
    }
}

// 获取随机数
function getRandom(prefix) {
    return prefix + Math.random().toString().slice(2);
}

// 替换 html 特殊字符
function replaceHtmlSymbol(html) {
    if (html == null) {
        return '';
    }
    return html.replace(/</gm, '&lt;').replace(/>/gm, '&gt;').replace(/"/gm, '&quot;');
}

// 返回百分比的格式
function percentFormat(number) {
    number = parseInt(number * 100);
    return number + '%';
}

/*
    bold-menu
*/
// 构造函数
function Bold(editor) {
    this.editor = editor;
    this.$elem = $('<div class="w-e-menu">\n            <i class="w-e-icon-bold"><i/>\n        </div>');
    this.type = 'click';

    // 当前是否 active 状态
    this._active = false;
}

// 原型
Bold.prototype = {
    constructor: Bold,

    // 点击事件
    onClick: function onClick(e) {
        // 点击菜单将触发这里

        var editor = this.editor;
        var isSeleEmpty = editor.selection.isSelectionEmpty();

        if (isSeleEmpty) {
            // 选区是空的，插入并选中一个“空白”
            editor.selection.createEmptyRange();
        }

        // 执行 bold 命令
        editor.cmd.do('bold');

        if (isSeleEmpty) {
            // 需要将选取折叠起来
            editor.selection.collapseRange();
            editor.selection.restoreSelection();
        }
    },

    // 试图改变 active 状态
    tryChangeActive: function tryChangeActive(e) {
        var editor = this.editor;
        var $elem = this.$elem;
        if (editor.cmd.queryCommandState('bold')) {
            this._active = true;
            $elem.addClass('w-e-active');
        } else {
            this._active = false;
            $elem.removeClass('w-e-active');
        }
    }
};

/*
    droplist
*/
var _emptyFn = function _emptyFn() {};

// 构造函数
function DropList(menu, opt) {
    var _this = this;

    // droplist 所依附的菜单
    this.menu = menu;
    this.opt = opt;
    // 容器
    var $container = $('<div class="w-e-droplist"></div>'

    // 标题
    );var $title = opt.$title;
    if ($title) {
        $title.addClass('w-e-dp-title');
        $container.append($title);
    }

    var list = opt.list || [];
    var type = opt.type || 'list'; // 'list' 列表形式（如“标题”菜单） / 'inline-block' 块状形式（如“颜色”菜单）
    var onClick = opt.onClick || _emptyFn;

    // 加入 DOM 并绑定事件
    var $list = $('<ul class="' + (type === 'list' ? 'w-e-list' : 'w-e-block') + '"></ul>');

    $container.append($list);
    var i = 0;
    list.forEach(function (item) {
        var $elem = item.$elem;
        var value = item.value;
        var $li = $('<li class="w-e-item"></li>');

        if ($elem) {
            $li.append($elem);
            $list.append($li);
            $elem.on('click', function (e) {
                onClick(value

                // 隐藏
                );_this.hideTimeoutId = setTimeout(function () {
                    _this.hide();
                }, 0);
            });
        }
        i++;
    }

    // 绑定隐藏事件
    );$container.on('mouseleave', function (e) {
        _this.hideTimeoutId = setTimeout(function () {
            _this.hide();
        }, 0);
    }

    // 记录属性
    );this.$container = $container;

    // 基本属性
    this._rendered = false;
    this._show = false;
}

// 原型
DropList.prototype = {
    constructor: DropList,

    // 显示（插入DOM）
    show: function show() {
        if (this.hideTimeoutId) {
            // 清除之前的定时隐藏
            clearTimeout(this.hideTimeoutId);
        }

        var menu = this.menu;
        var $menuELem = menu.$elem;
        var $container = this.$container;
        if (this._show) {
            return;
        }
        if (this._rendered) {
            // 显示
            $container.show();
        } else {
            // 加入 DOM 之前先定位位置
            var menuHeight = $menuELem.getSizeData().height || 0;
            var width = this.opt.width || 100; // 默认为 100
            $container.css('margin-top', menuHeight + 'px').css('width', width + 'px'

            // 加入到 DOM
            );$menuELem.append($container);
            this._rendered = true;
        }

        // 修改属性
        this._show = true;
        jscolor();
    },

    // 隐藏（移除DOM）
    hide: function hide() {
        if (this.showTimeoutId) {
            // 清除之前的定时显示
            clearTimeout(this.showTimeoutId);
        }

        var $container = this.$container;
        if (!this._show) {
            return;
        }
        // 隐藏并需改属性
        $container.hide();
        this._show = false;
    }
};

/*
    menu - header
*/
// 构造函数
function Head(editor) {
    var _this = this;

    this.editor = editor;
    this.$elem = $('<div class="w-e-menu"><i class="w-e-icon-header"><i/></div>');
    this.type = 'droplist';

    // 当前是否 active 状态
    this._active = false;

    // 初始化 droplist
    this.droplist = new DropList(this, {
        width: 100,
        $title: $('<p>设置标题</p>'),
        type: 'list', // droplist 以列表形式展示
        list: [{ $elem: $('<h1>H1</h1>'), value: '<h1>' }, { $elem: $('<h2>H2</h2>'), value: '<h2>' }, { $elem: $('<h3>H3</h3>'), value: '<h3>' }, { $elem: $('<h4>H4</h4>'), value: '<h4>' }, { $elem: $('<h5>H5</h5>'), value: '<h5>' }, { $elem: $('<p>正文</p>'), value: '<p>' }],
        onClick: function onClick(value) {
            // 注意 this 是指向当前的 Head 对象
            _this._command(value);
        }
    });
}

// 原型
Head.prototype = {
    constructor: Head,

    // 执行命令
    _command: function _command(value) {
        var editor = this.editor;
        editor.cmd.do('formatBlock', value);
    },

    // 试图改变 active 状态
    tryChangeActive: function tryChangeActive(e) {
        var editor = this.editor;
        var $elem = this.$elem;
        var reg = /^h/i;
        var cmdValue = editor.cmd.queryCommandValue('formatBlock');
        if (reg.test(cmdValue)) {
            this._active = true;
            $elem.addClass('w-e-active');
        } else {
            this._active = false;
            $elem.removeClass('w-e-active');
        }
    }
};

/*
    panel
*/

var emptyFn = function emptyFn() {};

// 记录已经显示 panel 的菜单
var _isCreatedPanelMenus = [];

// 构造函数
function Panel(menu, opt) {
    this.menu = menu;
    this.opt = opt;
}

// 原型
Panel.prototype = {
    constructor: Panel,

    // 显示（插入DOM）
    show: function show() {
        var _this = this;

        var menu = this.menu;
        if (_isCreatedPanelMenus.indexOf(menu) >= 0) {
            // 该菜单已经创建了 panel 不能再创建
            return;
        }

        var editor = menu.editor;
        var $textContainerElem = editor.$textContainerElem;
        var opt = this.opt;

        // panel 的容器
        var $container = $('<div class="w-e-panel-container"></div>');
        var width = opt.width || 300; // 默认 300px
        $container.css('width', width + 'px').css('margin-left', (0 - width) / 2 + 'px'

        // 准备 tabs 容器
        );var $tabTitleContainer = $('<ul class="w-e-panel-tab-title"></ul>');
        var $tabContentContainer = $('<div class="w-e-panel-tab-content"></div>');
        $container.append($tabTitleContainer).append($tabContentContainer

        // 设置高度
        );var height = opt.height;
        if (height) {
            $tabContentContainer.css('height', height + 'px').css('overflow-y', 'scroll');
        }

        // tabs
        var tabs = opt.tabs || [];
        var tabTitleArr = [];
        var tabContentArr = [];
        tabs.forEach(function (tab, tabIndex) {
            if (!tab) {
                return;
            }
            var title = tab.title || '';
            var tpl = tab.tpl || '';

            // 添加到 DOM
            var $title = $('<li class="w-e-item">' + title + '</li>');
            $tabTitleContainer.append($title);
            var $content = $(tpl);
            $tabContentContainer.append($content

            // 记录到内存
            );$title._index = tabIndex;
            tabTitleArr.push($title);
            tabContentArr.push($content

            // 设置 active 项
            );if (tabIndex === 0) {
                $title._active = true;
                $title.addClass('w-e-active');
            } else {
                $content.hide();
            }

            // 绑定 tab 的事件
            $title.on('click', function (e) {
                if ($title._active) {
                    return;
                }
                // 隐藏所有的 tab
                tabTitleArr.forEach(function ($title) {
                    $title._active = false;
                    $title.removeClass('w-e-active');
                });
                tabContentArr.forEach(function ($content) {
                    $content.hide();
                }

                // 显示当前的 tab
                );$title._active = true;
                $title.addClass('w-e-active');
                $content.show();
            });
        }

        // 绑定关闭事件
        );$container.on('click', function (e) {
            // 点击时阻止冒泡
            e.stopPropagation();
        });
        $textContainerElem.on('click', function (e) {
            _this.hide();
        }

        // 添加到 DOM
        );$textContainerElem.append($container

        // 绑定 opt 的事件，只有添加到 DOM 之后才能绑定成功
        );tabs.forEach(function (tab, index) {
            if (!tab) {
                return;
            }
            var events = tab.events || [];
            events.forEach(function (event) {
                var selector = event.selector;
                var type = event.type;
                var fn = event.fn || emptyFn;
                var $content = tabContentArr[index];
                $content.find(selector).on(type, function (e) {
                    e.stopPropagation();
                    var needToHide = fn(e
                    // 执行完事件之后，是否要关闭 panel
                    );if (needToHide) {
                        _this.hide();
                    }
                });
            });
        }

        // focus 第一个 elem
        );var $inputs = $container.find('input[type=text],textarea');
        if ($inputs.length) {
            $inputs.get(0).focus();
        }

        // 添加到属性
        this.$container = $container;

        // 隐藏其他 panel
        this._hideOtherPanels
        // 记录该 menu 已经创建了 panel
        ();_isCreatedPanelMenus.push(menu);
    },

    // 隐藏（移除DOM）
    hide: function hide() {
        var menu = this.menu;
        var $container = this.$container;
        if ($container) {
            $container.remove();
        }

        // 将该 menu 记录中移除
        _isCreatedPanelMenus = _isCreatedPanelMenus.filter(function (item) {
            if (item === menu) {
                return false;
            } else {
                return true;
            }
        });
    },

    // 一个 panel 展示时，隐藏其他 panel
    _hideOtherPanels: function _hideOtherPanels() {
        if (!_isCreatedPanelMenus.length) {
            return;
        }
        _isCreatedPanelMenus.forEach(function (menu) {
            var panel = menu.panel || {};
            if (panel.hide) {
                panel.hide();
            }
        });
    }
};

/*
    menu - link
*/
// 构造函数
function Link(editor) {
    this.editor = editor;
    this.$elem = $('<div class="w-e-menu"><i class="w-e-icon-link"><i/></div>');
    this.type = 'panel';

    // 当前是否 active 状态
    this._active = false;
}

// 原型
Link.prototype = {
    constructor: Link,

    // 点击事件
    onClick: function onClick(e) {
        var editor = this.editor;
        var $linkelem = void 0;

        if (this._active) {
            // 当前选区在链接里面
            $linkelem = editor.selection.getSelectionContainerElem();
            if (!$linkelem) {
                return;
            }
            // 将该元素都包含在选取之内，以便后面整体替换
            editor.selection.createRangeByElem($linkelem);
            editor.selection.restoreSelection
            // 显示 panel
            ();this._createPanel($linkelem.text(), $linkelem.attr('href'));
        } else {
            // 当前选区不在链接里面
            if (editor.selection.isSelectionEmpty()) {
                // 选区是空的，未选中内容
                this._createPanel('', '');
            } else {
                // 选中内容了
                this._createPanel(editor.selection.getSelectionText(), '');
            }
        }
    },

    // 创建 panel
    _createPanel: function _createPanel(text, link) {
        var _this = this;

        // panel 中需要用到的id
        var inputLinkId = getRandom('input-link');
        var inputTextId = getRandom('input-text');
        var btnOkId = getRandom('btn-ok');
        var btnDelId = getRandom('btn-del'

        // 是否显示“删除链接”
        );var delBtnDisplay = this._active ? 'inline-block' : 'none';

        // 初始化并显示 panel
        var panel = new Panel(this, {
            width: 300,
            // panel 中可包含多个 tab
            tabs: [{
                // tab 的标题
                title: '链接',
                // 模板
                tpl: '<div>\n                            <input id="' + inputTextId + '" type="text" class="block" value="' + text + '" placeholder="\u94FE\u63A5\u6587\u5B57"/></td>\n                            <input id="' + inputLinkId + '" type="text" class="block" value="' + link + '" placeholder="http://..."/></td>\n                            <div class="w-e-button-container">\n                                <button id="' + btnOkId + '" class="right">\u63D2\u5165</button>\n                                <button id="' + btnDelId + '" class="gray right" style="display:' + delBtnDisplay + '">\u5220\u9664\u94FE\u63A5</button>\n                            </div>\n                        </div>',
                // 事件绑定
                events: [
                // 插入链接
                {
                    selector: '#' + btnOkId,
                    type: 'click',
                    fn: function fn() {
                        // 执行插入链接
                        var $link = $('#' + inputLinkId);
                        var $text = $('#' + inputTextId);
                        var link = $link.val();
                        var text = $text.val();
                        _this._insertLink(text, link

                        // 返回 true，表示该事件执行完之后，panel 要关闭。否则 panel 不会关闭
                        );return true;
                    }
                },
                // 删除链接
                {
                    selector: '#' + btnDelId,
                    type: 'click',
                    fn: function fn() {
                        // 执行删除链接
                        _this._delLink

                        // 返回 true，表示该事件执行完之后，panel 要关闭。否则 panel 不会关闭
                        ();return true;
                    }
                }] // tab end
            }] // tabs end
        });

        // 显示 panel
        panel.show

        // 记录属性
        ();this.panel = panel;
    },

    // 删除当前链接
    _delLink: function _delLink() {
        if (!this._active) {
            return;
        }
        var editor = this.editor;
        var $selectionELem = editor.selection.getSelectionContainerElem();
        if (!$selectionELem) {
            return;
        }
        var selectionText = editor.selection.getSelectionText();
        editor.cmd.do('insertHTML', '<span>' + selectionText + '</span>');
    },

    // 插入链接
    _insertLink: function _insertLink(text, link) {
        if (!text || !link) {
            return;
        }
        var editor = this.editor;
        editor.cmd.do('insertHTML', '<a href="' + link + '" target="_blank">' + text + '</a>');
    },

    // 试图改变 active 状态
    tryChangeActive: function tryChangeActive(e) {
        var editor = this.editor;
        var $elem = this.$elem;
        var $selectionELem = editor.selection.getSelectionContainerElem();
        if (!$selectionELem) {
            return;
        }
        if ($selectionELem.getNodeName() === 'A') {
            this._active = true;
            $elem.addClass('w-e-active');
        } else {
            this._active = false;
            $elem.removeClass('w-e-active');
        }
    }
};

/*
    italic-menu
*/
// 构造函数
function Italic(editor) {
    this.editor = editor;
    this.$elem = $('<div class="w-e-menu">\n            <i class="w-e-icon-italic"><i/>\n        </div>');
    this.type = 'click';

    // 当前是否 active 状态
    this._active = false;
}

// 原型
Italic.prototype = {
    constructor: Italic,

    // 点击事件
    onClick: function onClick(e) {
        // 点击菜单将触发这里

        var editor = this.editor;
        var isSeleEmpty = editor.selection.isSelectionEmpty();

        if (isSeleEmpty) {
            // 选区是空的，插入并选中一个“空白”
            editor.selection.createEmptyRange();
        }

        // 执行 italic 命令
        editor.cmd.do('italic');

        if (isSeleEmpty) {
            // 需要将选取折叠起来
            editor.selection.collapseRange();
            editor.selection.restoreSelection();
        }
    },

    // 试图改变 active 状态
    tryChangeActive: function tryChangeActive(e) {
        var editor = this.editor;
        var $elem = this.$elem;
        if (editor.cmd.queryCommandState('italic')) {
            this._active = true;
            $elem.addClass('w-e-active');
        } else {
            this._active = false;
            $elem.removeClass('w-e-active');
        }
    }
};

/*
    redo-menu
*/
// 构造函数
function Redo(editor) {
    this.editor = editor;
    this.$elem = $('<div class="w-e-menu">\n            <i class="w-e-icon-redo"><i/>\n        </div>');
    this.type = 'click';

    // 当前是否 active 状态
    this._active = false;
}

// 原型
Redo.prototype = {
    constructor: Redo,

    // 点击事件
    onClick: function onClick(e) {
        // 点击菜单将触发这里

        var editor = this.editor;

        // 执行 redo 命令
        editor.cmd.do('redo');
    }
};

/*
    strikeThrough-menu
*/
// 构造函数
function StrikeThrough(editor) {
    this.editor = editor;
    this.$elem = $('<div class="w-e-menu">\n            <i class="w-e-icon-strikethrough"><i/>\n        </div>');
    this.type = 'click';

    // 当前是否 active 状态
    this._active = false;
}

// 原型
StrikeThrough.prototype = {
    constructor: StrikeThrough,

    // 点击事件
    onClick: function onClick(e) {
        // 点击菜单将触发这里

        var editor = this.editor;
        var isSeleEmpty = editor.selection.isSelectionEmpty();

        if (isSeleEmpty) {
            // 选区是空的，插入并选中一个“空白”
            editor.selection.createEmptyRange();
        }

        // 执行 strikeThrough 命令
        editor.cmd.do('strikeThrough');

        if (isSeleEmpty) {
            // 需要将选取折叠起来
            editor.selection.collapseRange();
            editor.selection.restoreSelection();
        }
    },

    // 试图改变 active 状态
    tryChangeActive: function tryChangeActive(e) {
        var editor = this.editor;
        var $elem = this.$elem;
        if (editor.cmd.queryCommandState('strikeThrough')) {
            this._active = true;
            $elem.addClass('w-e-active');
        } else {
            this._active = false;
            $elem.removeClass('w-e-active');
        }
    }
};

/*
    underline-menu
*/
// 构造函数
function Underline(editor) {
    this.editor = editor;
    this.$elem = $('<div class="w-e-menu">\n            <i class="w-e-icon-underline"><i/>\n        </div>');
    this.type = 'click';

    // 当前是否 active 状态
    this._active = false;
}

// 原型
Underline.prototype = {
    constructor: Underline,

    // 点击事件
    onClick: function onClick(e) {
        // 点击菜单将触发这里

        var editor = this.editor;
        var isSeleEmpty = editor.selection.isSelectionEmpty();

        if (isSeleEmpty) {
            // 选区是空的，插入并选中一个“空白”
            editor.selection.createEmptyRange();
        }

        // 执行 underline 命令
        editor.cmd.do('underline');

        if (isSeleEmpty) {
            // 需要将选取折叠起来
            editor.selection.collapseRange();
            editor.selection.restoreSelection();
        }
    },

    // 试图改变 active 状态
    tryChangeActive: function tryChangeActive(e) {
        var editor = this.editor;
        var $elem = this.$elem;
        if (editor.cmd.queryCommandState('underline')) {
            this._active = true;
            $elem.addClass('w-e-active');
        } else {
            this._active = false;
            $elem.removeClass('w-e-active');
        }
    }
};

/*
    undo-menu
*/
// 构造函数
function Undo(editor) {
    this.editor = editor;
    this.$elem = $('<div class="w-e-menu">\n            <i class="w-e-icon-undo"><i/>\n        </div>');
    this.type = 'click';

    // 当前是否 active 状态
    this._active = false;
}

// 原型
Undo.prototype = {
    constructor: Undo,

    // 点击事件
    onClick: function onClick(e) {
        // 点击菜单将触发这里

        var editor = this.editor;

        // 执行 undo 命令
        editor.cmd.do('undo');
    }
};

/*
    menu - list
*/
// 构造函数
function List(editor) {
    var _this = this;

    this.editor = editor;
    this.$elem = $('<div class="w-e-menu"><i class="w-e-icon-list2"><i/></div>');
    this.type = 'droplist';

    // 当前是否 active 状态
    this._active = false;

    // 初始化 droplist
    this.droplist = new DropList(this, {
        width: 120,
        $title: $('<p>设置列表</p>'),
        type: 'list', // droplist 以列表形式展示
        list: [{ $elem: $('<span><i class="w-e-icon-list-numbered"></i> 有序列表</span>'), value: 'insertOrderedList' }, { $elem: $('<span><i class="w-e-icon-list2"></i> 无序列表</span>'), value: 'insertUnorderedList' }],
        onClick: function onClick(value) {
            // 注意 this 是指向当前的 List 对象
            _this._command(value);
        }
    });
}

// 原型
List.prototype = {
    constructor: List,

    // 执行命令
    _command: function _command(value) {
        var editor = this.editor;
        var $textElem = editor.$textElem;
        editor.selection.restoreSelection();
        if (editor.cmd.queryCommandState(value)) {
            return;
        }
        editor.cmd.do(value

        // 验证列表是否被包裹在 <p> 之内
        );var $selectionElem = editor.selection.getSelectionContainerElem();
        if ($selectionElem.getNodeName() === 'LI') {
            $selectionElem = $selectionElem.parent();
        }
        if (/^ol|ul$/i.test($selectionElem.getNodeName()) === false) {
            return;
        }
        if ($selectionElem.equal($textElem)) {
            // 证明是顶级标签，没有被 <p> 包裹
            return;
        }
        var $parent = $selectionElem.parent();
        $selectionElem.insertAfter($parent);
        $parent.remove();
    },

    // 试图改变 active 状态
    tryChangeActive: function tryChangeActive(e) {
        var editor = this.editor;
        var $elem = this.$elem;
        if (editor.cmd.queryCommandState('insertUnOrderedList') || editor.cmd.queryCommandState('insertOrderedList')) {
            this._active = true;
            $elem.addClass('w-e-active');
        } else {
            this._active = false;
            $elem.removeClass('w-e-active');
        }
    }
};

/*
    menu - justify
*/
// 构造函数
function Justify(editor) {
    var _this = this;

    this.editor = editor;
    this.$elem = $('<div class="w-e-menu"><i class="w-e-icon-paragraph-left"><i/></div>');
    this.type = 'droplist';

    // 当前是否 active 状态
    this._active = false;

    // 初始化 droplist
    this.droplist = new DropList(this, {
        width: 100,
        $title: $('<p>对齐方式</p>'),
        type: 'list', // droplist 以列表形式展示
        list: [{ $elem: $('<span><i class="w-e-icon-paragraph-left"></i> 靠左</span>'), value: 'justifyLeft' }, { $elem: $('<span><i class="w-e-icon-paragraph-center"></i> 居中</span>'), value: 'justifyCenter' }, { $elem: $('<span><i class="w-e-icon-paragraph-right"></i> 靠右</span>'), value: 'justifyRight' }],
        onClick: function onClick(value) {
            // 注意 this 是指向当前的 List 对象
            _this._command(value);
        }
    });
}

// 原型
Justify.prototype = {
    constructor: Justify,

    // 执行命令
    _command: function _command(value) {
        var editor = this.editor;
        editor.cmd.do(value);
    }
};

/*
    droplist
*/
var _emptyFn$1 = function _emptyFn() {};

// 构造函数
function DropList$2(menu, opt) {
    var _this = this;

    // droplist 所依附的菜单
    this.menu = menu;
    this.opt = opt;
    // 容器
    var $container = $('<div class="w-e-droplist"></div>');

    var $title = opt.$title;
    if ($title) {
        $title.addClass('w-e-dp-title');
        $container.append($title);
    }

    var list = opt.list || [];
    var type = opt.type || 'list'; // 'list' 列表形式（如“标题”菜单） / 'inline-block' 块状形式（如“颜色”菜单）
    var onClick = opt.onClick || _emptyFn$1;

    // 加入 DOM 并绑定事件
    var $list = $('<ul class="' + (type === 'list' ? 'w-e-list' : 'w-e-block') + '"></ul>');

    $container.append($list);
    var i = 0;
    var len = list.length - 1;
    list.forEach(function (item) {
        var $elem = item.$elem;
        var value = item.value;
        if (i == len) {
            var $li = $('<li class="w-e-item w-e-btn-li"></li>');
        } else {
            var $li = $('<li class="w-e-item"></li>');
        }

        if ($elem) {
            $li.append($elem);
            $list.append($li);
            $elem.on('click', function (e) {
                onClick(value

                // 隐藏
                );_this.hideTimeoutId = setTimeout(function () {
                    _this.hide();
                }, 0);
            });
        }
        i++;
    }

    // 绑定隐藏事件
    );$container.on('mouseleave', function (e) {
        _this.hideTimeoutId = setTimeout(function () {
            _this.hide();
        }, 0);
    });

    $container.on('click', function (e) {
        _this.hideTimeoutId = setTimeout(function () {
            _this.show();
        });
    }, 0);

    // 记录属性
    this.$container = $container;

    // 基本属性
    this._rendered = false;
    this._show = false;
}

// 原型
DropList$2.prototype = {
    constructor: DropList$2,

    // 显示（插入DOM）
    show: function show() {
        if (this.hideTimeoutId) {
            // 清除之前的定时隐藏
            clearTimeout(this.hideTimeoutId);
        }

        var menu = this.menu;
        var $menuELem = menu.$elem;
        var $container = this.$container;
        if (this._show) {
            return;
        }
        if (this._rendered) {
            // 显示
            $container.show();
        } else {
            // 加入 DOM 之前先定位位置
            var menuHeight = $menuELem.getSizeData().height || 0;
            var width = this.opt.width || 100; // 默认为 100
            $container.css('margin-top', menuHeight + 'px').css('width', width + 'px'

            // 加入到 DOM
            );$menuELem.append($container);
            this._rendered = true;
        }

        // 修改属性
        this._show = true;
        jscolor();
    },

    // 隐藏（移除DOM）
    hide: function hide() {
        if (this.showTimeoutId) {
            // 清除之前的定时显示
            clearTimeout(this.showTimeoutId);
        }

        var $container = this.$container;
        if (!this._show) {
            return;
        }
        // 隐藏并需改属性
        $container.hide();
        this._show = false;
    }
};

/*
    menu - backcolor
*/
// 构造函数
function BackColor(editor) {
    var _this = this;

    this.editor = editor;
    this.$elem = $('<div class="w-e-menu"><i class="w-e-icon-pencil2"><i/></div>');
    this.type = 'droplist';

    // 当前是否 active 状态
    this._active = false;

    // 初始化 droplist
    this.droplist = new DropList$2(this, {
        width: 120,
        $title: $('<p>文字颜色</p>'),
        type: 'inline-block', // droplist 内容以 block 形式展示
        list: [{ $elem: $('<i style="color:#000000;" class="w-e-icon-pencil2"></i>'), value: '#000000' }, { $elem: $('<i style="color:#eeece0;" class="w-e-icon-pencil2"></i>'), value: '#eeece0' }, { $elem: $('<i style="color:#1c487f;" class="w-e-icon-pencil2"></i>'), value: '#1c487f' }, { $elem: $('<i style="color:#4d80bf;" class="w-e-icon-pencil2"></i>'), value: '#4d80bf' }, { $elem: $('<i style="color:#c24f4a;" class="w-e-icon-pencil2"></i>'), value: '#c24f4a' }, { $elem: $('<i style="color:#8baa4a;" class="w-e-icon-pencil2"></i>'), value: '#8baa4a' }, { $elem: $('<i style="color:#7b5ba1;" class="w-e-icon-pencil2"></i>'), value: '#7b5ba1' }, { $elem: $('<i style="color:#46acc8;" class="w-e-icon-pencil2"></i>'), value: '#46acc8' }, { $elem: $('<i style="color:#f9963b;" class="w-e-icon-pencil2"></i>'), value: '#f9963b' }, { $elem: $('<i style="color:#ffffff;" class="w-e-icon-pencil2"></i>'), value: '#ffffff' }, { $elem: $('<button class="jscolor {valueElement:null,onFineChange:\'efun.fontColor(this)\'} editor-define-color">\u81EA\u5B9A\u4E49\u989C\u8272</button>'), value: 'jscolor' }],
        onClick: function onClick(value) {
            // 注意 this 是指向当前的 BackColor 对象
            _this._command(value);
        }
    });
}

// 原型
BackColor.prototype = {
    constructor: BackColor,

    // 执行命令
    _command: function _command(value) {
        var editor = this.editor;
        editor.cmd.do('foreColor', value);
    }
};

/*
    menu - forecolor
*/
// 构造函数
function ForeColor$1(editor) {
    var _this = this;

    this.editor = editor;
    this.$elem = $('<div class="w-e-menu"><i class="w-e-icon-paint-brush"><i/></div>');
    this.type = 'droplist';

    // 当前是否 active 状态
    this._active = false;

    // 初始化 droplist
    this.droplist = new DropList$2(this, {
        width: 120,
        $title: $('<p>背景色</p>'),
        type: 'inline-block', // droplist 内容以 block 形式展示
        list: [{ $elem: $('<i style="color:#000000;" class="w-e-icon-paint-brush"></i>'), value: '#000000' }, { $elem: $('<i style="color:#eeece0;" class="w-e-icon-paint-brush"></i>'), value: '#eeece0' }, { $elem: $('<i style="color:#1c487f;" class="w-e-icon-paint-brush"></i>'), value: '#1c487f' }, { $elem: $('<i style="color:#4d80bf;" class="w-e-icon-paint-brush"></i>'), value: '#4d80bf' }, { $elem: $('<i style="color:#c24f4a;" class="w-e-icon-paint-brush"></i>'), value: '#c24f4a' }, { $elem: $('<i style="color:#8baa4a;" class="w-e-icon-paint-brush"></i>'), value: '#8baa4a' }, { $elem: $('<i style="color:#7b5ba1;" class="w-e-icon-paint-brush"></i>'), value: '#7b5ba1' }, { $elem: $('<i style="color:#46acc8;" class="w-e-icon-paint-brush"></i>'), value: '#46acc8' }, { $elem: $('<i style="color:#f9963b;" class="w-e-icon-paint-brush"></i>'), value: '#f9963b' }, { $elem: $('<i style="color:#ffffff;" class="w-e-icon-paint-brush"></i>'), value: '#ffffff' }, { $elem: $('<button class="jscolor {valueElement:null,onFineChange:\'efun.backColor(this)\'} editor-define-color">\u81EA\u5B9A\u4E49\u989C\u8272</button>'), value: 'jscolor' }],
        onClick: function onClick(value) {
            // 注意 this 是指向当前的 ForeColor 对象
            _this._command(value);
        }
    });
}

// 原型
ForeColor$1.prototype = {
    constructor: ForeColor$1,

    // 执行命令
    _command: function _command(value) {
        var editor = this.editor;
        editor.cmd.do('backColor', value);
    }
};

/*
    menu - quote
*/

// 构造函数
function Quote(editor) {
    var _this = this;

    this.editor = editor;
    this.$elem = $('<div class="w-e-menu">\n            <i class="w-e-icon-quotes-left"><i/>\n        </div>');
    this.type = 'droplist';

    // 当前是否 active 状态
    this._active = false;
    this.droplist = new DropList$2(this, {
        width: 120,
        $title: $('<p>块元素颜色</p>'),
        type: 'inline-block', // droplist 内容以 block 形式展示
        list: [{ $elem: $('<i style="color:#000000;" class="w-e-icon-paint-brush "></i>'), value: '#000000' }, { $elem: $('<i style="color:#eeece0;" class="w-e-icon-paint-brush"></i>'), value: '#eeece0' }, { $elem: $('<i style="color:#1c487f;" class="w-e-icon-paint-brush"></i>'), value: '#1c487f' }, { $elem: $('<i style="color:#4d80bf;" class="w-e-icon-paint-brush"></i>'), value: '#4d80bf' }, { $elem: $('<i style="color:#c24f4a;" class="w-e-icon-paint-brush"></i>'), value: '#c24f4a' }, { $elem: $('<i style="color:#8baa4a;" class="w-e-icon-paint-brush"></i>'), value: '#8baa4a' }, { $elem: $('<i style="color:#7b5ba1;" class="w-e-icon-paint-brush"></i>'), value: '#7b5ba1' }, { $elem: $('<i style="color:#46acc8;" class="w-e-icon-paint-brush"></i>'), value: '#46acc8' }, { $elem: $('<i style="color:#f9963b;" class="w-e-icon-paint-brush"></i>'), value: '#f9963b' }, { $elem: $('<i style="color:#ffffff;" class="w-e-icon-paint-brush"></i>'), value: '#ffffff' }, { $elem: $('<button class="jscolor {valueElement:null,onFineChange:\'efun.blockColor(this)\'} editor-define-color">\u81EA\u5B9A\u4E49\u989C\u8272</button>'), value: 'jscolor' }],
        onClick: function onClick(value) {
            // 注意 this 是指向当前的 ForeColor 对象
            _this._command(value);
        }
    });
}

// 原型
Quote.prototype = {
    constructor: Quote,
    _command: function _command(value) {
        console.log(value);
        var editor = this.editor;
        editor.cmd.do('formatBlock', '<BLOCKQUOTE>');
        var section = window.getSelection().anchorNode;

        for (var i = 0; i < 100; i++) {
            if (section.parentNode.nodeName == 'BLOCKQUOTE') {
                section.parentNode.style.backgroundColor = value;

                //console.log(section.parentNode.nodeName);
                break;
            } else {
                section = section.parentNode;
            }
        }
    }

    // onClick: function (e) {
    //     const editor = this.editor
    //     editor.cmd.do('formatBlock', '<BLOCKQUOTE>')
    // },
    //
    // tryChangeActive: function (e) {
    //     const editor = this.editor
    //     const $elem = this.$elem
    //     const reg = /^BLOCKQUOTE$/i
    //     const cmdValue = editor.cmd.queryCommandValue('formatBlock')
    //     if (reg.test(cmdValue)) {
    //         this._active = true
    //         $elem.addClass('w-e-active')
    //     } else {
    //         this._active = false
    //         $elem.removeClass('w-e-active')
    //     }
    // }
};

/*
    menu - code
*/
// 构造函数
function Code(editor) {
    this.editor = editor;
    this.$elem = $('<div class="w-e-menu">\n            <i class="w-e-icon-terminal"><i/>\n        </div>');
    this.type = 'panel';

    // 当前是否 active 状态
    this._active = false;
}

// 原型
Code.prototype = {
    constructor: Code,

    onClick: function onClick(e) {
        var editor = this.editor;
        var $startElem = editor.selection.getSelectionStartElem();
        var $endElem = editor.selection.getSelectionEndElem();
        var isSeleEmpty = editor.selection.isSelectionEmpty();
        var selectionText = editor.selection.getSelectionText();
        var $code = void 0;

        if (!$startElem.equal($endElem)) {
            // 跨元素选择，不做处理
            editor.selection.restoreSelection();
            return;
        }
        if (!isSeleEmpty) {
            // 选取不是空，用 <code> 包裹即可
            $code = $('<code>' + selectionText + '</code>');
            editor.cmd.do('insertElem', $code);
            editor.selection.createRangeByElem($code, false);
            editor.selection.restoreSelection();
            return;
        }

        // 选取是空，且没有夸元素选择，则插入 <pre><code></code></prev>
        if (this._active) {
            // 选中状态，将编辑内容
            this._createPanel($startElem.html());
        } else {
            // 未选中状态，将创建内容
            this._createPanel();
        }
    },

    _createPanel: function _createPanel(value) {
        var _this = this;

        // value - 要编辑的内容
        value = value || '';
        var type = !value ? 'new' : 'edit';
        var textId = getRandom('texxt');
        var btnId = getRandom('btn');

        var panel = new Panel(this, {
            width: 500,
            // 一个 Panel 包含多个 tab
            tabs: [{
                // 标题
                title: '插入代码',
                // 模板
                tpl: '<div>\n                        <textarea id="' + textId + '" style="height:145px;;">' + value + '</textarea>\n                        <div class="w-e-button-container">\n                            <button id="' + btnId + '" class="right">\u63D2\u5165</button>\n                        </div>\n                    <div>',
                // 事件绑定
                events: [
                // 插入代码
                {
                    selector: '#' + btnId,
                    type: 'click',
                    fn: function fn() {
                        var $text = $('#' + textId);
                        var text = $text.val() || $text.html();
                        text = replaceHtmlSymbol(text);
                        if (type === 'new') {
                            // 新插入
                            _this._insertCode(text);
                        } else {
                            // 编辑更新
                            _this._updateCode(text);
                        }

                        // 返回 true，表示该事件执行完之后，panel 要关闭。否则 panel 不会关闭
                        return true;
                    }
                }] // first tab end
            }] // tabs end
        }); // new Panel end

        // 显示 panel
        panel.show

        // 记录属性
        ();this.panel = panel;
    },

    // 插入代码
    _insertCode: function _insertCode(value) {
        var editor = this.editor;
        editor.cmd.do('insertHTML', '<pre><code>' + value + '</code></pre><p><br></p>');
    },

    // 更新代码
    _updateCode: function _updateCode(value) {
        var editor = this.editor;
        var $selectionELem = editor.selection.getSelectionContainerElem();
        if (!$selectionELem) {
            return;
        }
        $selectionELem.html(value);
        editor.selection.restoreSelection();
    },

    // 试图改变 active 状态
    tryChangeActive: function tryChangeActive(e) {
        var editor = this.editor;
        var $elem = this.$elem;
        var $selectionELem = editor.selection.getSelectionContainerElem();
        if (!$selectionELem) {
            return;
        }
        var $parentElem = $selectionELem.parent();
        if ($selectionELem.getNodeName() === 'CODE' && $parentElem.getNodeName() === 'PRE') {
            this._active = true;
            $elem.addClass('w-e-active');
        } else {
            this._active = false;
            $elem.removeClass('w-e-active');
        }
    }
};

/*
    menu - emoticon
*/
// 构造函数
function Emoticon(editor) {
    this.editor = editor;
    this.$elem = $('<div class="w-e-menu">\n            <i class="w-e-icon-happy"><i/>\n        </div>');
    this.type = 'panel';

    // 当前是否 active 状态
    this._active = false;
}

// 原型
Emoticon.prototype = {
    constructor: Emoticon,

    onClick: function onClick() {
        this._createPanel();
    },

    _createPanel: function _createPanel() {
        var _this = this;

        // 拼接表情字符串
        var faceHtml = '';
        var faceStr = '😀 😃 😄 😁 😆 😅 😂  😊 😇 🙂 🙃 😉 😌 😍 😘 😗 😙 😚 😋 😜 😝 😛 🤑 🤗 🤓 😎 😏 😒 😞 😔 😟 😕 🙁  😣 😖 😫 😩 😤 😠 😡 😶 😐 😑 😯 😦 😧 😮 😲 😵 😳 😱 😨 😰 😢 😥 😭 😓 😪 😴 🙄 🤔 😬 🤐';
        faceStr.split(/\s/).forEach(function (item) {
            if (item) {
                faceHtml += '<span class="w-e-item">' + item + '</span>';
            }
        });

        var handHtml = '';
        var handStr = '🙌 👏 👋 👍 👎 👊 ✊ ️👌 ✋ 👐 💪 🙏 ️👆 👇 👈 👉 🖕 🖐 🤘 🖖';
        handStr.split(/\s/).forEach(function (item) {
            if (item) {
                handHtml += '<span class="w-e-item">' + item + '</span>';
            }
        });

        var panel = new Panel(this, {
            width: 300,
            height: 200,
            // 一个 Panel 包含多个 tab
            tabs: [{
                // 标题
                title: '表情',
                // 模板
                tpl: '<div class="w-e-emoticon-container">' + faceHtml + '</div>',
                // 事件绑定
                events: [{
                    selector: 'span.w-e-item',
                    type: 'click',
                    fn: function fn(e) {
                        var target = e.target;
                        _this._insert(target.innerHTML
                        // 返回 true，表示该事件执行完之后，panel 要关闭。否则 panel 不会关闭
                        );return true;
                    }
                }]
            }, // first tab end
            {
                // 标题
                title: '手势',
                // 模板
                tpl: '<div class="w-e-emoticon-container">' + handHtml + '</div>',
                // 事件绑定
                events: [{
                    selector: 'span.w-e-item',
                    type: 'click',
                    fn: function fn(e) {
                        var target = e.target;
                        _this._insert(target.innerHTML
                        // 返回 true，表示该事件执行完之后，panel 要关闭。否则 panel 不会关闭
                        );return true;
                    }
                }] // second tab end
            }] // tabs end
        });

        // 显示 panel
        panel.show

        // 记录属性
        ();this.panel = panel;
    },

    // 插入表情
    _insert: function _insert(emoji) {
        var editor = this.editor;
        editor.cmd.do('insertHTML', '<span>' + emoji + '</span>');
    }
};

/*
    menu - table
*/
// 构造函数
function Table(editor) {
    this.editor = editor;
    this.$elem = $('<div class="w-e-menu"><i class="w-e-icon-table2"><i/></div>');
    this.type = 'panel';

    // 当前是否 active 状态
    this._active = false;
}

// 原型
Table.prototype = {
    constructor: Table,

    onClick: function onClick() {
        if (this._active) {
            // 编辑现有表格
            this._createEditPanel();
        } else {
            // 插入新表格
            this._createInsertPanel();
        }
    },

    // 创建插入新表格的 panel
    _createInsertPanel: function _createInsertPanel() {
        var _this = this;

        // 用到的 id
        var btnInsertId = getRandom('btn');
        var textRowNum = getRandom('row');
        var textColNum = getRandom('col');

        var panel = new Panel(this, {
            width: 250,
            // panel 包含多个 tab
            tabs: [{
                // 标题
                title: '插入表格',
                // 模板
                tpl: '<div>\n                        <p style="text-align:left; padding:5px 0;">\n                            \u521B\u5EFA\n                            <input id="' + textRowNum + '" type="text" value="5" style="width:40px;text-align:center;"/>\n                            \u884C\n                            <input id="' + textColNum + '" type="text" value="5" style="width:40px;text-align:center;"/>\n                            \u5217\u7684\u8868\u683C\n                        </p>\n                        <div class="w-e-button-container">\n                            <button id="' + btnInsertId + '" class="right">\u63D2\u5165</button>\n                        </div>\n                    </div>',
                // 事件绑定
                events: [{
                    // 点击按钮，插入表格
                    selector: '#' + btnInsertId,
                    type: 'click',
                    fn: function fn() {
                        var rowNum = parseInt($('#' + textRowNum).val());
                        var colNum = parseInt($('#' + textColNum).val());

                        if (rowNum && colNum && rowNum > 0 && colNum > 0) {
                            // form 数据有效
                            _this._insert(rowNum, colNum);
                        }

                        // 返回 true，表示该事件执行完之后，panel 要关闭。否则 panel 不会关闭
                        return true;
                    }
                }] // first tab end
            }] // tabs end
        }); // panel end

        // 展示 panel
        panel.show

        // 记录属性
        ();this.panel = panel;
    },

    // 插入表格
    _insert: function _insert(rowNum, colNum) {
        // 拼接 table 模板
        var r = void 0,
            c = void 0;
        var html = '<table border="0" width="100%" cellpadding="0" cellspacing="0">';
        for (r = 0; r < rowNum; r++) {
            html += '<tr>';
            if (r === 0) {
                for (c = 0; c < colNum; c++) {
                    html += '<th>&nbsp;</th>';
                }
            } else {
                for (c = 0; c < colNum; c++) {
                    html += '<td>&nbsp;</td>';
                }
            }
            html += '</tr>';
        }
        html += '</table><p><br></p>';

        // 执行命令
        var editor = this.editor;
        editor.cmd.do('insertHTML', html);
    },

    // 创建编辑表格的 panel
    _createEditPanel: function _createEditPanel() {
        var _this2 = this;

        // 可用的 id
        var addRowBtnId = getRandom('add-row');
        var addColBtnId = getRandom('add-col');
        var delRowBtnId = getRandom('del-row');
        var delColBtnId = getRandom('del-col');
        var delTableBtnId = getRandom('del-table'

        // 创建 panel 对象
        );var panel = new Panel(this, {
            width: 320,
            // panel 包含多个 tab
            tabs: [{
                // 标题
                title: '编辑表格',
                // 模板
                tpl: '<div>\n                        <div class="w-e-button-container" style="border-bottom:1px solid #f1f1f1;padding-bottom:5px;margin-bottom:5px;">\n                            <button id="' + addRowBtnId + '" class="left">\u589E\u52A0\u884C</button>\n                            <button id="' + delRowBtnId + '" class="red left">\u5220\u9664\u884C</button>\n                            <button id="' + addColBtnId + '" class="left">\u589E\u52A0\u5217</button>\n                            <button id="' + delColBtnId + '" class="red left">\u5220\u9664\u5217</button>\n                        </div>\n                        <div class="w-e-button-container">\n                            <button id="' + delTableBtnId + '" class="gray left">\u5220\u9664\u8868\u683C</button>\n                        </dv>\n                    </div>',
                // 事件绑定
                events: [{
                    // 增加行
                    selector: '#' + addRowBtnId,
                    type: 'click',
                    fn: function fn() {
                        _this2._addRow
                        // 返回 true，表示该事件执行完之后，panel 要关闭。否则 panel 不会关闭
                        ();return true;
                    }
                }, {
                    // 增加列
                    selector: '#' + addColBtnId,
                    type: 'click',
                    fn: function fn() {
                        _this2._addCol
                        // 返回 true，表示该事件执行完之后，panel 要关闭。否则 panel 不会关闭
                        ();return true;
                    }
                }, {
                    // 删除行
                    selector: '#' + delRowBtnId,
                    type: 'click',
                    fn: function fn() {
                        _this2._delRow
                        // 返回 true，表示该事件执行完之后，panel 要关闭。否则 panel 不会关闭
                        ();return true;
                    }
                }, {
                    // 删除列
                    selector: '#' + delColBtnId,
                    type: 'click',
                    fn: function fn() {
                        _this2._delCol
                        // 返回 true，表示该事件执行完之后，panel 要关闭。否则 panel 不会关闭
                        ();return true;
                    }
                }, {
                    // 删除表格
                    selector: '#' + delTableBtnId,
                    type: 'click',
                    fn: function fn() {
                        _this2._delTable
                        // 返回 true，表示该事件执行完之后，panel 要关闭。否则 panel 不会关闭
                        ();return true;
                    }
                }]
            }]
        });
        // 显示 panel
        panel.show();
    },

    // 获取选中的单元格的位置信息
    _getLocationData: function _getLocationData() {
        var result = {};
        var editor = this.editor;
        var $selectionELem = editor.selection.getSelectionContainerElem();
        if (!$selectionELem) {
            return;
        }
        var nodeName = $selectionELem.getNodeName();
        if (nodeName !== 'TD' && nodeName !== 'TH') {
            return;
        }

        // 获取 td index
        var $tr = $selectionELem.parent();
        var $tds = $tr.children();
        var tdLength = $tds.length;
        $tds.forEach(function (td, index) {
            if (td === $selectionELem[0]) {
                // 记录并跳出循环
                result.td = {
                    index: index,
                    elem: td,
                    length: tdLength
                };
                return false;
            }
        }

        // 获取 tr index
        );var $tbody = $tr.parent();
        var $trs = $tbody.children();
        var trLength = $trs.length;
        $trs.forEach(function (tr, index) {
            if (tr === $tr[0]) {
                // 记录并跳出循环
                result.tr = {
                    index: index,
                    elem: tr,
                    length: trLength
                };
                return false;
            }
        }

        // 返回结果
        );return result;
    },

    // 增加行
    _addRow: function _addRow() {
        // 获取当前单元格的位置信息
        var locationData = this._getLocationData();
        if (!locationData) {
            return;
        }
        var trData = locationData.tr;
        var $currentTr = $(trData.elem);
        var tdData = locationData.td;
        var tdLength = tdData.length;

        // 拼接即将插入的字符串
        var newTr = document.createElement('tr');
        var tpl = '',
            i = void 0;
        for (i = 0; i < tdLength; i++) {
            tpl += '<td>&nbsp;</td>';
        }
        newTr.innerHTML = tpl;
        // 插入
        $(newTr).insertAfter($currentTr);
    },

    // 增加列
    _addCol: function _addCol() {
        // 获取当前单元格的位置信息
        var locationData = this._getLocationData();
        if (!locationData) {
            return;
        }
        var trData = locationData.tr;
        var tdData = locationData.td;
        var tdIndex = tdData.index;
        var $currentTr = $(trData.elem);
        var $trParent = $currentTr.parent();
        var $trs = $trParent.children

        // 遍历所有行
        ();$trs.forEach(function (tr) {
            var $tr = $(tr);
            var $tds = $tr.children();
            var $currentTd = $tds.get(tdIndex);
            var name = $currentTd.getNodeName().toLowerCase

            // new 一个 td，并插入
            ();var newTd = document.createElement(name);
            $(newTd).insertAfter($currentTd);
        });
    },

    // 删除行
    _delRow: function _delRow() {
        // 获取当前单元格的位置信息
        var locationData = this._getLocationData();
        if (!locationData) {
            return;
        }
        var trData = locationData.tr;
        var $currentTr = $(trData.elem);
        $currentTr.remove();
    },

    // 删除列
    _delCol: function _delCol() {
        // 获取当前单元格的位置信息
        var locationData = this._getLocationData();
        if (!locationData) {
            return;
        }
        var trData = locationData.tr;
        var tdData = locationData.td;
        var tdIndex = tdData.index;
        var $currentTr = $(trData.elem);
        var $trParent = $currentTr.parent();
        var $trs = $trParent.children

        // 遍历所有行
        ();$trs.forEach(function (tr) {
            var $tr = $(tr);
            var $tds = $tr.children();
            var $currentTd = $tds.get(tdIndex
            // 删除
            );$currentTd.remove();
        });
    },

    // 删除表格
    _delTable: function _delTable() {
        var editor = this.editor;
        var $selectionELem = editor.selection.getSelectionContainerElem();
        if (!$selectionELem) {
            return;
        }
        var $table = $selectionELem.parentUntil('table');
        if (!$table) {
            return;
        }
        $table.remove();
    },

    // 试图改变 active 状态
    tryChangeActive: function tryChangeActive(e) {
        var editor = this.editor;
        var $elem = this.$elem;
        var $selectionELem = editor.selection.getSelectionContainerElem();
        if (!$selectionELem) {
            return;
        }
        var nodeName = $selectionELem.getNodeName();
        if (nodeName === 'TD' || nodeName === 'TH') {
            this._active = true;
            $elem.addClass('w-e-active');
        } else {
            this._active = false;
            $elem.removeClass('w-e-active');
        }
    }
};

/*
    menu - video
*/
// 构造函数
function Video(editor) {
    this.editor = editor;
    this.$elem = $('<div class="w-e-menu"><i class="w-e-icon-play"><i/></div>');
    this.type = 'panel';

    // 当前是否 active 状态
    this._active = false;
}

// 原型
Video.prototype = {
    constructor: Video,

    onClick: function onClick() {
        this._createPanel();
    },

    _createPanel: function _createPanel() {
        var _this = this;

        // 创建 id
        var textValId = getRandom('text-val');
        var btnId = getRandom('btn'

        // 创建 panel
        );var panel = new Panel(this, {
            width: 350,
            // 一个 panel 多个 tab
            tabs: [{
                // 标题
                title: '插入视频',
                // 模板
                tpl: '<div>\n                        <input id="' + textValId + '" type="text" class="block" placeholder="\u683C\u5F0F\u5982\uFF1A<iframe src=... ></iframe>"/>\n                        <div class="w-e-button-container">\n                            <button id="' + btnId + '" class="right">\u63D2\u5165</button>\n                        </div>\n                    </div>',
                // 事件绑定
                events: [{
                    selector: '#' + btnId,
                    type: 'click',
                    fn: function fn() {
                        var $text = $('#' + textValId);
                        var val = $text.val().trim

                        // 测试用视频地址
                        // <iframe height=498 width=510 src='http://player.youku.com/embed/XMjcwMzc3MzM3Mg==' frameborder=0 'allowfullscreen'></iframe>

                        ();if (val) {
                            // 插入视频
                            _this._insert(val);
                        }

                        // 返回 true，表示该事件执行完之后，panel 要关闭。否则 panel 不会关闭
                        return true;
                    }
                }] // first tab end
            }] // tabs end
        }); // panel end

        // 显示 panel
        panel.show

        // 记录属性
        ();this.panel = panel;
    },

    // 插入视频
    _insert: function _insert(val) {
        var editor = this.editor;
        editor.cmd.do('insertHTML', val + '<p><br></p>');
    }
};

/*
    panel
*/

/*
    menu - img
*/
// 构造函数
function Image(editor) {
    this.editor = editor;
    this.$elem = $('<div class="w-e-menu btn-w-e"><i class="w-e-icon-image"><i/></div>');
    this.type = 'panel';

    // 当前是否 active 状态
    this._active = true;
}

/*
    所有菜单的汇总
*/

// 存储菜单的构造函数
var MenuConstructors = {};

MenuConstructors.bold = Bold;

MenuConstructors.head = Head;

MenuConstructors.link = Link;

MenuConstructors.italic = Italic;

MenuConstructors.redo = Redo;

MenuConstructors.strikeThrough = StrikeThrough;

MenuConstructors.underline = Underline;

MenuConstructors.undo = Undo;

MenuConstructors.list = List;

MenuConstructors.justify = Justify;

MenuConstructors.foreColor = BackColor;

MenuConstructors.backColor = ForeColor$1;

MenuConstructors.quote = Quote;

MenuConstructors.code = Code;

MenuConstructors.emoticon = Emoticon;

MenuConstructors.table = Table;

MenuConstructors.video = Video;

MenuConstructors.image = Image;

/*
    菜单集合
*/
// 构造函数
function Menus(editor) {
    this.editor = editor;
    this.menus = {};
}

// 修改原型
Menus.prototype = {
    constructor: Menus,

    // 初始化菜单
    init: function init() {
        var _this = this;

        var editor = this.editor;
        var config = editor.config || {};
        var configMenus = config.menus || []; // 获取配置中的菜单

        // 根据配置信息，创建菜单
        configMenus.forEach(function (menuKey) {
            var MenuConstructor = MenuConstructors[menuKey];
            if (MenuConstructor && typeof MenuConstructor === 'function') {
                // 创建单个菜单
                _this.menus[menuKey] = new MenuConstructor(editor);
            }
        }

        // 添加到菜单栏
        );this._addToToolbar

        // 绑定事件
        ();this._bindEvent();
    },

    // 添加到菜单栏
    _addToToolbar: function _addToToolbar() {
        var editor = this.editor;
        var $toolbarElem = editor.$toolbarElem;
        var menus = this.menus;
        objForEach(menus, function (key, menu) {
            var $elem = menu.$elem;
            if ($elem) {
                $toolbarElem.append($elem);
            }
        });
    },

    // 绑定菜单 click mouseenter 事件
    _bindEvent: function _bindEvent() {
        var menus = this.menus;
        var editor = this.editor;
        objForEach(menus, function (key, menu) {
            var type = menu.type;
            if (!type) {
                return;
            }
            var $elem = menu.$elem;
            var droplist = menu.droplist;
            var panel = menu.panel;

            // 点击类型，例如 bold
            if (type === 'click' && menu.onClick) {
                $elem.on('click', function (e) {
                    if (editor.selection.getRange() == null) {
                        return;
                    }
                    menu.onClick(e);
                });
            }

            // 下拉框，例如 head
            if (type === 'droplist' && droplist) {
                $elem.on('mouseenter', function (e) {
                    if (editor.selection.getRange() == null) {
                        return;
                    }
                    // 显示
                    droplist.showTimeoutId = setTimeout(function () {
                        droplist.show();
                    }, 200);
                }).on('mouseleave', function (e) {
                    // 隐藏
                    droplist.hideTimeoutId = setTimeout(function () {
                        droplist.hide();
                    }, 0);
                });
            }

            // 弹框类型，例如 link
            if (type === 'panel' && menu.onClick) {
                $elem.on('click', function (e) {
                    if (editor.selection.getRange() == null) {
                        return;
                    }
                    // 在自定义事件中显示 panel
                    menu.onClick(e);
                });
            }
        });
    },

    // 尝试修改菜单状态
    changeActive: function changeActive() {
        var menus = this.menus;
        objForEach(menus, function (key, menu) {
            if (menu.tryChangeActive) {
                setTimeout(function () {
                    menu.tryChangeActive();
                }, 100);
            }
        });
    }
};

/*
    粘贴信息的处理
*/

// 获取粘贴的纯文本
function getPasteText(e) {
    var clipboardData = e.clipboardData || e.originalEvent.clipboardData;
    var pasteText = void 0;
    if (clipboardData == null) {
        pasteText = window.clipboardData && window.clipboardData.getData('text');
    } else {
        pasteText = clipboardData.getData('text/plain');
    }

    return replaceHtmlSymbol(pasteText);
}

// 获取粘贴的html
function getPasteHtml(e) {
    var clipboardData = e.clipboardData || e.originalEvent.clipboardData;
    var pasteText = void 0,
        pasteHtml = void 0;
    if (clipboardData == null) {
        pasteText = window.clipboardData && window.clipboardData.getData('text');
    } else {
        pasteText = clipboardData.getData('text/plain');
        pasteHtml = clipboardData.getData('text/html');
    }
    if (!pasteHtml && pasteText) {
        pasteHtml = '<p>' + replaceHtmlSymbol(pasteText) + '</p>';
    }
    if (!pasteHtml) {
        return;
    }

    // 过滤word中状态过来的无用字符
    var docSplitHtml = pasteHtml.split('</html>');
    if (docSplitHtml.length === 2) {
        pasteHtml = docSplitHtml[0];
    }

    // 过滤无用标签
    pasteHtml = pasteHtml.replace(/<(meta|script|link).+?>/igm, ''

    // 过滤样式
    );pasteHtml = pasteHtml.replace(/\s?(class|style)=('|").+?('|")/igm, '');

    return pasteHtml;
}

// 获取粘贴的图片文件
function getPasteImgs(e) {
    var result = [];
    var txt = getPasteText(e);
    if (txt) {
        // 有文字，就忽略图片
        return result;
    }

    var clipboardData = e.clipboardData || e.originalEvent.clipboardData || {};
    var items = clipboardData.items;
    if (!items) {
        return result;
    }

    objForEach(items, function (key, value) {
        var type = value.type;
        if (/image/i.test(type)) {
            result.push(value.getAsFile());
        }
    });

    return result;
}

/*
    编辑区域
*/

// 构造函数
function Text(editor) {
    this.editor = editor;
}

// 修改原型
Text.prototype = {
    constructor: Text,

    // 初始化
    init: function init() {
        // 绑定事件
        this._bindEvent();
    },

    // 清空内容
    clear: function clear() {
        this.html('<p><br></p>');
    },

    // 获取 设置 html
    html: function html(val) {
        var editor = this.editor;
        var $textElem = editor.$textElem;
        if (val == null) {
            return $textElem.html();
        } else {
            $textElem.html(val);
        }
    },

    // 获取 设置 text
    text: function text(val) {
        var editor = this.editor;
        var $textElem = editor.$textElem;
        if (val == null) {
            return $textElem.text();
        } else {
            $textElem.text('<p>' + val + '</p>');
        }
    },

    // 追加内容
    append: function append(html) {
        var editor = this.editor;
        var $textElem = editor.$textElem;
        $textElem.append($(html));
    },

    // 绑定事件
    _bindEvent: function _bindEvent() {
        // 实时保存选取
        this._saveRangeRealTime

        // 按回车建时的特殊处理
        ();this._enterKeyHandle

        // 清空时保留 <p><br></p>
        ();this._clearHandle

        // 粘贴事件（粘贴文字，粘贴图片）
        ();this._pasteHandle

        // tab 特殊处理
        ();this._tabHandle

        // img 点击
        ();this._imgHandle();
    },

    // 实时保存选取
    _saveRangeRealTime: function _saveRangeRealTime() {
        var editor = this.editor;
        var $textElem = editor.$textElem;

        // 保存当前的选区
        function saveRange(e) {
            // 随时保存选区
            editor.selection.saveRange
            // 更新按钮 ative 状态
            ();editor.menus.changeActive();
        }
        // 按键后保存
        $textElem.on('keyup', saveRange);
        $textElem.on('mousedown', function (e) {
            // mousedown 状态下，鼠标滑动到编辑区域外面，也需要保存选区
            $textElem.on('mouseleave', saveRange);
        });
        $textElem.on('mouseup', function (e) {
            saveRange
            // 在编辑器区域之内完成点击，取消鼠标滑动到编辑区外面的事件
            ();$textElem.off('mouseleave', saveRange);
        });
    },

    // 按回车键时的特殊处理
    _enterKeyHandle: function _enterKeyHandle() {
        var editor = this.editor;
        var $textElem = editor.$textElem;

        // 将回车之后生成的非 <p> 的顶级标签，改为 <p>
        function pHandle(e) {
            var $selectionElem = editor.selection.getSelectionContainerElem();
            var $parentElem = $selectionElem.parent();
            if (!$parentElem.equal($textElem)) {
                // 不是顶级标签
                return;
            }
            var nodeName = $selectionElem.getNodeName();
            if (nodeName === 'P') {
                // 当前的标签是 P ，不用做处理
            }

            if ($selectionElem.text()) {
                // 有内容，不做处理
                return;
            }

            // 插入 <p> ，并将选取定位到 <p>，删除当前标签
            var $p = $('<p><br></p>');
            $p.insertBefore($selectionElem);
            editor.selection.createRangeByElem($p, true);
            editor.selection.restoreSelection();
            $selectionElem.remove();
        }

        $textElem.on('keyup', function (e) {
            if (e.keyCode !== 13) {
                // 不是回车键
                return;
            }
            // 将回车之后生成的非 <p> 的顶级标签，改为 <p>
            pHandle(e);
        }

        // <pre><code></code></pre> 回车时 特殊处理
        );function codeHandle(e) {
            var $selectionElem = editor.selection.getSelectionContainerElem();
            if (!$selectionElem) {
                return;
            }
            var $parentElem = $selectionElem.parent();
            var selectionNodeName = $selectionElem.getNodeName();
            var parentNodeName = $parentElem.getNodeName();

            if (selectionNodeName !== 'CODE' || parentNodeName !== 'PRE') {
                // 不符合要求 忽略
                return;
            }

            if (!editor.cmd.queryCommandSupported('insertHTML')) {
                // 必须原生支持 insertHTML 命令
                return;
            }

            var _startOffset = editor.selection.getRange().startOffset;
            editor.cmd.do('insertHTML', '\n');
            editor.selection.saveRange();
            if (editor.selection.getRange().startOffset === _startOffset) {
                // 没起作用，再来一遍
                editor.cmd.do('insertHTML', '\n');
            }

            // 阻止默认行为
            e.preventDefault();
        }

        $textElem.on('keydown', function (e) {
            if (e.keyCode !== 13) {
                // 不是回车键
                return;
            }
            // <pre><code></code></pre> 回车时 特殊处理
            codeHandle(e);
        });
    },

    // 清空时保留 <p><br></p>
    _clearHandle: function _clearHandle() {
        var editor = this.editor;
        var $textElem = editor.$textElem;

        $textElem.on('keydown', function (e) {
            if (e.keyCode !== 8) {
                return;
            }
            var txtHtml = $textElem.html().toLowerCase().trim();
            if (txtHtml === '<p><br></p>') {
                // 最后剩下一个空行，就不再删除了
                e.preventDefault();
                return;
            }
        });

        $textElem.on('keyup', function (e) {
            if (e.keyCode !== 8) {
                return;
            }
            var $p = void 0;
            var txtHtml = $textElem.html().toLowerCase().trim

            // firefox 时用 txtHtml === '<br>' 判断，其他用 !txtHtml 判断
            ();if (!txtHtml || txtHtml === '<br>') {
                // 内容空了
                $p = $('<p><br/></p>');
                $textElem.html('' // 一定要先清空，否则在 firefox 下有问题
                );$textElem.append($p);
                editor.selection.createRangeByElem($p, false, true);
                editor.selection.restoreSelection();
            }
        });
    },

    // 粘贴事件（粘贴文字 粘贴图片）
    _pasteHandle: function _pasteHandle() {
        var editor = this.editor;
        var $textElem = editor.$textElem;

        // 粘贴文字
        $textElem.on('paste', function (e) {
            // 阻止默认行为，使用 execCommand 的粘贴命令
            e.preventDefault

            // 获取粘贴的文字
            ();var pasteText = void 0,
                pasteHtml = void 0;

            var $selectionElem = editor.selection.getSelectionContainerElem();
            if (!$selectionElem) {
                return;
            }
            var nodeName = $selectionElem.getNodeName

            // code 中粘贴忽略
            ();if (nodeName === 'CODE' || nodeName === 'PRE') {
                return;
            }

            // 表格中忽略，可能会出现异常问题
            if (nodeName === 'TD' || nodeName === 'TH') {
                return;
            }

            if (nodeName === 'DIV' || $textElem.html() === '<p><br></p>') {
                // 是 div，可粘贴过滤样式的文字和链接

                pasteHtml = getPasteHtml(e);
                if (!pasteHtml) {
                    return;
                }
                editor.cmd.do('insertHTML', pasteHtml);
            } else {
                // 不是 div，证明在已有内容的元素中粘贴，只粘贴纯文本

                pasteText = getPasteText(e);
                if (!pasteText) {
                    return;
                }
                editor.cmd.do('insertHTML', '<p>' + pasteText + '</p>');
            }
        }

        // 粘贴图片
        );$textElem.on('paste', function (e) {
            e.preventDefault

            // 获取粘贴的图片
            ();var pasteFiles = getPasteImgs(e);
            if (!pasteFiles || !pasteFiles.length) {
                return;
            }

            // 获取当前的元素
            var $selectionElem = editor.selection.getSelectionContainerElem();
            if (!$selectionElem) {
                return;
            }
            var nodeName = $selectionElem.getNodeName

            // code 中粘贴忽略
            ();if (nodeName === 'CODE' || nodeName === 'PRE') {
                return;
            }

            // 上传图片
            var uploadImg = editor.uploadImg;
            uploadImg.uploadImg(pasteFiles);
        });
    },

    // tab 特殊处理
    _tabHandle: function _tabHandle() {
        var editor = this.editor;
        var $textElem = editor.$textElem;

        $textElem.on('keydown', function (e) {
            if (e.keyCode !== 9) {
                return;
            }
            if (!editor.cmd.queryCommandSupported('insertHTML')) {
                // 必须原生支持 insertHTML 命令
                return;
            }
            var $selectionElem = editor.selection.getSelectionContainerElem();
            if (!$selectionElem) {
                return;
            }
            var $parentElem = $selectionElem.parent();
            var selectionNodeName = $selectionElem.getNodeName();
            var parentNodeName = $parentElem.getNodeName();

            if (selectionNodeName === 'CODE' && parentNodeName === 'PRE') {
                // <pre><code> 里面
                editor.cmd.do('insertHTML', '    ');
            } else {
                // 普通文字
                editor.cmd.do('insertHTML', '&nbsp;&nbsp;&nbsp;&nbsp;');
            }

            e.preventDefault();
        });
    },

    // img 点击
    _imgHandle: function _imgHandle() {
        var editor = this.editor;
        var $textElem = editor.$textElem;
        var selectedClass = 'w-e-selected';

        // 为图片增加 selected 样式
        $textElem.on('click', 'img', function (e) {
            var img = this;
            var $img = $(img

            // 去掉所有图片的 selected 样式
            );$textElem.find('img').removeClass(selectedClass

            // 为点击的图片增加样式，并记录当前图片
            );$img.addClass(selectedClass);
            editor._selectedImg = $img;

            // 修改选取
            editor.selection.createRangeByElem($img);
        }

        // 去掉图片的 selected 样式
        );$textElem.on('click  keyup', function (e) {
            if (e.target.matches('img')) {
                // 点击的是图片，忽略
                return;
            }
            // 取消掉 selected 样式，并删除记录
            $textElem.find('img').removeClass(selectedClass);
            editor._selectedImg = null;
        });
    }
};

/*
    命令，封装 document.execCommand
*/

// 构造函数
function Command(editor) {
    this.editor = editor;
}

// 修改原型
Command.prototype = {
    constructor: Command,

    // 执行命令
    do: function _do(name, value) {
        var editor = this.editor;

        // 如果无选区，忽略
        if (!editor.selection.getRange()) {
            return;
        }

        // 恢复选取
        editor.selection.restoreSelection

        // 执行
        ();var _name = '_' + name;
        if (this[_name]) {
            // 有自定义事件
            this[_name](value);
        } else {
            // 默认 command
            this._execCommand(name, value);
        }

        // 修改菜单状态
        editor.menus.changeActive

        // 最后，恢复选取保证光标在原来的位置闪烁
        ();editor.selection.saveRange();
        editor.selection.restoreSelection();
    },

    // 自定义 insertHTML 事件
    _insertHTML: function _insertHTML(html) {
        var editor = this.editor;
        var range = editor.selection.getRange

        // 保证传入的参数是 html 代码
        ();var test = /^<.+>$/.test(html);
        if (!test && !UA.isWebkit()) {
            // webkit 可以插入非 html 格式的文字
            throw new Error('执行 insertHTML 命令时传入的参数必须是 html 格式');
        }

        if (this.queryCommandSupported('insertHTML')) {
            // W3C
            this._execCommand('insertHTML', html);
        } else if (range.insertNode) {
            // IE
            range.deleteContents();
            range.insertNode($(html)[0]);
        } else if (range.pasteHTML) {
            // IE <= 10
            range.pasteHTML(html);
        }
    },

    // 插入 elem
    _insertElem: function _insertElem($elem) {
        var editor = this.editor;
        var range = editor.selection.getRange();

        if (range.insertNode) {
            range.deleteContents();
            range.insertNode($elem[0]);
        }
    },

    // 封装 execCommand
    _execCommand: function _execCommand(name, value) {
        document.execCommand(name, false, value);
    },

    // 封装 document.queryCommandValue
    queryCommandValue: function queryCommandValue(name) {
        return document.queryCommandValue(name);
    },

    // 封装 document.queryCommandState
    queryCommandState: function queryCommandState(name) {
        return document.queryCommandState(name);
    },

    // 封装 document.queryCommandSupported
    queryCommandSupported: function queryCommandSupported(name) {
        return document.queryCommandSupported(name);
    }
};

/*
    selection range API
*/

// 构造函数
function API(editor) {
    this.editor = editor;
    this._currentRange = null;
}

// 修改原型
API.prototype = {
    constructor: API,

    // 获取 range 对象
    getRange: function getRange() {
        return this._currentRange;
    },

    // 保存选区
    saveRange: function saveRange(_range) {
        if (_range) {
            // 保存已有选区
            this._currentRange = _range;
            return;
        }

        // 获取当前的选区
        var selection = window.getSelection();
        if (selection.rangeCount === 0) {
            return;
        }
        var range = selection.getRangeAt(0

        // 判断选区内容是否在编辑内容之内
        );var $containerElem = this.getSelectionContainerElem(range);
        if (!$containerElem) {
            return;
        }
        var editor = this.editor;
        var $textElem = editor.$textElem;
        if ($textElem.isContain($containerElem)) {
            // 是编辑内容之内的
            this._currentRange = range;
        }
    },

    // 折叠选区
    collapseRange: function collapseRange(toStart) {
        if (toStart == null) {
            // 默认为 false
            toStart = false;
        }
        var range = this._currentRange;
        if (range) {
            range.collapse(toStart);
        }
    },

    // 选中区域的文字
    getSelectionText: function getSelectionText() {
        var range = this._currentRange;
        if (range) {
            return this._currentRange.toString();
        } else {
            return '';
        }
    },

    // 选区的 $Elem
    getSelectionContainerElem: function getSelectionContainerElem(range) {
        range = range || this._currentRange;
        var elem = void 0;
        if (range) {
            elem = range.commonAncestorContainer;
            return $(elem.nodeType === 1 ? elem : elem.parentNode);
        }
    },
    getSelectionStartElem: function getSelectionStartElem(range) {
        range = range || this._currentRange;
        var elem = void 0;
        if (range) {
            elem = range.startContainer;
            return $(elem.nodeType === 1 ? elem : elem.parentNode);
        }
    },
    getSelectionEndElem: function getSelectionEndElem(range) {
        range = range || this._currentRange;
        var elem = void 0;
        if (range) {
            elem = range.endContainer;
            return $(elem.nodeType === 1 ? elem : elem.parentNode);
        }
    },

    // 选区是否为空
    isSelectionEmpty: function isSelectionEmpty() {
        var range = this._currentRange;
        if (range && range.startContainer) {
            if (range.startContainer === range.endContainer) {
                if (range.startOffset === range.endOffset) {
                    return true;
                }
            }
        }
        return false;
    },

    // 恢复选区
    restoreSelection: function restoreSelection() {
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(this._currentRange);
    },

    // 创建一个空白（即 &#8203 字符）选区
    createEmptyRange: function createEmptyRange() {
        var editor = this.editor;
        var range = this.getRange();
        var $elem = void 0;

        if (!range) {
            // 当前无 range
            return;
        }
        if (!this.isSelectionEmpty()) {
            // 当前选区必须没有内容才可以
            return;
        }

        // 目前只支持 webkit 内核
        if (UA.isWebkit()) {
            // 插入 &#8203
            editor.cmd.do('insertHTML', '&#8203;'
            // 修改 offset 位置
            );range.setEnd(range.endContainer, range.endOffset + 1
            // 存储
            );this.saveRange(range);
        } else {
            $elem = $('<strong>&#8203;</strong>');
            editor.cmd.do('insertElem', $elem);
            this.createRangeByElem($elem, true);
        }
    },

    // 根据 $Elem 设置选区
    createRangeByElem: function createRangeByElem($elem, toStart, isContent) {
        // $elem - 经过封装的 elem
        // toStart - true 开始位置，false 结束位置
        // isContent - 是否选中Elem的内容
        if (!$elem.length) {
            return;
        }

        var elem = $elem[0];
        var range = document.createRange();

        if (isContent) {
            range.selectNodeContents(elem);
        } else {
            range.selectNode(elem);
        }

        if (typeof toStart === 'boolean') {
            range.collapse(toStart);
        }

        // 存储 range
        this.saveRange(range);
    }
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

/*
    上传图片
*/

// 构造函数
function UploadImg(editor) {
    this.editor = editor;
}

// 原型
UploadImg.prototype = {
    constructor: UploadImg,

    // 根据 debug 弹出不同的信息
    _alert: function _alert(alertInfo, debugInfo) {
        var editor = this.editor;
        var debug = editor.config.debug;

        if (debug) {
            throw new Error('wangEditor: ' + (debugInfo || alertInfo));
        } else {
            alert(alertInfo);
        }
    },

    // 根据链接插入图片
    insertLinkImg: function insertLinkImg(link) {
        var _this2 = this;

        if (!link) {
            return;
        }
        var editor = this.editor;

        var img = document.createElement('img');
        img.onload = function () {
            img = null;
            editor.cmd.do('insertHTML', '<img src="' + link + '" style="max-width:100%;"/>');
        };
        img.onerror = function () {
            img = null;
            // 无法成功下载图片
            _this2._alert('插入图片错误', 'wangEditor: \u63D2\u5165\u56FE\u7247\u51FA\u9519\uFF0C\u56FE\u7247\u94FE\u63A5\u662F "' + link + '"\uFF0C\u4E0B\u8F7D\u8BE5\u94FE\u63A5\u5931\u8D25');
            return;
        };
        img.onabort = function () {
            img = null;
        };
        img.src = link;
    },

    // 上传图片
    uploadImg: function uploadImg(files) {
        var _this3 = this;

        if (!files || !files.length) {
            return;
        }

        // ------------------------------ 获取配置信息 ------------------------------
        var editor = this.editor;
        var config = editor.config;
        var maxSize = config.uploadImgMaxSize;
        var maxSizeM = maxSize / 1000 / 1000;
        var uploadImgServer = config.uploadImgServer;
        var uploadImgShowBase64 = config.uploadImgShowBase64;
        var uploadImgParams = config.uploadImgParams || {};
        var uploadImgHeaders = config.uploadImgHeaders || {};
        var hooks = config.uploadImgHooks || {};
        var timeout = config.uploadImgTimeout || 3000;
        var withCredentials = config.withCredentials;
        if (withCredentials == null) {
            withCredentials = false;
        }

        // ------------------------------ 验证文件信息 ------------------------------
        var resultFiles = [];
        var errInfo = [];
        arrForEach(files, function (file) {
            var name = file.name;
            var size = file.size;
            if (/\.(jpg|jpeg|png|bmp|gif)$/i.test(name) === false) {
                // 后缀名不合法，不是图片
                errInfo.push('\u3010' + name + '\u3011\u4E0D\u662F\u56FE\u7247');
                return;
            }
            if (maxSize < size) {
                // 上传图片过大
                errInfo.push('\u3010' + name + '\u3011\u5927\u4E8E ' + maxSizeM + 'M');
                return;
            }

            // 验证通过的加入结果列表
            resultFiles.push(file);
        }
        // 抛出验证信息
        );if (errInfo.length) {
            this._alert('图片验证未通过: \n' + errInfo.join('\n'));
            return;
        }
        // 添加图片数据
        var formdata = new FormData();
        arrForEach(resultFiles, function (file) {
            formdata.append(file.name, file);
        }

        // ------------------------------ 上传图片 ------------------------------
        );if (uploadImgServer && typeof uploadImgServer === 'string') {
            // 添加参数
            var uploadImgServerArr = uploadImgServer.split('#');
            uploadImgServer = uploadImgServerArr[0];
            var uploadImgServerHash = uploadImgServerArr[1] || '';
            objForEach(uploadImgParams, function (key, val) {
                if (uploadImgServer.indexOf('?') > 0) {
                    uploadImgServer += '&';
                } else {
                    uploadImgServer += '?';
                }
                uploadImgServer += key + '=' + encodeURIComponent(val);
            });
            if (uploadImgServerHash) {
                uploadImgServer += uploadImgServerHash;
            }

            // 定义 xhr
            var xhr = new XMLHttpRequest();

            // 设置超时
            xhr.timeout = timeout;
            xhr.ontimeout = function () {
                // hook - timeout
                if (hooks.timeout && typeof hooks.timeout === 'function') {
                    hooks.timeout(xhr, editor);
                }

                _this3._alert('上传图片超时');
            };

            // 监控 progress
            if (xhr.upload) {
                xhr.upload.onprogress = function (e) {
                    var percent = void 0;
                    if (e.lengthComputable) {
                        percent = e.loaded / e.total;
                        editor.bar.show('上传进度: ' + percentFormat(percent));
                        if (percent === 1) {
                            setTimeout(function () {
                                editor.bar.hide();
                            }, 1000);
                        }
                    }
                };
            }

            // 返回数据
            xhr.onreadystatechange = function () {
                var result = void 0;
                if (xhr.readyState === 4 && xhr.status === 200) {
                    if (xhr.status !== 200) {
                        // hook - error
                        if (hooks.error && typeof hooks.error === 'function') {
                            hooks.error(xhr, editor);
                        }

                        // xhr 返回状态错误
                        _this3._alert('上传图片发生错误', '\u4E0A\u4F20\u56FE\u7247\u53D1\u751F\u9519\u8BEF\uFF0C\u670D\u52A1\u5668\u8FD4\u56DE\u72B6\u6001\u662F ' + xhr.status);
                        return;
                    }

                    result = xhr.responseText;
                    if ((typeof result === 'undefined' ? 'undefined' : _typeof(result)) !== 'object') {
                        try {
                            result = JSON.parse(result);
                        } catch (ex) {
                            // hook - fail
                            if (hooks.fail && typeof hooks.fail === 'function') {
                                hooks.fail(xhr, editor, result);
                            }

                            _this3._alert('上传图片失败', '上传图片返回结果错误，返回结果是: ' + result);
                            return;
                        }
                    }
                    if (result.errno != '0') {
                        // hook - fail
                        if (hooks.fail && typeof hooks.fail === 'function') {
                            hooks.fail(xhr, editor, result);
                        }

                        // 数据错误
                        _this3._alert('上传图片失败', '上传图片返回结果错误，返回结果 errno=' + result.errno);
                    } else {
                        var data = result.data || [];
                        data.forEach(function (link) {
                            _this3.insertLinkImg(link);
                        }

                        // hook - success
                        );if (hooks.success && typeof hooks.success === 'function') {
                            hooks.success(xhr, editor, result);
                        }
                    }
                }
            };

            // hook - before
            if (hooks.before && typeof hooks.before === 'function') {
                hooks.before(xhr, editor, resultFiles);
            }

            xhr.open('POST', uploadImgServer

            // 自定义 headers
            );objForEach(uploadImgHeaders, function (key, val) {
                xhr.setRequestHeader(key, val);
            }

            // 跨域传 cookie
            );xhr.withCredentials = withCredentials;

            // 发送请求
            xhr.send(formdata

            // 注意，要 return 。不去操作接下来的 base64 显示方式
            );return;
        }

        // 显示 base64 格式
        if (uploadImgShowBase64) {
            arrForEach(files, function (file) {
                var _this = _this3;
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function () {
                    _this.insertLinkImg(this.result);
                };
            });
        }
    }
};

/*
    编辑区域左下角的提示条
*/

// 构造函数
function Bar(editor) {
    this.editor = editor;
}

// 原型
Bar.prototype = {
    constructor: Bar,

    // 初始化
    init: function init() {
        var editor = this.editor;
        var $textContainer = editor.$textContainerElem;
        var $bar = $('<div class="w-e-bar"></div>');
        $textContainer.append($bar

        // 记录属性
        );this.$bar = $bar;
    },

    // 显示一次
    showOnce: function showOnce(info) {
        var _this = this;

        this.show(info);

        setTimeout(function () {
            _this.hide();
        }, 1500);
    },

    // 显示文字
    show: function show(info) {
        var $bar = this.$bar;
        $bar.text(info);
        $bar.show();
    },

    // 隐藏
    hide: function hide() {
        var $bar = this.$bar;
        $bar.hide();
    }
};

/*
    编辑器构造函数
*/

// id，累加
var editorId = 1;

// 构造函数
function Editor(toolbarSelector, textSelector) {
    if (toolbarSelector == null) {
        // 没有传入任何参数，报错
        throw new Error('错误：初始化编辑器时候未传入任何参数，请查阅文档');
    }
    // id，用以区分单个页面不同的编辑器对象
    this.id = 'wangEditor-' + editorId++;

    this.toolbarSelector = toolbarSelector;
    this.textSelector = textSelector;

    // 自定义配置
    this.customConfig = {};
}

// 修改原型
Editor.prototype = {
    constructor: Editor,

    // 初始化 DOM
    _initDom: function _initDom() {
        var toolbarSelector = this.toolbarSelector;
        var $toolbarSelector = $(toolbarSelector);
        var textSelector = this.textSelector;

        // 定义变量
        var $toolbarElem = void 0,
            $textContainerElem = void 0,
            $textElem = void 0,
            $children = void 0;

        if (textSelector == null) {
            // 只传入一个参数，即是容器的选择器或元素，toolbar 和 text 的元素自行创建
            $toolbarElem = $('<div></div>');
            $textContainerElem = $('<div></div>'

            // 将编辑器区域原有的内容，暂存起来
            );$children = $toolbarSelector.children

            // 添加到 DOM 结构中
            ();$toolbarSelector.append($toolbarElem).append($textContainerElem

            // 自行创建的，需要配置默认的样式
            );$toolbarElem.css('background-color', '#f1f1f1').css('border', '1px solid #ccc');
            $textContainerElem.css('border', '1px solid #ccc').css('border-top', 'none').css('height', '300px');
        } else {
            // toolbar 和 text 的选择器都有值，记录属性
            $toolbarElem = $toolbarSelector;
            $textContainerElem = $(textSelector
            // 将编辑器区域原有的内容，暂存起来
            );$children = $textContainerElem.children();
        }

        // 编辑区域
        $textElem = $('<div></div>');
        $textElem.attr('contenteditable', 'true').attr('v-model','editor').css('width', '100%').css('height', '100%'

        // 初始化编辑区域内容
        );if ($children && $children.length) {
            $textElem.append($children);
        } else {
            $textElem.append($('<p><br></p>'));
        }

        // 编辑区域加入DOM
        $textContainerElem.append($textElem

        // 设置通用的 class
        );$toolbarElem.addClass('w-e-toolbar');
        $textContainerElem.addClass('w-e-text-container');
        $textElem.addClass('w-e-text'

        // 记录属性
        );this.$toolbarElem = $toolbarElem;
        this.$textContainerElem = $textContainerElem;
        this.$textElem = $textElem;
    },

    // 初始化配置
    _initConfig: function _initConfig() {
        // _config 是默认配置，this.customConfig 是用户自定义配置，将它们 merge 之后再赋值
        var target = {};
        this.config = Object.assign(target, config, this.customConfig);
    },

    // 封装 command
    _initCommand: function _initCommand() {
        this.cmd = new Command(this);
    },

    // 封装 selection range API
    _initSelectionAPI: function _initSelectionAPI() {
        this.selection = new API(this);
    },

    // 添加图片上传
    _initUploadImg: function _initUploadImg() {
        this.uploadImg = new UploadImg(this);
    },

    // 初始化菜单
    _initMenus: function _initMenus() {
        this.menus = new Menus(this);
        this.menus.init();
    },

    // 添加 text 区域
    _initText: function _initText() {
        this.txt = new Text(this);
        this.txt.init();
    },

    // 添加 bar
    _addBar: function _addBar() {
        this.bar = new Bar(this);
        this.bar.init();
    },

    // 创建编辑器
    create: function create() {
        // 初始化 DOM
        this._initDom

        // 初始化配置信息
        ();this._initConfig

        // 封装 command API
        ();this._initCommand

        // 封装 selection range API
        ();this._initSelectionAPI

        // 添加 text
        ();this._initText

        // 初始化菜单
        ();this._initMenus

        // 添加 图片上传
        ();this._initUploadImg

        // 添加 bar
        ();this._addBar();
    }
};

/**
 * jscolor - JavaScript Color Picker
 *
 * @link    http://jscolor.com
 * @license For open source use: GPLv3
 *          For commercial use: JSColor Commercial License
 * @author  Jan Odvarko
 * @version 2.0.4
 *
 * See usage examples at http://jscolor.com/examples/
 */

var jscolor$1 = function () {

	var jsc = {

		register: function register() {
			jsc.attachDOMReadyEvent(jsc.init);
			jsc.attachEvent(document, 'mousedown', jsc.onDocumentMouseDown);
			jsc.attachEvent(document, 'touchstart', jsc.onDocumentTouchStart);
			jsc.attachEvent(window, 'resize', jsc.onWindowResize);
		},

		init: function init() {
			if (jsc.jscolor.lookupClass) {
				jsc.jscolor.installByClassName(jsc.jscolor.lookupClass);
			}
		},

		tryInstallOnElements: function tryInstallOnElements(elms, className) {
			var matchClass = new RegExp('(^|\\s)(' + className + ')(\\s*(\\{[^}]*\\})|\\s|$)', 'i');

			for (var i = 0; i < elms.length; i += 1) {
				if (elms[i].type !== undefined && elms[i].type.toLowerCase() == 'color') {
					if (jsc.isColorAttrSupported) {
						// skip inputs of type 'color' if supported by the browser
						continue;
					}
				}
				var m;
				if (!elms[i].jscolor && elms[i].className && (m = elms[i].className.match(matchClass))) {
					var targetElm = elms[i];
					var optsStr = null;

					var dataOptions = jsc.getDataAttr(targetElm, 'jscolor');
					if (dataOptions !== null) {
						optsStr = dataOptions;
					} else if (m[4]) {
						optsStr = m[4];
					}

					var opts = {};
					if (optsStr) {
						try {
							opts = new Function('return (' + optsStr + ')')();
						} catch (eParseError) {
							jsc.warn('Error parsing jscolor options: ' + eParseError + ':\n' + optsStr);
						}
					}
					targetElm.jscolor = new jsc.jscolor(targetElm, opts);
				}
			}
		},

		isColorAttrSupported: function () {
			var elm = document.createElement('input');
			if (elm.setAttribute) {
				elm.setAttribute('type', 'color');
				if (elm.type.toLowerCase() == 'color') {
					return true;
				}
			}
			return false;
		}(),

		isCanvasSupported: function () {
			var elm = document.createElement('canvas');
			return !!(elm.getContext && elm.getContext('2d'));
		}(),

		fetchElement: function fetchElement(mixed) {
			return typeof mixed === 'string' ? document.getElementById(mixed) : mixed;
		},

		isElementType: function isElementType(elm, type) {
			return elm.nodeName.toLowerCase() === type.toLowerCase();
		},

		getDataAttr: function getDataAttr(el, name) {
			var attrName = 'data-' + name;
			var attrValue = el.getAttribute(attrName);
			if (attrValue !== null) {
				return attrValue;
			}
			return null;
		},

		attachEvent: function attachEvent(el, evnt, func) {
			if (el.addEventListener) {
				el.addEventListener(evnt, func, false);
			} else if (el.attachEvent) {
				el.attachEvent('on' + evnt, func);
			}
		},

		detachEvent: function detachEvent(el, evnt, func) {
			if (el.removeEventListener) {
				el.removeEventListener(evnt, func, false);
			} else if (el.detachEvent) {
				el.detachEvent('on' + evnt, func);
			}
		},

		_attachedGroupEvents: {},

		attachGroupEvent: function attachGroupEvent(groupName, el, evnt, func) {
			if (!jsc._attachedGroupEvents.hasOwnProperty(groupName)) {
				jsc._attachedGroupEvents[groupName] = [];
			}
			jsc._attachedGroupEvents[groupName].push([el, evnt, func]);
			jsc.attachEvent(el, evnt, func);
		},

		detachGroupEvents: function detachGroupEvents(groupName) {
			if (jsc._attachedGroupEvents.hasOwnProperty(groupName)) {
				for (var i = 0; i < jsc._attachedGroupEvents[groupName].length; i += 1) {
					var evt = jsc._attachedGroupEvents[groupName][i];
					jsc.detachEvent(evt[0], evt[1], evt[2]);
				}
				delete jsc._attachedGroupEvents[groupName];
			}
		},

		attachDOMReadyEvent: function attachDOMReadyEvent(func) {
			var fired = false;
			var fireOnce = function fireOnce() {
				if (!fired) {
					fired = true;
					func();
				}
			};

			if (document.readyState === 'complete') {
				setTimeout(fireOnce, 1); // async
				return;
			}

			if (document.addEventListener) {
				document.addEventListener('DOMContentLoaded', fireOnce, false);

				// Fallback
				window.addEventListener('load', fireOnce, false);
			} else if (document.attachEvent) {
				// IE
				document.attachEvent('onreadystatechange', function () {
					if (document.readyState === 'complete') {
						document.detachEvent('onreadystatechange', arguments.callee);
						fireOnce();
					}
				}

				// Fallback
				);window.attachEvent('onload', fireOnce);

				// IE7/8
				if (document.documentElement.doScroll && window == window.top) {
					var tryScroll = function tryScroll() {
						if (!document.body) {
							return;
						}
						try {
							document.documentElement.doScroll('left');
							fireOnce();
						} catch (e) {
							setTimeout(tryScroll, 1);
						}
					};
					tryScroll();
				}
			}
		},

		warn: function warn(msg) {
			if (window.console && window.console.warn) {
				window.console.warn(msg);
			}
		},

		preventDefault: function preventDefault(e) {
			if (e.preventDefault) {
				e.preventDefault();
			}
			e.returnValue = false;
		},

		captureTarget: function captureTarget(target) {
			// IE
			if (target.setCapture) {
				jsc._capturedTarget = target;
				jsc._capturedTarget.setCapture();
			}
		},

		releaseTarget: function releaseTarget() {
			// IE
			if (jsc._capturedTarget) {
				jsc._capturedTarget.releaseCapture();
				jsc._capturedTarget = null;
			}
		},

		fireEvent: function fireEvent(el, evnt) {
			if (!el) {
				return;
			}
			if (document.createEvent) {
				var ev = document.createEvent('HTMLEvents');
				ev.initEvent(evnt, true, true);
				el.dispatchEvent(ev);
			} else if (document.createEventObject) {
				var ev = document.createEventObject();
				el.fireEvent('on' + evnt, ev);
			} else if (el['on' + evnt]) {
				// alternatively use the traditional event model
				el['on' + evnt]();
			}
		},

		classNameToList: function classNameToList(className) {
			return className.replace(/^\s+|\s+$/g, '').split(/\s+/);
		},

		// The className parameter (str) can only contain a single class name
		hasClass: function hasClass(elm, className) {
			if (!className) {
				return false;
			}
			return -1 != (' ' + elm.className.replace(/\s+/g, ' ') + ' ').indexOf(' ' + className + ' ');
		},

		// The className parameter (str) can contain multiple class names separated by whitespace
		setClass: function setClass(elm, className) {
			var classList = jsc.classNameToList(className);
			for (var i = 0; i < classList.length; i += 1) {
				if (!jsc.hasClass(elm, classList[i])) {
					elm.className += (elm.className ? ' ' : '') + classList[i];
				}
			}
		},

		// The className parameter (str) can contain multiple class names separated by whitespace
		unsetClass: function unsetClass(elm, className) {
			var classList = jsc.classNameToList(className);
			for (var i = 0; i < classList.length; i += 1) {
				var repl = new RegExp('^\\s*' + classList[i] + '\\s*|' + '\\s*' + classList[i] + '\\s*$|' + '\\s+' + classList[i] + '(\\s+)', 'g');
				elm.className = elm.className.replace(repl, '$1');
			}
		},

		getStyle: function getStyle(elm) {
			return window.getComputedStyle ? window.getComputedStyle(elm) : elm.currentStyle;
		},

		setStyle: function () {
			var helper = document.createElement('div');
			var getSupportedProp = function getSupportedProp(names) {
				for (var i = 0; i < names.length; i += 1) {
					if (names[i] in helper.style) {
						return names[i];
					}
				}
			};
			var props = {
				borderRadius: getSupportedProp(['borderRadius', 'MozBorderRadius', 'webkitBorderRadius']),
				boxShadow: getSupportedProp(['boxShadow', 'MozBoxShadow', 'webkitBoxShadow'])
			};
			return function (elm, prop, value) {
				switch (prop.toLowerCase()) {
					case 'opacity':
						var alphaOpacity = Math.round(parseFloat(value) * 100);
						elm.style.opacity = value;
						elm.style.filter = 'alpha(opacity=' + alphaOpacity + ')';
						break;
					default:
						elm.style[props[prop]] = value;
						break;
				}
			};
		}(),

		setBorderRadius: function setBorderRadius(elm, value) {
			jsc.setStyle(elm, 'borderRadius', value || '0');
		},

		setBoxShadow: function setBoxShadow(elm, value) {
			jsc.setStyle(elm, 'boxShadow', value || 'none');
		},

		getElementPos: function getElementPos(e, relativeToViewport) {
			var x = 0,
			    y = 0;
			var rect = e.getBoundingClientRect();
			x = rect.left;
			y = rect.top;
			if (!relativeToViewport) {
				var viewPos = jsc.getViewPos();
				x += viewPos[0];
				y += viewPos[1];
			}
			return [x, y];
		},

		getElementSize: function getElementSize(e) {
			return [e.offsetWidth, e.offsetHeight];
		},

		// get pointer's X/Y coordinates relative to viewport
		getAbsPointerPos: function getAbsPointerPos(e) {
			if (!e) {
				e = window.event;
			}
			var x = 0,
			    y = 0;
			if (typeof e.changedTouches !== 'undefined' && e.changedTouches.length) {
				// touch devices
				x = e.changedTouches[0].clientX;
				y = e.changedTouches[0].clientY;
			} else if (typeof e.clientX === 'number') {
				x = e.clientX;
				y = e.clientY;
			}
			return { x: x, y: y };
		},

		// get pointer's X/Y coordinates relative to target element
		getRelPointerPos: function getRelPointerPos(e) {
			if (!e) {
				e = window.event;
			}
			var target = e.target || e.srcElement;
			var targetRect = target.getBoundingClientRect();

			var x = 0,
			    y = 0;

			var clientX = 0,
			    clientY = 0;
			if (typeof e.changedTouches !== 'undefined' && e.changedTouches.length) {
				// touch devices
				clientX = e.changedTouches[0].clientX;
				clientY = e.changedTouches[0].clientY;
			} else if (typeof e.clientX === 'number') {
				clientX = e.clientX;
				clientY = e.clientY;
			}

			x = clientX - targetRect.left;
			y = clientY - targetRect.top;
			return { x: x, y: y };
		},

		getViewPos: function getViewPos() {
			var doc = document.documentElement;
			return [(window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0), (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)];
		},

		getViewSize: function getViewSize() {
			var doc = document.documentElement;
			return [window.innerWidth || doc.clientWidth, window.innerHeight || doc.clientHeight];
		},

		redrawPosition: function redrawPosition() {

			if (jsc.picker && jsc.picker.owner) {
				var thisObj = jsc.picker.owner;

				var tp, vp;

				if (thisObj.fixed) {
					// Fixed elements are positioned relative to viewport,
					// therefore we can ignore the scroll offset
					tp = jsc.getElementPos(thisObj.targetElement, true); // target pos
					vp = [0, 0]; // view pos
				} else {
					tp = jsc.getElementPos(thisObj.targetElement); // target pos
					vp = jsc.getViewPos(); // view pos
				}

				var ts = jsc.getElementSize(thisObj.targetElement); // target size
				var vs = jsc.getViewSize(); // view size
				var ps = jsc.getPickerOuterDims(thisObj); // picker size
				var a, b, c;
				switch (thisObj.position.toLowerCase()) {
					case 'left':
						a = 1;b = 0;c = -1;break;
					case 'right':
						a = 1;b = 0;c = 1;break;
					case 'top':
						a = 0;b = 1;c = -1;break;
					default:
						a = 0;b = 1;c = 1;break;
				}
				var l = (ts[b] + ps[b]) / 2;

				// compute picker position
				if (!thisObj.smartPosition) {
					var pp = [tp[a], tp[b] + ts[b] - l + l * c];
				} else {
					var pp = [-vp[a] + tp[a] + ps[a] > vs[a] ? -vp[a] + tp[a] + ts[a] / 2 > vs[a] / 2 && tp[a] + ts[a] - ps[a] >= 0 ? tp[a] + ts[a] - ps[a] : tp[a] : tp[a], -vp[b] + tp[b] + ts[b] + ps[b] - l + l * c > vs[b] ? -vp[b] + tp[b] + ts[b] / 2 > vs[b] / 2 && tp[b] + ts[b] - l - l * c >= 0 ? tp[b] + ts[b] - l - l * c : tp[b] + ts[b] - l + l * c : tp[b] + ts[b] - l + l * c >= 0 ? tp[b] + ts[b] - l + l * c : tp[b] + ts[b] - l - l * c];
				}

				var x = pp[a];
				var y = pp[b];
				var positionValue = thisObj.fixed ? 'fixed' : 'absolute';
				var contractShadow = (pp[0] + ps[0] > tp[0] || pp[0] < tp[0] + ts[0]) && pp[1] + ps[1] < tp[1] + ts[1];

				jsc._drawPosition(thisObj, x, y, positionValue, contractShadow);
			}
		},

		_drawPosition: function _drawPosition(thisObj, x, y, positionValue, contractShadow) {
			var vShadow = contractShadow ? 0 : thisObj.shadowBlur; // px

			jsc.picker.wrap.style.position = positionValue;
			jsc.picker.wrap.style.left = x + 'px';
			jsc.picker.wrap.style.top = y - 140 + 'px';
			console.log(y);

			jsc.setBoxShadow(jsc.picker.boxS, thisObj.shadow ? new jsc.BoxShadow(0, vShadow, thisObj.shadowBlur, 0, thisObj.shadowColor) : null);
		},

		getPickerDims: function getPickerDims(thisObj) {
			var displaySlider = !!jsc.getSliderComponent(thisObj);
			var dims = [2 * thisObj.insetWidth + 2 * thisObj.padding + thisObj.width + (displaySlider ? 2 * thisObj.insetWidth + jsc.getPadToSliderPadding(thisObj) + thisObj.sliderSize : 0), 2 * thisObj.insetWidth + 2 * thisObj.padding + thisObj.height + (thisObj.closable ? 2 * thisObj.insetWidth + thisObj.padding + thisObj.buttonHeight : 0)];
			return dims;
		},

		getPickerOuterDims: function getPickerOuterDims(thisObj) {
			var dims = jsc.getPickerDims(thisObj);
			return [dims[0] + 2 * thisObj.borderWidth, dims[1] + 2 * thisObj.borderWidth];
		},

		getPadToSliderPadding: function getPadToSliderPadding(thisObj) {
			return Math.max(thisObj.padding, 1.5 * (2 * thisObj.pointerBorderWidth + thisObj.pointerThickness));
		},

		getPadYComponent: function getPadYComponent(thisObj) {
			switch (thisObj.mode.charAt(1).toLowerCase()) {
				case 'v':
					return 'v';break;
			}
			return 's';
		},

		getSliderComponent: function getSliderComponent(thisObj) {
			if (thisObj.mode.length > 2) {
				switch (thisObj.mode.charAt(2).toLowerCase()) {
					case 's':
						return 's';break;
					case 'v':
						return 'v';break;
				}
			}
			return null;
		},

		onDocumentMouseDown: function onDocumentMouseDown(e) {
			if (!e) {
				e = window.event;
			}
			var target = e.target || e.srcElement;

			if (target._jscLinkedInstance) {
				if (target._jscLinkedInstance.showOnClick) {
					target._jscLinkedInstance.show();
				}
			} else if (target._jscControlName) {
				jsc.onControlPointerStart(e, target, target._jscControlName, 'mouse');
			} else {
				// Mouse is outside the picker controls -> hide the color picker!
				if (jsc.picker && jsc.picker.owner) {
					jsc.picker.owner.hide();
				}
			}
		},

		onDocumentTouchStart: function onDocumentTouchStart(e) {
			if (!e) {
				e = window.event;
			}
			var target = e.target || e.srcElement;

			if (target._jscLinkedInstance) {
				if (target._jscLinkedInstance.showOnClick) {
					target._jscLinkedInstance.show();
				}
			} else if (target._jscControlName) {
				jsc.onControlPointerStart(e, target, target._jscControlName, 'touch');
			} else {
				if (jsc.picker && jsc.picker.owner) {
					jsc.picker.owner.hide();
				}
			}
		},

		onWindowResize: function onWindowResize(e) {
			jsc.redrawPosition();
		},

		onParentScroll: function onParentScroll(e) {
			// hide the picker when one of the parent elements is scrolled
			if (jsc.picker && jsc.picker.owner) {
				jsc.picker.owner.hide();
			}
		},

		_pointerMoveEvent: {
			mouse: 'mousemove',
			touch: 'touchmove'
		},
		_pointerEndEvent: {
			mouse: 'mouseup',
			touch: 'touchend'
		},

		_pointerOrigin: null,
		_capturedTarget: null,

		onControlPointerStart: function onControlPointerStart(e, target, controlName, pointerType) {
			var thisObj = target._jscInstance;

			jsc.preventDefault(e);
			jsc.captureTarget(target);

			var registerDragEvents = function registerDragEvents(doc, offset) {
				jsc.attachGroupEvent('drag', doc, jsc._pointerMoveEvent[pointerType], jsc.onDocumentPointerMove(e, target, controlName, pointerType, offset));
				jsc.attachGroupEvent('drag', doc, jsc._pointerEndEvent[pointerType], jsc.onDocumentPointerEnd(e, target, controlName, pointerType));
			};

			registerDragEvents(document, [0, 0]);

			if (window.parent && window.frameElement) {
				var rect = window.frameElement.getBoundingClientRect();
				var ofs = [-rect.left, -rect.top];
				registerDragEvents(window.parent.window.document, ofs);
			}

			var abs = jsc.getAbsPointerPos(e);
			var rel = jsc.getRelPointerPos(e);
			jsc._pointerOrigin = {
				x: abs.x - rel.x,
				y: abs.y - rel.y
			};

			switch (controlName) {
				case 'pad':
					// if the slider is at the bottom, move it up
					switch (jsc.getSliderComponent(thisObj)) {
						case 's':
							if (thisObj.hsv[1] === 0) {
								thisObj.fromHSV(null, 100, null);
							};break;
						case 'v':
							if (thisObj.hsv[2] === 0) {
								thisObj.fromHSV(null, null, 100);
							};break;
					}
					jsc.setPad(thisObj, e, 0, 0);
					break;

				case 'sld':
					jsc.setSld(thisObj, e, 0);
					break;
			}

			jsc.dispatchFineChange(thisObj);
		},

		onDocumentPointerMove: function onDocumentPointerMove(e, target, controlName, pointerType, offset) {
			return function (e) {
				var thisObj = target._jscInstance;
				switch (controlName) {
					case 'pad':
						if (!e) {
							e = window.event;
						}
						jsc.setPad(thisObj, e, offset[0], offset[1]);
						jsc.dispatchFineChange(thisObj);
						break;

					case 'sld':
						if (!e) {
							e = window.event;
						}
						jsc.setSld(thisObj, e, offset[1]);
						jsc.dispatchFineChange(thisObj);
						break;
				}
			};
		},

		onDocumentPointerEnd: function onDocumentPointerEnd(e, target, controlName, pointerType) {
			return function (e) {
				var thisObj = target._jscInstance;
				jsc.detachGroupEvents('drag');
				jsc.releaseTarget();
				// Always dispatch changes after detaching outstanding mouse handlers,
				// in case some user interaction will occur in user's onchange callback
				// that would intrude with current mouse events
				jsc.dispatchChange(thisObj);
			};
		},

		dispatchChange: function dispatchChange(thisObj) {
			if (thisObj.valueElement) {
				if (jsc.isElementType(thisObj.valueElement, 'input')) {
					jsc.fireEvent(thisObj.valueElement, 'change');
				}
			}
		},

		dispatchFineChange: function dispatchFineChange(thisObj) {
			if (thisObj.onFineChange) {
				var callback;
				if (typeof thisObj.onFineChange === 'string') {
					callback = new Function(thisObj.onFineChange);
				} else {
					callback = thisObj.onFineChange;
				}
				callback.call(thisObj);
			}
		},

		setPad: function setPad(thisObj, e, ofsX, ofsY) {
			var pointerAbs = jsc.getAbsPointerPos(e);
			var x = ofsX + pointerAbs.x - jsc._pointerOrigin.x - thisObj.padding - thisObj.insetWidth;
			var y = ofsY + pointerAbs.y - jsc._pointerOrigin.y - thisObj.padding - thisObj.insetWidth;

			var xVal = x * (360 / (thisObj.width - 1));
			var yVal = 100 - y * (100 / (thisObj.height - 1));

			switch (jsc.getPadYComponent(thisObj)) {
				case 's':
					thisObj.fromHSV(xVal, yVal, null, jsc.leaveSld);break;
				case 'v':
					thisObj.fromHSV(xVal, null, yVal, jsc.leaveSld);break;
			}
		},

		setSld: function setSld(thisObj, e, ofsY) {
			var pointerAbs = jsc.getAbsPointerPos(e);
			var y = ofsY + pointerAbs.y - jsc._pointerOrigin.y - thisObj.padding - thisObj.insetWidth;

			var yVal = 100 - y * (100 / (thisObj.height - 1));

			switch (jsc.getSliderComponent(thisObj)) {
				case 's':
					thisObj.fromHSV(null, yVal, null, jsc.leavePad);break;
				case 'v':
					thisObj.fromHSV(null, null, yVal, jsc.leavePad);break;
			}
		},

		_vmlNS: 'jsc_vml_',
		_vmlCSS: 'jsc_vml_css_',
		_vmlReady: false,

		initVML: function initVML() {
			if (!jsc._vmlReady) {
				// init VML namespace
				var doc = document;
				if (!doc.namespaces[jsc._vmlNS]) {
					doc.namespaces.add(jsc._vmlNS, 'urn:schemas-microsoft-com:vml');
				}
				if (!doc.styleSheets[jsc._vmlCSS]) {
					var tags = ['shape', 'shapetype', 'group', 'background', 'path', 'formulas', 'handles', 'fill', 'stroke', 'shadow', 'textbox', 'textpath', 'imagedata', 'line', 'polyline', 'curve', 'rect', 'roundrect', 'oval', 'arc', 'image'];
					var ss = doc.createStyleSheet();
					ss.owningElement.id = jsc._vmlCSS;
					for (var i = 0; i < tags.length; i += 1) {
						ss.addRule(jsc._vmlNS + '\\:' + tags[i], 'behavior:url(#default#VML);');
					}
				}
				jsc._vmlReady = true;
			}
		},

		createPalette: function createPalette() {

			var paletteObj = {
				elm: null,
				draw: null
			};

			if (jsc.isCanvasSupported) {
				// Canvas implementation for modern browsers

				var canvas = document.createElement('canvas');
				var ctx = canvas.getContext('2d');

				var drawFunc = function drawFunc(width, height, type) {
					canvas.width = width;
					canvas.height = height;

					ctx.clearRect(0, 0, canvas.width, canvas.height);

					var hGrad = ctx.createLinearGradient(0, 0, canvas.width, 0);
					hGrad.addColorStop(0 / 6, '#F00');
					hGrad.addColorStop(1 / 6, '#FF0');
					hGrad.addColorStop(2 / 6, '#0F0');
					hGrad.addColorStop(3 / 6, '#0FF');
					hGrad.addColorStop(4 / 6, '#00F');
					hGrad.addColorStop(5 / 6, '#F0F');
					hGrad.addColorStop(6 / 6, '#F00');

					ctx.fillStyle = hGrad;
					ctx.fillRect(0, 0, canvas.width, canvas.height);

					var vGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
					switch (type.toLowerCase()) {
						case 's':
							vGrad.addColorStop(0, 'rgba(255,255,255,0)');
							vGrad.addColorStop(1, 'rgba(255,255,255,1)');
							break;
						case 'v':
							vGrad.addColorStop(0, 'rgba(0,0,0,0)');
							vGrad.addColorStop(1, 'rgba(0,0,0,1)');
							break;
					}
					ctx.fillStyle = vGrad;
					ctx.fillRect(0, 0, canvas.width, canvas.height);
				};

				paletteObj.elm = canvas;
				paletteObj.draw = drawFunc;
			} else {
				// VML fallback for IE 7 and 8

				jsc.initVML();

				var vmlContainer = document.createElement('div');
				vmlContainer.style.position = 'relative';
				vmlContainer.style.overflow = 'hidden';

				var hGrad = document.createElement(jsc._vmlNS + ':fill');
				hGrad.type = 'gradient';
				hGrad.method = 'linear';
				hGrad.angle = '90';
				hGrad.colors = '16.67% #F0F, 33.33% #00F, 50% #0FF, 66.67% #0F0, 83.33% #FF0';

				var hRect = document.createElement(jsc._vmlNS + ':rect');
				hRect.style.position = 'absolute';
				hRect.style.left = -1 + 'px';
				hRect.style.top = -1 + 'px';
				hRect.stroked = false;
				hRect.appendChild(hGrad);
				vmlContainer.appendChild(hRect);

				var vGrad = document.createElement(jsc._vmlNS + ':fill');
				vGrad.type = 'gradient';
				vGrad.method = 'linear';
				vGrad.angle = '180';
				vGrad.opacity = '0';

				var vRect = document.createElement(jsc._vmlNS + ':rect');
				vRect.style.position = 'absolute';
				vRect.style.left = -1 + 'px';
				vRect.style.top = -1 + 'px';
				vRect.stroked = false;
				vRect.appendChild(vGrad);
				vmlContainer.appendChild(vRect);

				var drawFunc = function drawFunc(width, height, type) {
					vmlContainer.style.width = width + 'px';
					vmlContainer.style.height = height + 'px';

					hRect.style.width = vRect.style.width = width + 1 + 'px';
					hRect.style.height = vRect.style.height = height + 1 + 'px';

					// Colors must be specified during every redraw, otherwise IE won't display
					// a full gradient during a subsequential redraw
					hGrad.color = '#F00';
					hGrad.color2 = '#F00';

					switch (type.toLowerCase()) {
						case 's':
							vGrad.color = vGrad.color2 = '#FFF';
							break;
						case 'v':
							vGrad.color = vGrad.color2 = '#000';
							break;
					}
				};

				paletteObj.elm = vmlContainer;
				paletteObj.draw = drawFunc;
			}

			return paletteObj;
		},

		createSliderGradient: function createSliderGradient() {

			var sliderObj = {
				elm: null,
				draw: null
			};

			if (jsc.isCanvasSupported) {
				// Canvas implementation for modern browsers

				var canvas = document.createElement('canvas');
				var ctx = canvas.getContext('2d');

				var drawFunc = function drawFunc(width, height, color1, color2) {
					canvas.width = width;
					canvas.height = height;

					ctx.clearRect(0, 0, canvas.width, canvas.height);

					var grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
					grad.addColorStop(0, color1);
					grad.addColorStop(1, color2);

					ctx.fillStyle = grad;
					ctx.fillRect(0, 0, canvas.width, canvas.height);
				};

				sliderObj.elm = canvas;
				sliderObj.draw = drawFunc;
			} else {
				// VML fallback for IE 7 and 8

				jsc.initVML();

				var vmlContainer = document.createElement('div');
				vmlContainer.style.position = 'relative';
				vmlContainer.style.overflow = 'hidden';

				var grad = document.createElement(jsc._vmlNS + ':fill');
				grad.type = 'gradient';
				grad.method = 'linear';
				grad.angle = '180';

				var rect = document.createElement(jsc._vmlNS + ':rect');
				rect.style.position = 'absolute';
				rect.style.left = -1 + 'px';
				rect.style.top = -1 + 'px';
				rect.stroked = false;
				rect.appendChild(grad);
				vmlContainer.appendChild(rect);

				var drawFunc = function drawFunc(width, height, color1, color2) {
					vmlContainer.style.width = width + 'px';
					vmlContainer.style.height = height + 'px';

					rect.style.width = width + 1 + 'px';
					rect.style.height = height + 1 + 'px';

					grad.color = color1;
					grad.color2 = color2;
				};

				sliderObj.elm = vmlContainer;
				sliderObj.draw = drawFunc;
			}

			return sliderObj;
		},

		leaveValue: 1 << 0,
		leaveStyle: 1 << 1,
		leavePad: 1 << 2,
		leaveSld: 1 << 3,

		BoxShadow: function () {
			var BoxShadow = function BoxShadow(hShadow, vShadow, blur, spread, color, inset) {
				this.hShadow = hShadow;
				this.vShadow = vShadow;
				this.blur = blur;
				this.spread = spread;
				this.color = color;
				this.inset = !!inset;
			};

			BoxShadow.prototype.toString = function () {
				var vals = [Math.round(this.hShadow) + 'px', Math.round(this.vShadow) + 'px', Math.round(this.blur) + 'px', Math.round(this.spread) + 'px', this.color];
				if (this.inset) {
					vals.push('inset');
				}
				return vals.join(' ');
			};

			return BoxShadow;
		}(),

		//
		// Usage:
		// var myColor = new jscolor(<targetElement> [, <options>])
		//

		jscolor: function jscolor(targetElement, options) {

			// General options
			//
			this.value = null; // initial HEX color. To change it later, use methods fromString(), fromHSV() and fromRGB()
			this.valueElement = targetElement; // element that will be used to display and input the color code
			this.styleElement = targetElement; // element that will preview the picked color using CSS backgroundColor
			this.required = true; // whether the associated text <input> can be left empty
			this.refine = true; // whether to refine the entered color code (e.g. uppercase it and remove whitespace)
			this.hash = false; // whether to prefix the HEX color code with # symbol
			this.uppercase = true; // whether to uppercase the color code
			this.onFineChange = null; // called instantly every time the color changes (value can be either a function or a string with javascript code)
			this.activeClass = 'jscolor-active'; // class to be set to the target element when a picker window is open on it
			this.minS = 0; // min allowed saturation (0 - 100)
			this.maxS = 100; // max allowed saturation (0 - 100)
			this.minV = 0; // min allowed value (brightness) (0 - 100)
			this.maxV = 100; // max allowed value (brightness) (0 - 100)

			// Accessing the picked color
			//
			this.hsv = [0, 0, 100]; // read-only  [0-360, 0-100, 0-100]
			this.rgb = [255, 255, 255]; // read-only  [0-255, 0-255, 0-255]

			// Color Picker options
			//
			this.width = 181; // width of color palette (in px)
			this.height = 101; // height of color palette (in px)
			this.showOnClick = true; // whether to display the color picker when user clicks on its target element
			this.mode = 'HSV'; // HSV | HVS | HS | HV - layout of the color picker controls
			this.position = 'bottom'; // left | right | top | bottom - position relative to the target element
			this.smartPosition = true; // automatically change picker position when there is not enough space for it
			this.sliderSize = 16; // px
			this.crossSize = 8; // px
			this.closable = false; // whether to display the Close button
			this.closeText = 'Close';
			this.buttonColor = '#000000'; // CSS color
			this.buttonHeight = 18; // px
			this.padding = 12; // px
			this.backgroundColor = '#FFFFFF'; // CSS color
			this.borderWidth = 1; // px
			this.borderColor = '#BBBBBB'; // CSS color
			this.borderRadius = 8; // px
			this.insetWidth = 1; // px
			this.insetColor = '#BBBBBB'; // CSS color
			this.shadow = true; // whether to display shadow
			this.shadowBlur = 15; // px
			this.shadowColor = 'rgba(0,0,0,0.2)'; // CSS color
			this.pointerColor = '#4C4C4C'; // px
			this.pointerBorderColor = '#FFFFFF'; // px
			this.pointerBorderWidth = 1; // px
			this.pointerThickness = 2; // px
			this.zIndex = 1000000;
			this.container = null; // where to append the color picker (BODY element by default)


			for (var opt in options) {
				if (options.hasOwnProperty(opt)) {
					this[opt] = options[opt];
				}
			}

			this.hide = function () {
				if (isPickerOwner()) {
					detachPicker();
				}
			};

			this.show = function () {
				drawPicker();
			};

			this.redraw = function () {
				if (isPickerOwner()) {
					drawPicker();
				}
			};

			this.importColor = function () {

				if (!this.valueElement) {
					this.exportColor();
				} else {
					if (jsc.isElementType(this.valueElement, 'input')) {
						if (!this.refine) {
							if (!this.fromString(this.valueElement.value, jsc.leaveValue)) {
								if (this.styleElement) {
									this.styleElement.style.backgroundImage = this.styleElement._jscOrigStyle.backgroundImage;
									this.styleElement.style.backgroundColor = this.styleElement._jscOrigStyle.backgroundColor;
									this.styleElement.style.color = this.styleElement._jscOrigStyle.color;
								}
								this.exportColor(jsc.leaveValue | jsc.leaveStyle);
							}
						} else if (!this.required && /^\s*$/.test(this.valueElement.value)) {
							this.valueElement.value = '';
							if (this.styleElement) {
								this.styleElement.style.backgroundImage = this.styleElement._jscOrigStyle.backgroundImage;
								this.styleElement.style.backgroundColor = this.styleElement._jscOrigStyle.backgroundColor;
								this.styleElement.style.color = this.styleElement._jscOrigStyle.color;
							}
							this.exportColor(jsc.leaveValue | jsc.leaveStyle);
						} else if (this.fromString(this.valueElement.value)) {
							// managed to import color successfully from the value -> OK, don't do anything
						} else {
							this.exportColor();
						}
					} else {
						// not an input element -> doesn't have any value
						this.exportColor();
					}
				}
			};

			this.exportColor = function (flags) {
				//获取颜色值
				if (!(flags & jsc.leaveValue) && this.valueElement) {
					var value = this.toString();
					if (this.uppercase) {
						value = value.toUpperCase();
					}
					if (this.hash) {
						value = '#' + value;
					}

					if (jsc.isElementType(this.valueElement, 'input')) {
						console.log(value);
						this.valueElement.value = value;
					} else {
						this.valueElement.innerHTML = value;
					}
				}
				if (!(flags & jsc.leaveStyle)) {
					if (this.styleElement) {
						this.styleElement.style.backgroundImage = 'none';
						this.styleElement.style.backgroundColor = '#' + this.toString();
						this.styleElement.style.color = this.isLight() ? '#000' : '#FFF';
					}
				}
				if (!(flags & jsc.leavePad) && isPickerOwner()) {
					redrawPad();
				}
				if (!(flags & jsc.leaveSld) && isPickerOwner()) {
					redrawSld();
				}
			};

			// h: 0-360
			// s: 0-100
			// v: 0-100
			//
			this.fromHSV = function (h, s, v, flags) {
				// null = don't change
				if (h !== null) {
					if (isNaN(h)) {
						return false;
					}
					h = Math.max(0, Math.min(360, h));
				}
				if (s !== null) {
					if (isNaN(s)) {
						return false;
					}
					s = Math.max(0, Math.min(100, this.maxS, s), this.minS);
				}
				if (v !== null) {
					if (isNaN(v)) {
						return false;
					}
					v = Math.max(0, Math.min(100, this.maxV, v), this.minV);
				}

				this.rgb = HSV_RGB(h === null ? this.hsv[0] : this.hsv[0] = h, s === null ? this.hsv[1] : this.hsv[1] = s, v === null ? this.hsv[2] : this.hsv[2] = v);

				this.exportColor(flags);
			};

			// r: 0-255
			// g: 0-255
			// b: 0-255
			//
			this.fromRGB = function (r, g, b, flags) {
				// null = don't change
				if (r !== null) {
					if (isNaN(r)) {
						return false;
					}
					r = Math.max(0, Math.min(255, r));
				}
				if (g !== null) {
					if (isNaN(g)) {
						return false;
					}
					g = Math.max(0, Math.min(255, g));
				}
				if (b !== null) {
					if (isNaN(b)) {
						return false;
					}
					b = Math.max(0, Math.min(255, b));
				}

				var hsv = RGB_HSV(r === null ? this.rgb[0] : r, g === null ? this.rgb[1] : g, b === null ? this.rgb[2] : b);
				if (hsv[0] !== null) {
					this.hsv[0] = Math.max(0, Math.min(360, hsv[0]));
				}
				if (hsv[2] !== 0) {
					this.hsv[1] = hsv[1] === null ? null : Math.max(0, this.minS, Math.min(100, this.maxS, hsv[1]));
				}
				this.hsv[2] = hsv[2] === null ? null : Math.max(0, this.minV, Math.min(100, this.maxV, hsv[2]));

				// update RGB according to final HSV, as some values might be trimmed
				var rgb = HSV_RGB(this.hsv[0], this.hsv[1], this.hsv[2]);
				this.rgb[0] = rgb[0];
				this.rgb[1] = rgb[1];
				this.rgb[2] = rgb[2];

				this.exportColor(flags);
			};

			this.fromString = function (str, flags) {
				var m;
				if (m = str.match(/^\W*([0-9A-F]{3}([0-9A-F]{3})?)\W*$/i)) {
					// HEX notation
					//

					if (m[1].length === 6) {
						// 6-char notation
						this.fromRGB(parseInt(m[1].substr(0, 2), 16), parseInt(m[1].substr(2, 2), 16), parseInt(m[1].substr(4, 2), 16), flags);
					} else {
						// 3-char notation
						this.fromRGB(parseInt(m[1].charAt(0) + m[1].charAt(0), 16), parseInt(m[1].charAt(1) + m[1].charAt(1), 16), parseInt(m[1].charAt(2) + m[1].charAt(2), 16), flags);
					}
					return true;
				} else if (m = str.match(/^\W*rgba?\(([^)]*)\)\W*$/i)) {
					var params = m[1].split(',');
					var re = /^\s*(\d*)(\.\d+)?\s*$/;
					var mR, mG, mB;
					if (params.length >= 3 && (mR = params[0].match(re)) && (mG = params[1].match(re)) && (mB = params[2].match(re))) {
						var r = parseFloat((mR[1] || '0') + (mR[2] || ''));
						var g = parseFloat((mG[1] || '0') + (mG[2] || ''));
						var b = parseFloat((mB[1] || '0') + (mB[2] || ''));
						this.fromRGB(r, g, b, flags);
						return true;
					}
				}
				return false;
			};

			this.toString = function () {
				return (0x100 | Math.round(this.rgb[0])).toString(16).substr(1) + (0x100 | Math.round(this.rgb[1])).toString(16).substr(1) + (0x100 | Math.round(this.rgb[2])).toString(16).substr(1);
			};

			this.toHEXString = function () {
				return '#' + this.toString().toUpperCase();
			};

			this.toRGBString = function () {
				return 'rgb(' + Math.round(this.rgb[0]) + ',' + Math.round(this.rgb[1]) + ',' + Math.round(this.rgb[2]) + ')';
			};

			this.isLight = function () {
				return 0.213 * this.rgb[0] + 0.715 * this.rgb[1] + 0.072 * this.rgb[2] > 255 / 2;
			};

			this._processParentElementsInDOM = function () {
				if (this._linkedElementsProcessed) {
					return;
				}
				this._linkedElementsProcessed = true;

				var elm = this.targetElement;
				do {
					// If the target element or one of its parent nodes has fixed position,
					// then use fixed positioning instead
					//
					// Note: In Firefox, getComputedStyle returns null in a hidden iframe,
					// that's why we need to check if the returned style object is non-empty
					var currStyle = jsc.getStyle(elm);
					if (currStyle && currStyle.position.toLowerCase() === 'fixed') {
						this.fixed = true;
					}

					if (elm !== this.targetElement) {
						// Ensure to attach onParentScroll only once to each parent element
						// (multiple targetElements can share the same parent nodes)
						//
						// Note: It's not just offsetParents that can be scrollable,
						// that's why we loop through all parent nodes
						if (!elm._jscEventsAttached) {
							jsc.attachEvent(elm, 'scroll', jsc.onParentScroll);
							elm._jscEventsAttached = true;
						}
					}
				} while ((elm = elm.parentNode) && !jsc.isElementType(elm, 'body'));
			};

			// r: 0-255
			// g: 0-255
			// b: 0-255
			//
			// returns: [ 0-360, 0-100, 0-100 ]
			//
			function RGB_HSV(r, g, b) {
				r /= 255;
				g /= 255;
				b /= 255;
				var n = Math.min(Math.min(r, g), b);
				var v = Math.max(Math.max(r, g), b);
				var m = v - n;
				if (m === 0) {
					return [null, 0, 100 * v];
				}
				var h = r === n ? 3 + (b - g) / m : g === n ? 5 + (r - b) / m : 1 + (g - r) / m;
				return [60 * (h === 6 ? 0 : h), 100 * (m / v), 100 * v];
			}

			// h: 0-360
			// s: 0-100
			// v: 0-100
			//
			// returns: [ 0-255, 0-255, 0-255 ]
			//
			function HSV_RGB(h, s, v) {
				var u = 255 * (v / 100);

				if (h === null) {
					return [u, u, u];
				}

				h /= 60;
				s /= 100;

				var i = Math.floor(h);
				var f = i % 2 ? h - i : 1 - (h - i);
				var m = u * (1 - s);
				var n = u * (1 - s * f);
				switch (i) {
					case 6:
					case 0:
						return [u, n, m];
					case 1:
						return [n, u, m];
					case 2:
						return [m, u, n];
					case 3:
						return [m, n, u];
					case 4:
						return [n, m, u];
					case 5:
						return [u, m, n];
				}
			}

			function detachPicker() {
				jsc.unsetClass(THIS.targetElement, THIS.activeClass);
				jsc.picker.wrap.parentNode.removeChild(jsc.picker.wrap);
				delete jsc.picker.owner;
			}

			function drawPicker() {

				// At this point, when drawing the picker, we know what the parent elements are
				// and we can do all related DOM operations, such as registering events on them
				// or checking their positioning
				THIS._processParentElementsInDOM();

				if (!jsc.picker) {
					jsc.picker = {
						owner: null,
						wrap: document.createElement('div'),
						box: document.createElement('div'),
						boxS: document.createElement('div'), // shadow area
						boxB: document.createElement('div'), // border
						pad: document.createElement('div'),
						padB: document.createElement('div'), // border
						padM: document.createElement('div'), // mouse/touch area
						padPal: jsc.createPalette(),
						cross: document.createElement('div'),
						crossBY: document.createElement('div'), // border Y
						crossBX: document.createElement('div'), // border X
						crossLY: document.createElement('div'), // line Y
						crossLX: document.createElement('div'), // line X
						sld: document.createElement('div'),
						sldB: document.createElement('div'), // border
						sldM: document.createElement('div'), // mouse/touch area
						sldGrad: jsc.createSliderGradient(),
						sldPtrS: document.createElement('div'), // slider pointer spacer
						sldPtrIB: document.createElement('div'), // slider pointer inner border
						sldPtrMB: document.createElement('div'), // slider pointer middle border
						sldPtrOB: document.createElement('div'), // slider pointer outer border
						btn: document.createElement('div'),
						btnT: document.createElement('span' // text
						) };

					jsc.picker.pad.appendChild(jsc.picker.padPal.elm);
					jsc.picker.padB.appendChild(jsc.picker.pad);
					jsc.picker.cross.appendChild(jsc.picker.crossBY);
					jsc.picker.cross.appendChild(jsc.picker.crossBX);
					jsc.picker.cross.appendChild(jsc.picker.crossLY);
					jsc.picker.cross.appendChild(jsc.picker.crossLX);
					jsc.picker.padB.appendChild(jsc.picker.cross);
					jsc.picker.box.appendChild(jsc.picker.padB);
					jsc.picker.box.appendChild(jsc.picker.padM);

					jsc.picker.sld.appendChild(jsc.picker.sldGrad.elm);
					jsc.picker.sldB.appendChild(jsc.picker.sld);
					jsc.picker.sldB.appendChild(jsc.picker.sldPtrOB);
					jsc.picker.sldPtrOB.appendChild(jsc.picker.sldPtrMB);
					jsc.picker.sldPtrMB.appendChild(jsc.picker.sldPtrIB);
					jsc.picker.sldPtrIB.appendChild(jsc.picker.sldPtrS);
					jsc.picker.box.appendChild(jsc.picker.sldB);
					jsc.picker.box.appendChild(jsc.picker.sldM);

					jsc.picker.btn.appendChild(jsc.picker.btnT);
					jsc.picker.box.appendChild(jsc.picker.btn);

					jsc.picker.boxB.appendChild(jsc.picker.box);
					jsc.picker.wrap.appendChild(jsc.picker.boxS);
					jsc.picker.wrap.appendChild(jsc.picker.boxB);
				}

				var p = jsc.picker;

				var displaySlider = !!jsc.getSliderComponent(THIS);
				var dims = jsc.getPickerDims(THIS);
				var crossOuterSize = 2 * THIS.pointerBorderWidth + THIS.pointerThickness + 2 * THIS.crossSize;
				var padToSliderPadding = jsc.getPadToSliderPadding(THIS);
				var borderRadius = Math.min(THIS.borderRadius, Math.round(THIS.padding * Math.PI)); // px
				var padCursor = 'crosshair';

				// wrap
				p.wrap.style.clear = 'both';
				p.wrap.style.width = dims[0] + 2 * THIS.borderWidth + 'px';
				p.wrap.style.height = dims[1] + 2 * THIS.borderWidth + 'px';
				p.wrap.style.zIndex = THIS.zIndex;

				// picker
				p.box.style.width = dims[0] + 'px';
				p.box.style.height = dims[1] + 'px';

				p.boxS.style.position = 'absolute';
				p.boxS.style.left = '0';
				p.boxS.style.top = '0';
				p.boxS.style.width = '100%';
				p.boxS.style.height = '100%';
				jsc.setBorderRadius(p.boxS, borderRadius + 'px');

				// picker border
				p.boxB.style.position = 'relative';
				p.boxB.style.border = THIS.borderWidth + 'px solid';
				p.boxB.style.borderColor = THIS.borderColor;
				p.boxB.style.background = THIS.backgroundColor;
				jsc.setBorderRadius(p.boxB, borderRadius + 'px');

				// IE hack:
				// If the element is transparent, IE will trigger the event on the elements under it,
				// e.g. on Canvas or on elements with border
				p.padM.style.background = p.sldM.style.background = '#FFF';
				jsc.setStyle(p.padM, 'opacity', '0');
				jsc.setStyle(p.sldM, 'opacity', '0');

				// pad
				p.pad.style.position = 'relative';
				p.pad.style.width = THIS.width + 'px';
				p.pad.style.height = THIS.height + 'px';

				// pad palettes (HSV and HVS)
				p.padPal.draw(THIS.width, THIS.height, jsc.getPadYComponent(THIS));

				// pad border
				p.padB.style.position = 'absolute';
				p.padB.style.left = THIS.padding + 'px';
				p.padB.style.top = THIS.padding + 'px';
				p.padB.style.border = THIS.insetWidth + 'px solid';
				p.padB.style.borderColor = THIS.insetColor;

				// pad mouse area
				p.padM._jscInstance = THIS;
				p.padM._jscControlName = 'pad';
				p.padM.style.position = 'absolute';
				p.padM.style.left = '0';
				p.padM.style.top = '0';
				p.padM.style.width = THIS.padding + 2 * THIS.insetWidth + THIS.width + padToSliderPadding / 2 + 'px';
				p.padM.style.height = dims[1] + 'px';
				p.padM.style.cursor = padCursor;

				// pad cross
				p.cross.style.position = 'absolute';
				p.cross.style.left = p.cross.style.top = '0';
				p.cross.style.width = p.cross.style.height = crossOuterSize + 'px';

				// pad cross border Y and X
				p.crossBY.style.position = p.crossBX.style.position = 'absolute';
				p.crossBY.style.background = p.crossBX.style.background = THIS.pointerBorderColor;
				p.crossBY.style.width = p.crossBX.style.height = 2 * THIS.pointerBorderWidth + THIS.pointerThickness + 'px';
				p.crossBY.style.height = p.crossBX.style.width = crossOuterSize + 'px';
				p.crossBY.style.left = p.crossBX.style.top = Math.floor(crossOuterSize / 2) - Math.floor(THIS.pointerThickness / 2) - THIS.pointerBorderWidth + 'px';
				p.crossBY.style.top = p.crossBX.style.left = '0';

				// pad cross line Y and X
				p.crossLY.style.position = p.crossLX.style.position = 'absolute';
				p.crossLY.style.background = p.crossLX.style.background = THIS.pointerColor;
				p.crossLY.style.height = p.crossLX.style.width = crossOuterSize - 2 * THIS.pointerBorderWidth + 'px';
				p.crossLY.style.width = p.crossLX.style.height = THIS.pointerThickness + 'px';
				p.crossLY.style.left = p.crossLX.style.top = Math.floor(crossOuterSize / 2) - Math.floor(THIS.pointerThickness / 2) + 'px';
				p.crossLY.style.top = p.crossLX.style.left = THIS.pointerBorderWidth + 'px';

				// slider
				p.sld.style.overflow = 'hidden';
				p.sld.style.width = THIS.sliderSize + 'px';
				p.sld.style.height = THIS.height + 'px';

				// slider gradient
				p.sldGrad.draw(THIS.sliderSize, THIS.height, '#000', '#000');

				// slider border
				p.sldB.style.display = displaySlider ? 'block' : 'none';
				p.sldB.style.position = 'absolute';
				p.sldB.style.right = THIS.padding + 'px';
				p.sldB.style.top = THIS.padding + 'px';
				p.sldB.style.border = THIS.insetWidth + 'px solid';
				p.sldB.style.borderColor = THIS.insetColor;

				// slider mouse area
				p.sldM._jscInstance = THIS;
				p.sldM._jscControlName = 'sld';
				p.sldM.style.display = displaySlider ? 'block' : 'none';
				p.sldM.style.position = 'absolute';
				p.sldM.style.right = '0';
				p.sldM.style.top = '0';
				p.sldM.style.width = THIS.sliderSize + padToSliderPadding / 2 + THIS.padding + 2 * THIS.insetWidth + 'px';
				p.sldM.style.height = dims[1] + 'px';
				p.sldM.style.cursor = 'default';

				// slider pointer inner and outer border
				p.sldPtrIB.style.border = p.sldPtrOB.style.border = THIS.pointerBorderWidth + 'px solid ' + THIS.pointerBorderColor;

				// slider pointer outer border
				p.sldPtrOB.style.position = 'absolute';
				p.sldPtrOB.style.left = -(2 * THIS.pointerBorderWidth + THIS.pointerThickness) + 'px';
				p.sldPtrOB.style.top = '0';

				// slider pointer middle border
				p.sldPtrMB.style.border = THIS.pointerThickness + 'px solid ' + THIS.pointerColor;

				// slider pointer spacer
				p.sldPtrS.style.width = THIS.sliderSize + 'px';
				p.sldPtrS.style.height = sliderPtrSpace + 'px';

				// the Close button
				function setBtnBorder() {
					var insetColors = THIS.insetColor.split(/\s+/);
					var outsetColor = insetColors.length < 2 ? insetColors[0] : insetColors[1] + ' ' + insetColors[0] + ' ' + insetColors[0] + ' ' + insetColors[1];
					p.btn.style.borderColor = outsetColor;
				}
				p.btn.style.display = THIS.closable ? 'block' : 'none';
				p.btn.style.position = 'absolute';
				p.btn.style.left = THIS.padding + 'px';
				p.btn.style.bottom = THIS.padding + 'px';
				p.btn.style.padding = '0 15px';
				p.btn.style.height = THIS.buttonHeight + 'px';
				p.btn.style.border = THIS.insetWidth + 'px solid';
				setBtnBorder();
				p.btn.style.color = THIS.buttonColor;
				p.btn.style.font = '12px sans-serif';
				p.btn.style.textAlign = 'center';
				try {
					p.btn.style.cursor = 'pointer';
				} catch (eOldIE) {
					p.btn.style.cursor = 'hand';
				}
				p.btn.onmousedown = function () {
					THIS.hide();
				};
				p.btnT.style.lineHeight = THIS.buttonHeight + 'px';
				p.btnT.innerHTML = '';
				p.btnT.appendChild(document.createTextNode(THIS.closeText));

				// place pointers
				redrawPad();
				redrawSld();

				// If we are changing the owner without first closing the picker,
				// make sure to first deal with the old owner
				if (jsc.picker.owner && jsc.picker.owner !== THIS) {
					jsc.unsetClass(jsc.picker.owner.targetElement, THIS.activeClass);
				}

				// Set the new picker owner
				jsc.picker.owner = THIS;

				// The redrawPosition() method needs picker.owner to be set, that's why we call it here,
				// after setting the owner
				if (jsc.isElementType(container, 'body')) {
					jsc.redrawPosition();
				} else {
					jsc._drawPosition(THIS, 0, 0, 'relative', false);
				}

				if (p.wrap.parentNode != container) {
					container.appendChild(p.wrap);
				}

				jsc.setClass(THIS.targetElement, THIS.activeClass);
			}

			function redrawPad() {
				// redraw the pad pointer
				switch (jsc.getPadYComponent(THIS)) {
					case 's':
						var yComponent = 1;break;
					case 'v':
						var yComponent = 2;break;
				}
				var x = Math.round(THIS.hsv[0] / 360 * (THIS.width - 1));
				var y = Math.round((1 - THIS.hsv[yComponent] / 100) * (THIS.height - 1));
				var crossOuterSize = 2 * THIS.pointerBorderWidth + THIS.pointerThickness + 2 * THIS.crossSize;
				var ofs = -Math.floor(crossOuterSize / 2);
				jsc.picker.cross.style.left = x + ofs + 'px';
				jsc.picker.cross.style.top = y + ofs + 'px';

				// redraw the slider
				switch (jsc.getSliderComponent(THIS)) {
					case 's':
						var rgb1 = HSV_RGB(THIS.hsv[0], 100, THIS.hsv[2]);
						var rgb2 = HSV_RGB(THIS.hsv[0], 0, THIS.hsv[2]);
						var color1 = 'rgb(' + Math.round(rgb1[0]) + ',' + Math.round(rgb1[1]) + ',' + Math.round(rgb1[2]) + ')';
						var color2 = 'rgb(' + Math.round(rgb2[0]) + ',' + Math.round(rgb2[1]) + ',' + Math.round(rgb2[2]) + ')';
						jsc.picker.sldGrad.draw(THIS.sliderSize, THIS.height, color1, color2);
						break;
					case 'v':
						var rgb = HSV_RGB(THIS.hsv[0], THIS.hsv[1], 100);
						var color1 = 'rgb(' + Math.round(rgb[0]) + ',' + Math.round(rgb[1]) + ',' + Math.round(rgb[2]) + ')';
						var color2 = '#000';
						jsc.picker.sldGrad.draw(THIS.sliderSize, THIS.height, color1, color2);
						break;
				}
			}

			function redrawSld() {
				var sldComponent = jsc.getSliderComponent(THIS);
				if (sldComponent) {
					// redraw the slider pointer
					switch (sldComponent) {
						case 's':
							var yComponent = 1;break;
						case 'v':
							var yComponent = 2;break;
					}
					var y = Math.round((1 - THIS.hsv[yComponent] / 100) * (THIS.height - 1));
					jsc.picker.sldPtrOB.style.top = y - (2 * THIS.pointerBorderWidth + THIS.pointerThickness) - Math.floor(sliderPtrSpace / 2) + 'px';
				}
			}

			function isPickerOwner() {
				return jsc.picker && jsc.picker.owner === THIS;
			}

			function blurValue() {
				THIS.importColor();
			}

			// Find the target element
			if (typeof targetElement === 'string') {
				var id = targetElement;
				var elm = document.getElementById(id);
				if (elm) {
					this.targetElement = elm;
				} else {
					jsc.warn('Could not find target element with ID \'' + id + '\'');
				}
			} else if (targetElement) {
				this.targetElement = targetElement;
			} else {
				jsc.warn('Invalid target element: \'' + targetElement + '\'');
			}

			if (this.targetElement._jscLinkedInstance) {
				jsc.warn('Cannot link jscolor twice to the same element. Skipping.');
				return;
			}
			this.targetElement._jscLinkedInstance = this;

			// Find the value element
			this.valueElement = jsc.fetchElement(this.valueElement);
			// Find the style element
			this.styleElement = jsc.fetchElement(this.styleElement);

			var THIS = this;
			var container = this.container ? jsc.fetchElement(this.container) : document.getElementsByTagName('body')[0];
			var sliderPtrSpace = 3; // px

			// For BUTTON elements it's important to stop them from sending the form when clicked
			// (e.g. in Safari)
			if (jsc.isElementType(this.targetElement, 'button')) {
				if (this.targetElement.onclick) {
					var origCallback = this.targetElement.onclick;
					this.targetElement.onclick = function (evt) {
						origCallback.call(this, evt);
						return false;
					};
				} else {
					this.targetElement.onclick = function () {
						return false;
					};
				}
			}

			/*
   var elm = this.targetElement;
   do {
   	// If the target element or one of its offsetParents has fixed position,
   	// then use fixed positioning instead
   	//
   	// Note: In Firefox, getComputedStyle returns null in a hidden iframe,
   	// that's why we need to check if the returned style object is non-empty
   	var currStyle = jsc.getStyle(elm);
   	if (currStyle && currStyle.position.toLowerCase() === 'fixed') {
   		this.fixed = true;
   	}
   		if (elm !== this.targetElement) {
   		// attach onParentScroll so that we can recompute the picker position
   		// when one of the offsetParents is scrolled
   		if (!elm._jscEventsAttached) {
   			jsc.attachEvent(elm, 'scroll', jsc.onParentScroll);
   			elm._jscEventsAttached = true;
   		}
   	}
   } while ((elm = elm.offsetParent) && !jsc.isElementType(elm, 'body'));
   */

			// valueElement
			if (this.valueElement) {
				if (jsc.isElementType(this.valueElement, 'input')) {
					var updateField = function updateField() {
						THIS.fromString(THIS.valueElement.value, jsc.leaveValue);
						jsc.dispatchFineChange(THIS);
					};
					jsc.attachEvent(this.valueElement, 'keyup', updateField);
					jsc.attachEvent(this.valueElement, 'input', updateField);
					jsc.attachEvent(this.valueElement, 'blur', blurValue);
					this.valueElement.setAttribute('autocomplete', 'off');
				}
			}

			// styleElement
			if (this.styleElement) {
				this.styleElement._jscOrigStyle = {
					backgroundImage: this.styleElement.style.backgroundImage,
					backgroundColor: this.styleElement.style.backgroundColor,
					color: this.styleElement.style.color
				};
			}

			if (this.value) {
				// Try to set the color from the .value option and if unsuccessful,
				// export the current color
				this.fromString(this.value) || this.exportColor();
			} else {
				this.importColor();
			}
		}

	};

	//================================
	// Public properties and methods
	//================================


	// By default, search for all elements with class="jscolor" and install a color picker on them.
	//
	// You can change what class name will be looked for by setting the property jscolor.lookupClass
	// anywhere in your HTML document. To completely disable the automatic lookup, set it to null.
	//
	jsc.jscolor.lookupClass = 'jscolor';
	jsc.jscolor.installByClassName = function (className) {
		var inputElms = document.getElementsByTagName('input');
		var buttonElms = document.getElementsByTagName('button');

		jsc.tryInstallOnElements(inputElms, className);
		jsc.tryInstallOnElements(buttonElms, className);
	};

	jsc.register();
	return jsc.jscolor;
};

var efun = {
    blockColor: function blockColor(value) {

        document.execCommand('formatBlock', false, '<BLOCKQUOTE>');
        var section = window.getSelection().anchorNode;
        for (var i = 0; i < 100; i++) {
            if (section.nodeName == 'BLOCKQUOTE') {

                section.style.backgroundColor = '#' + value;
                break;
            } else {
                section = section.parentNode;
            }
        }
    },
    fontColor: function fontColor(value) {
        document.execCommand('foreColor', false, value);
        var section = window.getSelection().anchorNode;
        for (var i = 0; i < 100; i++) {
            if (section.nodeName == 'FONT') {

                section.color = '#' + value;
                break;
            } else {
                section = section.parentNode;
            }
        }
    },
    backColor: function backColor(value) {

        document.execCommand('backColor', false, value);
        var section = window.getSelection().anchorNode;
        if (section.nodeName == 'SPAN') {}
        for (var i = 0; i < 100; i++) {
            if (section.nodeName == 'SPAN') {
                section.style.backgroundColor = '#' + value;
                break;
            } else {
                section = section.parentNode;
            }
        }
    }

};

window.jscolor = jscolor$1 || {};
window.efun = efun || {};

try {
    document;
} catch (ex) {
    throw new Error('请在浏览器环境下运行');
}

// polyfill
polyfill

// 这里的 `inlinecss` 将被替换成 css 代码的内容，详情可去 ./gulpfile.js 中搜索 `inlinecss` 关键字
();var inlinecss = '.w-e-toolbar .w-e-droplist ul.w-e-block .w-e-btn-li {  width: 100%;  text-align: center;  padding: 0px;}.editor-define-color {  border: none;  width: 100%;  height: 100%;}.w-e-toolbar,.w-e-text-container,.w-e-menu-panel {  padding: 0;  margin: 0;  box-sizing: border-box;}.w-e-toolbar *,.w-e-text-container *,.w-e-menu-panel * {  padding: 0;  margin: 0;  box-sizing: border-box;}.w-e-clear-fix:after {  content: "";  display: table;  clear: both;}.editor-define-color {  border: none;}.w-e-toolbar .w-e-droplist {  position: absolute;  left: 0;  top: 0;  background-color: #fff;  border: 1px solid #f1f1f1;  border-right-color: #ccc;  border-bottom-color: #ccc;}.w-e-toolbar .w-e-droplist .w-e-dp-title {  text-align: center;  color: #999;  line-height: 2;  border-bottom: 1px solid #f1f1f1;  font-size: 13px;}.w-e-toolbar .w-e-droplist ul.w-e-list {  list-style: none;  line-height: 1;}.w-e-toolbar .w-e-droplist ul.w-e-list li.w-e-item {  color: #333;  padding: 5px 0;}.w-e-toolbar .w-e-droplist ul.w-e-list li.w-e-item:hover {  background-color: #f1f1f1;}.w-e-toolbar .w-e-droplist ul.w-e-block {  list-style: none;  text-align: left;  padding: 5px;}.w-e-toolbar .w-e-droplist ul.w-e-block li.w-e-item {  display: inline-block;  *display: inline;  *zoom: 1;  padding: 3px 5px;}.w-e-toolbar .w-e-droplist ul.w-e-block li.w-e-item:hover {  background-color: #f1f1f1;}@font-face {  font-family: \'icomoon\';  src: url(data:application/x-font-woff;charset=utf-8;base64,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) format(\'truetype\');  font-weight: normal;  font-style: normal;}[class^="w-e-icon-"],[class*=" w-e-icon-"] {  /* use !important to prevent issues with browser extensions that change fonts */  font-family: \'icomoon\' !important;  speak: none;  font-style: normal;  font-weight: normal;  font-variant: normal;  text-transform: none;  line-height: 1;  /* Better Font Rendering =========== */  -webkit-font-smoothing: antialiased;  -moz-osx-font-smoothing: grayscale;}.w-e-icon-upload2:before {  content: "\\e9c6";}.w-e-icon-trash-o:before {  content: "\\f014";}.w-e-icon-header:before {  content: "\\f1dc";}.w-e-icon-pencil2:before {  content: "\\e906";}.w-e-icon-paint-brush:before {  content: "\\f1fc";}.w-e-icon-image:before {  content: "\\e90d";}.w-e-icon-play:before {  content: "\\e912";}.w-e-icon-location:before {  content: "\\e947";}.w-e-icon-undo:before {  content: "\\e965";}.w-e-icon-redo:before {  content: "\\e966";}.w-e-icon-quotes-left:before {  content: "\\e977";}.w-e-icon-list-numbered:before {  content: "\\e9b9";}.w-e-icon-list2:before {  content: "\\e9bb";}.w-e-icon-link:before {  content: "\\e9cb";}.w-e-icon-happy:before {  content: "\\e9df";}.w-e-icon-bold:before {  content: "\\ea62";}.w-e-icon-underline:before {  content: "\\ea63";}.w-e-icon-italic:before {  content: "\\ea64";}.w-e-icon-strikethrough:before {  content: "\\ea65";}.w-e-icon-table2:before {  content: "\\ea71";}.w-e-icon-paragraph-left:before {  content: "\\ea77";}.w-e-icon-paragraph-center:before {  content: "\\ea78";}.w-e-icon-paragraph-right:before {  content: "\\ea79";}.w-e-icon-terminal:before {  content: "\\f120";}.w-e-icon-page-break:before {  content: "\\ea68";}.w-e-icon-cancel-circle:before {  content: "\\ea0d";}.w-e-toolbar {  display: -webkit-box;  display: -ms-flexbox;  display: flex;  padding: 0 5px;  /* 单个菜单 */}.w-e-toolbar .w-e-menu {  position: relative;  z-index: 10001;  text-align: center;  padding: 5px 10px;  cursor: pointer;}.w-e-toolbar .w-e-menu i {  color: #999;}.w-e-toolbar .w-e-menu:hover i {  color: #333;}.w-e-toolbar .w-e-active i {  color: #1e88e5;}.w-e-toolbar .w-e-active:hover i {  color: #1e88e5;}.editor-define-color {  border: none;  width: 100%;  height: 100%;}.w-e-text-container .w-e-panel-container {  position: absolute;  top: 0;  left: 50%;  border: 1px solid #ccc;  border-top: 0;  box-shadow: 1px 1px 2px #ccc;  color: #333;  background-color: #fff;  /* 为 emotion panel 定制的样式 */  /* 上传图片的 panel 定制样式 */}.w-e-text-container .w-e-panel-container .w-e-panel-tab-title {  list-style: none;  display: -webkit-box;  display: -ms-flexbox;  display: flex;  font-size: 14px;  margin: 2px 10px 0 10px;  border-bottom: 1px solid #f1f1f1;}.w-e-text-container .w-e-panel-container .w-e-panel-tab-title .w-e-item {  padding: 3px 5px;  color: #999;  cursor: pointer;  margin: 0 3px;  position: relative;  top: 1px;}.w-e-text-container .w-e-panel-container .w-e-panel-tab-title .w-e-active {  color: #333;  border-bottom: 1px solid #333;  cursor: default;  font-weight: 700;}.w-e-text-container .w-e-panel-container .w-e-panel-tab-content {  padding: 10px 15px 10px 15px;  font-size: 16px;  /* 输入框的样式 */  /* 按钮的样式 */}.w-e-text-container .w-e-panel-container .w-e-panel-tab-content input:focus,.w-e-text-container .w-e-panel-container .w-e-panel-tab-content textarea:focus,.w-e-text-container .w-e-panel-container .w-e-panel-tab-content button:focus {  outline: none;}.w-e-text-container .w-e-panel-container .w-e-panel-tab-content textarea {  width: 100%;  border: 1px solid #ccc;  padding: 5px;}.w-e-text-container .w-e-panel-container .w-e-panel-tab-content textarea:focus {  border-color: #1e88e5;}.w-e-text-container .w-e-panel-container .w-e-panel-tab-content input[type=text] {  border: none;  border-bottom: 1px solid #ccc;  font-size: 14px;  height: 20px;  color: #333;  padding: 10px 5px;  text-align: left;}.w-e-text-container .w-e-panel-container .w-e-panel-tab-content input[type=text].small {  width: 30px;  text-align: center;}.w-e-text-container .w-e-panel-container .w-e-panel-tab-content input[type=text].block {  display: block;  width: 100%;  margin: 10px 0;}.w-e-text-container .w-e-panel-container .w-e-panel-tab-content input[type=text]:focus {  border-bottom: 2px solid #1e88e5;}.w-e-text-container .w-e-panel-container .w-e-panel-tab-content .w-e-button-container button {  font-size: 14px;  color: #1e88e5;  border: none;  padding: 5px 10px;  background-color: #fff;  cursor: pointer;  border-radius: 3px;}.w-e-text-container .w-e-panel-container .w-e-panel-tab-content .w-e-button-container button.left {  float: left;  margin-right: 10px;}.w-e-text-container .w-e-panel-container .w-e-panel-tab-content .w-e-button-container button.right {  float: right;  margin-left: 10px;}.w-e-text-container .w-e-panel-container .w-e-panel-tab-content .w-e-button-container button.gray {  color: #999;}.w-e-text-container .w-e-panel-container .w-e-panel-tab-content .w-e-button-container button.red {  color: #c24f4a;}.w-e-text-container .w-e-panel-container .w-e-panel-tab-content .w-e-button-container button:hover {  background-color: #f1f1f1;}.w-e-text-container .w-e-panel-container .w-e-panel-tab-content .w-e-button-container:after {  content: "";  display: table;  clear: both;}.w-e-text-container .w-e-panel-container .w-e-emoticon-container .w-e-item {  cursor: pointer;  font-size: 18px;  padding: 0 3px;}.w-e-text-container .w-e-panel-container .w-e-up-img-container {  text-align: center;}.w-e-text-container .w-e-panel-container .w-e-up-img-container .w-e-up-btn {  display: inline-block;  *display: inline;  *zoom: 1;  color: #999;  cursor: pointer;  font-size: 60px;  line-height: 1;}.w-e-text-container .w-e-panel-container .w-e-up-img-container .w-e-up-btn:hover {  color: #333;}.w-e-text-container {  position: relative;  z-index: 10000;}.w-e-text-container .w-e-bar {  position: absolute;  background-color: #f1f1f1;  padding: 2px 5px;  color: #666;  bottom: 0;  left: 0;  font-size: 12px;}.w-e-text {  padding: 0 10px;  overflow-y: scroll;}.w-e-text p,.w-e-text h1,.w-e-text h2,.w-e-text h3,.w-e-text h4,.w-e-text h5,.w-e-text table,.w-e-text pre {  margin: 10px 0;  line-height: 1.5;}.w-e-text ul,.w-e-text ol {  margin: 10px 0 10px 20px;}.w-e-text blockquote {  display: block;  padding: 5px 10px;  margin: 10px 0;  line-height: 1.4;  font-size: 100%;  background-color: #f1f1f1;}.w-e-text code {  display: inline-block;  *display: inline;  *zoom: 1;  background-color: #f1f1f1;  border-radius: 3px;  padding: 3px 5px;  margin: 0 3px;}.w-e-text pre code {  display: block;}.w-e-text table {  border-top: 1px solid #ccc;  border-left: 1px solid #ccc;}.w-e-text table td,.w-e-text table th {  border-bottom: 1px solid #ccc;  border-right: 1px solid #ccc;  padding: 3px 5px;}.w-e-text table th {  border-bottom: 2px solid #ccc;  text-align: center;}.w-e-text:focus {  outline: none;}.w-e-text img {  cursor: pointer;}.w-e-text img:hover {  box-shadow: 0 0 5px #333;}.w-e-text img.w-e-selected {  border: 2px solid #1e88e5;}.w-e-text img.w-e-selected:hover {  box-shadow: none;}';

// 将 css 代码添加到 <style> 中
var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = inlinecss;
document.getElementsByTagName('HEAD').item(0).appendChild(style

// 返回
);var index = window.wangEditor || Editor;
window.Editor = Editor;

return index;

})));
