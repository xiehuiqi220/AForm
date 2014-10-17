# 表单的结构（schema）

有三种方式来定义表单的结构，该选项为schemaMode，有3个值：

 **local**： 根据本地schema生成表单

 **remote**：默认是remote，即根据render方法传入的json数据生成表单，通常是ajax或jsonp获取到的远程数据，若render方法没传入参数，则改为local模式

 **merge**：在local定义的schema的基础上，发现了json数据中有schema没定义的字段，该字段也会生成

schemaMode设定后，需要设置fields选项来增强表单或定义字段

1. **根据json数据自动生成**

此时fields中的字段配置起点缀的作用，也不需要包含json数据中的所有字段；支持嵌套

    var jf = new AForm("divOutput",{
        schemaMode:"remote"//可不设置，默认即该项,
        fields:{
            "a":{label:"a",type:"text"}
        }
    });
    jf.render({
        a:1,
        b:2,
        c:{
            c1:3
            c2:4
        }
    })

2. **通过预先定义的schema生成表单**，支持嵌套，默认值使用 **defaultValue** 选项来定义

    var jf = new AForm("divOutput",{
    schemaMode:"local",
    fields:{
        a:{label:"a",defaultValue:1},
        b:{label:"b",defaultValue:2},
        c:{
            fields:{
                c1:{defaultValue:3}
                c2:{defaultValue:4}
            }}
    }
    });

    jf.render()

3. **混合式，即 local 和 remote 生成的结构进行合并**

    var jf = new AForm("divOutput",{
    schemaMode:"merge",
    fields:{
        a:{label:"a",defaultValue:1},
        b:{label:"b",defaultValue:2}
    }
    });

    jf.render({c:3})

    **    此时会生成含a、b和c3个字段的表单，尽管c字段未在schema中定义，但因为使用了merge模式也会生成；另本例子中如果schemaMode不是merge，而是local，则只有a和b两个字段，如果是remote，则只有c一个字段。**
