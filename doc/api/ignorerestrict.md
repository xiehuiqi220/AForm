# 关于ignore属性与restrict模式

由于AForm获取数据（`getJson()` 或 `getJsonString()`）时会根据dom的结构来获取对应的json结构，因此若AForm在渲染后，容器内增加了一些额外的input输入项，那么可能会导致不可预期的错误，因额外的输入项不是AForm指定schema生成的。

AForm 有两个方案可以解决本问题：

### 方法1、用 ignore 属性忽略输入项

为新注入的额外输入元素增加 `ignore` 属性，并把属性值设为`ignore`，这样 AForm 获取数据时会忽略该输入组件，注意 `ignore` 并不是dom 的标准属性，而是自定义属性：

```javascript
<input type="text" ignore="ignore" />

$("input").attr("ignore","ignore");//使用jquery
```

`ignore` 也可用于忽略 AForm 表单生成的字段，为表单中的输入项DOM元素设置该属性，则该输入项不会被取值，因此其验证规则也不会生效。

### 方法2、设置表单为严格模式

为表单的全局属性设置 `restrict` 为 `true`，该模式在获取数据时将忽略所有非 AForm 生成的输入控件，例子：

```javascript
var jf = new AForm("target",{
    restrict:true,//严格模式
    fields:{
        //字段a通过extHtml为当前的表单增加了额外的输入框
        //但由于设置了严格模式，获取数据时不会获取到该 额外输入框的数据
        "a":{label:"a",type:"text",extHtml:"<input name='xx' />"}
    }
});

console.log(jf.getJson());//输出的数据将不会包含xx属性
```

