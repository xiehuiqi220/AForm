# 输入控件的类型

字段的type选项定义了该字段的输入控件，并将原封不动地渲染成最终的html标签的type属性，因此，该字段的可选值与html input的type属性是一致的，如text、textarea、select、radio、checkbox，如果您使用较新支持html5的浏览器，那么date、number、range、email、url也是恰当的值。

值得一提的是，如果type的值在插件中注册了，则将使用插件的渲染方法渲染输入控件，详细信息请参见“插件与增强”一章。

type的示例：

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
