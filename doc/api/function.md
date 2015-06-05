# 静态函数

静态方法通过`AForm.methodXX()`来调用，无需创建AForm的实例，通常用于全局数据的注册。

| 接口名 | 释义 | 备注 |
| -- | -- | -- |
| create(container,config) | 创建表单实例 | 同 `new AForm(...)` |
| registerAdapter(name,obj) | 注册数据适配器 |obj定义见2.9数据适配器章节
| registerControl(name,[baseName],obj) | 注册输入控件 |obj定义见3.1自定义输入控件
| registerValidator(name,obj) | 注册校验器 |obj定义见2.6表单验证章节

# 对象方法

| 接口名 | 释义 | 备注 |
| -- | -- | -- |
| render([data]) | 渲染表单 | 当不传入参数时，将使用fields的定义生成表单，即使用local模式 |
| getJsonString() | 获取为json字符串 | 输入未通过校验时会抛出异常 |
| getJson() | 获取为json对象 | 输入未通过校验时会抛出异常 |
| tryGetJson() | 获取为json对象 | 输入未通过校验时会返回null但不会抛出异常 |
| tryGetJsonString() | 获取为json字符串 | 输入未通过校验时返回空字符串 |
| reset() | 重置表单 | 将使用最后一次渲染的数据重新渲染表单，因此会清除上次渲染之后用户输入的痕迹 **注意：请避免使用表单DOM对象本身提供的reset方法来重置表单，应使用AForm提供的reset方法重置表单，否则会导致表单数据完全置为空** |

# 属性列表

| 属性名 | 释义 | 备注 |
| -- | -- | -- |
| config | 当前AForm的配置 | |
| container | 当前AForm所使用的DOM容器 | |
| originData | 当前AForm最后一次渲染所使用的数据 | 最终生成表单的数据，有可能与用户render传入的数据不完全一致 |
