# 自定义输入控件

若html自带的输入控件，如text、select等都无法满足你的需求时，可以编写自定义输入控件，如多级联动下拉列表、ip地址输入框，此时，仅需定义控件的渲染html和取值规则即可。

可以使用 `AForm.registerControl(myControlName,[baseName],obj)` 来注册一个输入控件，参数解释：

* myControlName：输入控件的名字
* baseName：父控件名字
* obj：控件的实现

输入控件的实现至少需包含两个方法：

* `render(k, v, conf, i, af,jpath)`用于渲染控件，返回渲染后的html
    * k，当前数据的key，应当赋值给input的name属性，以供取值时拿到key
    * v，当前数据的值，应当赋值给input的value属性，以供取值时拿到value
    * conf，当前字段的配置，这里可以规定一些该自定义输入控件使用的配置项
    * i，aform当前渲染控件数（永远自增且多个aform实例共享），通常可作为控件id的组成部分以确保控件id的唯一性
    * af，当前aform实例
    * jpath，当前字段在json中的路径，如".a.b"、"[0].a.b[1].x"
* `getJsonPartString(ele)` 返回控件的键值对字符串
    * ele，当前自定义输入控件渲染内容的父节点

（**注意getJsonPartString返回的是键值对字符串，而不仅仅是值**）

使用控件非常简单，设置字段的`type`为你注册的控件名即可，如`type:"myControlName"`，aform会自动寻找已注册的控件并调用它相关的方法渲染和取值。

## 注册一个输入控件
使用 `AForm.registerControl(myControlName,obj)` 即可注册一个输入控件
```javascript
    //注册一个带两个输入框的区间输入控件
    AForm.registerControl("rangeInput": {
            desc: "区间范围输入框",
            render: function (k, v, config , i ,af) {
                v = v.split(",");
                var html = "";
                var itemType = config.itemType || "text";
                html += "<input style='" + config.ctrlCssText + "' class='form-control' name=\"" + k + "_begin\" type='text' itemType='" + itemType + "' value='" + v[0] + "' />";
                html += " - ";
                html += "<input style='" + config.ctrlCssText + "' class='form-control' name=\"" + k + "_end\" type='text' itemType='" + itemType + "' value='" + (v[1] || "") + "' />";

                return html;
            },
            "getJsonPartString": function (ele,conf)//ele为插件的外层容器dom对象
            {
                var ips = ele.getElementsByTagName("input");
                var k = ips[0].name.replace("_begin", "");
                return "\"" + k + "\":\"" + ips[0].value + "," + ips[1].value + "\"";
            }
        });
```

**注意：getJsonPartString 是返回一个key-value键值对，而不是纯粹的value，建议使用双引号包裹key，否则若key包含空格、中划线则在后续的解析中将会报语法错误**

## 使用输入控件

设置字段的type属性为控件名即可：

```javascript
    var jf = new AForm("divOutput",{
            fields:{
                range:{label:"价格区间",type:"rangeInput"}//注意type的值即控件注册的名字
        }
    });

    jf.render()
```

## 输入控件的继承

可以使用 `AForm.registerControl(name,baseName,obj)` 来继承一个输入控件，并可覆盖父控件的`render`或`getJsonPartString`方法，并可以通过 `this.__super` 来引用父控件原型。

```javascript
    //基类控件
    AForm.registerControl("date",  {
        desc:"date",
        render: function(k, v, conf, i, af) {
            return "我是date";
        },
        getJsonPartString: function(ele) {
            return "my value";
        }
    });

    //子控件
    AForm.registerControl("datetime", "date", {
        desc:"datetime",
        render: function(k, v, conf, i, af) {
            var html = this.__super.render(k, v, conf, i, af);//this.__super 为父类对象
            html += " -- datetime";
            return html;
        }
    });

    //继承aform默认的基本输入控件，针对控件仅包含一个input的情况
    //这样直接使用父类的getJsonPartString方法而无需自己实现
    AForm.registerControl("myControl", "__AFORM_BASIC_PLUGIN__", {...});

```

## 重写传统输入控件

字段的`type`设置了字段使用的输入控件，如`type:"text"`代表使用单行文本输入框，但aform会先寻找是否注册了名为`text`的自定义输入控件，若有，则优先使用自定义的输入控件，因此运用这一特性，可以重写传统 html 的输入控件，增加自己业务需要的特性。

范例：

```javascript
//完全自己实现render和getJsonPartString
AForm.registerControl("text",  {...});
AForm.registerControl("select", {...});
AForm.registerControl("textarea", {...});

//继承aform基本输入控件
AForm.registerControl("text", "__AFORM_BASIC_PLUGIN__", {...});
AForm.registerControl("select", "__AFORM_BASIC_PLUGIN__", {...});
AForm.registerControl("textarea", "__AFORM_BASIC_PLUGIN__", {...});

```

## 在自定义输入控件中绑定dom事件

由于`render`方法返回的是html，因此为html中的dom绑定事件需在整个表单渲染结束后，可以捕获aform的`renderComplete`事件并为dom绑定事件，这里的关键是需要为必要的dom元素设置合适的id或选择器，以便在处理函数中获取到响应的dom。

范例（注册一个日期选择器）：


```javascript
//继承aform基本输入控件，避免重写取值函数
AForm.registerControl("datetime", "__AFORM_BASIC_PLUGIN__", {
    desc: "日期",
    render: function(k, v, conf, i, af,jpath) {
        conf.pattern = conf.pattern || ymdPattern;//校验年月日格式
        //公共属性
        var attrHtml = [];
        if (conf.required) {
            attrHtml.push("required");
        }
        if (conf.readonly) {
            attrHtml.push("readonly");
        }
        if (conf.disabled) {
            attrHtml.push("disabled");
        }
        var id = 'ele-date-' + i;
        attrHtml.push("name='" + k +"'");
        attrHtml.push("jpath='" + jpath +"'");
        attrHtml.push("value='" + v +"'");
        attrHtml.push("id=" + id);
        attrHtml.push("class='json-field-input datetime dpl-text dpl-text-calendar " + AForm.Config.extClassName.control + "'");
        attrHtml = attrHtml.join(" ");

        var html = "<input " + attrHtml + " />";

        //注意这里使用one绑定事件，而不是使用on
        af.one("renderComplete", function() {
            var dp = new Datepicker({
                target: "#" + id
            });
            dp.on("select", function(o) {
                $('#' + id).val(dateUtil.format(o.date, 'yyyy-MM-dd'));
            })
        });
        return html;
    }
});

```
** 注意，在`render`中绑定事件尽量使用`one`而不是使用`on`， 以确保注册的事件处理程序仅执行一次，若使用`on`，则表单如果多次`render`会触发多次监听器处理程序，而由于aform每次渲染dom会发生变化，此前注册的监听器处理程序可能会因为无法找到dom节点而运行报错**


## 取数异常处理

在`getJsonPartString`中若字段未通过验证，仅需使用`emit`发送相应事件以通知业务方即可，其他的逻辑就交给aform处理吧，阅读[表单验证](../mannual/validate.md)获取更多详情。

实例：

```javascript
getJsonPartString: function (con ,fd, af) {
    var sel = $(con).find(".xyz");
    if (fd.required && !sel.val()) {
        af.emit("empty",[sel[0], fd]);//触发empty事件

        return false;
    }
    if (sel.val().indexOf("http://") !== 0) {
        af.emit("invalid",[sel[0], fd,"xx需以http开头"]);//触发invalid事件

        return false;
    }
    return sel.attr("name") + ":\"" + sel.val() + "\"";
}
```





