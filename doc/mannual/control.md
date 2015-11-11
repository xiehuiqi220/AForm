# 输入控件的类型

字段的 type 选项决定了该字段的输入控件，并将原封不动地渲染成最终的html标签的type属性，因此，该字段的可选值与html input的type属性是一致的，如：

- text
- textarea
- select
- radio
- checkbox

如果您使用较新支持html5的浏览器，那么

- date
- number
- range
- email
- url

也是恰当的值。

**注意**：当你未设置type时，AForm会根据输入数据的类型自动设置控件类型，如:

1. 布尔类型的值将自动生成一个复选框
2. 对象类型将生成一个fieldset
3. 数组类型将生成一个table
4. 数值、字符串类型将生成单个文本输入框


值得一提的是，如果type的值在插件中注册了（通常是你想自定义输入控件时），则将使用插件的渲染方法渲染输入控件，详细信息请参见 [自定义输入控件](../plugin/control.md)一章。

## type的示例：
```javascript
    var jf = new AForm("divOutput",{
    schemaMode:"local",
    fields:{
        a:{label:"a",type:"textarea"},//文本区域
        b:{label:"b",type:"radio",datalist:[
            {text:"男",value:"male"},
            {text:"女",value:"female"},
        ]}//单选，选项使用datalist定义
    }
    });

```
# 自定义输入控件

请参考 [自定义输入控件](../plugin/control.md)


