# 表单的布局

对于输入如下数据：


	{"Name":"John Smith","Age":32,"Employed":true}


AForm生成的HTML如下所示（为方便查看DOM结构，以下代码有适当删减）：


	<fieldset class="json-form-element json-Object">
	<legend style="display:">
		<label><input checked type="checkbox"></label>
	</legend>
	<div class="json-form-element json-basic-element json-String">
		<label class="json-field-label label-Name" style="display:" for="ele-json-2">Name:</label>
		<input class="json-field-input" id="ele-json-2" type="text" name="Name" value="John Smith">
	</div>
	<div class="json-form-element json-basic-element json-Number">
		<label class="json-field-label label-Age" style="display:" for="ele-json-3">Age:</label>
		<input class="json-field-input" id="ele-json-3" type="text" name="Age" value="32">
	</div>
	<div class="json-form-element json-basic-element json-Boolean">
		<label class="json-field-label label-Employed" style="display:" for="ele-json-4">Employed:</label>
		<input class="json-field-input" id="ele-json-4" type="checkbox" checked="" name="Employed">
	</div>
	</fieldset>

可以看到，每个键值对都会生成一个div块状元素包裹，里面通常包含一个label和输入控件，如果您想在一行显示多个输入项，此时可通过inline、width、break等选项来组合设置，您也可以自己编写样式表控制。

配置名		|释义	|类型	|默认值	|范例
-----		|-----	|-----	|-----	|-----
inline		|输入控件外层容器是否行内布局，相当于设置display为inline-block |布尔型 |false |inline:true
width		|输入控件外层容器的宽度，取值和css的width属性一致 |字符串 |不设置 |width:"300px"
break		|末尾换行，仅当inline为true时有效，相当于在控件后增加了一个清除浮动的元素	|布尔型	|false	|break:true














