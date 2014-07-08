/*!
 * AForm v1.1
 *
 * Copyright 2014, 谢慧琦
 *
 * Date: 2014年6月20日
 */

;(function()
{
	//------------------------------------------------------------------------------------------
	//辅助方法
	var AFormHelper = {
		addClass : function(ele, clsName)
		{
			if(!ele.className)
			{
				ele.className = clsName;
			}
			else if(ele.className.indexOf(clsName) == -1 )
			{
				ele.className += " " + clsName;
			}
		},
		onValueChane : function(input)
		{
			this.addClass(input,"json_form_dirty");
			this.validateInput(input);
		},
		validateInput : function(input)//用于验证输入控件的value
		{
			var v = input.value;
			if(v == "" && input.getAttribute("required") != null)
			{
				AFormConfig.fn.onEmpty(input);
				return false;
			}
			if(v != "" && input.getAttribute("pattern") && !new RegExp("^"+input.getAttribute("pattern")+"$","i").test(input.value))
			{
				AFormConfig.fn.onInvalid(input);
				return false;
			}
			
			return true;
		},
		getNextSibling : function(n)
		{
			var x = n.nextSibling;
			while (x && x.nodeType != 1)
			{
				x = x.nextSibling;
			}
			return x;
		},
		showNextSibling : function(ele,visible)
		{
			var n = this.getNextSibling(ele);
			while(n)
			{
				var isHidden = n.getAttribute("hidden") != null;//兼容html5的hidden属性
				n.style.display = isHidden ? "none" : (visible ? "" : "none");
				n = this.getNextSibling(n);
			}
		},
		isInArray : function(key,array)
		{
			var i = array.length;
			while(i--)
			{
				if(key == array[i])return true;
			}
			return false;
		},
		removeRow : function(row)
		{
			var tbBody = row.parentNode;
			if(tbBody.rows.length == 1 && !tbBody.tempRow)//若只有一行了，则存储该行为表格的临时行，用于下次表格新增行
			{
				row.cells[0].innerHTML = 0;//起始为0，addRow后，将自增1，之所以设置row的序号为0，而不是clone后再设置，是因为ie对于未在表格中的row取cell会报错
				tbBody.tempRow = row.cloneNode(true);
			}
			tbBody.removeChild(row);
		},
		addRow : function(table)
		{
			var tbBody = table.tBodies[0];
			if(!tbBody)return false;
			var lastRow = null;
			if(tbBody.rows.length == 0)
			{
				lastRow = tbBody.tempRow;//若表格存储了临时的行，则使用临时行
			}
			else
			{
				lastRow = tbBody.rows[tbBody.rows.length - 1];//否则使用最后一行
				if(!lastRow)return false;
			}
			var newRow = lastRow.cloneNode(true);
			
			var labels = newRow.getElementsByTagName("label");
			var len = labels.length;
			
			while(len--)
			{
				var lb = labels[len];
				var forId = lb.htmlFor;
				var newId = "ele_json_new_"+len+"_"+(new Date().getTime() % 1000000);
				lb.htmlFor = newId;
				
				var ip = this.getNextSibling(lb);//找到label的input
				ip.readOnly = false;
				ip.id = newId;//input
				ip.value = "";//clear
			}
			
			table.tBodies[0].appendChild(newRow);
			var rowNumber = newRow.cells[0].innerHTML - 0;//行的第一列，序号列，数值+1
			newRow.cells[0].innerHTML = rowNumber+1;
		},
		each : function(array,fn)
		{
			var len = array.length;
			for(var i = 0; i< len; i++)
			{
				fn(array[i],i);
			}
		},
		getObjType : function(obj)
		{
			if(obj.constructor == Array)return "Array";
			else if(obj.constructor == Object)return "Object";
			else if(obj.constructor == Number)return "Number";
			else if(obj.constructor == Boolean)return "Boolean";
			else if(obj.constructor == String)return "String";
			else return "unknow";
		}
	};
	
	function replaceBadControl(v)
	{
		//过滤不合法的bad control char
		v = v.replace(/\\/g,"\\\\");//反斜杠
		v = v.replace(/"/g,"\\\"");//双引号
		v = v.replace(/\n/g,"\\n");//回车符
		v = v.replace(/\t/g,"\\t");//tab符
			
		return v;
	}
	
	var valueSetter = {};//dom value赋值队列，生命周期为一次render过程，每次render前要reset为空对象
	//表单元素工厂
	var FormElementFactory = {
		//获取字段的标签名
		getLabelText : function(fieldConfig,name_or_index)
		{
			if(fieldConfig && fieldConfig.label)
			{
				return fieldConfig.label.toString();
			}
			else return typeof name_or_index == "undefined" ? "" : name_or_index;
		},
		generateDatalist : function(list,id)
		{
			var len = list.length;
			
			var html = [];
			html.push("<datalist id='"+id+"'>");
			
			var isTextValue = len > 0 && typeof list[0] == 'object';
			
			for(var i = 0; i< len; i++)
			{
				var v = isTextValue ? list[i].value : list[i];
				var t = isTextValue ? list[i].text : list[i];
				html.push("<option value=\""+v+"\" ");
				html.push( v== t ? "/>" : (">"+t+"</option>"));
			}
			
			html.push("</datalist>");
			return html.join('');
		},
		generateInputHtml : function(param)
		{
			param = param || {};
			param.type = param.type || "text";
			
			var html = [];
			
			switch(param.type)
			{
				case "text":
				default:
					
					var listHtml = "";
					var listId = "list_" + param.id;
					var attrList = "";
					
					html.push("<input ");
					if(param.datalist && param.datalist.length > 0)
					{
						listHtml = (this.generateDatalist(param.datalist,listId));
						html.push(" list='"+listId+"'");
					}
					html.push(param.attrHtml);
					html.push(" onchange='AFormHelper.onValueChane(this)' id='");
					html.push(param.id+"' type='"+param.type+"' ");//这里是用户传入的type，而不是text，这样可支持html5的类型
					html.push(param.attrName);
					html.push(" value=\"" + "" + "\" />");
					
					valueSetter[param.id] = param.value;//使用dom赋值，而不使用字符串拼接方式，避免单引号、双引号等字符转义出问题
					html.push(listHtml);
					
					break;
				case "textarea":
					
					html.push("<textarea ");
					html.push(param.attrHtml);
					html.push(" onchange='AFormHelper.addClass(this,\"json_form_dirty\")' id='");
					html.push(param.id+"'");
					html.push(param.attrName);
					html.push(">"+param.value+"</textarea>");
					
					break;
				case "hidden":
					
					html.push("<input type='hidden' ");
					html.push(param.attrHtml);
					html.push(" id='");
					html.push(param.id+"'");
					html.push(param.attrName);
					html.push(" value=\""+param.value+"\" />");
					
					break;
				case "select":
					
					html.push("<select ");
					html.push(param.attrHtml);
					html.push(" id='"+param.id+"' ");
					html.push(param.attrName);
					html.push(">");
					
					var list = param.datalist;
					var len = list.length;			
					var isTextValue = len > 0 && typeof list[0] == 'object';
					
					var valueArr = param.multiple ? param.value.toString().split(param.delimiter || AFormConfig.defaultDelimiter) : [param.value];
					
					for(var i = 0; i< len; i++)
					{
						var v = isTextValue ? list[i].value : list[i];
						var t = isTextValue ? list[i].text : list[i];
						html.push("<option "+(AFormHelper.isInArray(v.toString() ,valueArr) ? "selected" : "")+" value=\""+v+"\">"+t+"</option>");
					}

					html.push("</select>");
					
					break;
				case "radio":
					
					html.push("<span ");
					html.push(param.attrHtml);
					html.push(" id='"+param.id+"' ");
					html.push(">");
					
					var list = param.datalist;
					var len = list.length;			
					var isTextValue = len > 0 && typeof list[0] == 'object';
					
					for(var i = 0; i< len; i++)
					{
						var v = isTextValue ? list[i].value : list[i];
						var t = isTextValue ? list[i].text : list[i];
						html.push("<label><input "+param.attrName+" type='radio' "+(v.toString() == param.value ? "checked" : "")+" value=\""+v+"\" />"+t+"</label>");
					}

					html.push("</span>");
					
					break;
				case "checkbox":
					
					html.push("<span ");
					html.push(param.attrHtml);
					html.push(" id='"+param.id+"' ");
					html.push(">");
					
					var list = param.datalist || [];
					var len = list.length;
					var isTextValue = len > 0 && typeof list[0] == 'object';
					
					var valueArr = param.value.toString().split(param.delimiter || AFormConfig.defaultDelimiter);
					
					for(var i = 0; i< len; i++)
					{
						var v = isTextValue ? list[i].value : list[i];
						var t = isTextValue ? list[i].text : list[i];
						html.push("<label><input "+param.attrName+" type='checkbox' "+(AFormHelper.isInArray(v.toString() ,valueArr) ? "checked" : "")+" value=\""+v+"\" />"+t+"</label>");
					}

					html.push("</span>");
					
					break;
			}
			
			return html.join('');
		},
		//创建输入控件
		createInputRow : function(param)
		{
			if(!param.fieldConfig)param.fieldConfig = {};
			
			var strAttrName = (typeof param.name_or_index == "string" ? ("name=" + param.name_or_index + "") : "");
			var elementId = param.fieldConfig.ctrlId || ("ele_json_" + AForm.renderCount);//若给定控件id，则用给定的控件id
			var labelHtml = "<" + AFormConfig.tags.label + " class='json_field_label label_" + param.name_or_index + "' style='" +(param.fieldConfig.labelCssText || "") + ";display:" + ((strAttrName == "" || param.hideLabel || param.fieldConfig.hideLabel) ? "none" : "")+"' for='"+elementId+"'>";
		 	labelHtml += this.getLabelText(param.fieldConfig,param.name_or_index);
		 	labelHtml += param.fieldConfig.hideColon ? "" : ":";
			if(param.fieldConfig.required)
			{
				labelHtml += "<span class='json_form_required'>*</span>";
			}
			labelHtml += "</" + AFormConfig.tags.label + ">";
			
			var cssText = (param.fieldConfig.cssText || "");
			var attr = (param.fieldConfig.attr || "");
			
			if(param.fieldConfig.inline)
			{
				cssText += ";display:inline-block;*display:inline;*zoom:1";/* ie 6、7 hack */
			}
			if(param.fieldConfig.hidden)
			{
				attr += " hidden='hidden'";
				cssText += ";display:none";/* ie 6、7 hack */
			}
			if(param.fieldConfig.width)
			{
				cssText += ";width:"+param.fieldConfig.width;/* ie 6、7 hack */
			}
			
			var html = ["<" + AFormConfig.tags.basicContainer + " "+attr+" style='" + cssText + "' class='json_form_element json_basic_element json_"+param.dataType+" " + AFormConfig.extClassName.basicContainer + "'>"];
			html.push(labelHtml);
			
			if(param.fieldConfig.frontalHtml)//输入控件前的html
			{
				html.push(param.fieldConfig.frontalHtml);
			}
			//公共属性
			var attrHtml = [];
			if(param.fieldConfig.ctrlAttr)
			{
				for(var p in param.fieldConfig.ctrlAttr)
				{
					attrHtml.push(p + "=\"" + param.fieldConfig.ctrlAttr[p] + "\"");
				}
			}
			if(param.fieldConfig.required)
			{
				attrHtml.push("required");
			}
			if(param.fieldConfig.readonly)
			{
				attrHtml.push("readonly");
			}
			if(param.fieldConfig.disabled)
			{
				attrHtml.push("disabled");
			}
			if(param.fieldConfig.maxlength)
			{
				attrHtml.push("maxlength='"+param.fieldConfig.maxlength+"'");
			}
			if(param.fieldConfig.ctrlCssText)
			{
				attrHtml.push("style='"+param.fieldConfig.ctrlCssText+"'");
			}
			if(param.fieldConfig.pattern)
			{
				attrHtml.push("pattern='"+param.fieldConfig.pattern+"'");
			}
			if(param.fieldConfig.size)
			{
				attrHtml.push("size='"+param.fieldConfig.size+"'");
			}
			if(param.fieldConfig.type == 'select' && param.fieldConfig.multiple)
			{
				attrHtml.push("multiple='multiple'");
			}
			if(param.fieldConfig.title)
			{
				attrHtml.push("title='"+param.fieldConfig.title+"'");
			}
			if(param.fieldConfig.placeholder)
			{
				attrHtml.push("placeholder='"+param.fieldConfig.placeholder+"'");
			}
			attrHtml.push("class='json_field_input " + AFormConfig.extClassName.control + "'");
			attrHtml = attrHtml.join(' ');
			//end 公共属性
			
			//创建输入元素
			if(param.dataType == "Boolean")
			{
				html.push("<input "+attrHtml+" id=\""+elementId+"\" type=\"checkbox\" "+(param.inputData ? "checked" : "")+" "+strAttrName+" />");
			}
			else	// if(param.dataType == "String")
			{
				//先判断是否有插件，有则用插件托管渲染
				if(param.fieldConfig.type in AFormPlugin.control)
				{
					//插件用固定样式包裹
					html.push("<span type=\"" + param.fieldConfig.type + "\" class=\"json_field_plugin\">");
					html.push(AFormPlugin.control[param.fieldConfig.type].render(param.name_or_index , param.inputData , param.fieldConfig));
					html.push("</span>");
				}
				else
				{
					if(AFormConfig.tags.controlContainer)html.push("<" + AFormConfig.tags.controlContainer + ">");
					html.push(FormElementFactory.generateInputHtml({
						"type":param.fieldConfig.type,//text,textarea,select,checkbox,radio,hidden 或者其他无法预期的类型，如type、mail、date等html5新增属性
						"datalist":param.fieldConfig.datalist,
						"attrHtml":attrHtml,
						"multiple":param.fieldConfig.multiple,
						"delimiter":param.fieldConfig.delimiter,
						"id":elementId,
						"attrName":strAttrName,
						"value":param.inputData
					}));
					if(AFormConfig.tags.controlContainer)html.push("</" + AFormConfig.tags.controlContainer + ">");
				}
			}
			
			if(param.fieldConfig.extHtml)//附加html
			{
				html.push(param.fieldConfig.extHtml);
			}
 			if(!param.hiddenTips && param.fieldConfig.tips)//若未隐藏帮助tips，且tips不为空
			{
				var tipsTpl = param.fieldConfig.tipsTpl || param.globalConfig.tipsTpl;//字段优先
				html.push(tipsTpl.replace(/\{tips\}/g,param.fieldConfig.tips));
			}
			html.push("</" + AFormConfig.tags.basicContainer + ">");
			
			return html.join('');
		},
		createString : function(inputStr, name_or_index, globalConfig, fieldConfig, hideLabel, hiddenTips)
		{
			return this.createInputRow({
				inputData:inputStr,
				dataType:"String",
				name_or_index:name_or_index,
				globalConfig:globalConfig,
				fieldConfig:fieldConfig,
				hideLabel:hideLabel,
				hiddenTips:hiddenTips
			});
		},
		createNumber : function(inputNumber, name_or_index, globalConfig, fieldConfig, hideLabel, hiddenTips)
		{
			return this.createInputRow({
				inputData:inputNumber,
				dataType:"Number",
				name_or_index:name_or_index,
				globalConfig:globalConfig,
				fieldConfig:fieldConfig,
				hideLabel:hideLabel,
				hiddenTips:hiddenTips
			});
		},
		createBoolean : function(inputBool, name_or_index, globalConfig, fieldConfig, hideLabel, hiddenTips)
		{
			return this.createInputRow({
				inputData:inputBool,
				dataType:"Boolean",
				name_or_index:name_or_index,
				globalConfig:globalConfig,
				fieldConfig:fieldConfig,
				hideLabel:hideLabel,
				hiddenTips:hiddenTips
			});
		}
	};

	//已渲染单元数量，静态成员初始化
	AForm.renderCount = 0;
	
	//构造函数
	//param container dom元素或其id
	//param config 配置对象，json格式
	//return void
	function AForm(container,config)
	{
		
		this.container = typeof container == "string" ? document.getElementById(container) : container;
		
		//初始化默认配置
		this.config = {
			title : "" , //表单的标题
			showArrayNO : true,//是否显示数组元素序号，从1开始
			hideCollapser : false,
			hideColon :false,//不隐藏冒号
			addRowText : AFormConfig.wording.addRowText,
			rowAction : ['＋','×'],
			tipsTpl : AFormConfig.tpl.tips,
			thTipsTpl : AFormConfig.tpl.thTips,
			fields : {}				//字段配置，字段名为key
		};
		
		//合并配置项
		if(typeof config == "object")
		{
			for(var p in config)
			{
				this.config[p] = config[p];
			}
		}
	}
	
	//当渲染完毕做什么
	AForm.prototype.onRenderComplete = function()
	{
	}
	
	//渲染json数据
	//input 输入的json数据
	AForm.prototype.render = function(input)
	{
		valueSetter = {};//渲染前reset
		this.container.innerHTML = this.renderData(input);
		
		//赋值器
		for(var id in valueSetter)
		{
			document.getElementById(id).value = valueSetter[id];
		}
		
		//渲染标题
		var rootEle = this.container.childNodes[0];
		var titleEle = null;
		if(rootEle.tagName.toLowerCase() == "fieldset")
		{
			titleEle = rootEle.getElementsByTagName("legend")[0];
		}
		else if(rootEle.tagName.toLowerCase() == "table")
		{
			titleEle = rootEle.getElementsByTagName("caption")[0];
		}
		
		if(this.config.title)//若设置了标题，则显示，否则隐藏
		{
			titleEle && (titleEle.innerHTML = this.config.title);
		}
		else
		{
			titleEle && (titleEle.style.display = "none");
		}
		
		this.onRenderComplete();
		return this;
	};
	
	//获取输入空间集合的value，返回json
	AForm.prototype.getJson = function(domEle)//遍历具有
	{
		var result = this.getJsonString();
		return eval("("+result+")");
	};
	
	//获取输入空间集合的value，返回形如json的字符串
	AForm.prototype.getJsonString = function(domEle)//遍历具有
	{
		domEle = domEle || this.container.childNodes[0];//若未传，则默认为根元素
		var result = [];
		
		if(domEle.className.indexOf("json_field_plugin") > -1)//插件优先
		{
			var pluginName = domEle.getAttribute("type");
			var pluginInstance = AFormPlugin.control[pluginName];
			return pluginInstance.getJsonPartString(domEle);
		}
		
		if(domEle.className.indexOf('json_Object') > -1)
		{
			domEleName = domEle.getAttribute("name");//ie9需使用getAttribute
			if(domEleName)
			{
				result.push("\""+domEleName+"\":");
			}
			result.push("{");
			
			var childNodes = [];
			if(domEle.nodeName == 'TR')
			{
				AFormHelper.each(domEle.cells,function(cell)
				{
					if(cell.firstChild.nodeType == 1 && cell.firstChild.className.indexOf("json_form_element") > -1)
					{
						childNodes.push(cell.firstChild);
					}
				});
			}
			else
			{
				childNodes = domEle.getElementsByTagName("div")[0].childNodes;//fieldset下第一个div的子元素
			}
			
			var len = childNodes.length;
			for(var i = 0;i < len; i++)
			{
				var node = childNodes[i];
				if(node.className.indexOf('json_form_element') > -1)
				{
					result.push(this.getJsonString(node));
					if(i < len-1)result.push(",");
				}
			}
			result.push("}");
		}
		else if(domEle.className.indexOf('json_Array') > -1)
		{
			domEleName = domEle.getAttribute("name");
			if(domEleName)
			{
				result.push("\"" + domEleName + "\":");
			}
			result.push("[");
			
			var rows = domEle.tBodies.length > 0 ? domEle.tBodies[0].rows : [];//忽略thead
			var len = rows.length;
			for(var i = 0;i < len; i++)//
			{
				var row = rows[i];
				result.push(this.getJsonString(row));
				if(i < len-1)result.push(",");
			}
			result.push("]");
		}
		else if(domEle.className.indexOf("json_basic_element") > -1)
		{
			//先找插件
			var nodes = domEle.childNodes;
			var i = nodes.length;
			while(i--)
			{
				if(nodes[i].className && nodes[i].className.indexOf("json_field_plugin") > -1)
				{
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
			
			for(var ii = 0 ; ii < controlList.length ; ii++)
			{
				var ip = controlList[ii];
				if(ip.getAttribute("ignore") == "true")
				{
					controlList.splice(ii , 1);
				}
			}
			
			//若仍然无控件，则返回空json
			if(controlList.length == 0)
			{
				return "\"\":null";
			}
			
			var l = controlList.length;
			var fieldName = controlList[0].name;
			var conf = this.config.fields[fieldName] || {};
			
			if(fieldName)//若存在字段名，则设为key
			{
				result.push("\""+fieldName+"\":");
			}
			
			//获取该字段的value
			var values = [];
			for(var i = 0;i < l; i++)
			{
				var input = controlList[i];
				var domType = input.type;
				if(domType == "radio" || domType == "checkbox")
				{
					if(!input.checked)continue;//未勾选，则忽略之，继续下一个input
				}
				
				if(domType == "select-multiple")
				{
					var select = input;
					var selen = select.length;
					for(j = 0; j < selen; j++)
					{     
						if(select.options[j].selected)
						{
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
			if(conf.required && (tmpValue == ""))
			{
				AFormConfig.fn.onEmpty(controlList[0],conf);
				throw new Error(fieldName + " cannot be empty");
			}
			//处理非法情形
			if(tmpValue != "" && conf.pattern && !new RegExp("^"+conf.pattern+"$","i").test(tmpValue))
			{
				AFormConfig.fn.onInvalid(input,conf);
				throw new Error("invalid value");
			}
			
			//把处理后的值推入result
			if(domEle.className.indexOf("json_Boolean") > -1)
			{
				result.push(values.length > 0);//若勾选即为true
			}
			else if(domEle.className.indexOf("json_Number") > -1)
			{
				var len = values.length;
				for(var i = 0; i< len; i++)
				{
					values[i] -= 0;//转换为数字
				}
				result.push(values.join(','));
			}
			else if(domEle.className.indexOf("json_String") > -1)
			{
				var len = values.length;
				for(var i = 0; i< len; i++)
				{
					//过滤不合法的bad control char
					values[i] = replaceBadControl(values[i]);
				}

				result.push('"');
				result.push(values.join(conf.delimiter || ","));
				result.push('"');
			}
		}
		
		result = result.join('');
		
		return  result;
		
	};
	
	//渲染一项数据
	//@input 输入的数据
	//@name_or_index 数据的key名
	//@hideLabel 隐藏label
	//@hiddenTips 隐藏tips
	AForm.prototype.renderData = function(input,name_or_index,hideLabel,hiddenTips)
	{
		if(input == null)input = 'null';
		if(input == undefined)input = 'undefined';

		var strAttrName = (typeof name_or_index == "string" ? ("name='"+name_or_index+"'") : "");
		var fieldConfig = this.config.fields[name_or_index] || {};
		
		//若不渲染，则忽略之
		if(fieldConfig.noRender)
		{
			return "";
		}
		
		var attr = "" , cssText = "";
		if(fieldConfig.hidden)
		{
			attr += " hidden='hidden'";
			cssText += ";display:none";/* ie 6、7 hack */
		}
		
		//设置属性默认值
		fieldConfig.hideCollapser = "hideCollapser" in fieldConfig ? fieldConfig.hideCollapser : this.config.hideCollapser;
		fieldConfig.hideColon = "hideColon" in fieldConfig ? fieldConfig.hideColon : this.config.hideColon;
		fieldConfig.showArrayNO = "showArrayNO" in fieldConfig ? fieldConfig.showArrayNO : this.config.showArrayNO;
		fieldConfig.label = fieldConfig.label || this.config.label || name_or_index;//没有则取name or index
		
		AForm.renderCount++;
		switch(input.constructor)
		{
			case Number:
				return FormElementFactory.createNumber(input,name_or_index,this.config,fieldConfig,hideLabel,hiddenTips);
				break;
			case String:
				return FormElementFactory.createString(input,name_or_index,this.config,fieldConfig,hideLabel,hiddenTips);
				break;
			case Boolean:
				return FormElementFactory.createBoolean(input,name_or_index,this.config,fieldConfig,hideLabel,hiddenTips);
				break;
			case Object:
				var fdStyle = cssText;
				if(!name_or_index)
				{
					fieldConfig.hideCollapser = true;//若无名，则隐藏折叠器
					fdStyle = "border:none";
				}

				var fieldsetBegin = ("<" + AFormConfig.tags.objectContainer + " "+strAttrName+ " "+attr+" style='" + fdStyle + "' class='json_form_element json_Object'>");
				fieldsetBegin += "<legend "+(strAttrName == "" ? "style='display:'" : "")+">";
				fieldsetBegin += "<label>";
				if(!fieldConfig.hideCollapser)//若不隐藏折叠器，则展示
				{
					//判断默认是否折叠，折叠的话，则不勾选
					fieldsetBegin += "<input " + (fieldConfig.collapse ? "" : "checked") + " onclick='AFormHelper.showNextSibling(this.parentNode.parentNode,this.checked)' type='checkbox' />";
				}
				fieldsetBegin += FormElementFactory.getLabelText(fieldConfig,name_or_index);
				fieldsetBegin += "</label></legend><div style='display:" + (fieldConfig.collapse ? "none" : "") + "'>";//折叠隐藏
				var fieldsetEnd = "</div></" + AFormConfig.tags.objectContainer + ">";
				var temp = [fieldsetBegin];
				
				//对字段排序
				var keyArray = _sortObject(input , this.config.fields);
				//遍历排好序的字段
				for (var i=0; i < keyArray.length; i++) {
					var key = keyArray[i];
					temp.push(this.renderData(input[key],key));
				}
				temp.push(fieldsetEnd);
				return temp.join('');
				break;
			case Array:
				//检测插件，插件优先
				if(fieldConfig.type in AFormPlugin.control)
				{
					//插件用固定样式包裹
					var html = [];
					html.push("<span type=\"" + fieldConfig.type + "\" class=\"json_form_element json_field_plugin\">");
					html.push(AFormPlugin.control[fieldConfig.type].render(name_or_index , input , fieldConfig));
					html.push("</span>");
					return html.join("");
				}
				
				var temp = ["<table border='1' "+strAttrName+" "+attr+" style=\""+cssText+"\" class=\"json_form_element json_Array " + AFormConfig.extClassName.table + "\">"];
				temp.push("<caption>");
				temp.push("<label>");
				if(!fieldConfig.hideCollapser)//若不隐藏折叠器，则展示
				{
					temp.push("<input " + (fieldConfig.collapse ? "" : "checked")+" onclick='AFormHelper.showNextSibling(this.parentNode.parentNode,this.checked);AFormHelper.showNextSibling(this.parentNode,this.checked)' type='checkbox' />");
				}
				temp.push(FormElementFactory.getLabelText(fieldConfig,name_or_index)+"</label>");
				
				if(!fieldConfig.noCreate)//若没禁止添加
				{
					var addRowText = this.config.addRowText || "＋";
					temp.push(" <a style='display:" + (fieldConfig.collapse ? "none" : "") + "' class='json_form_action' href='javascript:void(null)' onclick='AFormHelper.addRow(this.parentNode.parentNode)' title='增加一行'>"+addRowText+"</a> ");
				}
				temp.push("</caption>");
				
				var len = input.length;
				
				//当子元素是object时附加表格标题行
				//若行数大于0且数组元素整齐，则提取标题
				var isRegular = (len > 0 && input[0].constructor == Object);//若第一个元素是Object，则当成元素是统一对象的规则数组
				var attrIndexDisplay = fieldConfig.showArrayNO ? "width:4em" : "display:none";

				fieldConfig.rowAction = fieldConfig.rowAction || this.config.rowAction;
				if(fieldConfig.noDelete)
				{
					delete fieldConfig.rowAction["×"];
				}
				if(fieldConfig.noCreate)
				{
					delete fieldConfig.rowAction["+"];
				}
				
				//仅数组元素为对象时才生成表头
				if(isRegular)
				{
					temp.push("<thead style='display:" + (fieldConfig.collapse ? "none" : "") + "'><tr>");
					temp.push("<th style='" + attrIndexDisplay + "'>" + AFormConfig.wording.numText + "</th>");
					var firstEle = input[0];
					
					//对字段排序
					var keyArray = _sortObject(firstEle , this.config.fields);
					//遍历排好序的字段
					for (var i=0; i < keyArray.length; i++)
					{
						var k = keyArray[i];
						var fieldConf = this.config.fields[k] || {};
						 if(fieldConf.noRender)
						 {
						 	 continue;
						 }
						temp.push("<th");
						if(fieldConf.hidden)
						{
							temp.push(" style='display:none'");
						}
						temp.push(">")
						temp.push(FormElementFactory.getLabelText(fieldConf,k));
						if(fieldConf && fieldConf.tips)
						{
							var tipsTpl = this.config.thTipsTpl;//字段优先
							temp.push(tipsTpl.replace(/\{tips\}/g,fieldConf.tips));
						}
						temp.push("</th>");
					}
					
					//若操作行为大于0，则建立操作列
					if(fieldConfig.rowAction.length > 0)
					{
						temp.push("<th style='width:4em'>操作</th>");
					}
					temp.push("</tr></thead>");
				}
				
				temp.push("<tbody style='display:" + (fieldConfig.collapse ? "none" : "") + "'>");
				//生成表格的行
				for(var i = 0;i < len ;i++)
				{
					var curEle = input[i];
					var eleType = AFormHelper.getObjType(curEle);
					var basicClass = AFormHelper.isInArray(eleType,['String','Number','Boolean']) ? " json_basic_element" : "";
					temp.push("<tr class='"+basicClass+"json_"+eleType+"'>");
					
					if(isRegular && curEle.constructor == Object)
					{
						temp.push("<td style='"+attrIndexDisplay+"' class='json_form_rowNumber'>"+(i+1)+"</td>");
						//对字段排序
						var keyArray = _sortObject(firstEle , this.config.fields);
						//遍历排好序的字段
						for (var ii=0; ii < keyArray.length; ii++)
						{
							var p = keyArray[ii];
							var fieldConf = this.config.fields[p] || {};
							if(fieldConf.noRender)
							{
								continue;
							}
							temp.push("<td");
							if(fieldConf.hidden)
							{
								temp.push(" style='display:none'");
							}
							temp.push(">")
							temp.push(this.renderData(curEle[p],p,true,true));//隐藏label和tips
							temp.push("</td>");
						}
					}
					else
					{
						temp.push("<td class='json_form_rowNumber'>"+(i+1)+"</td><td>");
						temp.push(this.renderData(curEle,i));
						temp.push("</td>");
					}
					
					//末尾的操作列
					if(fieldConfig.rowAction.length > 0)
					{
						temp.push("<td class='json_form_actionCell'>");
						
						for(var j = 0 , l = fieldConfig.rowAction.length ; j < l ; j++)
						{
							var actionHtml = fieldConfig.rowAction[j];
							//若属于预定义的行为，则使用AForm默认提供的
							if(actionHtml in AFormConfig.defaultAction)
							{
								actionHtml = AFormConfig.defaultAction[actionHtml];
							}
							temp.push(actionHtml);
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
	
	//对对象排序，其key被conf设置了顺序，order越大越排前
	function _sortObject(obj , fconf)
	{
		var arr = [];
		for(k in obj){
			arr.push(k);
		}

		arr.sort(function(x , y){
			var order1 = fconf[x] && fconf[x].order ? fconf[x].order : 0;
			var order2 = fconf[y] && fconf[y].order ? fconf[y].order : 0;

			if(order2 - order1 > 0)return 1;
		});
		
		return arr;
	}
	
	window.AForm = AForm;
	window.AFormHelper = AFormHelper;
	
})();
