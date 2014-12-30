# 自定义输入控件

可以使用 `AForm.registerControl("控件名",实现)` 来注册一个输入控件。

输入控件的实现包含两个方法：render和getJsonPartString，render用于渲染控件，返回渲染后的html，getJsonPartString用于获取控件的键值对（**注意是键值对，而不仅仅是值**）

## 范例1：注册一个区间输入控件
```
AForm.registerControl("rangeInput": {
            desc: "范围输入框",
            render: function (k, v, config,af) {
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

## 使用输入控件
```

var jf = new AForm("divOutput",{
        fields:{
            range:{label:"价格区间",type:"rangeInput"}//注意type的值即控件注册的名字
        }
        });

        jf.render()
```














