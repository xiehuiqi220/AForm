/*!
 * aform v1.4.17
 * Copyright 2015, xiehuiqi
 * Date: 2015年11月3日
 */

(function() {
    if (window.AForm) {
        if (typeof module === "object" && module.exports) {
            module.exports = window.AForm;
        }

        return window.AForm;
    }//若已存在，则使用之前存在的版本

    /** 常量 */
    var AFORM_SYS_PLUGIN = "__AFORM_SYS_PLUGIN__";
    var AFORM_BASIC_PLUGIN = "__AFORM_BASIC_PLUGIN__";
    var AFORM_OBJ_PLUGIN = "__AFORM_OBJ_PLUGIN__";
    var AFORM_ARR_PLUGIN = "__AFORM_ARR_PLUGIN__";
    var controlInstance = {};
    var aformInstance = {};//aform实例
    var basicControl;
    var objControl;
    var arrControl;
    var sysControl;

    /** 已渲染数据 */
    AForm.renderCount = 0;//已渲染的控件数
    AForm.formCount = 0;//已生成的实例数
    /** 外部插件容器 */
    AForm.Plugin = {};
    AForm.Plugin.control = {};//控件
    AForm.Plugin.validator = {};//验证器
    AForm.Plugin.adapter = {};//适配器
    AForm.Plugin.prop = {};//自定义属性

    /** 全局配紫红 */
    AForm.Config = {};
    AForm.Config.defaultDelimiter = ",";//默认字符串分隔符，用于处理复选框的逗号隔开的值
    /** 表格行操作 */
    AForm.Config.defaultAction = {
        "aform_array_add_row": {
            html: "<a href='javascript:void(null)' title='增加'>＋</a>"
        },
        "aform_array_delete_row": {
            html: "<a href='javascript:void(null)' title='删除'>×</a>"
        }
    };

    /** 标签 */
    AForm.Config.tags = {
        "basicContainer": "div",//div
        "objectContainer": "fieldset",
        "label": "label", //label
        "controlContainer": "" //默认为空
    };
    /** 额外样式名 */
    AForm.Config.extClassName = {
        "basicContainer": "",//form-group
        "label": "",
        "table": "",//table table-bordered
        "control": "",//form-control
        "controlContainer": ""
    };
    /** 模板 */
    AForm.Config.tpl = {
        "tips": "&nbsp;<a title='{tip}' href='#nolink'>[?]</a>",
        "thTips": "<sup title='{tips}'>[?]</sup>"
    };
    /** 文案 */
    AForm.Config.wording = {
        "numText": "NO.",
        "addRowText": "\u589E\u52A0",//增加
        "oprText": "\u64CD\u4F5C",//操作
        "labelColon": "\uFF1A" //：
    };

    /** 处理函数 */
    AForm.Config.fn = {
        "showTips": function(input, errMsg) {
            alert(errMsg);
        },
        "hideTips": function(input) {
            _debug(input.name + " value is valid");
        },
        "onEmpty": function(input, conf) {
            var name = input.getAttribute("name");

            var errMsg = conf ? ("字段[" + (conf.label) + "]不能为空") : input.title;
            if (!errMsg) {
                errMsg = "字段[" + (input.getAttribute("name")) + "]不能为空";
            }

            AForm.Config.fn.showTips(input, errMsg);
        },
        "onInvalid": function(input, conf, errorMsg) {
            var errMsg = errorMsg ? errorMsg : (conf ? ("字段[" + (conf.label) + "]的值非法") : input.title);
            if (!errMsg) {
                errMsg = "字段[" + (input.getAttribute("name")) + "]非法";
            }

            AForm.Config.fn.showTips(input, errMsg);
            if (typeof input.focus === "function" || typeof input.focus === "object") {
                input.focus();
            }
        },
        "onValid": function(input, conf) {
            AForm.Config.fn.hideTips(input);
        },
        "onGlobalInvalid": function(msg) {
            alert(msg);
        }
    };

    //初始化事件
    var validateEvt = {
        empty: function() {
            AForm.Config.fn.onEmpty.apply(AForm, arguments);
        },
        invalid: function() {
            AForm.Config.fn.onInvalid.apply(AForm, arguments);
        },
        valid: function() {
            AForm.Config.fn.onValid.apply(AForm, arguments);
        },
        globalInvalid: function() {
            AForm.Config.fn.onGlobalInvalid.apply(AForm, arguments);
        }
    };

    //helper
    var _formHelper = {
        $: function(id) {
            return document.getElementById(id);
        },
        toArray: function(s) {
            try {
                return Array.prototype.slice.call(s);//ie8报错，见https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice#Streamlining_cross-browser_behavior
            } catch (e) {
                var arr = [];
                for (var i = 0, len = s.length; i < len; i++) {
                    arr[i] = s[i];
                }
                return arr;
            }
        },
        indexOf: function(arr, fn) {
            var pos = -1;
            _h.each(arr, function(item, i) {
                if (fn(item)) {
                    pos = i;
                    return false;
                }
            });

            return pos;
        },
        isIE: function() {
            var myNav = navigator.userAgent.toLowerCase();
            return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
        },
        getInput: function(domEle, restrict) {
            if (_h.hasClass(domEle, "json-field-plugin")) {
                restrict = false;//若是外部自定义控件，有可能并不会在html上打上data-gen=aform的标记，因此需要设置严格模式为false
            }
            var controlList = [];
            var ips = _h.toArray(domEle.getElementsByTagName("input"));
            var txts = _h.toArray(domEle.getElementsByTagName("textarea"));
            var sels = _h.toArray(domEle.getElementsByTagName("select"));

            var clTemp = ips.concat(txts).concat(sels);
            for (var ii = 0; ii < clTemp.length; ii++) {
                var ip = clTemp[ii];
                //忽略的控件无需取值
                //严格模式下，非aform生成的input无需取值
                if (_h.isIgnore(ip) || (restrict && ip.getAttribute("data-gen") != "aform")) {
                } else {
                    controlList.push(ip);
                }
            }

            return controlList;
        },
        removeArray: function(arr, fn) {
            var pos = _h.indexOf(arr, fn);
            if (pos > -1) {
                arr.splice(pos, 1);
            }
        },
        hasClass: function(ele, clsName) {
            if (!ele || !ele.nodeType == 1) {
                return false;
            }
            return (" " + ele.className).indexOf(" " + clsName) > -1;
        },
        isFormElement: function(ele) {
            var isEle = _h.hasClass(ele, "json-form-element") || _h.hasClass(ele, "json-field-plugin");
            return isEle && !_h.isIgnore(ele);
        },
        isIgnore: function(ele) {
            if (!ele || !ele.getAttribute) {
                return false;
            }
            return ele.getAttribute("ignore") == "true" || ele.getAttribute("ignore") == "ignore";
        },
        addClass: function(ele, clsName) {
            if (!ele || !clsName) {
                return false;
            }
            if (!ele.className) {
                ele.className = clsName;
            }
            else if (!_formHelper.hasClass(ele, clsName)) {
                ele.className += " " + clsName;
            }
        },
        validateInput: function(input, conf, af)//用于验证输入控件的value
        {
            var v = input.value;
            return validateInput(af, input, v, conf);
        },
        getParent: function(ele, ptag) {
            ptag = ptag.toUpperCase();
            var p = ele.parentNode;
            while (p && p.tagName != ptag) {
                p = p.parentNode;
            }

            return p;
        },
        getNextSibling: function(n) {
            var x = n.nextSibling;
            while (x && x.nodeType != 1) {
                x = x.nextSibling;
            }
            return x;
        },
        showNextSibling: function(ele, visible) {
            var n = this.getNextSibling(ele);
            while (n) {
                var isHidden = n.getAttribute("hidden") != null;//兼容html5的hidden属性
                n.style.display = isHidden ? "none" : (visible ? "" : "none");
                n = this.getNextSibling(n);
            }
        },
        getTarget: function(e) {
            e = e || window.event;
            return e.target || e.srcElement;
        },
        addEvent: function(ele, evt, fn) {
            if (ele.attachEvent) {
                return ele.attachEvent('on' + evt, fn);
            }
            else {
                return ele.addEventListener(evt, fn, false);
            }
        },
        exeCmd: function(e, tbid, rowAction, fnBefore, fnAfter) {
            e = e || event;
            var ele = e.srcElement ? e.srcElement : e.target;
            var cmd = ele.getAttribute("cmd");
            if (!cmd) {
                return false;
            }
            var table = _formHelper.getParent(ele, "table");

            //重要，如果事件源table存在事件绑定，但当前触发的事件函数源却不是该table，则是冒泡带上的事件，忽略之，防止触发两次
            if (table && table.onclick && table.id != tbid) {
                return false;
            }
            var row = _formHelper.getParent(ele, "tr");

            if (cmd == "aform_array_collapse_table") {//隐藏table
                var show = true;

                if (_formHelper.hasClass(ele, "json-form-ctrl-un-collapse")) {
                    ele.className = ele.className.replace("json-form-ctrl-un-collapse", "json-form-ctrl-collapse");
                    show = false;//需要折叠
                } else if (_formHelper.hasClass(ele, "json-form-ctrl-collapse")) {
                    ele.className = ele.className.replace("json-form-ctrl-collapse", "json-form-ctrl-un-collapse");
                }

                _formHelper.showNextSibling(_formHelper.getParent(ele, "caption"), show);
                _formHelper.showNextSibling(ele, show);
            } else if (cmd == "aform_array_collapse_fieldset") {
                var show = true;

                if (_formHelper.hasClass(ele, "json-form-ctrl-un-collapse")) {
                    ele.className = ele.className.replace("json-form-ctrl-un-collapse", "json-form-ctrl-collapse");
                    show = false;
                } else if (_formHelper.hasClass(ele, "json-form-ctrl-collapse")) {
                    ele.className = ele.className.replace("json-form-ctrl-collapse", "json-form-ctrl-un-collapse");
                }

                _formHelper.showNextSibling(_formHelper.getParent(ele, "legend"), show);
            } else if (cmd == "aform_array_add_row") {//默认添加行为
                _joinFunction(fnBefore, window, ["aform_array_add_row", table]);//before
                _formHelper.addRow(table);
                _joinFunction(fnAfter, window, ["aform_array_add_row", table]);//after
            } else if (cmd == "aform_array_delete_row") {//默认删除行的行为
                if (!table) {
                    return false;
                }
                if (fnBefore.length) {
                    _joinFunction(fnBefore, window, ["aform_array_delete_row", row]) && _formHelper.removeRow(row);
                }
                else {
                    if (!confirm("确定删除该行吗？")) {
                        return false;
                    }
                    _formHelper.removeRow(row);
                }
                _joinFunction(fnAfter, window, ["aform_array_delete_row", row, table]);//after
            } else {//执行自定义的
                for (var icmd in rowAction) {
                    var item = rowAction[icmd];
                    if (icmd == cmd && typeof item.handler == "function") {
                        var ret = true;
                        if (fnBefore.length) {
                            ret = _joinFunction(fnBefore, window, [icmd, row, table]);
                        }
                        ret && item.handler(row, table, icmd);
                        _joinFunction(fnAfter, window, [icmd, row, table]);//after
                        break;
                    }
                }
            }
        },
        isObjEmpty: function(obj) {
            if (!obj || obj.length) {
                return true;
            }//数组不合法，认为是空
            for (var p in obj) {
                return false;
            }
            return true;
        },
        isInArray: function(key, array) {
            var i = array.length;
            while (i--) {
                if (key == array[i]) {
                    return true;
                }
            }
            return false;
        },
        removeRow: function(row) {
            var tbBody = row.parentNode;
            if (tbBody.rows.length == 1 && !tbBody.tempRow)//若只有一行了，则存储该行为表格的临时行，用于下次表格新增行
            {
                row.cells[0].innerHTML = 0;//起始为0，addRow后，将自增1，之所以设置row的序号为0，而不是clone后再设置，是因为ie对于未在表格中的row取cell会报错
                tbBody.tempRow = row.cloneNode(true);
            }
            tbBody.removeChild(row);
        },
        addRow: function(table) {
            var tbBody = table.tBodies[0];
            if (!tbBody) {
                return false;
            }
            var lastRow = null;
            if (tbBody.rows.length == 0) {
                lastRow = tbBody.tempRow;//若表格存储了临时的行，则使用临时行
            }
            else {
                lastRow = tbBody.rows[tbBody.rows.length - 1];//否则使用最后一行
                if (!lastRow) {
                    return false;
                }
            }
            var newRow = lastRow.cloneNode(true);

            var labels = newRow.getElementsByTagName("label");
            var len = labels.length;

            while (len--) {
                var lb = labels[len];
                var newId = "ele_json_new_" + len + "_" + (new Date().getTime() % 1000000);
                if (lb.htmlFor) {//如果此前有for，才修改for为新值
                    lb.htmlFor = newId;
                }

                var ip = this.getNextSibling(lb);//找到label的input
                if (ip) {
                    ip.readOnly = false;
                    ip.id = newId;//input
                    ip.value = "";//clear
                }
            }

            table.tBodies[0].appendChild(newRow);
            var rowNumber = newRow.cells[0].innerHTML - 0;//行的第一列，序号列，数值+1
            newRow.cells[0].innerHTML = rowNumber + 1;
        },
        trim: function(s) {
            if (typeof s != "string") {
                return s;
            }
            if (s.trim) {
                return s.trim();
            }
            else {
                return s.replace(/(^\s+)|(\s+$)/g, "");
            }
        },
        each: function(array, fn) {
            var len = array.length;
            for (var i = 0; i < len; i++) {
                var ret = fn(array[i], i);
                if (ret === false) {
                    break;
                }
            }
        },
        objEach: function(obj, fn) {
            obj = obj || {};
            for (var p in obj) {
                if (!obj.hasOwnProperty(p)) {
                    continue;
                }

                if (fn(p, obj[p]) === false) {
                    break;
                }
            }
        },
        getObjType: function(obj) {
            if (obj === undefined) {
                return "undefined";
            }
            if (obj === null) {
                return "null";
            }
            if (obj.constructor == Array) {
                return "Array";
            }
            if (obj.constructor == Array) {
                return "Array";
            }
            else if (obj.constructor == Object) {
                return "Object";
            }
            else if (obj.constructor == Number) {
                return "Number";
            }
            else if (obj.constructor == Boolean) {
                return "Boolean";
            }
            else if (obj.constructor == String) {
                return "String";
            }
            else {
                return "unknow";
            }
        },
        extend: function(obj, base) {
            if (!obj) {
                obj = {};
            }
            if (!base) {
                return obj;
            }
            for (var p in base) {
                obj[p] = base[p];
            }

            return obj;
        },
        obj2str: function(obj, sep) {
            var arr = [];
            for (var p in obj) {
                arr.push(p + "=\"" + obj[p] + "\"");
            }
            return arr.join(sep || " ");
        }
    };
    var _h = _formHelper;

    //全局静态函数

    /**
     * @description 创建一个aform实例，和 new 结果一样
     */
    AForm.create = function(arg1, arg2) {
        return new AForm(arg1, arg2);
    };

    /**
     * @description 根据表单id获取一个aform实例，和 new 结果一样
     */
    AForm.get = function(id) {
        return aformInstance[id];
    };

    /**
     * @description 注册输入控件
     * @param {String} name  控件名
     * @param {Object} obj 被继承的控件名或控件定义
     * @param {Object} obj2 控件定义，无继承时无该参数
     */
    AForm.registerControl = function(name, obj, obj2) {
        if (typeof name != "string") {
            _debug("invalid control param");
            return false;
        }

        //未使用继承
        var proto;
        if (typeof obj == "object") {
            proto = obj;
        } else if (typeof obj == "string") {
            //使用了继承方式
            var superName = obj;
            var __super = AForm.Plugin.control[superName].prototype;
            if (!__super) {
                _debug(superName + " not exist");
                return false;
            }

            var t = _h.extend({}, __super);
            obj2 = _h.extend(t, obj2);
            obj2.__super = __super;
            proto = obj2;
        }

        AForm.Plugin.control[name] = function() {
        };
        AForm.Plugin.control[name].prototype = proto;
    };

    /**
     * @description 注册自定义属性
     * @param {String} name  属性名，多个用空格隔开
     * @param {Object} obj 控件定义
     */
    AForm.registerProp = function(name, obj) {
        var name = name.split(/\s+/g);
        _h.each(name, function(n) {
            AForm.Plugin.prop[n] = obj;
        })
    };

    /**
     * @description 注册验证器
     * @param {String} name  控件名
     * @param {Object} obj 控件定义
     */
    AForm.registerValidator = function(name, obj) {
        AForm.Plugin.validator[name] = obj;
    };

    /**
     * @description 注册适配器
     * @param {String} name  控件名
     * @param {Object} obj 控件定义
     */
    AForm.registerAdapter = function(name, obj) {
        AForm.Plugin.adapter[name] = obj;
    };

    //基本属性的注册
    AForm.registerProp("maxlength", {
        beforeRender: function(m, prop, conf) {
            conf.ctrlAttr["maxlength"] = m;
        }
    });
    AForm.registerProp("minlength", {
        beforeRender: function(ml, prop, conf) {
            var tag = "_af_prop_minlength";
            _h.removeArray(conf.validators, function(item) {
                return item._af_source = tag;
            });
            conf.ctrlAttr["minlength"] = ml;
            (conf.validators.push({
                    rule: function(v) {
                        return v.length >= ml;
                    },
                    _af_source: tag,
                    errorMsg: "输入的字符长度需不少于" + ml
                }
            ));
        }
    });
    AForm.registerProp("readonly disabled pattern", {
        beforeRender: function(r, prop, conf) {
            if (r) {
                conf.ctrlAttr[prop] = r;
            } else {
                delete conf.ctrlAttr[prop];
            }
        }
    });
    AForm.registerProp("size title placeholder", {
        beforeRender: function(s, prop, conf) {
            conf.ctrlAttr[prop] = s;
        }
    });
    AForm.registerProp("multiple", {
        beforeRender: function(multiple, prop, conf) {
            (multiple && conf.type == "select") && (conf.ctrlAttr["multiple"] = "multiple");
        }
    });
    AForm.registerProp("required", {
        beforeRender: function(required, prop, conf) {
            required && (conf.ctrlAttr["required"] = "required");
        }
    });

    /* 注册基本渲染器 */
    AForm.registerControl(AFORM_BASIC_PLUGIN, {
        desc: "AForm 基础渲染器",
        render: function(nameOrIndex, input, fieldConfig, renderCount, afObj, jpath, hideLabel) {
            if (fieldConfig.jtype == "Number") {
                return _FormElementFactory.createNumber(input, nameOrIndex, afObj.config, fieldConfig, hideLabel, afObj);
            } else if (fieldConfig.jtype == "String") {
                return _FormElementFactory.createString(input, nameOrIndex, afObj.config, fieldConfig, hideLabel, afObj);
            } else if (fieldConfig.jtype == "Boolean") {
                return _FormElementFactory.createBoolean(input, nameOrIndex, afObj.config, fieldConfig, hideLabel, afObj);
            } else {
                return _FormElementFactory.createString(input, nameOrIndex, afObj.config, fieldConfig, hideLabel, afObj);
            }
        },
        getJsonPartString: function(domEle, fd, af) {
            var controlList = _h.getInput(domEle, af.config.restrict);
            //若仍然无控件，则返回空json
            if (controlList.length == 0) {
                return "\"\":null";
            }

            var l = controlList.length;
            var fieldName = controlList[0].name;
            var jpath = controlList[0].getAttribute("jpath") || domEle.getAttribute("jpath");
            var conf = af.getConfigByPath(jpath);
            var result = [];

            if (fieldName)//若存在字段名，则设为key
            {
                result.push("\"" + fieldName + "\":");
            }

            //获取该字段的value
            var values = [];
            for (var i = 0; i < l; i++) {
                var input = controlList[i];
                var domType = input.type;
                if (domType == "radio" || domType == "checkbox") {
                    if (!input.checked) {
                        continue;
                    }//未勾选，则忽略之，继续下一个input
                }

                if (domType == "select-multiple") {
                    var select = input;
                    var selen = select.length;
                    for (j = 0; j < selen; j++) {
                        if (select.options[j].selected) {
                            values.push(select.options[j].value);
                        }
                    }
                }
                else//文本输入框、radio、checobox等
                {
                    if (conf.needOther) {//若设置了other选项
                        if (_h.hasClass(input, "aform-other-input")) {//若选中了other
                            if (values[values.length - 1] == "__other__") {
                                values[values.length - 1] = (_h.trim(input.value));
                            }
                        } else {
                            values.push(_h.trim(input.value));
                        }
                    } else {
                        values.push(_h.trim(input.value));
                    }
                }
            }

            //处理为空情形
            var tmpValue = values.join('');
            validateInput(af, input, tmpValue, conf, controlList[0]);

            //值适配器处理
            var fnAdpt = function(v) {
                return v;
            };
            if (conf.valueAdapter && typeof conf.valueAdapter.beforeGet == "function") {
                fnAdpt = conf.valueAdapter.beforeGet;
            }

            //把处理后的值推入result
            if (domEle.className.indexOf("json-Boolean") > -1) {
                var tmp = fnAdpt(values.length > 0);
                if (typeof tmp == "string") {
                    tmp = "\"" + tmp + "\"";
                }
                result.push(tmp);//若勾选即为true
            }
            else if (domEle.className.indexOf("json-Number") > -1) {
                var len = values.length;
                for (var i = 0; i < len; i++) {
                    values[i] -= 0;//转换为数字
                }
                result.push(fnAdpt(values.join(conf.delimiter || ',')));
            }
            else {// (domEle.className.indexOf("json-String") > -1) {
                var len = values.length;
                for (var i = 0; i < len; i++) {
                    //过滤不合法的bad control char
                    values[i] = _replaceBadControl(values[i]);
                }

                result.push('"');
                result.push(fnAdpt(values.join(conf.delimiter || ",")));
                result.push('"');
            }

            return result.join("");
        }
    });
    basicControl = new AForm.Plugin.control[AFORM_BASIC_PLUGIN];

    //注册OBJ渲染器
    AForm.registerControl(AFORM_ARR_PLUGIN, {
        desc: "AForm arr渲染器",
        render: function(nameOrIndex, input, fieldConfig, renderCount, afObj, jpath, hideLabel) {
            fieldConfig.rowAction = fieldConfig.rowAction || afObj.config.rowAction;
            if (typeof nameOrIndex == "string") {
                fieldConfig.attr["name"] = nameOrIndex;
            }

            //检测插件，插件优先
            if (fieldConfig.type in AForm.Plugin.control) {
                //插件用固定样式包裹
                return _genPlugin(nameOrIndex, input, afObj, fieldConfig.type, fieldConfig, "", "div");
            }

            var tbId = fieldConfig.ctrlId || ("ele_json_tb_" + AForm.renderCount);
            var me = afObj;
            _eventSetter["click"][tbId] = function(e) {
                _formHelper.exeCmd(e, tbId, fieldConfig.rowAction, me.eventArr.beforeExeCmd, me.eventArr.afterExeCmd);
            };

            var cssText = fieldConfig.cssText;
            if (fieldConfig.hidden) {
                cssText += ";display:none";
            }
            var temp = [];
            temp.push(_s(fieldConfig.frontalHtml));

            temp.push("<table id='" + tbId + "' " + _formHelper.obj2str(fieldConfig.attr) + " style=\"" +
                cssText + "\" class=\"json-form-element json-Array " + AForm.Config.extClassName.table +
                "\">");
            temp.push("<caption style='display:" + (fieldConfig.hideLabel ? "none" : "") + "'>");
            temp.push("<label cmd='aform_array_collapse_table' ");
            if (!fieldConfig.hideCollapser)//若不隐藏折叠器，则展示
            {
                temp.push(" class='json-form-collapser " +
                    (fieldConfig.collapse ? "json-form-ctrl-collapse" : "json-form-ctrl-un-collapse") + "'");
            }
            temp.push(">" + _FormElementFactory.getLabelText(fieldConfig, nameOrIndex) + "</label>");

            if (!fieldConfig.noCreate)//若没禁止添加
            {
                var addRowText = afObj.config.addRowText || "＋";
                temp.push(" <a cmd='aform_array_add_row' style='display:" + (fieldConfig.collapse ? "none" : "") +
                    "' class='json-form-array-add' href='javascript:void(null)'  title='增加一行'>" + addRowText + "</a> ");
            }

            if (fieldConfig.tips && !fieldConfig.noTips) {
                temp.push(fieldConfig.tipsTpl.replace(/\{tips\}/g, fieldConfig.tips));
            }
            temp.push("</caption>");

            var len = input.length;

            //当子元素是object时附加表格标题行
            //若行数大于0且数组元素整齐，则提取标题
            var isRegular = (len > 0 && input[0].constructor == Object);//若第一个元素是Object，则当成元素是统一对象的规则数组
            var attrIndexDisplay = fieldConfig.showArrayNO ? "" : "display:none";

            if (fieldConfig.noDelete) {
                delete fieldConfig.rowAction["aform_array_delete_row"];
            }
            if (fieldConfig.noCreate) {
                delete fieldConfig.rowAction["aform_array_add_row"];
            }

            //仅数组元素为对象且没隐藏表头时才生成表头
            if (isRegular) {
                temp.push("<thead style='display:" + (fieldConfig.collapse || fieldConfig.hideHeader ? "none" : "") +
                    "'><tr>");
                temp.push("<th style='" + attrIndexDisplay + "'>" + AForm.Config.wording.numText + "</th>");
                var firstEle = input[0];

                //对字段排序
                var keyArray = _sortObject(firstEle, fieldConfig.fields);
                //遍历排好序的字段
                for (var i = 0; i < keyArray.length; i++) {
                    var k = keyArray[i];
                    var fieldConf = afObj.getConfigByPath(jpath + "[0]." + k);
                    if (fieldConf.noRender) {
                        continue;
                    }
                    temp.push("<th");
                    if (fieldConf.hidden) {
                        temp.push(" style='display:none'");
                    }
                    if (fieldConf.required) {
                        temp.push(" class='json-form-required'");
                    }
                    temp.push(">");
                    temp.push(_FormElementFactory.getLabelText(fieldConf, k));
                    if (fieldConf && fieldConf.tips) {
                        var tipsTpl = afObj.config.thTipsTpl;//表头的提示
                        temp.push(tipsTpl.replace(/\{tips\}/g, fieldConf.tips));
                    }
                    temp.push("</th>");
                }

                //若操作行为大于0，则建立操作列
                if (!_formHelper.isObjEmpty(fieldConfig.rowAction)) {
                    temp.push("<th class='json-form-action'>" + AForm.Config.wording.oprText + "</th>");
                }
                temp.push("</tr></thead>");
            }

            temp.push("<tbody style='display:" + (fieldConfig.collapse ? "none" : "") + "'>");
            //生成表格的行
            for (var i = 0; i < len; i++) {
                var curEle = input[i];
                var eleType = _formHelper.getObjType(curEle);
                var basicClass = _formHelper.isInArray(eleType, ['String', 'Number', 'Boolean']) ?
                    " json-basic-element" : "";
                temp.push("<tr class='" + basicClass + "json-" + eleType + "'>");

                if (isRegular && curEle.constructor == Object) {
                    temp.push("<td style='" + attrIndexDisplay + "' class='json-form-rowNumber'>" + (i + 1) + "</td>");
                    //对字段排序
                    var keyArray = _sortObject(firstEle, fieldConfig.fields);
                    //遍历排好序的字段
                    for (var ii = 0; ii < keyArray.length; ii++) {
                        var p = keyArray[ii];
                        var fieldConf = afObj.getConfigByPath(jpath + "[0]." + p);
                        if (fieldConf.noRender) {
                            continue;
                        }
                        temp.push("<td");
                        if (fieldConf.hidden) {
                            temp.push(" style='display:none'");
                        }
                        temp.push(">");
                        temp.push(afObj.renderData(curEle[p], p, jpath + "[" + i + "]." + p, true));//隐藏label和tips

                        temp.push("</td>");
                    }
                }
                else {
                    temp.push("<td class='json-form-rowNumber'>" + (i + 1) + "</td><td>");
                    temp.push(afObj.renderData(curEle, i, jpath + "[" + i + "]"));

                    temp.push("</td>");
                }

                //末尾的操作列
                if (!_formHelper.isObjEmpty(fieldConfig.rowAction)) {
                    temp.push("<td class='json-form-actionCell'>");

                    for (var cmd in fieldConfig.rowAction) {
                        var btn = fieldConfig.rowAction[cmd];
                        temp.push("<span class='json-form-action-wrapper' cmd='" + cmd + "'>");
                        temp.push(btn.html.replace(/<(\w)+\s*/g, "<$1 cmd='" + cmd + "' "));
                        temp.push("</span>");
                    }
                    temp.push("</td>");
                }
                temp.push("</tr>");
            }

            temp.push("</tbody>");
            temp.push("</table>");
            temp.push(_s(fieldConfig.extHtml));

            return temp.join('');
        }
    });
    arrControl = new AForm.Plugin.control[AFORM_ARR_PLUGIN];

    //注册OBJ渲染器
    AForm.registerControl(AFORM_OBJ_PLUGIN, {
        desc: "AForm OBJ渲染器",
        render: function(nameOrIndex, input, fieldConfig, renderCount, afObj, jpath) {
            if (typeof nameOrIndex == "string") {
                fieldConfig.attr["name"] = nameOrIndex;
            }

            var cssText = (fieldConfig.cssText || "");

            if (fieldConfig.inline) {
                cssText += ";display:inline-block;*display:inline;*zoom:1";//* ie 6、7 hack
            }
            if (fieldConfig.hidden) {
                cssText += ";display:none";
            }
            if (fieldConfig.width) {
                cssText += ";width:" + fieldConfig.width;
            }

            if (fieldConfig.type in AForm.Plugin.control) {
                //插件用固定样式包裹
                return _genPlugin(nameOrIndex, input, afObj, fieldConfig.type, fieldConfig, cssText, "div");
            }

            if (!nameOrIndex) {
                //fieldConfig.hideCollapser = true;//若是根节点，则隐藏折叠器
                cssText += "border:none";//若是根节点，则隐藏边框
            }

            var fieldsetBegin = ("<" + AForm.Config.tags.objectContainer + " " + _formHelper.obj2str(fieldConfig.attr) +
                " style='" + cssText + "' class='json-form-element json-Object'>");
            var labelCssText = fieldConfig.labelCssText || "";
            labelCssText += ";display:" + (fieldConfig.hideLabel ? "none" : "");
            fieldsetBegin += "<legend style=\"" + labelCssText + "\">";
            fieldsetBegin += "<label  cmd='aform_array_collapse_fieldset' class='json-form-collapser ";
            if (!fieldConfig.hideCollapser)//若不隐藏折叠器，则展示
            {
                var colId = "json_form_collapser_" + AForm.renderCount;
                fieldsetBegin +=
                    (fieldConfig.collapse ? "json-form-ctrl-collapse" : "json-form-ctrl-un-collapse") + "'";
                fieldsetBegin += "id='" + colId + "' >";
                _eventSetter["click"][colId] = function(e) {
                    _formHelper.exeCmd(e);
                };
            } else {
                fieldsetBegin += "' >";
            }
            fieldsetBegin += _FormElementFactory.getLabelText(fieldConfig, nameOrIndex);
            fieldsetBegin += "</label>";
            if (fieldConfig.tips && !fieldConfig.noTips) {
                fieldsetBegin += _genTips(fieldConfig.tipsTpl, fieldConfig)
            }

            fieldsetBegin += "</legend>";
            fieldsetBegin += _s(fieldConfig.frontalHtml);
            fieldsetBegin +=
                "<div class='json-form-fdset' style='display:" + (fieldConfig.collapse ? "none" : "") + "'>";//折叠隐藏
            var fieldsetEnd = "</div></" + AForm.Config.tags.objectContainer + ">";

            var temp = [fieldsetBegin];

            //对字段排序
            var keyArray = _sortObject(input, fieldConfig.fields || {});
            //遍历排好序的字段
            for (var i = 0; i < keyArray.length; i++) {
                var key = keyArray[i];
                temp.push(afObj.renderData(input[key], key, jpath + "." + key));

            }
            temp.push(_s(fieldConfig.extHtml));
            temp.push(fieldsetEnd);

            return temp.join('');
        }
    });
    objControl = new AForm.Plugin.control[AFORM_OBJ_PLUGIN];

    //默认全局渲染器
    AForm.registerControl(AFORM_SYS_PLUGIN, {
        desc: "AForm全局渲染器",
        render: function(nameOrIndex, input, fieldConfig, renderCount, afObj, jpath, hideLabel) {
            var t = _formHelper.getObjType(input);
            var guid = _guid(renderCount);
            var renderRer;
            switch (t) {
                case "Number":
                case "String":
                case "Boolean":
                    fieldConfig.jtype = t;
                    renderRer = basicControl;
                    break;
                case "Object":
                    renderRer = objControl;
                    break;
                case "Array":
                    renderRer = arrControl;
                    break;
            }

            renderRer.guid = guid;
            return renderRer.render(nameOrIndex, input, fieldConfig, AForm.renderCount, afObj, jpath, hideLabel);
        }
    });
    sysControl = new AForm.Plugin.control[AFORM_SYS_PLUGIN];

    var _valueSetter = {};//dom value赋值队列，生命周期为一次render过程，每次render前要reset为空对象
    var _eventSetter = {
        click: {},
        blur: {}
    };//事件赋值队列，生命周期为一次render过程，每次render前要reset为空对象

    //表单元素工厂
    var _FormElementFactory = {
        //获取字段的标签名
        getLabelText: function(fieldConfig, nameOrIndex) {
            if (fieldConfig && fieldConfig.label) {
                return fieldConfig.label.toString();
            }
            else {
                return typeof nameOrIndex == "undefined" ? "" : nameOrIndex;
            }
        },
        generateDatalist: function(list, id) {
            var len = list.length;

            var html = [];
            html.push("<datalist id='" + id + "'>");

            var isTextValue = len > 0 && typeof list[0] == 'object';

            for (var i = 0; i < len; i++) {
                var v = isTextValue ? list[i].value : list[i];
                var t = isTextValue ? list[i].text : list[i];
                html.push("<option label=\"" + _s(t) + "\" value=\"" + _s(v) + "\" />");
            }

            html.push("</datalist>");
            return html.join('');
        },
        generateInputHtml: function(param) {
            param = param || {};
            param.type = param.type || "text";
            var afObj = param.afObj;

            var sDisabled = param.disabled ? "disabled" : "";

            var html = [];

            switch (param.type) {
                case "text":
                default:

                    var listHtml = "";
                    var listId = "list_" + param.id;

                    html.push("<input data-gen='aform' ");
                    if (param.datalist && param.datalist.length > 0) {
                        listHtml = (this.generateDatalist(param.datalist, listId));
                        html.push(" list='" + listId + "'");
                    }
                    html.push(param.attrHtml);
                    html.push(" id='");
                    html.push(param.id + "' type='" + param.type + "' ");//这里是用户传入的type，而不是text，这样可支持html5的类型
                    html.push(param.attrName);
                    html.push(" value=\"" + "" + "\" />");

                    _eventSetter["blur"][param.id] = function(e) {
                        var ip = _h.getTarget(e);
                        _formHelper.validateInput(ip, param, afObj);
                    };
                    //param.value == 0的情况下，会不显示0
                    param.value != "" && (_valueSetter[param.id] = param.value);//使用dom赋值，而不使用字符串拼接方式，避免单引号、双引号等字符转义出问题
                    html.push(listHtml);

                    break;
                case "textarea":

                    html.push("<textarea data-gen='aform' ");
                    html.push(param.attrHtml);
                    html.push(" id='");
                    html.push(param.id + "'");
                    html.push(param.attrName);
                    html.push(">" + param.value + "</textarea>");

                    _eventSetter["blur"][param.id] = function(e) {
                        var ip = _h.getTarget(e);
                        _formHelper.validateInput(ip, param, afObj);
                    };

                    break;
                case "hidden":

                    html.push("<input data-gen='aform' type='hidden' ");
                    html.push(param.attrHtml);
                    html.push(" id='");
                    html.push(param.id + "'");
                    html.push(param.attrName);
                    html.push(" value=\"" + param.value + "\" />");

                    break;
                case "select":

                    html.push("<select data-gen='aform' ");
                    html.push(param.attrHtml);
                    html.push(" id='" + param.id + "' ");
                    html.push(param.attrName);
                    html.push(">");

                    _eventSetter["blur"][param.id] = function(e) {
                        var ip = _h.getTarget(e);
                        _formHelper.validateInput(ip, param, afObj);
                    };

                    var list = param.datalist || [];
                    var len = list.length;

                    var valueArr = param.multiple ?
                        param.value.toString().split(param.delimiter || AForm.Config.defaultDelimiter) : [param.value];

                    for (var i = 0; i < len; i++) {
                        var v = list[i].value == undefined ? list[i] : list[i].value;
                        var t = list[i].text == undefined ? list[i] : list[i].text;

                        if (list[i].group) {
                            html.push("<optgroup label='" + t + "'></optgroup>");
                        }
                        else {
                            html.push("<option " + (_formHelper.isInArray(v.toString(), valueArr) ? "selected" : "") +
                                " value=\"" + v + "\">" + t + "</option>");
                        }
                    }

                    html.push("</select>");
                    break;
                case "radio":

                    html.push("<span ");
                    html.push(param.attrHtml);
                    html.push(" id='" + param.id + "' ");
                    html.push(">");

                    var list = param.datalist;
                    var len = list.length;
                    var isTextValue = len > 0 && typeof list[0] == 'object';
                    var hasChecked = false;//是否radio被选中

                    for (var i = 0; i < len; i++) {
                        var v = isTextValue ? list[i].value : list[i];
                        v = _s(v);
                        var t = isTextValue ? list[i].text : list[i];
                        if (v == param.value) {
                            hasChecked = true;
                        }
                        html.push("<label><input jpath='" + param.jpath + "' data-gen='aform' " + param.attrName + " " +
                            sDisabled +
                            " type='radio' " + (v == param.value ? "checked" : "") + " value=\"" + v +
                            "\" />" + t + "</label>");
                    }
                    if (param.needOther) {
                        var needChecked = !hasChecked && param.value;//若value未被选中，且不为空
                        html.push("<label><input jpath='" + param.jpath +
                            "' class=\"aform-other-radio\" data-gen='aform' " + param.attrName + " " +
                            sDisabled +
                            " type='radio' " + (needChecked ? "checked" : "") + " value=\"__other__\" />其他</label>");
                        html.push("<label><input jpath='" + param.jpath + "' class=\"aform-other-input " +
                            AForm.Config.extClassName.control +
                            "\" data-gen='aform' " + param.attrName + " " + sDisabled +
                            " type='text'  value=\"" + (hasChecked ? "" : param.value) + "\" /></label>");
                    }

                    html.push("</span>");

                    break;
                case "checkbox":

                    html.push("<span ");
                    html.push(param.attrHtml);
                    html.push(" id='" + param.id + "' ");
                    html.push(">");

                    var list = param.datalist || [];
                    var len = list.length;

                    var valueArr = param.value.toString().split(param.delimiter || AForm.Config.defaultDelimiter);

                    for (var i = 0; i < len; i++) {
                        var isO = typeof list[i] == 'object';

                        var v = isO ? list[i].value : list[i];
                        var t = isO ? list[i].text : list[i];
                        var c = isO ? list[i].custom : "";
                        html.push("<label><input jpath='" + param.jpath + "' data-gen='aform' " + param.attrName + " " +
                            sDisabled +
                            " type='checkbox' " + (_formHelper.isInArray(_s(v), valueArr) ? "checked" : "") +
                            " value=\"" + _s(v) + "\" data-custom=\"" + _s(c) + "\" /> " + _s(t) + "</label>");
                    }

                    html.push("</span>");

                    break;
            }

            return html.join('');
        },
        //创建输入控件
        createInputRow: function(param) {
            if (!param.fieldConfig) {
                param.fieldConfig = {};
            }

            var strAttrName = (typeof param.nameOrIndex == "string" ? ("name=" + param.nameOrIndex + "") : "");
            var elementId = param.fieldConfig.ctrlId || ("ele_json_" + AForm.renderCount);
            var labelHtml = "<" + AForm.Config.tags.label + " class='json-field-label " +
                AForm.Config.extClassName.label + " label_" + param.nameOrIndex + "' style='" +
                (param.fieldConfig.labelCssText || "") + ";display:" +
                ((strAttrName == "" || param.hideLabel || param.fieldConfig.hideLabel) ? "none" : "") + "' for='" +
                elementId + "'>";
            if (param.fieldConfig.required && param.globalConfig.requireAtBegin) {
                labelHtml += "<span class='json-form-required'>*</span>";
            }
            labelHtml += this.getLabelText(param.fieldConfig, param.nameOrIndex);
            labelHtml += param.fieldConfig.hideColon ? "" : AForm.Config.wording.labelColon;
            if (param.fieldConfig.required && !param.globalConfig.requireAtBegin) {
                labelHtml += " <span class='json-form-required'>*</span>";
            }
            labelHtml += "</" + AForm.Config.tags.label + ">";

            var cssText = (param.fieldConfig.cssText || "");
            var attr = _h.extend({}, param.fieldConfig.attr);
            var className = "json-form-element json-basic-element json-" + param.dataType + " " +
                AForm.Config.extClassName.basicContainer;

            if (param.fieldConfig.inline) {
                cssText += ";display:inline-block;*display:inline;*zoom:1";//* ie 6、7 hack
                className += " json-form-inline";
            }
            if (param.fieldConfig.hidden) {
                attr.hidden = 'hidden';
                cssText += ";display:none";
            }
            if (param.fieldConfig.jpath) {
                attr["jpath"] = param.fieldConfig.jpath;
            }
            if (param.fieldConfig.width) {
                cssText += ";width:" + param.fieldConfig.width;
            }

            var html = ["<" + AForm.Config.tags.basicContainer + " " + _formHelper.obj2str(attr) + " style='" +
                cssText + "' class='" + className + "'>"];
            html.push(labelHtml);

            if (param.fieldConfig.frontalHtml)//输入控件前的html
            {
                html.push(param.fieldConfig.frontalHtml);
            }
            //公共属性
            var attrHtml = [];
            if (param.fieldConfig.ctrlAttr) {
                attrHtml.push(_formHelper.obj2str(param.fieldConfig.ctrlAttr, " "));
            }
            if (param.fieldConfig.ctrlCssText) {
                attrHtml.push("style='" + param.fieldConfig.ctrlCssText + "'");
            }

            attrHtml.push("class='json-field-input " + AForm.Config.extClassName.control + " " +
                _s(param.fieldConfig.type) + "'");
            attrHtml = attrHtml.join(" ");
            //end 公共属性

            //创建输入元素
            if (param.dataType == "Boolean") {
                html.push("<input " + attrHtml + " id=\"" + elementId + "\" type=\"checkbox\" " +
                    (param.inputData ? "checked" : "") + " " + strAttrName + " />");
            }
            else	// if(param.dataType == "String")
            {
                //先判断是否有插件，有则用插件托管渲染
                if (param.fieldConfig.type in AForm.Plugin.control) {
                    //插件用固定样式包裹
                    html.push(_genPlugin(param.nameOrIndex, param.inputData, param.afObj, param.fieldConfig.type, param.fieldConfig));
                }
                else {
                    if (AForm.Config.tags.controlContainer) {
                        html.push("<" + AForm.Config.tags.controlContainer + " class='" +
                            (AForm.Config.extClassName.controlContainer || '') + "'>");
                    }
                    var arg = _formHelper.extend({}, param.fieldConfig);
                    arg.id = elementId;
                    arg.attrHtml = attrHtml;
                    arg.attrName = strAttrName;
                    arg.value = param.inputData;
                    arg.afObj = param.afObj;
                    html.push(_FormElementFactory.generateInputHtml(arg));
                    if (AForm.Config.tags.controlContainer) {
                        html.push("</" + AForm.Config.tags.controlContainer + ">");
                    }
                }
            }

            if (param.fieldConfig.extHtml)//附加html
            {
                html.push(param.fieldConfig.extHtml);
            }
            if (!param.fieldConfig.noTips && param.fieldConfig.tips)//若未隐藏帮助tips，且tips不为空
            {
                var tipsTpl = param.fieldConfig.tipsTpl || param.globalConfig.tipsTpl;//字段优先
                html.push(_genTips(tipsTpl, param.fieldConfig));
            }
            html.push("</" + AForm.Config.tags.basicContainer + ">");

            if (param.fieldConfig["break"]) {
                html.push('<br style="clear:both">');
            }
            return html.join('');
        },
        createString: function(inputStr, nameOrIndex, globalConfig, fieldConfig, hideLabel, afObj) {
            return this.createInputRow({
                inputData: inputStr,
                dataType: "String",
                nameOrIndex: nameOrIndex,
                globalConfig: globalConfig,
                fieldConfig: fieldConfig,
                hideLabel: hideLabel,
                afObj: afObj
            });
        },
        createNumber: function(inputNumber, nameOrIndex, globalConfig, fieldConfig, hideLabel, afObj) {
            return this.createInputRow({
                inputData: inputNumber,
                dataType: "Number",
                nameOrIndex: nameOrIndex,
                globalConfig: globalConfig,
                fieldConfig: fieldConfig,
                hideLabel: hideLabel,
                afObj: afObj
            });
        },
        createBoolean: function(inputBool, nameOrIndex, globalConfig, fieldConfig, hideLabel, afObj) {
            return this.createInputRow({
                inputData: inputBool,
                dataType: "Boolean",
                nameOrIndex: nameOrIndex,
                globalConfig: globalConfig,
                fieldConfig: fieldConfig,
                hideLabel: hideLabel,
                afObj: afObj
            });
        }
    };

    /**
     * @description aform构造函数
     * @param {String or Object} container  表单容器的domId，或dom节点
     * @param {Object} config 控件定义
     */
    function AForm(container, config) {
        this.container = typeof container == "string" ? _formHelper.$(container) : container;
        if (!this.container) {
            _debug("no container");
            return false;
        }

        AForm.formCount++;
        if (!this.container.id) {
            this.container.id = "aform_" + AForm.formCount + "_" + parseInt(Math.random() * 10000);
        }
        aformInstance[this.container.id] = this;
        this.eventArr = {
            "renderComplete": [],//渲染完后 的回调队列，可以通过on('renderComplete',function) 加入回调队列
            "enter": [],
            "change": [],//表单有输入项修改时
            "beforeExeCmd": [],
            "afterExeCmd": [],
            "valid": [],//字段通过校验时
            "invalid": [],//字段未通过校验时
            "globalInvalid": [],//完整表单数据未通过校验时
            "empty": [] //字段必填但为空时
        };
        this.errors = [];//是否获取数据时存在错误

        //初始化默认配置
        this.config = {
            title: "", //表单的标题
            //使用schema的模式
            // remote - 根据render函数中的数据参数自动生成
            // local - 完全用户定义，由fields决定
            // merge - 把user定义的schema合并到数据生成的schema，亦即若schema有、data无的字段，合并后会有该字段
            schemaMode: "remote",//默认是remote，亦即根据data自动生成
            showArrayNO: true,//是否显示数组元素序号，从1开始
            hideCollapser: false,//隐藏折叠器
            restrict: false,//是否严格模式
            className: "",//容器样式名,
            lazyRenderInterval: 50,//延迟渲染的间隔
            requireAtBegin: false,//必填星号是否在label的前面
            validators: false,//全局验证器
            noValidate: false,//默认开启验证
            breakOnError: true,//当单个字段出错时，中断程序执行流
            readonly: false,//只读模式，若为true，则默认其下所有控件均为只读
            hideColon: false,//不隐藏冒号
            addRowText: AForm.Config.wording.addRowText,
            rowAction: AForm.Config.defaultAction,
            tipsTpl: AForm.Config.tpl.tips,
            thTipsTpl: AForm.Config.tpl.thTips,
            fields: {}				//字段配置，字段名为key
        };

        //合并配置项
        if (typeof config == "object") {
            for (var p in config) {
                //事件处理器
                if (p.substr(0, 2) == "on" && typeof config[p] == "function") {
                    var ep = p.replace(/^on([A-Z])/, function(all, $1) {
                        return $1.toLowerCase()
                    });
                    if (ep in this.eventArr) {
                        this.on(ep, config[p]);
                    }
                }
                else {
                    this.config[p] = config[p];
                }
            }
        }

        _h.addClass(this.container, "aform");
        _h.addClass(this.container, this.config.className);

        this.config.watch = _computeWatch(this.config.watch);
        this.config.validators = _computeValidator(this.config.validators);
        this.config.valueAdapter = _computeAdapter(this.config.valueAdapter);

        //初始化事件
        for (var evt in validateEvt) {
            this.on(evt, validateEvt[evt]);
        }

        this.on("empty", function(input, conf) {
            this.errors.push({
                "errorType": "empty",
                "errorMsg": "请输入" + conf.label,
                "invalidControl": input
            });
        });
        this.on("invalid", function(input, conf, errorMsg) {
            this.errors.push({
                "errorType": "invalid",
                "errorMsg": errorMsg,
                "invalidControl": input
            });
        });
        this.on("globalInvalid", function(msg, input) {
            this.errors.push({
                "errorType": "globalInvalid",
                "errorMsg": msg,
                "invalidControl": input
            });
        });

        //忙指示器
        this.busy = 0;

        //值监听器
        this.on("change", function(jpath, cv, input) {
            _debug(jpath + " changed to : " + cv);
            var obs = this.config.watch[jpath];
            if (!obs) {
                return;
            }
            if (_h.getObjType(obs) != "Array") {
                _debug("watch of " + jpath + " is not array");
                return;
            }

            _h.each(obs, function(fn) {
                fn(cv, input);
            })
        });
        var me = this;
        this.on("renderComplete", function() {
            var d = this.originData;
            for (var jp in this.config.watch) {
                var cv = eval("(d" + jp + ")");
                this.emit("change", [jp , cv]);
            }

            attachMonitor(this.container, function(jpath, cv, input) {
                me.emit("change", [jpath , cv , input]);
            });
        });
    }

    //绑定一个事件
    AForm.prototype.on = function(evtName, handler) {
        if (evtName in this.eventArr) {
            this["eventArr"][evtName].push(handler);
        }
    };

    //解除一个事件
    AForm.prototype.off = function(evtName, handler) {
        if (evtName in this.eventArr) {
            var me = this;
            var newArr = [];
            _h.each(this["eventArr"][evtName], function(item, i) {
                if (item !== handler) {
                    newArr.push(item);
                }
            });

            this["eventArr"][evtName] = newArr;
        }
    };

    //绑定一个事件，执行完毕取消绑定
    AForm.prototype.one = function(evtName, handler) {
        if (evtName in this.eventArr) {
            var len = this["eventArr"][evtName].length;
            var me = this;
            var dstFn = function() {
                me.off(evtName, dstFn);
                handler();
            };
            this["eventArr"][evtName].push(dstFn);
        }
    };

    //发射一个事件
    AForm.prototype.emit = function(evtName, data) {
        _joinFunction(this.eventArr[evtName], this, data);
        if (evtName in validateEvt && evtName != "valid" && this.config.breakOnError) {
            _debug(data);
            throw new Error("invalid data ,reason is " + evtName);
        }
    };

    //重置，相当于用最后一次渲染的数据重新绘制表单，这样既可清除上次渲染之后用户输入的痕迹
    AForm.prototype.reset = function() {
        this.render(this.originData);
    };

    //渲染json数据
    //input 输入的json数据
    AForm.prototype.render = function(input) {
        if (!this.container) {
            return false;
        }

        //计算属性
        for (var p in this.config.fields) {
            this.config.fields[p].name = p;//设置name属性
            _computeProp(this.config.fields[p], this);
        }
        var me = this;

        if (this.busy > 0) {
            setTimeout(function() {
                me.render(input);
            }, this.config.lazyRenderInterval);
            _debug("aform is busy,will rerender after some time");
            return this;
        }

        if (input === undefined || input === null) {
            this.config.schemaMode = "local";//若不传数据，则强制使用本地schema
            if (this.config.jtype == "Array") {
                input = [
                    {}
                ];
            }
        } else {
            //全局数据适配器
            if (this.config.valueAdapter && typeof this.config.valueAdapter.beforeRender == "function") {
                input = this.config.valueAdapter.beforeRender(input);
            }
        }

        switch (this.config.schemaMode) {
            case "local":
                var isArray = _h.getObjType(input) == "Array";
                var localData = _genDefaultData(this.config.fields);
                input = typeof input == "object" ? input : {};

                if (isArray) {
                    var tmpArr = [];
                    for (var i = 0 , len = input.length; i < len; i++) {
                        var tmp = {};

                        for (var p in localData) {
                            tmp[p] = localData[p];//拷贝
                            if (_h.getObjType(input[i]) != "Object") {
                                input[i] = {};
                            }
                            if (p in input[i]) {
                                tmp[p] = input[i][p];
                            }
                        }

                        tmpArr.push(tmp);
                    }
                } else if (!_formHelper.isObjEmpty(input)) {
                    for (var p in localData) {//支持2层深拷贝
                        if (_h.getObjType(localData[p]) == "Object") {
                            for (var pp in localData[p]) {
                                if (_h.getObjType(input[p]) == "Object" && pp in input[p]) {
                                    localData[p][pp] = input[p][pp];
                                }
                            }
                        } else if (_h.getObjType(localData[p]) == "Array") {
                            if (_h.getObjType(input[p]) != "Array") {
                                input[p] = [
                                    {}
                                ];
                            }
                            _h.each(input[p], function(item, i) {
                                localData[p][i] = _h.extend({}, localData[p][0]);
                                for (var pp in localData[p][i]) {
                                    if (_h.getObjType(input[p][i]) == "Object" && pp in input[p][i]) {
                                        localData[p][i][pp] = input[p][i][pp];
                                    }
                                }
                            });
                        } else {
                            if (p in input) {
                                localData[p] = input[p];
                            }
                        }
                    }
                }
                input = isArray ? tmpArr : localData;//数组不变
            default :
                break;
        }

        _valueSetter = {};//渲染前reset
        _eventSetter = {
            click: {},
            blur: {}
        };

        this.originData = input;//最后一次渲染的原始数据
        this.container.innerHTML = this.renderData(this.originData);

        //赋值器
        for (var id in _valueSetter) {
            if (id && _formHelper.$(id)) {
                _formHelper.$(id).value = _valueSetter[id];
            }
        }
        //事件赋值器
        _h.objEach(_eventSetter, function(evtName, idObj) {
            _h.objEach(idObj, function(id, fn) {
                _h.addEvent(_h.$(id), evtName, fn);
            });
        });

        //渲染标题
        var rootEle = this.container.childNodes[0];
        var titleEle = null;
        if (rootEle) {
            if (rootEle.tagName.toLowerCase() == "fieldset") {
                titleEle = rootEle.getElementsByTagName("legend")[0];
            }
            else if (rootEle.tagName.toLowerCase() == "table") {
                titleEle = rootEle.getElementsByTagName("caption")[0].getElementsByTagName("label")[0];
            }
        }

        if (this.config.title)//若设置了标题，则显示，否则隐藏
        {
            titleEle && (titleEle.innerHTML = this.config.title + " " + titleEle.innerHTML);
        }
        else {
            titleEle && (titleEle.style.display = "none");
        }

        //renderComplete
        this.emit("renderComplete");

        if (this.eventArr.enter.length > 0) {
            this.container.onkeyup = function(evt) {
                evt = evt || window.event;
                if (evt.keyCode == 13) {
                    me.emit("enter");
                }
            }
        }
        return this;
    };

    //获取输入空间集合的value，返回json
    AForm.prototype.getJson = function(domEle)//遍历具有
    {
        var result = this.getJsonString();
        var d = eval("(" + result + ")");
        //全局数据适配器，仅对getJson函数有效
        if (d && this.config.valueAdapter && typeof this.config.valueAdapter.beforeGet == "function") {
            d = this.config.valueAdapter.beforeGet(d);
        }

        return d;
    };

    //获取输入空间集合的value，返回json
    AForm.prototype.tryGetJson = function(domEle)//遍历具有
    {
        var result = null;
        try {
            result = this.getJson();
        }
        catch (ex) {
        }
        finally {
            return result;
        }
    };

    //获取输入空间集合的value，返回json字符串
    AForm.prototype.tryGetJsonString = function(domEle)//遍历具有
    {
        var result = null;
        try {
            result = this.getJsonString();
        }
        catch (ex) {
        }
        finally {
            return result;
        }
    };

    //获取输入空间集合的value，返回json
    AForm.prototype.getJsonString = function(domEle)//遍历具有
    {
        var me = this;
        this.errors = [];//reset

        var result = _getJsonString.call(this);
        if (!this.config.noValidate && this.config.validators) {
            var json = eval("(" + result + ")");
            _h.each(this.config.validators, function(item) {
                if (typeof item.rule == "function" && item.rule(json, me.container) !== true &&
                    item.errorMsg !== false) {
                    me.emit("globalInvalid", [item.errorMsg , item.invalidControl]);
                }
            });
        }

        if (this.errors.length > 0) {
            _debug(this.errors);
            throw new Error("get form value has " + this.errors.length + " errors");
        }
        return result;
    };

    //获取输入控件集合的value，返回形如json的字符串
    function _getJsonString(domEle)//遍历
    {
        var me = this;
        domEle = domEle || (this.container ? this.container.childNodes[0] : null);//若未传，则默认为根元素
        if (!domEle) {
            return "";
        }
        var result = [];

        if (_h.hasClass(domEle, "json-field-plugin"))//插件优先
        {
            var guid = domEle.getAttribute("guid");
            var pluginInstance = controlInstance[guid];

            var jpath = domEle.getAttribute("jpath");
            return pluginInstance.getJsonPartString(domEle, this.getConfigByPath(jpath), this);
        }

        var domEleName;
        if (_h.hasClass(domEle, 'json-Object')) {
            domEleName = domEle.getAttribute("name");//ie9需使用getAttribute
            var conf = {};
            if (domEleName) {
                result.push("\"" + domEleName + "\":");
                conf = this.config.fields[domEleName];
            }
            result.push("{");

            var childNodes = [];
            if (domEle.nodeName == 'TR') {
                _formHelper.each(domEle.cells, function(cell) {
                    if (cell.firstChild && cell.firstChild.nodeType == 1 && _h.isFormElement(cell.firstChild)) {
                        childNodes.push(cell.firstChild);
                    }
                });
            }
            else {
                //找到fdset json-form-fdset
                var divs = domEle.childNodes;
                _h.each(divs, function(ele) {
                    if (ele.tagName == "DIV" && ele.className == "json-form-fdset") {
                        childNodes = ele.childNodes;
                        return false;
                    }
                });
            }

            var realNodes = [];
            _h.each(childNodes, function(node, i) {
                _h.isFormElement(node) && realNodes.push(node);
            });

            var len = realNodes.length;
            for (var i = 0; i < len; i++) {
                var node = realNodes[i];
                result.push(_getJsonString.call(this, node));
                if (i < len - 1) {
                    result.push(",");
                }
            }
            result.push("}");
        }
        else if (_h.hasClass(domEle, 'json-Array')) {
            domEleName = domEle.getAttribute("name");
            if (domEleName) {
                result.push("\"" + domEleName + "\":");
            }
            result.push("[");

            var rows = domEle.tBodies.length > 0 ? domEle.tBodies[0].rows : [];//忽略thead
            var len = rows.length;
            _h.each(rows, function(row, i) {
                result.push(_getJsonString.call(me, row));
                if (i < len - 1) {
                    result.push(",");
                }
            });
            result.push("]");
        }
        else if (_h.hasClass(domEle, "json-basic-element")) {
            //先找插件
            var nodes = domEle.childNodes;
            var i = nodes.length;
            while (i--) {
                if (_h.hasClass(nodes[i], "json-field-plugin") && !_h.isIgnore(nodes[i])) {
                    var guid = nodes[i].getAttribute("guid");
                    var pluginInstance = controlInstance[guid];

                    var jpath = domEle.getAttribute("jpath");
                    return pluginInstance.getJsonPartString(nodes[i], this.getConfigByPath(jpath), this);
                }
            }

            //没有插件的话再取值
            return basicControl.getJsonPartString(domEle, null, this);
        }

        result = result.join('');
        return  result;
    }

    //根据path获取字段配置
    AForm.prototype.getConfigByPath = function(path) {
        path = path || "";
        path = path.replace(/\[.+?\]/g, "");//替换掉数组 a[0].b[1] 替换为 a.b
        if (!path) {
            return this.config;
        }//若path为空，取根配置

        var arr = path.split('.');
        var conf = this.config || {};

        for (var i = 0, l = arr.length; i < l; i++) {
            var p = arr[i];
            if (!p) {
                continue;
            }
            if (conf && conf.fields) {
                conf = conf.fields[p];
            } else {
                conf = null;
            }
        }

        //如果无该路径的配置且为自动生成schema，则用第一层的字段作为配置
        if (_formHelper.isObjEmpty(conf) && (this.config.schemaMode == "remote" || !this.config.schemaMode)) {
            conf = this.config.fields[p];
        }

        return conf || {};
    };

    //渲染一项数据
    //@input 输入的数据
    //@nameOrIndex 数据的key名
    //@jpath 当前数据的路径，如数据是{a:{b:1})，此时渲染b，则路径为 “.a.b”
    //@hideLabel 隐藏label
    AForm.prototype.renderData = function(input, nameOrIndex, jpath, hideLabel) {
        var afObj = this;
        jpath = jpath || "";

        if (input == null) {
            return "";//忽略null
        }
        if (input == undefined) {
            input = 'undefined';
        }

        var fieldConfig = this.getConfigByPath(jpath);

        //若不渲染，则忽略之
        if (fieldConfig.noRender) {
            return "";
        }

        //设置属性默认值
        fieldConfig.hideCollapser =
                "hideCollapser" in fieldConfig ? fieldConfig.hideCollapser : this.config.hideCollapser;
        fieldConfig.hideColon = "hideColon" in fieldConfig ? fieldConfig.hideColon : this.config.hideColon;
        fieldConfig.hideLabel = "hideLabel" in fieldConfig ? fieldConfig.hideLabel : this.config.hideLabel;
        fieldConfig.showArrayNO = "showArrayNO" in fieldConfig ? fieldConfig.showArrayNO : this.config.showArrayNO;
        fieldConfig.label = fieldConfig.label || this.config.label || nameOrIndex;//没有则取name or index
        fieldConfig.hideHeader = "hideHeader" in fieldConfig ? fieldConfig.hideHeader : this.config.hideHeader;
        fieldConfig.noCreate = "noCreate" in fieldConfig ? fieldConfig.noCreate : this.config.noCreate;
        fieldConfig.readonly = "readonly" in fieldConfig ? fieldConfig.readonly : this.config.readonly;
        fieldConfig.tipsTpl = "tipsTpl" in fieldConfig ? fieldConfig.tipsTpl : this.config.tipsTpl;
        fieldConfig.validators = fieldConfig.validators || [];
        fieldConfig.attr = fieldConfig.attr || {};//容器属性
        fieldConfig.ctrlAttr = fieldConfig.ctrlAttr || {};//容器内控件属性
        fieldConfig.cssText = fieldConfig.cssText || "";
        fieldConfig.ctrlAttr["jpath"] = jpath;
        fieldConfig.jpath = jpath;

        fieldConfig.validators = _computeValidator(fieldConfig.validators);
        fieldConfig.valueAdapter = _computeAdapter(fieldConfig.valueAdapter);

        //值适配器处理，仅当name_or_index是字符串，即为对象的属性时才可适配，否则返回数组导致无限循环
        if (typeof nameOrIndex == "string" && fieldConfig.valueAdapter &&
            typeof fieldConfig.valueAdapter.beforeRender == "function") {
            var tmp = fieldConfig.valueAdapter.beforeRender(input, nameOrIndex);
            //仅支持基本类型，若返回对象，则get适配器无法生效
            input = tmp;
        }
        AForm.renderCount++;
        return sysControl.render(nameOrIndex, input, fieldConfig, AForm.renderCount, afObj, jpath, hideLabel)
    };

    //undefined或null转为空字符串
    function _s(v) {
        if (v === undefined || v === null) {
            return "";
        }
        return v.toString();
    }

    //生成默认数据
    function _genDefaultData(fields) {
        if (typeof fields !== "object") {
            return undefined;
        }

        var obj = {};
        for (var p in fields) {
            //检测是否有子字段
            if (typeof fields[p].fields == "object") {
                if (fields[p].jtype && fields[p].jtype.toLowerCase() == "array") {
                    obj[p] = [_genDefaultData(fields[p].fields)];//数组
                } else {
                    obj[p] = _genDefaultData(fields[p].fields);//对象
                }
            } else {
                obj[p] = typeof fields[p].defaultValue == "undefined" ? "" : fields[p].defaultValue;
            }
        }

        var result = {};
        var arr = _sortObject(obj, fields);

        for (var i = 0 , len = arr.length; i < len; i++) {
            result[arr[i]] = obj[arr[i]];
        }
        return result;
    }

    //对对象排序，其key被conf设置了顺序，order越大越排前
    function _sortObject(obj, fconf) {
        fconf = fconf || {};

        var arr = [];
        var oo = 0;
        for (var k in obj) {
            oo++;
            arr.push(k);

            if (!fconf[k]) {
                fconf[k] = {};
            }

            fconf[k].oOrder = oo;//保存原顺序，防止不稳定排序
        }

        arr.sort(function(x, y) {
            var order1 = fconf[x] && fconf[x].order ? fconf[x].order : 0;
            var order2 = fconf[y] && fconf[y].order ? fconf[y].order : 0;

            if (order2 - order1 > 0) {
                return 1;
            }
            else if (order2 - order1 == 0) {
                return fconf[x].oOrder - fconf[y].oOrder;
            }
            else {
                return -1;
            }
        });

        return arr;
    }

    //处理验证器
    function _computeValidator(validators) {
        //全局验证器加工
        if ((typeof validators == "object" && "rule" in validators) || typeof validators == "string") {
            validators = [validators];
        }

        _h.each(validators, function(item, i) {
            if (typeof item == "string") {
                //若字符串在验证器中已注册
                if (AForm.Plugin.validator[item]) {
                    validators[i] = AForm.Plugin.validator[item];
                }
            } else if (typeof item == "object" && typeof item.rule == "string" && item.rule.length > 2) {
                item.rule = new Function("$v", "$ctrl", "return " + item.rule);
            }
        });

        return validators;
    }

    //处理监听器
    function _computeWatch(w) {
        w = w || {};
        return w;
    }

    //处理适配器
    function _computeAdapter(adpt) {
        //全局验证器加工
        if (typeof adpt == "string") {
            adpt = AForm.Plugin.adapter[adpt];
        }

        return adpt;
    }

    //校验输入项
    function validateInput(af, input, tmpValue, conf, firstInput) {
        //若不需验证，直接返回
        if (af.config.noValidate) {
            return true;
        }

        var invalid = false;
        firstInput = firstInput || input;//当有多个选项时，为空时聚焦到第一个选项
        if (!af.config.noValidate && conf.required && (tmpValue == "")) {
            invalid = true;
            af.emit("empty", [firstInput, conf]);
        }
        //处理非法情形
        if (!af.config.noValidate && tmpValue != "" && conf.pattern &&
            !new RegExp("^" + conf.pattern + "$", "i").test(tmpValue)) {
            invalid = true;
            af.emit("invalid", [input, conf, conf.patternErrorMsg || ""]);
        }
        //处理规则校验
        if (!af.config.noValidate && tmpValue != "" && conf.validators) {
            _h.each(conf.validators, function(item, i) {
                if (typeof item.rule == "function" && item.rule(tmpValue, input) !== true) {
                    if (item.errorMsg !== false) {
                        invalid = true;
                        af.emit("invalid", [input, conf, item.errorMsg]);
                    }
                }
            });
        }

        if (!invalid) {
            af.emit("valid", [input]);
        }
    }

    //处理自定义属性
    function _computeProp(fd, af) {
        if (!fd || typeof fd !== "object") {//防止重复计算
            return;
        }
        for (var prop in fd) {

            if (!(prop in AForm.Plugin.prop)) {
                continue;
            }

            fd.ctrlAttr = fd.ctrlAttr || {};
            fd.validators = fd.validators || [];
            fd.attr = fd.attr || {};
            fd.style = fd.style || {};
            fd.ctrlStyle = fd.ctrlStyle || {};

            var propObj = AForm.Plugin.prop[prop];
            propObj.beforeRender && propObj.beforeRender(fd[prop], prop, fd, af);
        }
        //递归
        if (fd.fields) {
            for (var p in fd.fields) {
                _computeProp(fd.fields[p], af);
            }
        }
    }

    //执行函数队列
    function _joinFunction(fnArr, caller, arg) {
        var ret = true;
        for (var i = 0; i < fnArr.length; i++) {
            if (arg === undefined) {
                ret = fnArr[i].apply(caller);
            }
            else {
                ret = fnArr[i].apply(caller, arg);
            }
        }
        return ret;
    }

    //生成tips
    function _genTips(tipsTpl, fd) {
        var ret = tipsTpl.replace(/\{tips\}/g, _s(fd.tips));
        ret = ret.replace(/\{tipsCssText\}/g, _s(fd.tipsCssText));
        return ret;
    }

    //生成guid
    function _guid(i, t) {
        return "ctrl_" + _s(t) + "_" + i + "_" + parseInt(Math.random() * 100000);
    }

    function _genPlugin(nameOrIndex, inputData, afObj, type, fd, cssText, tag) {
        var guid = _guid(AForm.renderCount, type);
        controlInstance[guid] = new AForm.Plugin.control[type];

        var thisPlugin = controlInstance[guid];
        var tagName = thisPlugin.tagName || (tag || "span");
        var html = "";
        html += ("<" + tagName + " guid=\"" + guid + "\" style=\"" + _s(cssText || fd.ctrlCssText) + "\" type=\"" +
            type + "\" class=\"json-field-plugin " + type + " \">");
        html += (thisPlugin.render(nameOrIndex, inputData, fd, AForm.renderCount, afObj, fd.jpath));
        html += ("</" + tagName + ">");

        return html;
    }

    //监听表单所有字段的的修改事件
    function attachMonitor(container, fn) {
        //监听radio、checkbox的点击事件
        _h.addEvent(container, "click", function(e) {
            var target = _h.getTarget(e);
            //若不是表单字段，则忽略
            var jpath = target.getAttribute("jpath");
            if ((target.type !== "radio" && target.type !== "checkbox") || !jpath) {
                return;//不能return false，因在ie低版本下会禁止浏览器默认事件
            }

            fn(jpath, target.value, target);
        });

        //监听onchange事件
        var ie = _h.isIE();
        var ips = [];
        if (ie && ie < 9) {
            ips = _h.getInput(container, false);
        } else {
            //当通过冒泡绑定时，避免重复绑定
            if (!(container.getAttribute("data-monitor"))) {
                ips = [container];
            }
        }

        _h.each(ips, function(ipt) {
            if (ipt.type && !(ipt.getAttribute("jpath"))) {
                return;
            }
            ipt.setAttribute("data-monitor", true);
            _h.addEvent(ipt, "change", function(e) {
                var target = _h.getTarget(e);
                //若不是表单字段，则忽略
                var jpath = target.getAttribute("jpath");
                if (!jpath) {
                    return false;
                }

                fn(jpath, target.value, target);
            });
        });

    }

    //输出
    function _debug(msg) {
        if (typeof console == "undefined" || typeof console.log == "undefined") {
            return false;
        }
        else {
            console.log(msg);
        }
    }

    //过滤不合法的bad control char
    function _replaceBadControl(v) {
        v = v.replace(/\\/g, "\\\\");//反斜杠
        v = v.replace(/"/g, "\\\"");//双引号
        v = v.replace(/\n/g, "\\n");//回车符
        v = v.replace(/\t/g, "\\t");//tab符

        return v;
    }

    //导出
    if (typeof module === "object" && module.exports) {
        module.exports = AForm;
    }
    else if (typeof define === "function" && (define.amd || define.fmd)) {
        define("aform", [], function() {
            return AForm;
        });
    }

    if (typeof window !== "undefined") {
        window.AForm = AForm;
    }
})();
