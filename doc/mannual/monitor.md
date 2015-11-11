# 监听用户输入

若需监听表单所有输入，可使用change事件来监听，处理函数有3个参数，含义分别是：

* jpath：当前修改的输入项的jpath路径，如".age"、".list[0].name"，注意若当前渲染的是一个对象，那么jpath前面是带点号的
* val：修改后的新值
* input：当前操作的输入控件


范例：

```javascript
var jf = new AForm(...);
jf.on("change",function(jpath , val , input){
    console.log(arguments);
});

```

##监听指定字段

在change事件中可以根据jpath来筛选需要处理的字段，也可以直接编写配置实现，aform提供了watch配置，该配置是一个key为jpath，值为函数数组的对象，也就是说一个jpath可以指定多个处理函数，例如：

```javscript
var af = new Aform("target",{
title:"test form",
fields:{
    age:{label:"年龄"}
}
watch: {
            ".age": [
            function(cv , input) {
                console.log("我的值被改成" + cv + "啦！");
            }
            ]
        }
});
```


##注意

目前aform仅能监听由aform自己生成的输入项修改事件，若是自定义控件，需自行触发aform实例的change事件，如

```javscript
afObj.emit("change", [jpath , val ， input]);
```

另外，若字段是复选框组合，则监听到的变化是被选中那个复选框的值，这一点与aform取数时会取到所有勾选复选框的值有一点差别。
