# 表单验证

AForm支持所有的表单验证方式：

1. 必填项校验,required:true/false
2. 正则表达式校验,pattern
3. 自定义逻辑校验,validators，一个数组或对象，当是对象时，其包含两个key：rule与errorMsg，rule是一个参数为输入控件值得函数，返回布尔类型，true为通过验证，否则未通过验证，未通过验证将弹出errorMsg提醒；当validators是一个数组时，数组元素即为上述提到的包含rule和errorMsg的对象，依次通过时该字段才通过验证；**当validators用在全局配置中时，其校验的是整个表单得到的json数据值**

示例：

    var jf = new AForm("divOutput",{
    schemaMode:"local",
    fields:{
        a:{label:"a",defaultValue:1,required:true},//必填校验
        b:{label:"b",defaultValue:2,pattern:"\\d+"}//正则校验
        c:{label:"b",defaultValue:"http://www.taobao.com",validators:{
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
