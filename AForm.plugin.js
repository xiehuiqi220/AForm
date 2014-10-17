/*!
 * AForm v1.1
 *
 * Copyright 2014, 谢慧琦
 *
 * Date: 2014年5月10日
 */

//插件
var AFormPlugin = {};
AFormPlugin.control = {
	"span" : {
		"desc" : "展示字段",
		"render" : function(k , v , config)//key , value , 字段的配置，需根据v的类型做不同的渲染
		{
			var html = "<span title=\"" + this.desc + "\" name=\"" + k + "\">" + v + "</span>";
			return html;
		},
		"getJsonPartString" : function(ele)//ele为插件的外层容器dom对象
		{
			var span = ele.getElementsByTagName("span")[0];
			var k = span.getAttribute("name");
			var v = span.innerHTML;
			
			return "\"" + k + "\":\"" + v + "\"";
		}
	},
	"color" : {
		"desc" : "颜色选择器",
		"render" : function(k , v , config)//key , value , 字段的配置，需根据v的类型做不同的渲染
		{
			var html = "<input style=\"background-color:" + v + "\" title=\"" + this.desc + "\" name=\"" + k + "\" value=\"" + v + "\" />";
			return html;
		},
		"getJsonPartString" : function(ele)//ele为插件的外层容器dom对象
		{
			var input = ele.getElementsByTagName("input")[0];
			var k = input.getAttribute("name");
			var v = input.value;
			
			return "\"" + k + "\":\"" + v + "\"";
		}
	}
}

