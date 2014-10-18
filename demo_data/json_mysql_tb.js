cbGenForm({
    "存储引擎": {
        "表引擎": "InnxDB"
    },
    "字符集": {
        "编码": "latin1",
        "整理": ""
    },
	描述:"表1"
},{
	"tipsTpl":" <span style='color:gray;font-size:13px'>{tips}</span>",
    "fields": 
    {
		"存储引擎":{fields:{
			"表引擎": {type:"radio",required:true,disabled:true,datalist:["InnoDB","MyISAM"],tips:"支持事物、行级锁及外键"}
		}},
		"字符集":{hideCollapser:true,fields:{
			"编码": {type:"select",datalist:["latin1","utf-8","gb2312"]},
			"整理":{placeholder:"latin1_bin",required:true}
        }},
		"描述":{label:"描述",type:"text",required:true}
    }
});
