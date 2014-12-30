# 事件


| 事件名 | 释义
| -- | -- | -- |
| renderComplete | 表单 render 渲染完成时的处理函数
| enter | 用户按了回车键时的处理函数
| beforeExeCmd| 用户交互前的处理函数，如删除表格的一行，返回true时才能继续后续的行为，因此可以用于删除前的一些权限校验、服务器逻辑处理等
| afterExeCmd| 用户交互后的处理函数

## 示例：

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


