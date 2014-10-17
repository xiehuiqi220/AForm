# 输入提示

1. placeholder，将在输入框内部显示提示文案
2. tips，输入控件后方显示文案
3. tipsTpl，决定tips的html模板，{tips}代表嵌入tips变量


示例：

    var jf = new AForm("divOutput",{
    schemaMode:"local",
    fields:{
        a:{label:"a",placeholder:"请输入a"},
        b:{label:"b",tips:"需要大于5",tipsTpl:"<span>{tips}</span>"}
    });

