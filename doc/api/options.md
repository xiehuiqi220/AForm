# 配置列表


## 表单配置

配置名		|释义	|类型	|默认值	|范例
-----		|-----	|-----	|-----	|-----
title		|表单标题|字符串	|不设置	|`title : "新增页面"`
schemaMode		|结构模式，`remote/local/merge`|字符串	|remote	|`schemaMode : "local"`
showArrayNO		|是否显示数组表格前的序号列|布尔	|false	|`showArrayNO : false`
hideCollapser		|隐藏折叠器|布尔	|false	|`hideCollapser : true`
className		|容器样式名|字符串	|不设置	|`className : "compact vertical"`
validators		|全局验证器|对象或数组	|不设置	|请见"表单验证一节"
readonly		|是否只读，若是则表单下所有字段为只读|布尔	|false	|`readonly : true`
hideColon		|隐藏label后的冒号|布尔	|false	|`hideColon : true`
addRowText		|数组表格添加新行的链接文本|字符串	|AForm.Config.wording.addRowText	|`addRowText : "新增一行"`
rowAction		|数组表单操作列的按钮列表|对象	|AForm.Config.defaultAction	|请参见“表格增强”一节
tipsTpl		|tips模板|字符串	|AForm.Config.tpl.tips	|`tipsTpl : "<b>{tips}</b>"`
thTipsTpl		|表格列tips模板|字符串	|AForm.Config.tpl.thTips	|`thTipsTpl : "<b style='{tipsCssText}'>{tips}</b>"`
restrict		|是否严格模式，请参见"避免额外输入项干预数据获取"一节|布尔	|false|`restrict :true`
fields		|表单字段，详细配置见“字段配置”|对象	|不设置	|`fields : {}`


## 字段配置

