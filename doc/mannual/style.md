# 样式与属性定义

## 样式

尽管如下选项可以设置单个元素的各个区域的样式，但建议您编写样式表单统一定义表单风格，请参见“样式编写指引”一节

选项| 释义| 类型 |默认值 |示例|
--- | --- | --- | --- |
ctrlCssText	|输入控件的样式 |字符串或函数 |不设置 |ctrlCssText:"color:red"
labelCssText	|控件前面标签的样式 |字符串 |不设置 |labelCssText:"color:red"
cssText	|输入控件外层容器的样式 |字符串 |不设置 |cssText:"border:1px solid gray"

## 属性

大部分属性可直接作为选项名设置，如maxlength、size、readonly属性，请参见“配置列表”一节，如果配置项支持的属性不能满足您的需求，则可自定义属性，ctrlAttr是一个对象，包含了属性的键值对

选项| 释义| 类型 |默认值 |示例|
--- | --- | --- | --- |
ctrlAttr	|输入控件的属性集合，用于设置额外或个性化的属性	|json对象	|不设置	|ctrlAttr:\{max:200,min:100,step:5,onchange:"alert(this.value)"\}
