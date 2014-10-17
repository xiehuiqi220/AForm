cbGenForm({
    "存储引擎": {
        "表引擎": "InnoDB"
    },
    "字符集": {
        "编码": "latin1",
        "整理": "latin1_bin"
    }
},{
	"tipsTpl":" <span style='color:gray;font-size:13px'>{tips}</span>",
    "fields": 
    {
        "表引擎": {type:"select",disabled:true,datalist:["InnoDB","MyISAM"],tips:"支持事物、行级锁及外键"},
        "编码": {type:"select",datalist:["latin1","utf-8","gb2312"]},
        "字符集":{hideCollapser:true}
    }
});
