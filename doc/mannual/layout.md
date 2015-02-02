# 表单的布局

AForm 规定一个控件要么是 block 类型，要么是 inline-block 类型，block 类型中，一个控件（包括其容器）占据一行，而inline 类型，多个控件会挤在一行。

AForm通过如下属性的复合使用可以实现大部分的表单布局：

配置名		|释义	|类型	|默认值	|范例
-----		|-----	|-----	|-----	|-----
inline		|输入控件外层容器是否行内布局，相当于设置 display 为 inline-block |布尔型 |false |`inline:true`
width		|输入控件外层容器的宽度，取值和css的width属性一致 |字符串 |不设置 |`width:"300px"`
break		|末尾换行，仅当inline为true时有效，相当于在控件后增加了一个清除浮动的元素	|布尔型	|false	|`break:true`
hideLabel		|隐藏输入框前的label	|布尔型	|false	|`hideLabel:true`
hideColon		|隐藏label后的冒号	|布尔型	|false	|`hideColon:true`














