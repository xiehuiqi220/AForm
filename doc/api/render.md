# 渲染与获取数据

1. 渲染获取好的数据

    var jf = new AForm("divOutput",{});
    jf.render({
        a:1,
        b:2
    })

2. 直接根据本地schema渲染表单

    var jf = new AForm("divOutput",{
    schemaMode:"local",
    fields:{
        a:{label:"a",defaultValue:1},
        b:{label:"b",defaultValue:2}
    }
    });

    jf.render()

上述两段代码的结果是一样的。

##获取数据

AForm获取的数据格式与你当初渲染使用的格式是一致的，需要注意的是，一旦输入的值未通过验证，AForm会直接抛出异常，因此您需要使用try捕获之，但通常不需要做什么处理，因为抛出异常的同时AForm会弹出提示指示何个输入控件有误。

1. 获取为json字符串

    var str = "";

    try {
        str = jf.getJsonString();
    }catch(ex){
        console.dir(ex);
    }

2. 获取为json对象，try/catch已省略

    var data = jf.getJson();

3. 不抛出异常获取，若输入的项未通过验证，直接返回false

    var data = jf.tryGetJsonString();
    var data = jf.tryGetJson();

    if(data !== false){
        //todo
    }








