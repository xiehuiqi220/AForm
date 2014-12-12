# 模块化加载模式

## AMD规范（requirejs）

```

define(["aform"], function (AForm) {
        //建立一个表单
        jf = new AForm("target", conf);
        jf.on("renderComplete", function () {
            //done
        });

        jf.render();
}

```

