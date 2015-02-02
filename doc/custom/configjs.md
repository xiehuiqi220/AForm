#与Bootstrap的结合

Bootstrap 3.2 支持3种布局方式：

1. 垂直（`form-vertical`），标签和输入框上下排列
2. 行内（`form-inline`），标签和输入框水平排列，一行显示多个域
3. 水平（`form-horizontal`），标签和输入框水平排列，但一行仅显示一个域

另 Bootstrap 为表单容器以及输入控件定义了`form-group`、`form-control`，因此 AForm 与 Bootstrap 的结合，归根到底就是要把 AForm 配置为应用上述样式。

## 1、修改AForm全局配置增加额外样式名

在创建AForm表单实例之前，为AForm生成的DOM的添加 Bootstrap 对应的样式：

```javascript
    AForm.Config.extClassName.basicContainer = "form-group";
    AForm.Config.extClassName.table = "table table-bordered";
    AForm.Config.extClassName.control = "form-control";

```

这段代码可以在创建某个AForm前直接使用，也可以放置在aform.config.js文件中作为全站默认配置

## 2、通过 `className` 属性设置AForm实例的样式名为Bootstrap相应布局样式名

```javascript

    var jf = new AForm("target",{
        className:"form-horizontal",//注意该属性
        fields:{
            a:{label:"a",defaultValue:1},
            b:{label:"b",defaultValue:2}
        }
    });

    jf.render();

```

**注意：由于 Bootstrap 的表单html规范和AForm的并不完全一致，因此在实现form-horizontal的时候需要您强制设置 `form-control` 的 `display` 属性为 `inline` 且宽度不为100% ，从而不占据一行的空间**，像如下这样：

```css
.aform.form-horizontal form-control {
    display:inline;
    width:auto;
}

```
