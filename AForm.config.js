/*!
 * AForm v1.1
 *
 * Copyright 2014, 谢慧琦
 *
 * Date: 2014年5月10日
 */
 
 
//默认全局配置

var AFormConfig = {};
AFormConfig.defaultDelimiter = ",";//默认字符串分隔符，用于处理复选框的逗号隔开的值
//表格行操作
AFormConfig.defaultAction = {
	"＋" : "<a class='json_form_action' href='javascript:void(0)' title='增加' onclick='var row = this.parentNode.parentNode;AFormHelper.addRow(row.parentNode.parentNode);'>＋<a>",
	"×" : "<a class='json_form_action' href='javascript:void(0)' title='删除' onclick='if(!confirm(\"确定删除该行吗？\"))return false;var row = this.parentNode.parentNode;AFormHelper.removeRow(row);'>×<a>"
};
//标签
AFormConfig.tags = {
	"basicContainer" : "div",//div
	"objectContainer" : "fieldset",
	"label" : "label", //label
	"controlContainer" : "" //默认为空
};
//额外样式名
AFormConfig.extClassName = {
	"basicContainer" : "form-group",
	"table" : "table table-bordered",
	"control" : "form-control"
};
//模板
AFormConfig.tpl = {
	"tips" : '&nbsp;<a title="{tips}" href="#nolink">[?]</a>',
	"thTips" : "<sup title='{tips}'>[?]</sup>"
};
//术语
AFormConfig.wording = {
	"numText" : "序号",
	"addRowText" : "增加"
};

//处理函数
AFormConfig.fn = {
	"onEmpty" : function(input,conf){
		var errMsg = conf ? ("字段["+(conf.label)+"]不能为空") : input.title;
		if(!errMsg) errMsg = "字段["+(input.getAttribute("name"))+"]不能为空";
		
		alert(errMsg);
		if(typeof input.focus == "function" || typeof input.focus == "object")
		{
			input.focus();
		}
	},
	"onInvalid" : function(input,conf){
		var errMsg = conf ? ("字段["+(conf.label)+"]的值非法") : input.title;
		if(!errMsg) errMsg = "字段["+(input.getAttribute("name"))+"]非法";

		alert(errMsg);
		if(typeof input.focus == "function" || typeof input.focus == "object")
		{
			input.focus();
		}
	}
};



