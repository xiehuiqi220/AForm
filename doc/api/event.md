# 事件


| 事件名 | 释义
| -- | -- | -- |
| renderComplete | 表单 render 渲染完成
| enter | 用户按了回车键
| beforeExeCmd| 用户交互前，如删除表格的一行，返回true时才能继续后续的行为，因此可以用于删除前的一些权限校验、服务器逻辑处理等
| afterExeCmd| 用户交互后
| invalid| 字段输入错误，详见 [表单验证](../mannual/validate.md)
| valid| 字段通过校验，详见 [表单验证](../mannual/validate.md)
| empty| 字段输入为空，详见 [表单验证](../mannual/validate.md)
| globalInvalid| 全局数据错误，详见 [表单验证](../mannual/validate.md)
| change| 当表单有输入项被用户更改时，详见 [监听用户输入](../mannual/monitor.md)

## 示例：

```javascript
    //renderComplete
    var jf = new AForm(...);
    jf.on("renderComplete", function(){
        //todo
    });

    //回车
    jf.on("enter",function(){
        alert(jf.getJsonString());
    });

    //onBeforeExeCmd
    jf.on("beforeExeCmd , function(cmd,dom){
        if(cmd == "aform_array_delete_row")
        return confirm("确认删除吗？");
        else return true;
    });

```

