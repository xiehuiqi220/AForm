## 定义表格操作

对于数组，AForm默认渲染成表格，表格最右侧即为操作列，默认操作列有两个按钮，增加和删除，你可以使用`noCreate`和`noDelete`分别隐藏增加和删除按钮。

默认按钮的定义在这里，你可以修改全局配置：

```javascript
AForm.Config.defaultAction = {
     "aform_array_add_row": {
        html: "<a href='javascript:void(null)' title='增加'>＋</a>"
    },
    "aform_array_delete_row": {
     html: "<a href='javascript:void(null)' title='删除'>×</a>"
    }
};

```
对于某个表单实例，若想自定其操作按钮，可以使用`rowAction`配置，例子：

```javascript
var af = new AForm("target", {
    title: "xx列表",
    schemaMode: "local",
    noCreate:true,
    noDelete:true,
    rowAction:{
        "select":{//定义了一个选择操作
            html:'<a href="#nolink">选择</a>',
            handler:function(row,table,cmd){
                console.log(row);
                // 这里能获取到当前所在的表格行
                //从而可以对行进行处理
                }
            }
        },
    fields: {...}
});
```
## 定义操作的前置或后置处理逻辑

若想在执行表格操作前做一些处理，比如删除行之前执行服务器端的删除，可以监听`beforeExeCmd`事件来实现，若该事件的handler返回false，则不会执行后续的操作；若想在表格操作完成之后做一些处理，可以监听`afterExeCmd`来实现，以下是一个例子：

```javascript
var af = new AForm(...);
af.on("beforeExeCmd", function (cmd, row) {
    if (cmd != "aform_array_delete_row")return true;

    if (confirm("删除该行吗？")) {
        var id = $("input[name=id]", row).val();
        return ajaxSyncDelete(id);//执行同步的ajax远程调用操作
    } else return false;
});
```
