/*!
 * AForm v1.1
 * Copyright 2014, 谢慧琦
 * Date: 2014年5月10日
 */

;(function() {
    //初始化
    if (typeof AFormPlugin == "undefined") {
        AFormPlugin = {
            control: {}
        };
    }

    //已渲染单元数量，静态成员初始化
    AForm.renderCount = 0;
    var _valueSetter = {};//dom value赋值队列，生命周期为一次render过程，每次render前要reset为空对象
    var _onchangeSetter = {};//事件赋值队列，生命周期为一次render过程，每次render前要reset为空对象
    var _onclickSetter = {};//事件赋值队列，生命周期为一次render过程，每次render前要reset为空对象

    //helper
    var _formHelper = {
        $: function (id) {
            return document.getElementById(id);
        },
        hasClass: function (ele, clsName) {
            return (" " + ele.className).indexOf(" " + clsName) > -1;
        },
        addClass: function (ele, clsName) {
            if (!ele.className) {
                ele.className = clsName;
            }
            else if (!_formHelper.hasClass(ele, clsName)) {
                ele.className += " " + clsName;
            }
        },
        onValueChange: function (input, conf) {
            this.addClass(input, "json-form-dirty");
            this.validateInput(input, conf);
        },
        validateInput: function (input, conf)//用于验证输入控件的value
        {
            var v = input.value;
            if (v == "" && input.getAttribute("required") != null) {
                AFormConfig.fn.onEmpty(input, conf);
                return false;
            }
            if (v != "" && input.getAttribute("pattern") && !new RegExp("^" + input.getAttribute("pattern") + "$", "i").test(input.value)) {
                AFormConfig.fn.onInvalid(input, conf);
                return false;
            }

            return true;
        },
        getParent: function (ele, ptag) {
            ptag = ptag.toUpperCase();
            var p = ele.parentNode;
            while (p && p.tagName != ptag) {
                p = p.parentNode;
            }

            return p;
        },
        getNextSibling: function (n) {
            var x = n.nextSibling;
            while (x && x.nodeType != 1) {
                x = x.nextSibling;
            }
            return x;
        },
        showNextSibling: function (ele, visible) {
            var n = this.getNextSibling(ele);
            while (n) {
                var isHidden = n.getAttribute("hidden") != null;//兼容html5的hidden属性
                n.style.display = isHidden ? "none" : (visible ? "" : "none");
                n = this.getNextSibling(n);
            }
        },
        exeCmd: function (e, tbid, rowAction) {
            e = e || event;
            var ele = e.srcElement ? e.srcElement : e.target;
            var cmd = ele.getAttribute("cmd");
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
                if (typeof fnBefore == "function") {
                    fnBefore("aform_array_add_row", table) && _formHelper.addRow(table);
                } else {
                    _formHelper.addRow(table);
                }
            } else if (cmd == "aform_array_delete_row") {//默认删除行的行为
                if (!table)return false;
                if (typeof fnBefore == "function") {
                    fnBefore("aform_array_delete_row", row) && _formHelper.removeRow(row);
                }
                else {
                    if (!confirm("确定删除该行吗？"))return false;
                    _formHelper.removeRow(row);
                }
            } else {//执行自定义的
                for (var icmd in rowAction) {
                    var item = rowAction[icmd];
                    if (icmd == cmd && typeof item.handler == "function") {
                        item.handler(row, table, icmd);
                        break;
                    }
                }
            }
        },
        isObjEmpty: function (obj) {
            if (!obj || obj.length)return true;//数组不合法，认为是空
            for (var p in obj) {
                return false;
            }
            return true;
        },
        isInArray: function (key, array) {
            var i = array.length;
            while (i--) {
                if (key == array[i])return true;
            }
            return false;
        },
        removeRow: function (row) {
            var tbBody = row.parentNode;
            if (tbBody.rows.length == 1 && !tbBody.tempRow)//若只有一行了，则存储该行为表格的临时行，用于下次表格新增行
            {
                row.cells[0].innerHTML = 0;//起始为0，addRow后，将自增1，之所以设置row的序号为0，而不是clone后再设置，是因为ie对于未在表格中的row取cell会报错
                tbBody.tempRow = row.cloneNode(true);
            }
            tbBody.removeChild(row);
        },
        addRow: function (table) {
            var tbBody = table.tBodies[0];
            if (!tbBody)return false;
            var lastRow = null;
            if (tbBody.rows.length == 0) {
                lastRow = tbBody.tempRow;//若表格存储了临时的行，则使用临时行
            }
            else {
                lastRow = tbBody.rows[tbBody.rows.length - 1];//否则使用最后一行
                if (!lastRow)return false;
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
        each: function (array, fn) {
            var len = array.length;
            for (var i = 0; i < len; i++) {
                var ret = fn(array[i], i);
                if (ret === false)break;
            }
        },
        getObjType: function (obj) {
            if (obj.constructor == Array)return "Array";
            else if (obj.constructor == Object)return "Object";
            else if (obj.constructor == Number)return "Number";
            else if (obj.constructor == Boolean)return "Boolean";
            else if (obj.constructor == String)return "String";
            else return "unknow";
        }
    };

    //表单元素工厂
    var _FormElementFactory = {
        //获取字段的标签名
        getLabelText: function (fieldConfig, name_or_index) {
            if (fieldConfig && fieldConfig.label) {
                return fieldConfig.label.toString();
            }
            else return typeof name_or_index == "undefined" ? "" : name_or_index;
        },
        generateDatalist: function (list, id) {
            var len = list.length;

            var html = [];
            html.push("<datalist id='" + id + "'>");

            var isTextValue = len > 0 && typeof list[0] == 'object';

            for (var i = 0; i < len; i++) {
                var v = isTextValue ? list[i].value : list[i];
                html.push("<option value=\"" + v + "\" />");
            }

            html.push("</datalist>");
            return html.join('');
        },
        generateInputHtml: function (param) {
            param = param || {};
            param.type = param.type || "text";

            var html = [];

            switch (param.type) {
                case "text":
                default:

                    var listHtml = "";
                    var listId = "list_" + param.id;
                    var attrList = "";

                    html.push("<input ");
                    if (param.datalist && param.datalist.length > 0) {
                        listHtml = (this.generateDatalist(param.datalist, listId));
                        html.push(" list='" + listId + "'");
                    }
                    html.push(param.attrHtml);
                    html.push(" id='");
                    html.push(param.id + "' type='" + param.type + "' ");//这里是用户传入的type，而不是text，这样可支持html5的类型
                    html.push(param.attrName);
                    html.push(" value=\"" + "" + "\" />");

                    _onchangeSetter[param.id] = function () {
                        _formHelper.onValueChange(this, param)
                    };
                    param.value != "" && (_valueSetter[param.id] = param.value);//使用dom赋值，而不使用字符串拼接方式，避免单引号、双引号等字符转义出问题
                    html.push(listHtml);

                    break;
                case "textarea":

                    html.push("<textarea ");
                    html.push(param.attrHtml);
                    html.push(" id='");
                    html.push(param.id + "'");
                    html.push(param.attrName);
                    html.push(">" + param.value + "</textarea>");

                    _onchangeSetter[param.id] = function () {
                        _formHelper.onValueChange(this, param)
                    };

                    break;
                case "hidden":

                    html.push("<input type='hidden' ");
                    html.push(param.attrHtml);
                    html.push(" id='");
                    html.push(param.id + "'");
                    html.push(param.attrName);
                    html.push(" value=\"" + param.value + "\" />");

                    break;
                case "select":

                    html.push("<select ");
                    html.push(param.attrHtml);
                    html.push(" id='" + param.id + "' ");
                    html.push(param.attrName);
                    html.push(">");

                    var list = param.datalist || [];
                    var len = list.length;

                    var valueArr = param.multiple ? param.value.toString().split(param.delimiter || AFormConfig.defaultDelimiter) : [param.value];

                    for (var i = 0; i < len; i++) {
                        var v = list[i].value == undefined ? list[i] : list[i].value;
                        var t = list[i].text == undefined ? list[i] : list[i].text;

                        if (list[i].group) {
                            html.push("<optgroup label='" + t + "'></optgroup>");
                        }
                        else {
                            html.push("<option " + (_formHelper.isInArray(v.toString(), valueArr) ? "selected" : "") + " value=\"" + v + "\">" + t + "</option>");
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

                    for (var i = 0; i < len; i++) {
                        var v = isTextValue ? list[i].value : list[i];
                        var t = isTextValue ? list[i].text : list[i];
                        html.push("<label><input " + param.attrName + " type='radio' " + (v.toString() == param.value ? "checked" : "") + " value=\"" + v + "\" />" + t + "</label>");
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
                    var isTextValue = len > 0 && typeof list[0] == 'object';

                    var valueArr = param.value.toString().split(param.delimiter || AFormConfig.defaultDelimiter);

                    for (var i = 0; i < len; i++) {
                        var v = isTextValue ? list[i].value : list[i];
                        var t = isTextValue ? list[i].text : list[i];
                        html.push("<label><input " + param.attrName + " type='checkbox' " + (_formHelper.isInArray(v.toString(), valueArr) ? "checked" : "") + " value=\"" + v + "\" />" + t + "</label>");
                    }

                    html.push("</span>");

                    break;
            }

            return html.join('');
        },
        //创建输入控件
        createInputRow: function (param) {
            if (!param.fieldConfig)param.fieldConfig = {};

            var strAttrName = (typeof param.name_or_index == "string" ? ("name=" + param.name_or_index + "") : "");
            var elementId = param.fieldConfig.ctrlId || ("ele_json_" + AForm.renderCount);
            var labelHtml = "<" + AFormConfig.tags.label + " class='json-field-label " + AFormConfig.extClassName.label + " label_" + param.name_or_index + "' style='" + (param.fieldConfig.labelCssText || "") + ";display:" + ((strAttrName == "" || param.hideLabel || param.fieldConfig.hideLabel) ? "none" : "") + "' for='" + elementId + "'>";
            labelHtml += this.getLabelText(param.fieldConfig, param.name_or_index);
            labelHtml += param.fieldConfig.hideColon ? "" : AFormConfig.wording.labelColon;
            if (param.fieldConfig.required) {
                labelHtml += "<span class='json-form-required'>*</span>";
            }
            labelHtml += "</" + AFormConfig.tags.label + ">";

            var cssText = (param.fieldConfig.cssText || "");
            var attr = (param.fieldConfig.attr || "");
            var className = "json-form-element json-basic-element json-" + param.dataType + " " + AFormConfig.extClassName.basicContainer;

            if (param.fieldConfig.inline) {
                cssText += ";display:inline-block;*display:inline;*zoom:1";//* ie 6、7 hack
                className += " json-form-inline";
            }
            if (param.fieldConfig.hidden) {
                attr += " hidden='hidden'";
                cssText += ";display:none";
            }
            if (param.fieldConfig.jpath) {
                attr += " jpath='" + param.fieldConfig.jpath + "'";
            }
            if (param.fieldConfig.width) {
                cssText += ";width:" + param.fieldConfig.width;
            }

            var html = ["<" + AFormConfig.tags.basicContainer + " " + attr + " style='" + cssText + "' class='" + className + "'>"];
            html.push(labelHtml);

            if (param.fieldConfig.frontalHtml)//输入控件前的html
            {
                html.push(param.fieldConfig.frontalHtml);
            }
            //公共属性
            var attrHtml = [];
            if (param.fieldConfig.ctrlAttr) {
                for (var p in param.fieldConfig.ctrlAttr) {
                    attrHtml.push(p + "=\"" + param.fieldConfig.ctrlAttr[p] + "\"");
                }
            }
            if (param.fieldConfig.required) {
                attrHtml.push("required");
            }
            if (param.fieldConfig.readonly) {
                attrHtml.push("readonly");
            }
            if (param.fieldConfig.disabled) {
                attrHtml.push("disabled");
            }
            if (param.fieldConfig.maxlength) {
                attrHtml.push("maxlength='" + param.fieldConfig.maxlength + "'");
            }
            if (param.fieldConfig.ctrlCssText) {
                attrHtml.push("style='" + param.fieldConfig.ctrlCssText + "'");
            }
            if (param.fieldConfig.pattern) {
                attrHtml.push("pattern='" + param.fieldConfig.pattern + "'");
            }
            if (param.fieldConfig.size) {
                attrHtml.push("size='" + param.fieldConfig.size + "'");
            }
            if (param.fieldConfig.type == 'select' && param.fieldConfig.multiple) {
                attrHtml.push("multiple='multiple'");
            }
            if (param.fieldConfig.title) {
                attrHtml.push("title='" + param.fieldConfig.title + "'");
            }
            if (param.fieldConfig.placeholder) {
                attrHtml.push("placeholder='" + param.fieldConfig.placeholder + "'");
            }
            attrHtml.push("class='json-field-input " + AFormConfig.extClassName.control + "'");
            attrHtml = attrHtml.join(' ');
            //end 公共属性

            //创建输入元素
            if (param.dataType == "Boolean") {
                html.push("<input " + attrHtml + " id=\"" + elementId + "\" type=\"checkbox\" " + (param.inputData ? "checked" : "") + " " + strAttrName + " />");
            }
            else	// if(param.dataType == "String")
            {
                //先判断是否有插件，有则用插件托管渲染
                if (param.fieldConfig.type in AFormPlugin.control) {
                    //插件用固定样式包裹
                    html.push("<span type=\"" + param.fieldConfig.type + "\" class=\"json-field-plugin\">");
                    html.push(AFormPlugin.control[param.fieldConfig.type].render(param.name_or_index, param.inputData, param.fieldConfig, AForm.renderCount));
                    html.push("</span>");
                }
                else {
                    if (AFormConfig.tags.controlContainer)html.push("<" + AFormConfig.tags.controlContainer + " class='" + (AFormConfig.extClassName.controlContainer || '') + "'>");
                    html.push(_FormElementFactory.generateInputHtml({
                        "type": param.fieldConfig.type,//text,textarea,select,checkbox,radio,hidden 或者其他无法预期的类型，如type、mail、date等html5新增属性
                        "datalist": param.fieldConfig.datalist,
                        "attrHtml": attrHtml,
                        "multiple": param.fieldConfig.multiple,
                        "delimiter": param.fieldConfig.delimiter,
                        "id": elementId,
                        "label": param.fieldConfig.label,
                        "attrName": strAttrName,
                        "value": param.inputData
                    }));
                    if (AFormConfig.tags.controlContainer)html.push("</" + AFormConfig.tags.controlContainer + ">");
                }
            }

            if (param.fieldConfig.extHtml)//附加html
            {
                html.push(param.fieldConfig.extHtml);
            }
            if (!param.fieldConfig.noTips && param.fieldConfig.tips)//若未隐藏帮助tips，且tips不为空
            {
                var tipsTpl = param.fieldConfig.tipsTpl || param.globalConfig.tipsTpl;//字段优先
                html.push(tipsTpl.replace(/\{tips\}/g, param.fieldConfig.tips));
            }
            html.push("</" + AFormConfig.tags.basicContainer + ">");

            return html.join('');
        },
        createString: function (inputStr, name_or_index, globalConfig, fieldConfig, hideLabel) {
            return this.createInputRow({
                inputData: inputStr,
                dataType: "String",
                name_or_index: name_or_index,
                globalConfig: globalConfig,
                fieldConfig: fieldConfig,
                hideLabel: hideLabel
            });
        },
        createNumber: function (inputNumber, name_or_index, globalConfig, fieldConfig, hideLabel) {
            return this.createInputRow({
                inputData: inputNumber,
                dataType: "Number",
                name_or_index: name_or_index,
                globalConfig: globalConfig,
                fieldConfig: fieldConfig,
                hideLabel: hideLabel
            });
        },
        createBoolean: function (inputBool, name_or_index, globalConfig, fieldConfig, hideLabel) {
            return this.createInputRow({
                inputData: inputBool,
                dataType: "Boolean",
                name_or_index: name_or_index,
                globalConfig: globalConfig,
                fieldConfig: fieldConfig,
                hideLabel: hideLabel
            });
        }
    };

    //构造函数
    //param container dom元素或其id
    //param config 配置对象，json格式
    //return void
    function AForm(container, config) {

        this.container = typeof container == "string" ? _formHelper.$(container) : container;

        //初始化默认配置
        this.config = {
            title: "", //表单的标题
            //使用schema的模式
            // remote - 根据render函数中的数据参数自动生成
            // local - 完全用户定义，由fields决定
            // merge - 把user定义的schema合并到数据生成的schema，亦即若schema有、data无的字段，合并后会有该字段
            schemaMode: "remote",//默认是remote，亦即根据data自动生成
            showArrayNO: true,//是否显示数组元素序号，从1开始
            hideCollapser: false,
            validators: false,//全局验证器
            readonly: false,//只读模式，若为true，则默认其下所有控件均为只读
            hideColon: false,//不隐藏冒号
            addRowText: AFormConfig.wording.addRowText,
            rowAction: AFormConfig.defaultAction,
            tipsTpl: AFormConfig.tpl.tips,
            thTipsTpl: AFormConfig.tpl.thTips,
            fields: {}				//字段配置，字段名为key
        };

        var eveFn = {
            //当渲染完毕做什么
            "onRenderComplete": null,
            //当回车时做什么
            "onEnter": null,
            //执行命令前的动作
            "onBeforeExeCmd": null
        };

        //合并配置项
        if (typeof config == "object") {
            for (var p in config) {
                if (p in eveFn && typeof config[p] == "function") {
                    this[p] = config[p];
                }
                else {
                    this.config[p] = config[p];
                }
            }
        }

        //全局验证器加工
        if (typeof this.config.validators == "object" && "rule" in this.config.validators) {
            this.config.validators = [this.config.validators];
        }

        for (var i = 0; i < this.config.validators.length; i++) {
            var item = this.config.validators[i];
            if (typeof item.rule == "string" && item.rule.length > 2) {
                item.rule = new Function("$v", "$ctrl", "return " + item.rule);
            }
        }
    }

    AForm.prototype.onRenderComplete = null;
    AForm.prototype.onBeforeExeCmd = null;
    AForm.prototype.onEnter = null

    //渲染json数据
    //input 输入的json数据
    AForm.prototype.render = function (input) {
        if (input == undefined) {
            this.config.schemaMode = "local";//若不传数据，则强制使用本地schema
        }

        var localData = {};
        switch (this.config.schemaMode) {
            case "local":
                var isArray = input instanceof Array;
                var localData = _genDefaultData(this.config.fields);
                input = typeof input == "object" ? input : {};

                if (isArray) {
                    var tmpArr = [];
                    for (var i = 0 , len = input.length; i < len; i++) {
                        var tmp = {};

                        for (var p in localData) {
                            tmp[p] = localData[p];//拷贝
                            if (p in input[i]) {
                                tmp[p] = input[i][p];
                            }
                        }

                        tmpArr.push(tmp);
                    }
                } else {
                    for (var p in localData) {
                        if (p in input) {
                            localData[p] = input[p];
                        }
                    }
                }
                input = isArray ? tmpArr : localData;//数组不变
                break;
            default :
                break;
        }

        _valueSetter = {};//渲染前reset
        _onchangeSetter = {};
        _onclickSetter = {};

        this.container.innerHTML = this.renderData(input);

        //赋值器
        for (var id in _valueSetter) {
            if (id && _formHelper.$(id)) {
                _formHelper.$(id).value = _valueSetter[id];
            }
        }
        //事件onchange赋值器
        for (var id in _onchangeSetter) {
            if (id && _formHelper.$(id)) {
                _formHelper.$(id).onchange = _onchangeSetter[id];
            }
        }
        //事件onclick赋值器
        for (var id in _onclickSetter) {
            if (id && _formHelper.$(id)) {
                _formHelper.$(id).onclick = _onclickSetter[id];
            }
        }

        //渲染标题
        var rootEle = this.container.childNodes[0];
        var titleEle = null;
        if (rootEle.tagName.toLowerCase() == "fieldset") {
            titleEle = rootEle.getElementsByTagName("legend")[0];
        }
        else if (rootEle.tagName.toLowerCase() == "table") {
            titleEle = rootEle.getElementsByTagName("caption")[0].getElementsByTagName("label")[0];
        }

        if (this.config.title)//若设置了标题，则显示，否则隐藏
        {
            titleEle && (titleEle.innerHTML = this.config.title + " " + titleEle.innerHTML);
        }
        else {
            titleEle && (titleEle.style.display = "none");
        }

        //事件渲染
        if (typeof this.onRenderComplete == "function") {
            this.onRenderComplete();
        }
        if (typeof this.onEnter == "function") {
            var me = this;
            this.container.onkeyup = function (evt) {
                evt = evt || window.event;
                if (evt.keyCode == 13) {
                    me.onEnter();
                }
            }
        }
        return this;
    };


    //获取输入空间集合的value，返回json
    AForm.prototype.getJson = function (domEle)//遍历具有
    {
        var result = this.getJsonString();
        return eval("(" + result + ")");
    };

    //获取输入空间集合的value，返回json
    AForm.prototype.tryGetJson = function (domEle)//遍历具有
    {
        var result = null;
        try {
            result = eval("(" + this.getJsonString() + ")");
        }
        catch (ex) {
            ;
        }
        finally {
            return result;
        }
    };

    //获取输入空间集合的value，返回json
    AForm.prototype.getJsonString = function (domEle)//遍历具有
    {
        var result = _getJsonString.call(this);
        if (this.config.validators) {
            var json = eval("(" + result + ")");
            for (var i = 0; i < this.config.validators.length; i++) {
                var item = this.config.validators[i];
                if (typeof item.rule == "function" && item.rule(json, this.container) !== true) {
                    if (item.errorMsg !== false) {
                        AFormConfig.fn.onGlobalInvalid(item.errorMsg);
                    }
                    throw new Error("invalid value , not match global rule " + item.errorMsg);
                }
            }
        }
        return result;
    };

    //全局静态函数
    // 注册一个输入控件
    //obj {render  , getJsonPartString}
    AForm.registerControl = function (name, obj) {
        AFormPlugin.control[name] = obj;
    };

    //获取输入控件集合的value，返回形如json的字符串
    function _getJsonString(domEle)//遍历
    {
        domEle = domEle || this.container.childNodes[0];//若未传，则默认为根元素
        var result = [];

        if (domEle.className.indexOf("json-field-plugin") > -1)//插件优先
        {
            var pluginName = domEle.getAttribute("type");
            var pluginInstance = AFormPlugin.control[pluginName];
            return pluginInstance.getJsonPartString(domEle);
        }

        if (domEle.className.indexOf('json-Object') > -1) {
            domEleName = domEle.getAttribute("name");//ie9需使用getAttribute
            var conf = {};
            if (domEleName) {
                result.push("\"" + domEleName + "\":");
                conf = this.config.fields[domEleName];
            }
            result.push("{");

            var childNodes = [];
            if (domEle.nodeName == 'TR') {
                _formHelper.each(domEle.cells, function (cell) {
                    if (cell.firstChild && cell.firstChild.nodeType == 1 && cell.firstChild.className.indexOf("json-form-element") > -1) {
                        childNodes.push(cell.firstChild);
                    }
                });
            }
            else {
                childNodes = domEle.getElementsByTagName("div")[0].childNodes;//fieldset下第一个div的子元素
            }

            var len = childNodes.length;
            for (var i = 0; i < len; i++) {
                var node = childNodes[i];
                if (node.className.indexOf('json-form-element') > -1) {
                    result.push(_getJsonString.call(this, node));
                    if (i < len - 1)result.push(",");
                }
            }
            result.push("}");
        }
        else if (domEle.className.indexOf('json-Array') > -1) {
            domEleName = domEle.getAttribute("name");
            if (domEleName) {
                result.push("\"" + domEleName + "\":");
            }
            result.push("[");

            var rows = domEle.tBodies.length > 0 ? domEle.tBodies[0].rows : [];//忽略thead
            var len = rows.length;
            for (var i = 0; i < len; i++)//
            {
                var row = rows[i];
                result.push(_getJsonString.call(this, row));
                if (i < len - 1)result.push(",");
            }
            result.push("]");
        }
        else if (domEle.className.indexOf("json-basic-element") > -1) {
            //先找插件
            var nodes = domEle.childNodes;
            var i = nodes.length;
            while (i--) {
                if (nodes[i].className && nodes[i].className.indexOf("json-field-plugin") > -1) {
                    var pluginName = nodes[i].getAttribute("type");
                    var pluginInstance = AFormPlugin.control[pluginName];
                    return pluginInstance.getJsonPartString(nodes[i]);
                }
            }

            //没有插件的话再遍历input
            var controlList = [];
            var ips = Array.prototype.slice.call(domEle.getElementsByTagName("input"));
            var txts = Array.prototype.slice.call(domEle.getElementsByTagName("textarea"));
            var sels = Array.prototype.slice.call(domEle.getElementsByTagName("select"));

            controlList = ips.concat(txts).concat(sels);

            for (var ii = 0; ii < controlList.length; ii++) {
                var ip = controlList[ii];
                if (ip.getAttribute("ignore") == "true") {
                    controlList.splice(ii, 1);
                }
            }

            //若仍然无控件，则返回空json
            if (controlList.length == 0) {
                return "\"\":null";
            }

            var l = controlList.length;
            var fieldName = controlList[0].name;
            var jpath = controlList[0].getAttribute("jpath") || domEle.getAttribute("jpath");
            var conf = this.getConfigByPath(jpath);

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
                    if (!input.checked)continue;//未勾选，则忽略之，继续下一个input
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
                    values.push(input.value);
                }
            }

            //处理为空情形
            var tmpValue = values.join('');
            if (conf.required && (tmpValue == "")) {
                AFormConfig.fn.onEmpty(controlList[0], conf);
                throw new Error(fieldName + " cannot be empty");
            }
            //处理非法情形
            if (tmpValue != "" && conf.pattern && !new RegExp("^" + conf.pattern + "$", "i").test(tmpValue)) {
                AFormConfig.fn.onInvalid(input, conf);
                throw new Error("invalid value , not match pattern");
            }
            //处理规则校验
            if (tmpValue != "" && conf.validators) {
                for (var i = 0; i < conf.validators.length; i++) {
                    var item = conf.validators[i];
                    if (typeof item.rule == "function" && item.rule(tmpValue, input) !== true) {
                        if (item.errotMsg !== false) {
                            AFormConfig.fn.onInvalid(input, conf, item.errorMsg);
                        }
                        throw new Error("invalid value , not match rule");
                    }
                }
            }

            //值适配器处理
            var fn = function (v) {
                return v;
            };
            if (conf.valueAdapter && typeof conf.valueAdapter.beforeGet == "function") {
                fn = conf.valueAdapter.beforeGet;
            }

            //把处理后的值推入result
            if (domEle.className.indexOf("json-Boolean") > -1) {
                var tmp = fn(values.length > 0);
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
                result.push(fn(values.join(conf.delimiter || ',')));
            }
            else if (domEle.className.indexOf("json-String") > -1) {
                var len = values.length;
                for (var i = 0; i < len; i++) {
                    //过滤不合法的bad control char
                    values[i] = _replaceBadControl(values[i]);
                }

                result.push('"');
                result.push(fn(values.join(conf.delimiter || ",")));
                result.push('"');
            }
        }

        result = result.join('');
        return  result;
    }

    //根据path获取字段配置
    AForm.prototype.getConfigByPath = function (path) {
        if (!path)return {};
        if (path.indexOf(".") == -1)return {};

        var arr = path.split('.');
        var conf = this.config || {};

        for (var i = 0, l = arr.length; i < l; i++) {
            var p = arr[i];
            if (!p)continue;
            if (conf && conf.fields) {
                conf = conf.fields[p];
            }else {
                conf = null;
            }
        }

        //如果无该路径的配置且为自动生成schema，则用第一层的字段作为配置
        if(_formHelper.isObjEmpty(conf) && (this.config.schemaMode == "remote" || !this.config.schemaMode)){
            conf = this.config.fields[p];
        }
        return conf || {};
    };

    //渲染一项数据
    //@input 输入的数据
    //@name_or_index 数据的key名
    //@jpath 当前数据的路径，如数据是{a:{b:1})，此时渲染b，则路径为 “a.b”
    //@hideLabel 隐藏label
    AForm.prototype.renderData = function (input, name_or_index, jpath, hideLabel) {
        jpath = jpath || "";
        _debug(name_or_index, jpath);

        if (input == null) {
            return "";//忽略null
        }
        if (input == undefined)input = 'undefined';

        var strAttrName = (typeof name_or_index == "string" ? ("name='" + name_or_index + "'") : "");
        var fieldConfig = this.getConfigByPath(jpath);

        //若不渲染，则忽略之
        if (fieldConfig.noRender) {
            return "";
        }

        var attr = "" , cssText = "";
        if (fieldConfig.hidden) {
            attr += " hidden='hidden'";
            cssText += ";display:none";
            /* ie 6、7 hack */
        }

        //设置属性默认值
        fieldConfig.hideCollapser = "hideCollapser" in fieldConfig ? fieldConfig.hideCollapser : this.config.hideCollapser;
        fieldConfig.hideColon = "hideColon" in fieldConfig ? fieldConfig.hideColon : this.config.hideColon;
        fieldConfig.showArrayNO = "showArrayNO" in fieldConfig ? fieldConfig.showArrayNO : this.config.showArrayNO;
        fieldConfig.label = fieldConfig.label || this.config.label || name_or_index;//没有则取name or index
        fieldConfig.hideHeader = "hideHeader" in fieldConfig ? fieldConfig.hideHeader : this.config.hideHeader;
        fieldConfig.readonly = "readonly" in fieldConfig ? fieldConfig.readonly : this.config.readonly;
        fieldConfig.validators = fieldConfig.validators || [];
        fieldConfig.ctrlAttr = fieldConfig.ctrlAttr || {};
        fieldConfig.ctrlAttr.jpath = jpath;
        fieldConfig.jpath = jpath;

        if (typeof fieldConfig.validators == "object" && "rule" in fieldConfig.validators) {
            fieldConfig.validators = [fieldConfig.validators];
        }

        for (var i = 0; i < fieldConfig.validators.length; i++) {
            var item = fieldConfig.validators[i];
            if (typeof item.rule == "string" && item.rule.length > 2) {
                item.rule = new Function("$v", "$ctrl", "return " + item.rule);
            }
        }

        //值适配器处理
        if (fieldConfig.valueAdapter && typeof fieldConfig.valueAdapter.beforeRender == "function") {
            var tmp = fieldConfig.valueAdapter.beforeRender(input, name_or_index);
            //仅支持基本类型，若返回对象，则get适配器无法生效
            input = tmp;
        }
        AForm.renderCount++;
        switch (input.constructor) {
            case Number:
                return _FormElementFactory.createNumber(input, name_or_index, this.config, fieldConfig, hideLabel);
                break;
            case String:
                return _FormElementFactory.createString(input, name_or_index, this.config, fieldConfig, hideLabel);
                break;
            case Boolean:
                return _FormElementFactory.createBoolean(input, name_or_index, this.config, fieldConfig, hideLabel);
                break;
            case Object:
                var fdStyle = cssText;
                if (!name_or_index) {
                    fieldConfig.hideCollapser = true;//若无名，则隐藏折叠器
                    fdStyle = "border:none";
                }

                var fieldsetBegin = ("<" + AFormConfig.tags.objectContainer + " " + strAttrName + " " + attr + " style='" + fdStyle + "' class='json-form-element json-Object'>");
                fieldsetBegin += "<legend " + (strAttrName == "" ? "style='display:'" : "") + ">";
                fieldsetBegin += "<label  cmd='aform_array_collapse_fieldset' class='json-form-collapser ";
                if (!fieldConfig.hideCollapser)//若不隐藏折叠器，则展示
                {
                    var colId = "json_form_collapser_" + AForm.renderCount;
                    fieldsetBegin += (fieldConfig.collapse ? "json-form-ctrl-collapse" : "json-form-ctrl-un-collapse") + "'";
                    fieldsetBegin += "id='" + colId + "' >";
                    _onclickSetter[colId] = function (e) {
                        _formHelper.exeCmd(e, tbId, fieldConfig.rowAction);
                    };
                } else {
                    fieldsetBegin += "' >";
                }
                fieldsetBegin += _FormElementFactory.getLabelText(fieldConfig, name_or_index);
                fieldsetBegin += "</label></legend><div class='json-form-fdset' style='display:" + (fieldConfig.collapse ? "none" : "") + "'>";//折叠隐藏
                var fieldsetEnd = "</div></" + AFormConfig.tags.objectContainer + ">";
                var temp = [fieldsetBegin];

                //对字段排序
                var keyArray = _sortObject(input, fieldConfig.fields || {});
                //遍历排好序的字段
                for (var i = 0; i < keyArray.length; i++) {
                    var key = keyArray[i];
                    temp.push(this.renderData(input[key], key, jpath + "." + key));
                }
                temp.push(fieldsetEnd);
                return temp.join('');
                break;
            case Array:
                fieldConfig.rowAction = fieldConfig.rowAction || this.config.rowAction;

                //检测插件，插件优先
                if (fieldConfig.type in AFormPlugin.control) {
                    //插件用固定样式包裹
                    var html = [];
                    html.push("<span type=\"" + fieldConfig.type + "\" class=\"json-form-element json-field-plugin\">");
                    html.push(AFormPlugin.control[fieldConfig.type].render(name_or_index, input, fieldConfig, AForm.renderCount));
                    html.push("</span>");
                    return html.join("");
                }

                var tbId = "ele_json_tb_" + AForm.renderCount;
                var me = this;
                _onclickSetter[tbId] = function (e) {
                    _formHelper.exeCmd(e, tbId, fieldConfig.rowAction, me.onBeforeExeCmd);
                };

                var temp = ["<table id='" + tbId + "' border='1' " + strAttrName + " " + attr + " style=\"" + cssText + "\" class=\"json-form-element json-Array " + AFormConfig.extClassName.table + "\">"];
                temp.push("<caption>");
                temp.push("<label cmd='aform_array_collapse_table' ");
                if (!fieldConfig.hideCollapser)//若不隐藏折叠器，则展示
                {
                    temp.push(" class='json-form-collapser " + (fieldConfig.collapse ? "json-form-ctrl-collapse" : "json-form-ctrl-un-collapse") + "'");
                }
                temp.push(">" + _FormElementFactory.getLabelText(fieldConfig, name_or_index) + "</label>");

                if (!fieldConfig.noCreate)//若没禁止添加
                {
                    var addRowText = this.config.addRowText || "＋";
                    temp.push(" <a cmd='aform_array_add_row' style='display:" + (fieldConfig.collapse ? "none" : "") + "' class='json-form-array-add' href='javascript:void(null)'  title='增加一行'>" + addRowText + "</a> ");
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
                    temp.push("<thead style='display:" + (fieldConfig.collapse || fieldConfig.hideHeader ? "none" : "") + "'><tr>");
                    temp.push("<th style='" + attrIndexDisplay + "'>" + AFormConfig.wording.numText + "</th>");
                    var firstEle = input[0];

                    //对字段排序
                    var keyArray = _sortObject(firstEle, this.config.fields);
                    //遍历排好序的字段
                    for (var i = 0; i < keyArray.length; i++) {
                        var k = keyArray[i];
                        var fieldConf = this.config.fields[k] || {};
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
                            var tipsTpl = this.config.thTipsTpl;//表头的提示
                            temp.push(tipsTpl.replace(/\{tips\}/g, fieldConf.tips));
                        }
                        temp.push("</th>");
                    }

                    //若操作行为大于0，则建立操作列
                    if (!_formHelper.isObjEmpty(fieldConfig.rowAction)) {
                        temp.push("<th class='json-form-action'>" + AFormConfig.wording.oprText + "</th>");
                    }
                    temp.push("</tr></thead>");
                }

                temp.push("<tbody style='display:" + (fieldConfig.collapse ? "none" : "") + "'>");
                //生成表格的行
                for (var i = 0; i < len; i++) {
                    var curEle = input[i];
                    var eleType = _formHelper.getObjType(curEle);
                    var basicClass = _formHelper.isInArray(eleType, ['String', 'Number', 'Boolean']) ? " json-basic-element" : "";
                    temp.push("<tr class='" + basicClass + "json-" + eleType + "'>");

                    if (isRegular && curEle.constructor == Object) {
                        temp.push("<td style='" + attrIndexDisplay + "' class='json-form-rowNumber'>" + (i + 1) + "</td>");
                        //对字段排序
                        var keyArray = _sortObject(firstEle, this.config.fields);
                        //遍历排好序的字段
                        for (var ii = 0; ii < keyArray.length; ii++) {
                            var p = keyArray[ii];
                            var fieldConf = this.config.fields[p] || {};
                            if (fieldConf.noRender) {
                                continue;
                            }
                            temp.push("<td");
                            if (fieldConf.hidden) {
                                temp.push(" style='display:none'");
                            }
                            temp.push(">");
                            temp.push(this.renderData(curEle[p], p, jpath + "[" + i + "]." + p, true));//隐藏label和tips

                            temp.push("</td>");
                        }
                    }
                    else {
                        temp.push("<td class='json-form-rowNumber'>" + (i + 1) + "</td><td>");
                        temp.push(this.renderData(curEle, i, jpath + "[" + i + "]"));

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

                return temp.join('');
                break;
        }
    };

    //生成默认数据
    function _genDefaultData(fields) {
        if (typeof fields !== "object")return undefined;

        var obj = {};
        for (var p in fields) {
            //检测是否有子字段
            if (typeof fields[p].fields == "object") {
                obj[p] = _genDefaultData(fields[p].fields);
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
        var arr = [];
        var oo = 0;
        for (k in obj) {
            oo++;
            arr.push(k);

            if (!fconf[k]) {
                fconf[k] = {};
            }

            fconf[k].oOrder = oo;//保存原顺序，防止不稳定排序
        }

        arr.sort(function (x, y) {
            var order1 = fconf[x] && fconf[x].order ? fconf[x].order : 0;
            var order2 = fconf[y] && fconf[y].order ? fconf[y].order : 0;

            if (order2 - order1 > 0)return 1;
            else if (order2 - order1 == 0)return fconf[x].oOrder - fconf[y].oOrder;
            else return -1;
        });

        return arr;
    }

    //输出
    function _debug(msg) {
        if (!console)return false;
        else {
            if (typeof msg == "object")console.dir(msg);
            else console.log.apply(console, arguments);
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
    if (typeof window !== "undefined") {
        window.AForm = AForm;
    }
    if (typeof module !== "undefined" && module.exports) {
        module.exports = AForm;
    }
    if (typeof define === "function" && define.amd) {
        define("aform", [], function () {
            return AForm;
        });
    }
})();

