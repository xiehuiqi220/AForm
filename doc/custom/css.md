# 样式编写


AForm对任何合法的数据都生成一个DOM容器，该容器的样式名包含“json-form-element”，因此如果您需对所有数据容器设置样式，则使用“json-form-element”选择器即可，另外容器的样式名还包括生成该容器的数据类型，比如若输入的数据是object，则容器包含样式名“json-Object”，若输入的数据是数组，则容器样式名包含“json-Array”，若输入的数据是字符串、布尔值或数字类型，则样式名除分别包含“json-String”、“json-Boolean”或“json-Number”之外，还会包含“json-basic-element”，例如，对于输入如下数据：


	{"Name":"John Smith","Age":32,"Employed":true}


其生成的HTML如下所示（为方便查看DOM结构，以下代码有适当删减）：


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



- 若数据是键值对，且值是字符串、布尔值或数字类型的一种，则数据的键将生成一个label元素，该label的样式名包含“json-field-label”以及“label-{键名}”。
- 任何生成的输入控件，如文本框、下拉列表、复选框等容器，都包含样式名“json-field-input”。
- 文本框和文本区域，在值改变后，会增加样式“json-form-dirty”，因此您可以通过此选择器设定被修改过的输入框的样式。
- 数组生成的表格，数据行每行的第一列—编号列，其样式名是“json-form-rowNumber”，数据航每行的最后一列—操作列，其样式名是“json-form-actionCell”。
- 若数据是必填项，则其输入框左侧的label（若有）后会生成一个带星号的span，该span的样式名为“json-form-required”。

.以下是一个AForm表单样式范例：


	<style>

	table.json-Array a.json-form-action	/* 数组表格操作列单元格下删除链接的样式 */
	{
		text-decoration:none;
	}

	</style>

