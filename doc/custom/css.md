# CSS文件编写指引


以如下数据为例：

```javascript
	{
	    "Name":"John Smith",
	    "Age":32,
	    "Employed":true
	}
```

AForm渲染的HTML如下所示：

```html

	<fieldset style="border:none" class="json-form-element json-Object">
    <legend style="display: none;"><label cmd="aform_array_collapse_fieldset" class="json-form-collapser "></label>
    </legend>
    <div class="json-form-fdset">
        <div style="" class="json-form-element json-basic-element json-String form-group">
            <label class="json-field-label  label_Name" for="ele_json_20">Name：</label>
            <input class="json-field-input form-control" id="ele_json_20" type="text" name="Name" value=""></div>
        <div jpath=".Age" style="" class="json-form-element json-basic-element json-Number form-group">
            <label class="json-field-label  label_Age" for="ele_json_21">Age：</label>
            <input class="json-field-input form-control" id="ele_json_21" type="text" name="Age" value="">
        </div>
        <div style="" class="json-form-element json-basic-element json-Boolean form-group">
            <label class="json-field-label  label_Employed" for="ele_json_22">Employed：</label>
            <input class="json-field-input form-control" id="ele_json_22" type="checkbox" checked="" name="Employed">
        </div>
    </div>
</fieldset>

```

您可以通过firebug或chrome devtools查看dom容器的样式名

.以下是一个AForm表单样式范例：

```css

	.aform div.json-form-element	/* 输入控件外层容器样式 */
     {
        padding: 5px;
    }

    .aform label.json-field-label	/* 输入控件左侧label样式 */
     {
        display: inline-block;
        width: 110px;
        font-weight: bold;
        font-size: 13px;
        color: #666;
    }


```

**注意，如果需要直接通过AForm的配置修改当前表单的样式，请参见`labelCssText`、`ctrlCssText`以及`cssText`属性。**

