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

任何问题，请联系我：xiehuiqi220@gmail.com，我会尽快回复

### 协议
[MIT license]
