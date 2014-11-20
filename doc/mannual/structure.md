# 表单的结构（schema）

表单的结构即表单由哪些元素组成、元素的类型以及元素之间的关系；AForm有三种方式来决定表单的结构，该选项为schemaMode，有3个可选值：

| **remote** | 默认是remote，即根据render方法传入的json数据生成表单，通常是ajax或jsonp获取到的远程数据，若render方法没传入参数，则改为local模式 |
|--|--|
| **local** | 根据本地schema生成表单，此时fields中定义的字段决定了表单的元素 |
| **merge** | 在local定义的schema的基础上，发现了json数据中有schema没定义的字段，该字段也会生成 |

schemaMode设定后，需要设置fields选项来增强表单或定义字段


**1. remote模式，根据json数据自动生成表单**

此时fields中的字段配置起点缀的作用，也不需要包含json数据中的所有字段；支持嵌套
```javascript
var jf = new AForm("divOutput",{
    schemaMode:"remote",//可不设置，默认即该项,
    fields:{
        "a":{label:"a",type:"text"}
    }
});
jf.render({
    a:1,
    b:2,
    c:{
        c1:3,
        c2:4
    }
})
```
**2. local模式，通过本地定义的schema生成表单**

此时表单的结构以fields定义的为准，render传入的数据即使有额外的字段，也不会渲染，字段通过fields属性支持嵌套，默认值使用 **defaultValue** 选项来定义

```javascript
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

```

**3. merge，混合式，即 local 和 remote 生成的数据结构进行合并**

注意合并仅仅是浅拷贝，亦即仅仅合并第一级的属性，不会递归地合并更深层的结构

```javascript
var jf = new AForm("divOutput",{
    schemaMode:"merge",
    fields:{
        a:{label:"a",defaultValue:1},
        b:{label:"b",defaultValue:2}
    }
});

jf.render({c:3})

```

**    此时会生成含a、b和c 3个字段的表单，尽管c字段未在schema中定义，但因为使用了merge模式也会生成；另本例子中如果schemaMode不是merge，而是local，则只有a和b两个字段，如果是remote，则只有c一个字段。**
