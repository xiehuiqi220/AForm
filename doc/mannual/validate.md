# 表单验证


## 验证方式

AForm支持3种最基本的表单验证方式：

### 1. 必填项校验

`required`，可选值 true/false

### 2. 正则表达式校验

`pattern`,值为正则表达式字符串，如：“`\\d+`”（纯数字），该选项最终会渲染成输入控件的pattern属性（HTML5 新增），因此您**不必在表达式的前后加上^以及$**。

### 3. 自定义逻辑校验

`validators`，一个数组或对象，当是对象时，其包含两个key：`rule`与`errorMsg`，`rule`是一个参数为输入控件值的函数，返回布尔类型，`true`为通过验证，否则未通过验证，未通过验证将弹出`errorMsg`提醒；

当`validators`是一个数组时，数组元素即为上述提到的包含`rule`和`errorMsg`的对象，所有规则通过时该字段才通过验证；

**当validators用在全局配置中时，其校验的是整个表单得到的json数据值**。

## 示例：

    var jf = new AForm("target",{
    fields:{
        a:{label:"a",required:true},//必填校验
        b:{label:"b",pattern:"\\d+"}//正则校验
        c:{label:"b",validators:{//自定义校验
            rule : function(v){
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

## 定义输入未通过验证的提示方式

提示方式通过如下配置定义：

```
AForm.Config.fn = {
        "showTips": function (input, errMsg) {
            alert(errMsg);
        },
        "onEmpty": function (input, conf) {
            var name = input.getAttribute("name");

            var errMsg = conf ? ("字段[" + (conf.label) + "]不能为空") : input.title;
            if (!errMsg) errMsg = "字段[" + (input.getAttribute("name")) + "]不能为空";

            AForm.Config.fn.showTips(input, errMsg);
            if (typeof input.focus == "function" || typeof input.focus == "object") {
                input.focus();
            }
        },
        "onInvalid": function (input, conf, errorMsg) {
            var errMsg = errorMsg ? errorMsg : (conf ? ("字段[" + (conf.label) + "]的值非法") : input.title);
            if (!errMsg) errMsg = "字段[" + (input.getAttribute("name")) + "]非法";

            AForm.Config.fn.showTips(input, errMsg);
            if (typeof input.focus == "function" || typeof input.focus == "object") {
                input.focus();
            }
        },
        "onGlobalInvalid": function (msg) {
            alert(msg);
        }
    };

```

若您需要修改，可自行引入aform.config.js，并把上述代码拷贝至该文件，修改即可。

**
注意：目前AForm的机制是只要有一个字段校验未通过，则直接抛出异常，因此暂不支持一次性显示所有未通过校验字段的原因。**


