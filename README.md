### v1.4.17 更新日志

1. 增加了AForm.get方法，可根据容器id得到aform实例
2. 增加了[valid](http://xiehuiqi220.github.io/AForm/doc/book/mannual/validate.html)事件，通知字段通过校验，另验证时机更改为当输入项失去焦点时触发，增加了AForm.Config.fn.hideTips配置，设置隐藏提示
3. 增加了trim机制，默认所有文本域取值会经过trim
4. 增加了[watch](http://xiehuiqi220.github.io/AForm/doc/book/mannual/monitor.html) 机制 
4. 其他bug修复

### v1.3.5 更新日志

1. 增加了invalid、empty和globalInvalid事件，分别对应字段不合法，字段为空和整个数据不合法，同时自定义输入组件也可以通过向表单实例发射该事件通知表单
2. 增加了errors属性，通过该对象可以获取到当前表单所有验证错误
3. 增加了breakOnError属性，默认为true,即即使仅单个字段出错，亦会中断程序执行流，设为false，则可以在所有字段错误发生后通过errors对象获取错误列表

### v1.3.0 更新日志

1. 输入控件的实现改为实例化模式，同类型多个输入控件在同一个表单不会冲突
2. 输入控件实现了继承
3. 可以使用AForm.create创建表单，和使用new AForm创建实例的参数和结果一样
4. radio类型支持设置“其他”选项，使用needOther:true将额外增加其他选项以及一个文本输入框
5. 修复表格无法设置ctrlId的bug
6. 表格和fieldset均支持frontalHtml、extHtml和tips选项
7. 输入项label的必填星号支持放置在label的前面，使用requireAtBegin为true即可
8. 增加off方法，用于解绑一个事件监听处理程序
9. 增加one方法，绑定的事件处理程序在执行后将被移除，常用于定义输入控件时在render方法中延迟绑定事件
10. schemaMode为local时，支持2层的浅拷贝
11. 表格的border默认不设置（此前设置为1），如需设置可以使用attr:{border:1}实现
12. 修复schemaMode为local且jtype为Array时render空数据仍当成object渲染的bug
13. 其他代码的优化和bug修复
14. 若div.json-form-element或div.json=field-plugin设置了ignore属性，则其下所有input均会被忽略


### 介绍

AForm 是工业级的表单解决方案，它基于声明式编程和模型驱动，做到了大部分工作的自动化，使用AForm，您仅需关心数据模型、数据约束和表单的最终展现，而无需关心表单的实现细节，对于大量使用表单的应用系统来说，AForm可以极大地提高您的生产力。

![示意图](http://xiehuiqi220.github.io/AForm/img/converse.png)

### 主要特点

1. 声明式，易用，轻量，无依赖，无侵入
2. 模型驱动，AForm认为模型即表单，表单即模型，您仅需关心数据模型，而无需关心表单实现细节
3. 自动化，支持任意复杂的数据模型生成表单，如嵌套对象，数组
4. 一站式，支持输入验证、数据适配、自定义样式、输入插件等几乎与表单相关的所有机制
5. 全适配，支持所有浏览器和移动终端，从ie6到html5无缝支持

### 安装或引用

**1)** 直接 clone 本仓库 ```git clone https://github.com/xiehuiqi220/AForm.git```

**2)** 使用 bower ```bower install aform --save```

**3)** 使用 npm ```npm install aform --save```

**4)** 直接下载js源文件 [aform.js](https://raw.githubusercontent.com/xiehuiqi220/AForm/master/aform.js)

### 使用例子


[查看 jsbin 范例](http://jsbin.com/napuxe/3/edit?html,css,js,output)

```javascript
var af = new AForm("target",{
    className:"form-horizontal",
    fields:{
        "name":{label:"姓名"},
        "age":{label:"年龄",type:"number"},
        "education":{label:"教育经历",fields:{
            school:{label:"学校"}
            from:{label:"开始时间",type:"date"},
            end:{label:"结束时间",type:"date"},
            degree:{label:"学位",required:false,type:"select",datalist:["学士","硕士",""]}
        }}
    }
});
af.render({
    "name": 1,
    "age": 2,
    "education":[{
        school:"中国理工大学",from:"2004-9-1",end:"2008-7-1",degree:"学士"
    },{
        school:"中国文化大学",from:"2008-9-1",end:"2010-7-1",degree:"硕士"
    }]
});

console.log(af.getJson());//将输出与渲染数据一致的json结构
```

### 文档

1. [demo](http://xiehuiqi220.github.io/AForm/)
2. [文档](http://xiehuiqi220.github.io/AForm/doc/book/)，持续完善中
3. [单元测试](http://xiehuiqi220.github.io/AForm/unit-test/)
4. 交流qq群：123488698

### 联系

任何问题，请联系我：xiehuiqi220@gmail.com，非休息时间一般可做到一小时内回复

### 协议
[MIT license]
