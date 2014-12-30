# 模块化加载模式

## AMD规范加载AForm（如 requirejs）

```

define(["aform"], function (AForm) {
        //建立一个表单
        jf = new AForm("target");
        jf.on("renderComplete", function () {
            //done
        });

        jf.render({
            a:1,
            b:2
        });
}

```

## AMD规范定义插件

```

define("controlName",["aform"], function (AForm) {
        AForm.registerControl("controlName",{
            render:function(){...}
            getJsonPartString:function(){...}
        });
}

```
