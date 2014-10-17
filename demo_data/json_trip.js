cbGenForm({
    "申请人":"张三",
    "出发地点":"大连",
    "目的地点":"北京",
    "出发日期":"2012-9-2",
    "返回日期":"2012-9-5",
    "出差目的":"沟通A项目合作情况",
    "交通工具":"火车",
    "备用金":"5000",
    "同行人员":[{"姓名":"李四","部门":"行政部","机构":"秘书组","偕行目的":"辅助事物"}]
	},{
    "fields":
    {
    	"申请人":{extHtml:" <a style='' href='#nolink'>详细</a>"},
    	"出发地点":{inline:true,width:"350px"},
    	"目的地点":{inline:true,width:"350px",extHtml:"</div><div style='clear:both'>"},
    	"出发日期":{inline:true,width:"350px"},
    	"返回日期":{inline:true,width:"350px",extHtml:"</div><div style='clear:both'>"},
    	"出差目的":{type:"textarea",required:true},
    	"交通工具":{type:"radio",inline:true,width:"350px",datalist:["飞机","火车","专车"]},
    	"备用金":{type:"number",inline:true,width:"350px",extHtml:" RMB"},
    	"部门":{type:"select",datalist:["研发部","市场部","行政部"]},
    	"姓名":{label:"偕行人",required:true}
    }
});
