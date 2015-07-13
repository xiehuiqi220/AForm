# 表单验证


## 验证方式

AForm支持3种最基本的表单验证方式：

### 1. 必填项校验

`required`，可选值 true/false

### 2. 正则表达式校验

`pattern`,值为正则表达式字符串，如：“`\\d+`”（纯数字），该选项最终会渲染成输入控件的pattern属性（HTML5 新增），因此您**不必在表达式的前后加上^以及$**。
`patternErrorMsg`，配置正则表达式校验失败的消息提示，如：“请输入数字”

### 3. 自定义逻辑校验

`validators`，数组、对象或字符串，当是对象时，其包含两个key：`rule`与`errorMsg`，`rule`是一个有两个参数函数，参数1是输入的值，参数2是输入控件本身dom对象，返回布尔类型，`true`为通过验证，否则未通过验证，未通过验证将弹出`errorMsg`提醒；

当`validators`是一个数组时，数组元素即为上述提到的包含`rule`和`errorMsg`的对象，所有规则均返回`true`该字段才通过验证；

当`validators`是一个字符串（验证器名字）时，将使用该名字对应的验证器，验证器需提前使用`AForm.registerValidator(name,obj)`注册。

**当validators用在全局配置中时，其校验的是整个表单得到的json数据值**。

示例：

```javascript
    var jf = new AForm("target",{
    fields:{
        a:{label:"a",required:true},//必填校验
        b:{label:"b",pattern:"\\d+"}//正则校验
        c:{label:"b",validators:{//自定义校验
            rule : function(v , input){
                return v.indexOf("http://") == 0;//以http开头
            },
            errorMsg:"字段b需以http开头"
        }}
    },
    validators:{//全局校验器
        rule : function(json){
            return json.a > json.b;
        },
        errorMsg:"字段a的值应该大于b的值"
    }
    });
```

`rule`作用于单个字段时其第2个参数是当前报错的输入控件，在某些情况下可以用到。

## 注册验证器

在复杂的项目，表单验证逻辑需要复用时，可以使用`AForm.registerValidator(name , obj)`来注册一个验证器，字段使用该验证器时仅需设置`validators`为验证器的名字即可，示例：

```javascript
    //定义校验手机号码的校验器
    AForm.registerValidator("cellphone", {
        rule: function(v) {
            return /\d{11}/.test(v);
        },
        errorMsg: "请输入正确的手机号码"
    });

    //长度校验
    AForm.registerValidator("100length", {
        rule: function(v, input) {
            this.errorMsg = "字符长度不能超过100，当前为" + v.length;
            return v.length <= 100;
        },
        errorMsg: ""
    });

    //使用单个校验器
    var jf = new AForm("target",{
        fields:{
            a:{label:"a",validators:"cellphone"},//使用验证器名
        }
    });

    //使用多个校验器
    var jf = new AForm("target",{
        fields:{
            a:{label:"a",validators:["cellphone","100length"]},//数组元素即验证器名
        }
    });

```

## 定义输入未通过验证的提示方式

提示方式通过如下配置定义：

```javascript
//显示提示的函数
AForm.Config.fn.showTips = function (input, errMsg) {
    alert(errMsg);
};
//当字段为空的处理函数
AForm.Config.fn.onEmpty = function (input, conf) {
    var name = input.getAttribute("name");

    var errMsg = conf ? ("字段[" + (conf.label) + "]不能为空") : input.title;
    if (!errMsg) errMsg = "字段[" + (input.getAttribute("name")) + "]不能为空";

    AForm.Config.fn.showTips(input, errMsg);
    if (typeof input.focus == "function" || typeof input.focus == "object") {
        input.focus();
    }
};
//当字段未通过验证的函数
AForm.Config.fn.onInvalid = function (input, conf, errorMsg) {
    var errMsg = errorMsg ? errorMsg : (conf ? ("字段[" + (conf.label) + "]的值非法") : input.title);
    if (!errMsg) errMsg = "字段[" + (input.getAttribute("name")) + "]非法";

    AForm.Config.fn.showTips(input, errMsg);
    if (typeof input.focus == "function" || typeof input.focus == "object") {
        input.focus();
    }
},
//当全局数据未通过验证的函数
AForm.Config.fn.onGlobalInvalid = function (msg) {
    alert(msg);
};

```

若您需要修改，可自行引入aform.config.js，并把上述代码拷贝至该文件，修改即可。

**
注意：AForm默认是只要有一个字段校验未通过，则直接抛出异常，可通过配置表单的`breakOnError:false`关闭该机制，当该属性为false时，所有字段的错误都透传了才抛出异常。**

## 验证事件

字段为空、字段校验不通过或全局数据校验不通过的处理函数可分别使用`empty`、`invalid`、`globalInvalid` 事件名来注册。

```javascript
//捕获字段为空事件
var jf = new AForm("target", ...);
jf.on("empty",function(input , conf){
    //todo
});

//捕获字段不合法事件
var jf = new AForm("target", ...);
jf.on("invalid",function(input , conf  , errorMsg){
    //todo
});

//捕获全局数据不合法事件
//由于全局数据不合法有可能并非某个输入框导致，因此input参数可能为空
var jf = new AForm("target", ...);
jf.on("empty",function(errorMsg , [input]){//
    //todo
});

```

## 汇总所有错误信息

若需获取汇总的错误信息，可通过aform实例的`errors`属性获取（注意先关闭`breakOnError`，否则总是只能获取到一个错误），该属性为一个元素为错误对象的数组，每个错误对象结构如下：

| 属性 | 释义
| -- | -- | -- |
| errorType | 错误类型，empty、invalid 或 globalInvalid|
| errorMsg | 错误消息|
| invalidControl | 对应的输入控件，有可能为空 |

示例：

```javascript
var jf = new AForm("target", {
    breakOnError : false, //当所有错误都暴露后才中断
    ...
});
var data = jf.tryGetJson();
if(!data && this.errors.length >  0){
    console.log(this.erros);
}else {
    //数据获取成功
    console.log(data);
}
```