配置名		|释义	|类型	|默认值	|范例
-----		|-----	|-----	|-----	|-----
ctrlId		|输入控件的id，当该字段的输入在界面中唯一的话，设置该id便于您之后获取该输入控件，不设置该项，会使用组件自动生成的id	|字符串	|不设置	|`ctrlId:"txt_name"`
ctrlAttr	|输入控件的属性集合，用于设置额外或个性化的属性	|json对象	|不设置	|`ctrlAttr:{max:200,min:100,step:5}`
hidden		|是否隐藏该字段的输入界面，若true在html5下将为容器生成hidden属性	|布尔型	|false	|`hidden:true`
label		|生成的label中的内容，不设置则使用字段名	|字符串	|空字符串	|`label:"年龄"`
dfaultValue	|默认值	|any	|不设置	|`dfaultValue:"Y"`
hideLabel	|隐藏label	|布尔型	|false	|`hideLabel:true`
hideColon	|隐藏字段标签名后面的冒号	|布尔型	|false	|`hideColon:true`
hideHeader	|隐藏表头，仅针对数组产生的表格有效	|布尔型	|false	|`hideHeader:true`
noRender	|不渲染该字段，则获取到的数据同样没有该字段，相当于删除了该字段	|布尔型	|false	|`noRender:true`
order		|序号，越大越排前，用于调节字段的顺序	|数字	|0	|`order:999`
break		|换行，仅当inline为true时有效	|布尔型	|false	|`break:true`
hideCollapser	|是否隐藏折叠器，针对object和array有效，若不设置或设置为false，则会在输入控件集合外层添加一个复选框用于折叠或展开子项	|布尔型	|false	|`hideCollapser:true`
collapse	|是否折叠容器，针对object和array有效，	|布尔型	|false	|`collapse:true`
tips		|输入控件右侧生成的tips内容，需配合tipsTpl使用 |字符串 |不设置 |`tips:"<span>填写您常使用的邮箱</span>"`
noTips		|是否显示输入框右侧的tips，对于表格中的输入框，由于表头已显示了tips，因此可设置此项以隐藏输入框后的tips |布尔型 |false |`noTips:true`
tipsTpl	|输入控件右侧生成的tips容器html模板，需配合tips属性使用，若该项未设置，则使用全局配置 |字符串 |全局配置项中的tipsTpl |`tipsTpl:"<a>\{tips\}</a>"`
ctrlCssText	|输入控件的样式 |字符串或函数 |不设置 |`ctrlCssText:"color:red"`
labelCssText	|空间前面标签的样式 |字符串 |不设置 |`labelCssText:"color:red"`
tipsCssText	|tips标签的样式 |字符串 |不设置 |`tipsCssText:"color:red"`
cssText	|输入控件外层容器的样式 |字符串 |不设置 |`cssText:"border:1px solid gray"`
placeholder	|输入框为空时显示的提示文字，同html5的对应属性 |字符串 |不设置 |`placeholder:"please input your address"`
extHtml	|输入框后的附加内容，勿放置任何input控件，否则会影响表单的取值 |字符串 |不设置 |`extHtml:"<input type='button' value='选择' />"`
frontalHtml|输入框前的附加内容，勿放置任何input控件，否则会影响表单的取值 |字符串 |不设置 | `frontalHtml:"/data/web/template/"`
inline		|输入控件外层容器是否行内布局，相当于设置display为inline-block |布尔型 |false |`inline:true`
width		|输入控件外层容器的宽度，取值和css的width属性一致 |字符串 |不设置 |`width:"300px"`
type		|输入控件类型，可选的值为：text、textarea、radio、checkbox、select、hidden或其他浏览器支持的类型，如html5新增的number、date等类型，额外属性需配合ctrlAttr使用 |字符串 |text |`type:"select"`
needOther		|仅针对type为radio的字段有效，将生成“其他”选项和输入框 |布尔型 |false |`needOther:true`
maxlength	|输入控件的输入值最大长度，仅针对文本框有效 |数字 |不设置 |`maxlength:20`
minlength	|输入控件的输入值最小长度 |数字 |不设置 |`minlength:10`
readonly	|输入控件是否只读，仅针对文本框和文本区域有效 |布尔型 |不设置 |`readonly:true`
disabled	|输入控件是否禁用，效果同html元素的disabled属性 |布尔型 |不设置 |`disabled:true`
required	|输入控件是否必填，用value是否为空字符串判断 |布尔型 |不设置 |`required:true`
requiredAtBegin	|表示必填项的符号是否显示在标签最前面，否则显示在后面 |布尔型 |false |`requiredAtBegin:true`
pattern	|输入值的校验正则表达式，格式同html5的表单元素的pattern属性 |字符串 |不设置 |`pattern:"\\d+"`
patternErrorMsg	|正则校验失败后的错误提示 |字符串 |不设置 |`patternErrorMsg:"宽度需要是一个整数"`
validators	|输入值的校验函数或表达式，为字符串时，格式为js条件表达式，为真时合法；为函数时，返回true为合法；为对象时，下设两个属性rule和errorMsg，rule是一个函数；为数组时，其元素是上述任何类型 |字符串或函数 |不设置 |    `validator:function(v){return v > 5;}`
title		|鼠标移到输入控件上时显示的提示内容，也是当字段输入不合法时的提示内容 |字符串 |不设置 | title:"请填写数字"
datalist	|输入控件的可选项目列表，针对select、checkbox、radio有效，当浏览器支持html5的datalist且输入控件是text时，会生成datalist标签辅助输入。 |数组 |不设置 |`datalist:[{value:0,text:"男",group:"分组名",custom:"自定义数据"}]`
multiple	|是否多选，仅针对select和checkbox有效 |布尔类型 |false |`multiple:true`
delimiter	|多选时，数据值的分隔符 |字符串 |半角逗号"," |`delimiter:";"`
size		|输入控件的size属性，表现为文本框的长度或多选下拉列表的高度等效果 |数字 |不设置 |`size:5`
noCreate	|是否禁用数组表格的添加行功能 |布尔 |false |`noCreate:true`
noDelete	|是否禁用数组表格的删除行功能 |布尔 |false |`noCreate:true`
onRenderComplete	|当前字段渲染完毕后的处理函数 |函数 |不设置 |`onRenderComplete:fn`
valueAdapter|值适配器，可在渲染或获取值前修改值，为一个对象，包含两个属性beforeRender和beforeGet，皆为传入旧值且返回新值的函数 |对象 |不设置 | 请参见数据适配器一章


