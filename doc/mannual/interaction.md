# 交互

## 隐藏折叠器

    当字段的值是json对象或者数组时，字段label的左侧默认会显示一个三角形图标用于折叠或展开，如果不想显示折叠器，则可以这样

    hideCollapser:true

## 默认即折叠复杂对象

    默认情况下，折叠器是展开的，如果想默认折叠，则这样：

    collapse:true



## 示例：

    var jf = new AForm("divOutput",{
    fields:{
        a:{label:"a",hideCollapser:true},
        b:{label:"b",collapse:true},
    });
    jf.render({a:[1,2,3],b:{x:1}});

## 回车提交、删除前确认等交互请参看“事件”一节
