# 接口列表

| 接口名 | 释义 | 备注 |
| -- | -- | -- |
| render([data]) | 渲染表单 | 当不传入参数时，将使用fields的定义生成表单，即使用local模式 |
| getJsonString() | 获取为json字符串 | 输入未通过校验时会抛出异常 |
| getJson() | 获取为json对象 | 输入未通过校验时会抛出异常 |
| tryGetJson() | 获取为json对象 | 输入未通过校验时会返回null但不会抛出异常 |
| tryGetJsonString() | 获取为json字符串 | 输入未通过校验时返回空字符串 |

# 属性列表

| 属性名 | 释义 | 备注 |
| -- | -- | -- |
| config | 当前AForm的配置 | |
| container | 当前AForm所使用的DOM容器 | |
| originData | 当前AForm最后一次渲染所使用的数据 | 最终生成表单的数据，有可能与用户render传入的数据不完全一致 |
