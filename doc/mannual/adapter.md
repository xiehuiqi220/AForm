# 数据适配器

valueAdapter,值适配器，可在渲染或获取值前修改值，valueAdapter为一个对象，包含两个属性 beforeRender 和 beforeGet，分别代表渲染前的处理和获取数据前的处理，通常这两个函数的逻辑是相反的，以保持数据一致性，这两个函数的参数都是当前的值，函数返回新的值

## 示例，把Y/N转为布尔值

    var jf = new AForm("divOutPut",fields:{
        "isPublish":{
            label:"是否发布",valueAdapter:{
                beforeRender:function(v){
                    return v == "Y";
                },
                beforeGet:function(v){
                    return v ? "Y" : "N";
                }
            }
        }
    });
    jf.render({isPublish:"N"});
    //最终结果是isPublish将渲染为一个复选框，而获取的数据仍然会是Y或N，而不是true或false

## 什么情况下用到适配器？

比如，对于某个键，服务器返回给你的是Y/N，而你想转为true或false从而渲染为一个复选框，此时适配器就有用了；或者当服务器传给你的时间是unix时间戳，你想转为yMd本地化格式，这个时候适配器也很有用，尽管你可以再渲染表单前对数据作一下加工，但适配器可以使你的代码写的更为优雅简洁。
