<<<<<<< HEAD
=======
AForm使用指南
=============
>Author 伐薪


1. AForm介绍
------------
AForm是一个可以把json数据转换成表单输入项的javascript组件，并可以轻松把输入的数据又还原成json，您仅需输入几行配置即可轻松生成各式各样的标准表单；在web系统中，只要您使用表单收集数据，相信您一定可以通过AForm来大大提高开发表单的效率。

### 主要特点

1. 使用和配置简单，仅包含3个函数，可快速上手
2. 表单标准化，支持文本框、文本区域、单选框、复选框、下拉列表等各种输入控件
3. 支持对数组元素的增删改操作
4. 支持html5的新特性
5. 支持输入验证，输入提示
6. 可高度定制，支持自定义样式、界面以及各种验证处理函数

### 适用场景：

1. 各种WEB后台管理系统的数据录入表单
2. 基于json的配置编辑
3. 工作流系统的自定义表单

### 支持浏览器：

ie6+、firefox 3.5+、chrome 1.5+

2. 快速上手
-----------
使用AForm极其简单，您首先需在调用页面的head部分引入如下js文件和样式文件（样式文件是可选的）：


	<link href="AForm.css" rel="stylesheet" />
	<script src="AForm.js"></script>


然后，准备好需要渲染的json数据和针对该数据的一些配置（同样也是json格式），以及用于显示表单的DOM容器（比如一个form或者div，假设命名为“divOutput”），最后像下面这样使用：
	
		
	<script>
	var jf = new JsonForm("divOutput",{
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

>>>>>>> c72bafb30a89d808d8d6b0f9909ea29981cb33ed


3. API指引
-----------

#### 对象函数

**AForm(container,config)**

- 构造函数
- 无返回值
- 生成AForm的一个实例，但此时尚未在页面中生成表单
* container: 字符串类型，生成的表单置于何个容器，该容器的id
* config: json对象，表单的配置项，包含全局配置以及对字段的配置

.举例：


	var jf = new AForm("divTest");
	var jf = new AForm("divTest",{"fields":{"age":{"label":"年龄"}}});


[NOTE]
config的配置，请参见第4节“表单配置项”


**.render(json)**

- 生成
- 无返回值
- 生成表单，在构造函数给定的container中生成对传入json数据的输入项集合

.举例：


	jf.render({"a":1,"b":2});



**.getJsonString()**

- 获取输入控件集合的值
- 返回与render中传入的json格式一致的字符串	
- 该函数递归遍历容器下所有元素，收集所有输入项的值，返回一个字符串，该字符串的格式与用户渲染表单时传入的json数据一致

.举例：

	try
	{
	     var strJson = jf.getJsonString();
	}
	catch(ex)
	{
	      console.log("输入数据格式不对，请按提示进行更正");//不要再使用alert，抛出异常前会alert
	}

[NOTE]
该函数返回符合json格式的字符串，而不是object，当数据有异常时，会throw一个error，因此您需要捕获该异常

**.getJson ()**
- 获取输入控件集合的值
- 返回与render中传入的json格式一致的json对象
- 与getJsonString方法的区别是多了一次解析操作，亦即把字符串转换为json对象

.举例：

	
	try
	{
	     var json = jf.getJson();
	}
	catch(ex)
	{
	      console.log("输入数据格式不对，请按提示进行更正");
	}


>注意：该函数返回json对象，当数据有异常时，会throw一个error，因此您需要捕获该异常

#### 静态函数

.config
.registerPlugin

4. 表单配置项
-------------

配置项指定表单的创建细节，位于构造函数的第二个参数中，配置项包含了表单的全局设置以及json数据各个字段的配置，配置项的结构以及其属性默认值如下：

### 全局配置


*title*
:	表单的标题，可不设置

*schemaMode*
:	表单结构模式，local | merge | auto ，默认为auto，即自动根据传入的数据生成结构，local，根据fields定义生成结构，merge，fields定义和传入的数据生成的结构取并集

*readonly*
:	是否只读，若只读，则后续的字段，除非有自己的定义，否则都会只读

*showArrayNO*
:	是否显示数组表格序号列，true或false.

*hideCollapser*
:	隐藏fieldset开头的展示复选框，默认显示.

*hideColon*
:	字段的label是否显示冒号，默认显示.

*addRowText*
:	添加数组元素/表格行按钮文本，默认是“+”.

*rowAction*
:	数组操作列的按钮集合.

*tipsTpl*
:	输入框右侧的输入tips模板字符串，模板中的"\{tips\}"将自动替换为字段的tips属性，默认值"\{tips\}".

*thTipsTpl*
:	表格表头标题的tips模板字符串，模板中的"\{tips\}"将自动替换为字段的tips属性，默认值"\{tips\}".

*fields*
:	字段配置，以json数据中的字段名为key的json对象，字段配置明细请参见下面的表格.

### fields 字段配置项

配置名		|释义	|类型	|默认值	|范例
-----		|-----	|-----	|-----	|-----
|ctrlId		|输入控件的id，当该字段的输入在界面中唯一的话，设置该id便于您之后获取该输入控件，不设置该项，会使用组件自动生成的id	|字符串	|不设置	|ctrlId:"txt_name"
|ctrlAttr	|输入控件的属性集合，用于设置额外或个性化的属性	|json对象	|不设置	|ctrlAttr:\{max:200,min:100,step:5,onchange:"alert(this.value)"\}
|hidden		|是否隐藏该字段的输入界面，若true在html5下将为容器生成hidden属性	|布尔型	|false	|hidden:true
|label		|生成的label中的内容，不设置则使用字段名	|字符串	|空字符串	|label:"年龄"
|dfaultValue	|默认值	|any	|不设置	|dfaultValue:"Y"
|hideLabel	|隐藏label	|布尔型	|false	|hideLabel:true
|hideColon	|隐藏字段标签名后面的冒号	|布尔型	|false	|hideColon:true
|hideHeader	|隐藏表头，仅针对数组产生的表格有效	|布尔型	|false	|hideHeader:true
|noRender	|不渲染该字段，则获取到的数据同样没有该字段，相当于删除了该字段	|布尔型	|false	|noRender:true
|order		|序号，越大越排前，用于调节字段的顺序	|数字	|0	|order:999
|break		|换行，仅当inline为true时有效	|布尔型	|false	|break:true
|hideCollapser	|是否隐藏折叠器，针对object和array有效，若不设置或设置为false，则会在输入控件集合外层添加一个复选框用于折叠或展开子项	|布尔型	|false	|hideCollapser:true
|collapse	|是否折叠容器，针对object和array有效，	|布尔型	|false	|collapse:true
|tips		|输入控件右侧生成的tips内容，需配合tipsTpl使用 |字符串 |不设置 |tips:"填写您常使用的邮箱"
|tipsTpl	|输入控件右侧生成的tips容器html模板，需配合tips属性使用，若该项未设置，则使用全局配置 |字符串 |全局配置项中的tipsTpl |tipsTpl:"<a>\{tips\}</a>"
|ctrlCssText	|输入控件的样式 |字符串或函数 |不设置 |ctrlCssText:"color:red"
|labelCssText	|空间前面标签的样式 |字符串 |不设置 |labelCssText:"color:red"
|cssText	|输入控件外层容器的样式 |字符串 |不设置 |cssText:"border:1px solid gray"
|placeholder	|输入框为空时显示的提示文字，同html5的对应属性 |字符串 |不设置 |placeholder:"please input your address"
|extHtml	|输入框后的附加内容，勿放置任何input控件，否则会影响表单的取值 |字符串 |不设置 |extHtml:"<input type='button' value='选择' />"
|frontalHtml	|输入框前的附加内容，勿放置任何input控件，否则会影响表单的取值 |字符串 |不设置 |frontalHtml:"/data/web/template/"
|inline		|输入控件外层容器是否行内布局，相当于设置display为inline-block |布尔型 |false |inline:true
|width		|输入控件外层容器的宽度，取值和css的width属性一致 |字符串 |不设置 |width:"300px"
|type		|输入控件类型，可选的值为：text、textarea、radio、checkbox、select、hidden或其他浏览器支持的类型，如html5新增的number、date等类型，额外属性需配合ctrlAttr使用 |字符串 |text |type:"select"
|maxlength	|输入控件的输入值最大长度，仅针对文本框和文本区域有效 |数字 |不设置 |maxlength:20
|readonly	|输入控件是否只读，仅针对文本框和文本区域有效 |布尔型 |不设置 |readonly:true
|disabled	|输入控件是否禁用，效果同html元素的disabled属性 |布尔型 |不设置 |disabled:true
|required	|输入控件是否必填，用value是否为空字符串判断 |布尔型 |不设置 |required:true
|pattern	|输入值的校验正则表达式，格式同html5的表单元素的pattern属性 |字符串 |不设置 |pattern:"\\d+"
|validators	|输入值的校验函数或表达式，为字符串时，格式为js条件表达式，为真时合法；为函数时，返回true为合法；为对象时，下设两个属性rule和errorMsg，rule是一个函数；为数组时，其元素是上述任何类型 |字符串或函数 |不设置 |    validator:"$v > 5" validator:function(v){return v > 5;}
|title		|鼠标移到输入控件上时显示的提示内容，也是当字段输入不合法时的提示内容 |字符串 |不设置 | title:"请填写数字"
|datalist	|输入控件的可选项目列表，针对select、checkbox、radio有效，当浏览器支持html5的datalist且输入控件是text时，会生成datalist标签辅助输入。 |数组 |不设置 |datalist:[\{value:0,text:"男"\},\{value:1,text:"女"\}] datalist:["office","photoshop","vbscript","c#","arcgis"]
|multiple	|是否多选，仅针对select和checkbox有效 |布尔类型 |false |multiple:true
|delimiter	|多选时，数据值的分隔符 |字符串 |半角逗号"," |delimiter:";"
|size		|输入控件的size属性，表现为文本框的长度或多选下拉列表的高度等效果 |数字 |不设置 |size:5
|noCreate	|是否禁用数组表格的添加行功能 |布尔 |false |noCreate:true
|noDelete	|是否禁用数组表格的删除行功能 |布尔 |false |noCreate:true
|onRenderComplete	|当前字段渲染完毕后的处理函数 |函数 |不设置 |`onRenderComplete:function(ctrlId , con){alert(ctrlId);}`
|valueAdapter|值适配器，可在渲染或获取值前修改值，为一个对象，包含两个属性beforeRender和beforeGet，皆为传入旧值且返回新值的函数 |对象 |不设置 |`valueAdapter:{beforeRender:function(v){return v+1},beforeGet:function(v){return v-1}}`


5. 样式编写指南
-----------------

AForm对任何合法的数据都生成一个DOM容器，该容器的样式名包含“json_form_element”，因此如果您需对所有数据容器设置样式，则使用“json_form_element”选择器即可，另外容器的样式名还包括生成该容器的数据类型，比如若输入的数据是object，则容器包含样式名“json_Object”，若输入的数据是数组，则容器样式名包含“json_Array”，若输入的数据是字符串、布尔值或数字类型，则样式名除分别包含“json_String”、“json_Boolean”或“json_Number”之外，还会包含“json_basic_element”，例如，对于输入如下数据：


	{"Name":"John Smith","Age":32,"Employed":true}


其生成的HTML如下所示（为方便查看DOM结构，以下代码有适当删减）：


	<fieldset class="json_form_element json_Object">
	<legend style="display:">
		<label><input checked type="checkbox"></label>
	</legend>
	<div class="json_form_element json_basic_element json_String">
		<label class="json_field_label label_Name" style="display:" for="ele_json_2">Name:</label>
		<input class="json_field_input" id="ele_json_2" type="text" name="Name" value="John Smith">
	</div>
	<div class="json_form_element json_basic_element json_Number">
		<label class="json_field_label label_Age" style="display:" for="ele_json_3">Age:</label>
		<input class="json_field_input" id="ele_json_3" type="text" name="Age" value="32">
	</div>
	<div class="json_form_element json_basic_element json_Boolean">
		<label class="json_field_label label_Employed" style="display:" for="ele_json_4">Employed:</label>
		<input class="json_field_input" id="ele_json_4" type="checkbox" checked="" name="Employed">
	</div>
	</fieldset>


 
- 若数据是键值对，且值是字符串、布尔值或数字类型的一种，则数据的键将生成一个label元素，该label的样式名包含“json_field_label”以及“label_{键名}”。
- 任何生成的输入控件，如文本框、下拉列表、复选框等容器，都包含样式名“json_field_input”。
- 文本框和文本区域，在值改变后，会增加样式“json_form_dirty”，因此您可以通过此选择器设定被修改过的输入框的样式。
- 数组生成的表格，数据行每行的第一列—编号列，其样式名是“json_form_rowNumber”，数据航每行的最后一列—操作列，其样式名是“json_form_actionCell”。
- 若数据是必填项，则其输入框左侧的label（若有）后会生成一个带星号的span，该span的样式名为“json_form_required”。

.以下是一个AForm表单样式范例：

	
	<style>

	table.json_Array a.json_form_action	/* 数组表格操作列单元格下删除链接的样式 */
	{
		text-decoration:none;
	}

	</style>



6. 二次开发指南
----------------

.AForm生成表单的过程.

AForm根据您传入的对象生成一个表单，注意该表单并未包含form标签，而只是一批输入控件集合。默认情况下，string和number类型生成文本框，boolean类型生成一个复选框，array类型生成表格，每行代表数组的一个元素，object类型生成一个fieldset，其中每个一级子元素代表一组key-value，AForm根据您输入数据的复杂度递归地做上述过程。

.修改文本框输入值为空时的处理函数.

引入AForm的js之后，修改AFormHelper.handlerEmpty函数，该函数的原内容是：


	handlerEmpty : function(input,conf)//处理输入值为空的函数，可改写
	{
		var errMsg = conf ? ("字段["+(conf.label)+"]不能为空") : input.title;
		if(errMsg)alert(errMsg);
	
		if(typeof input.focus == "function" || typeof input.focus == "object")
		{
			input.focus();
		}
	}



.修改文本框输入值不合法时的处理函数.

引入AForm的js之后，修改AFormHelper. handlerInvalid函数，该函数的原内容是：


	handlerInvalid : function(input,conf)//处理输入值不合法的函数，可改写
	{
	var errMsg = conf ? ("字段["+(conf.label)+"]的值非法") : input.title;
	if(errMsg)alert(errMsg);
	if(typeof input.focus == "function" || typeof input.focus == "object")
	{
		input.focus();
	}
	}




.使用css3选择器获获取名为"abc"的输入控件.



	json_basic_element input[name=abc]



7. FAQ
-------


1. AForm是否支持html5的类型，如number、date等？
 - 支持！在字段配置中，设置type的值为number、date等类型即可，针对这些类型的独有属性可通过ctrlAttr设置，比如定义身高为number输入框，可按如下配置：
	Height: { label: "身高", required: true, type:"number" , ctrlAttr : \{min:100,max:200,step:1\} }

2. 我想编写js控制某个输入框，如设置事件，如何实现？
 - 可使用css选择器选取该输入框，如若该输入框对应的字段名为abc，则使用如下css选择器可选取到：json_basic_element input[name=abc]，如果您还是觉得麻烦，可设置该字段的ctrlId为abc，此后可通过getElementById得到该组件，再绑定事件即可。

3. 对某个数组，我不想用户添加和删除行，怎么实现？
 - AForm针对数组会生成一个表格，如果您不想用户添加和删除行，可设置针对该字段的属性“noCreate”和“noDelete”为true，这样就不会针对该数组生成“添加”和“删除”按钮。

4. 是否可以直接提交AForm生成的表单，会不会有什么问题？
 - 您完全可以直接通过表单的提交按钮提交AForm的表单，而不需调用getJson函数获取数据，AForm生成的输入项是符合语义的，比如针对如下数据生成的表单：
    `{"Name":"John Smith","Age":32,"Employed":true}`，
	对该表单进行get提交后，查询参数将为：
	`Name=John+Smith&Age=32&Employed=on`，
	如果数据有嵌套，或者数据中有数组，那么提交的查询参数也不会有问题，关键是服务器程序要正确地去读取这些提交过来的数据。

