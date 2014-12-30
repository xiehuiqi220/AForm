#快速上手

使用AForm极其简单，您首先需在调用页面的head部分引入如下js文件和样式文件（样式文件是可选的，通常需要您自定义）：

	<link href="AForm.css" rel="stylesheet" />

	<script src="AForm.js"></script>
	<script src="AForm.config.js"></script> 全局配置，可选
	<script src="AForm.plugin.js"></script> 插件范例，可选


然后，准备好需要渲染的json数据和针对该数据的一些配置（同样也是json格式），以及用于显示表单的DOM容器（比如一个form或者div，假设其id为“divOutput”），最后像下面这样使用：


	<script>
	var jf = new AForm("divOutput",{
	title : "我的表单",
	fields:{
		Name:{label:"姓名",readonly:true},
		Sexy:{label:"性别",type:"radio",datalist:[{value:0,text:"男"},{value:1,text:"女"}]},
		Country:{label:"国家",readonly:true,type:"select",datalist:['USA','CHINA','KOREA']}
	}
	});
	jf.render({
	  "Name": "John Smith",
	  "Sexy": 1,
	  "Country":"CHINA"
	});
	</script>



这样就会在指定的容器中生成一组输入项，当您想收集用户数据时，执行getJsonString函数即可，该函数返回一个符合json标准的字符串：

---------------------
<script>
var data;
//一定要使用try，catch来捕获异常，因若收集到的字段值不合您定义的规则将直接抛出异常
//字段不合法的情况下，将弹出提示，同时抛出异常
try {
	data = jf.getJsonString();// 或者 data = jf.getJson();
}catch(ex){
	console.log(ex);
}
</script>

