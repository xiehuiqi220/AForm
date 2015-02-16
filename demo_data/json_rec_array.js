cbGenForm({
    "name": 1,
    "age": 2,
    "education":[{
        degree:"学士",school:"中国理工大学",from:"2015年2月16日"
    },{
        degree:"硕士",school:"中国文化大学",from:"2015年2月16日"
    }]
},{
	className:"form-horizontal",
    fields:{
        "name":{label:"姓名"},
        "age":{label:"年龄",type:"number"},
        "education":{label:"教育经历",fields:{
            degree:{label:"学位",required:true},
        	school:{label:"学校",order:1},
			from:{noRender:true}
        }}
    }
});
