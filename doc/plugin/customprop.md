# 自定义属性

若aform或基本html提供的输入项属性无法满足需求，可编写自定义属性扩展表单的功能。

可使用 `AForm.registerProp` 来注册一个自定义属性，该方法第一个参数是属性名，第二个参数是属性的实现，实现中可通过`beforeRender`来修改当前使用了该属性的字段的配置：
```javascript
AForm.registerProp("propName", {
    beforeRender: function(conf) {
        //这里修改当前字段的配置
    }
});
```

而使用自定义属性与使用aform提供给字段的属性是一样的。


** 范例1，定义 minlength 属性 **

传统的html为input提供了maxlength属性，该属性使得输入框的字符无法超出给定的长度，然而并没有minlength属性，用户希望该属性可以限制某个输入项最少的字符长度，可以通过aform的自定义属性并结合验证器来实现这个功能，范例代码：

```javascript
AForm.registerProp("minlength", {
    beforeRender: function(conf) {
        if (!conf.minlength) {
            return;
        }
        conf.ctrlAttr["minlength"] = conf.minlength;
        conf.validators.push({
            rule: function(v) {
                return v.length >= conf.minlength;
            },
            errorMsg: "输入的字符长度需不少于" + conf.minlength
        });
    }
});


```
** 范例2，定义异步 datalist 属性 **

aform 为拥有可选项的输入控件如radio、select、checkbox提供了datalist属性指定选项列表，然而在实际的场景中，datalist 属性可能来自一个远程数据源，此时可通过自定义属性结合ajax来实现：

```javascript
//先引入jquery
//注册异步datalist属性，名为asyncDatalist
AForm.registerProp("asyncDatalist", {
    "beforeRender": function(conf , af) {
        var etc = conf.asyncDatalist;
        if (!etc) {
            return;
        }

        var datalist = [];
        conf.datalist = conf.datalist || [];
        var url = etc.url;
        af.busy++;//设置忙指示器，以便aform在数据获取完毕时才渲染
        $.ajax({
            url: url
        }).done(function(d) {
            var dl = eval("d"+etc.dataPath);
            $.each(dl, function(i, l) {
                datalist.push({
                    value: l[etc.valueKey],
                    text: l[etc.textKey]
                });
            });

            conf.datalist = conf.datalist.concat(datalist);
            af.busy--;//忙指示器-1
        });
    }
});
```
注意该自定义属性使用了延迟渲染的特性，请参考[延迟渲染](../api/lazyrender.md)。

使用该`asyncDatalist`属性：

```javascript
var af = new AForm("targetId", {
    fields: {
        "myCode": {label: "业务场景",
            datalist: [
                {value: "", text: "-------选择场景-------"}
            ],
			asyncDatalist: {//使用自定义属性
                url: "/mylist.json",
                dataPath: ".content.list",
                valueKey: "id",
                textKey: "name"
            }, type: "select", required: true},
    }
});
af.render({
    "myCode": "3"
});
```

```

