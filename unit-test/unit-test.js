AForm.Config.fn.showTips = function() {
    console.log(arguments);
};
QUnit.testDone(function() {
    AForm.renderCount = 0;
});
QUnit.test("渲染与获取", function(assert) {
    var data = {
        "arraySimple": [
            1,
            2,
            3
        ], "arrayComplext": [
            {x: 1, y: 2},
            {x: 3, y: 4}
        ],
        "boolean": true,
        "null": null,
        "number": 123,
        "object": {
            "a": "b",
            "c": "d",
            "e": "f"
        },
        "string": "Hello World"
    };

    var af = new AForm("frm");
    af.render(data);

    var desthtml = '<fieldset style=\";border:none\" class=\"json-form-element json-Object\"><legend style=\"display: none;\"><label cmd=\"aform_array_collapse_fieldset\" class=\"json-form-collapser json-form-ctrl-un-collapse\" id=\"json_form_collapser_1\"></label></legend><div class=\"json-form-fdset\" style=\"display:\"><table id=\"ele_json_tb_2\" border=\"1\" name=\"arraySimple\" style=\"\" class=\"json-form-element json-Array table table-bordered\"><caption style=\"display:\"><label cmd=\"aform_array_collapse_table\" class=\"json-form-collapser json-form-ctrl-un-collapse\">arraySimple</label> <a cmd=\"aform_array_add_row\" style=\"display:\" class=\"json-form-array-add\" href=\"javascript:void(null)\" title=\"增加一行\">增加</a> </caption><tbody style=\"display:\"><tr class=\" json-basic-elementjson-Number\"><td class=\"json-form-rowNumber\">1</td><td><div name=\"arraySimple\" jpath=\".arraySimple[0]\" style=\"\" class=\"json-form-element json-basic-element json-Number form-group\"><label class=\"json-field-label  label_0\" style=\";display:none\" for=\"ele_json_3\">arraySimple：</label><input data-gen=\"aform\" jpath=\".arraySimple[0]\" class=\"json-field-input form-control\" id=\"ele_json_3\" type=\"text\" value=\"\"></div></td><td class=\"json-form-actionCell\"><span class=\"json-form-action-wrapper\" cmd=\"aform_array_add_row\"><a cmd=\"aform_array_add_row\" href=\"javascript:void(null)\" title=\"增加\">＋</a></span><span class=\"json-form-action-wrapper\" cmd=\"aform_array_delete_row\"><a cmd=\"aform_array_delete_row\" href=\"javascript:void(null)\" title=\"删除\">×</a></span></td></tr><tr class=\" json-basic-elementjson-Number\"><td class=\"json-form-rowNumber\">2</td><td><div name=\"arraySimple\" jpath=\".arraySimple[1]\" style=\"\" class=\"json-form-element json-basic-element json-Number form-group\"><label class=\"json-field-label  label_1\" style=\";display:none\" for=\"ele_json_4\">arraySimple：</label><input data-gen=\"aform\" jpath=\".arraySimple[1]\" class=\"json-field-input form-control\" id=\"ele_json_4\" type=\"text\" value=\"\"></div></td><td class=\"json-form-actionCell\"><span class=\"json-form-action-wrapper\" cmd=\"aform_array_add_row\"><a cmd=\"aform_array_add_row\" href=\"javascript:void(null)\" title=\"增加\">＋</a></span><span class=\"json-form-action-wrapper\" cmd=\"aform_array_delete_row\"><a cmd=\"aform_array_delete_row\" href=\"javascript:void(null)\" title=\"删除\">×</a></span></td></tr><tr class=\" json-basic-elementjson-Number\"><td class=\"json-form-rowNumber\">3</td><td><div name=\"arraySimple\" jpath=\".arraySimple[2]\" style=\"\" class=\"json-form-element json-basic-element json-Number form-group\"><label class=\"json-field-label  label_2\" style=\";display:none\" for=\"ele_json_5\">arraySimple：</label><input data-gen=\"aform\" jpath=\".arraySimple[2]\" class=\"json-field-input form-control\" id=\"ele_json_5\" type=\"text\" value=\"\"></div></td><td class=\"json-form-actionCell\"><span class=\"json-form-action-wrapper\" cmd=\"aform_array_add_row\"><a cmd=\"aform_array_add_row\" href=\"javascript:void(null)\" title=\"增加\">＋</a></span><span class=\"json-form-action-wrapper\" cmd=\"aform_array_delete_row\"><a cmd=\"aform_array_delete_row\" href=\"javascript:void(null)\" title=\"删除\">×</a></span></td></tr></tbody></table><table id=\"ele_json_tb_6\" border=\"1\" name=\"arrayComplext\" style=\"\" class=\"json-form-element json-Array table table-bordered\"><caption style=\"display:\"><label cmd=\"aform_array_collapse_table\" class=\"json-form-collapser json-form-ctrl-un-collapse\">arrayComplext</label> <a cmd=\"aform_array_add_row\" style=\"display:\" class=\"json-form-array-add\" href=\"javascript:void(null)\" title=\"增加一行\">增加</a> </caption><thead style=\"display:\"><tr><th style=\"\">NO.</th><th>x</th><th>y</th><th class=\"json-form-action\">操作</th></tr></thead><tbody style=\"display:\"><tr class=\"json-Object\"><td style=\"\" class=\"json-form-rowNumber\">1</td><td><div jpath=\".arrayComplext[0].x\" style=\"\" class=\"json-form-element json-basic-element json-Number form-group\"><label class=\"json-field-label  label_x\" style=\";display:none\" for=\"ele_json_7\">x：</label><input data-gen=\"aform\" jpath=\".arrayComplext[0].x\" class=\"json-field-input form-control\" id=\"ele_json_7\" type=\"text\" name=\"x\" value=\"\"></div></td><td><div jpath=\".arrayComplext[0].y\" style=\"\" class=\"json-form-element json-basic-element json-Number form-group\"><label class=\"json-field-label  label_y\" style=\";display:none\" for=\"ele_json_8\">y：</label><input data-gen=\"aform\" jpath=\".arrayComplext[0].y\" class=\"json-field-input form-control\" id=\"ele_json_8\" type=\"text\" name=\"y\" value=\"\"></div></td><td class=\"json-form-actionCell\"><span class=\"json-form-action-wrapper\" cmd=\"aform_array_add_row\"><a cmd=\"aform_array_add_row\" href=\"javascript:void(null)\" title=\"增加\">＋</a></span><span class=\"json-form-action-wrapper\" cmd=\"aform_array_delete_row\"><a cmd=\"aform_array_delete_row\" href=\"javascript:void(null)\" title=\"删除\">×</a></span></td></tr><tr class=\"json-Object\"><td style=\"\" class=\"json-form-rowNumber\">2</td><td><div jpath=\".arrayComplext[1].x\" style=\"\" class=\"json-form-element json-basic-element json-Number form-group\"><label class=\"json-field-label  label_x\" style=\";display:none\" for=\"ele_json_9\">x：</label><input data-gen=\"aform\" jpath=\".arrayComplext[1].x\" class=\"json-field-input form-control\" id=\"ele_json_9\" type=\"text\" name=\"x\" value=\"\"></div></td><td><div jpath=\".arrayComplext[1].y\" style=\"\" class=\"json-form-element json-basic-element json-Number form-group\"><label class=\"json-field-label  label_y\" style=\";display:none\" for=\"ele_json_10\">y：</label><input data-gen=\"aform\" jpath=\".arrayComplext[1].y\" class=\"json-field-input form-control\" id=\"ele_json_10\" type=\"text\" name=\"y\" value=\"\"></div></td><td class=\"json-form-actionCell\"><span class=\"json-form-action-wrapper\" cmd=\"aform_array_add_row\"><a cmd=\"aform_array_add_row\" href=\"javascript:void(null)\" title=\"增加\">＋</a></span><span class=\"json-form-action-wrapper\" cmd=\"aform_array_delete_row\"><a cmd=\"aform_array_delete_row\" href=\"javascript:void(null)\" title=\"删除\">×</a></span></td></tr></tbody></table><div jpath=\".boolean\" style=\"\" class=\"json-form-element json-basic-element json-Boolean form-group\"><label class=\"json-field-label  label_boolean\" style=\";display:\" for=\"ele_json_11\">boolean：</label><input jpath=\".boolean\" class=\"json-field-input form-control\" id=\"ele_json_11\" type=\"checkbox\" checked=\"\" name=\"boolean\"></div><div jpath=\".number\" style=\"\" class=\"json-form-element json-basic-element json-Number form-group\"><label class=\"json-field-label  label_number\" style=\";display:\" for=\"ele_json_12\">number：</label><input data-gen=\"aform\" jpath=\".number\" class=\"json-field-input form-control\" id=\"ele_json_12\" type=\"text\" name=\"number\" value=\"\"></div><fieldset name=\"object\" style=\";\" class=\"json-form-element json-Object\"><legend style=\"display:\"><label cmd=\"aform_array_collapse_fieldset\" class=\"json-form-collapser json-form-ctrl-un-collapse\" id=\"json_form_collapser_13\">object</label></legend><div class=\"json-form-fdset\" style=\"display:\"><div jpath=\".object.a\" style=\"\" class=\"json-form-element json-basic-element json-String form-group\"><label class=\"json-field-label  label_a\" style=\";display:\" for=\"ele_json_14\">a：</label><input data-gen=\"aform\" jpath=\".object.a\" class=\"json-field-input form-control\" id=\"ele_json_14\" type=\"text\" name=\"a\" value=\"\"></div><div jpath=\".object.c\" style=\"\" class=\"json-form-element json-basic-element json-String form-group\"><label class=\"json-field-label  label_c\" style=\";display:\" for=\"ele_json_15\">c：</label><input data-gen=\"aform\" jpath=\".object.c\" class=\"json-field-input form-control\" id=\"ele_json_15\" type=\"text\" name=\"c\" value=\"\"></div><div jpath=\".object.e\" style=\"\" class=\"json-form-element json-basic-element json-String form-group\"><label class=\"json-field-label  label_e\" style=\";display:\" for=\"ele_json_16\">e：</label><input data-gen=\"aform\" jpath=\".object.e\" class=\"json-field-input form-control\" id=\"ele_json_16\" type=\"text\" name=\"e\" value=\"\"></div></div></fieldset><div jpath=\".string\" style=\"\" class=\"json-form-element json-basic-element json-String form-group\"><label class=\"json-field-label  label_string\" style=\";display:\" for=\"ele_json_17\">string：</label><input data-gen=\"aform\" jpath=\".string\" class=\"json-field-input form-control\" id=\"ele_json_17\" type=\"text\" name=\"string\" value=\"\"></div></div></fieldset>';
    assert.equal($(af.container).html(), desthtml, "生成的html合法!");

    var result = af.tryGetJson();

    assert.ok(!!result, "获取数据成功检测");
    assert.ok(result["null"] == undefined, "null不获取");
    assert.deepEqual($.extend(result, {"null": null}), data, "比较获取的数据与原始数据");
});
QUnit.test("嵌套结构", function(assert) {
    var af = new AForm("frm");
    var data = {
        x: {
            y: {
                z: [
                    {"a": 1},
                    {"a": 2}
                ]
            }
        }
    };
    af.render(data);
    var desthtml = '<fieldset style=\";border:none\" class=\"json-form-element json-Object\"><legend style=\"display: none;\"><label cmd=\"aform_array_collapse_fieldset\" class=\"json-form-collapser json-form-ctrl-un-collapse\" id=\"json_form_collapser_1\"></label></legend><div class=\"json-form-fdset\" style=\"display:\"><fieldset name=\"x\" style=\";\" class=\"json-form-element json-Object\"><legend style=\"display:\"><label cmd=\"aform_array_collapse_fieldset\" class=\"json-form-collapser json-form-ctrl-un-collapse\" id=\"json_form_collapser_2\">x</label></legend><div class=\"json-form-fdset\" style=\"display:\"><fieldset name=\"y\" style=\";\" class=\"json-form-element json-Object\"><legend style=\"display:\"><label cmd=\"aform_array_collapse_fieldset\" class=\"json-form-collapser json-form-ctrl-un-collapse\" id=\"json_form_collapser_3\">y</label></legend><div class=\"json-form-fdset\" style=\"display:\"><table id=\"ele_json_tb_4\" border=\"1\" name=\"z\" style=\"\" class=\"json-form-element json-Array table table-bordered\"><caption style=\"display:\"><label cmd=\"aform_array_collapse_table\" class=\"json-form-collapser json-form-ctrl-un-collapse\">z</label> <a cmd=\"aform_array_add_row\" style=\"display:\" class=\"json-form-array-add\" href=\"javascript:void(null)\" title=\"增加一行\">增加</a> </caption><thead style=\"display:\"><tr><th style=\"\">NO.</th><th>a</th><th class=\"json-form-action\">操作</th></tr></thead><tbody style=\"display:\"><tr class=\"json-Object\"><td style=\"\" class=\"json-form-rowNumber\">1</td><td><div jpath=\".x.y.z[0].a\" style=\"\" class=\"json-form-element json-basic-element json-Number form-group\"><label class=\"json-field-label  label_a\" style=\";display:none\" for=\"ele_json_5\">a：</label><input data-gen=\"aform\" jpath=\".x.y.z[0].a\" class=\"json-field-input form-control\" id=\"ele_json_5\" type=\"text\" name=\"a\" value=\"\"></div></td><td class=\"json-form-actionCell\"><span class=\"json-form-action-wrapper\" cmd=\"aform_array_add_row\"><a cmd=\"aform_array_add_row\" href=\"javascript:void(null)\" title=\"增加\">＋</a></span><span class=\"json-form-action-wrapper\" cmd=\"aform_array_delete_row\"><a cmd=\"aform_array_delete_row\" href=\"javascript:void(null)\" title=\"删除\">×</a></span></td></tr><tr class=\"json-Object\"><td style=\"\" class=\"json-form-rowNumber\">2</td><td><div jpath=\".x.y.z[1].a\" style=\"\" class=\"json-form-element json-basic-element json-Number form-group\"><label class=\"json-field-label  label_a\" style=\";display:none\" for=\"ele_json_6\">a：</label><input data-gen=\"aform\" jpath=\".x.y.z[1].a\" class=\"json-field-input form-control\" id=\"ele_json_6\" type=\"text\" name=\"a\" value=\"\"></div></td><td class=\"json-form-actionCell\"><span class=\"json-form-action-wrapper\" cmd=\"aform_array_add_row\"><a cmd=\"aform_array_add_row\" href=\"javascript:void(null)\" title=\"增加\">＋</a></span><span class=\"json-form-action-wrapper\" cmd=\"aform_array_delete_row\"><a cmd=\"aform_array_delete_row\" href=\"javascript:void(null)\" title=\"删除\">×</a></span></td></tr></tbody></table></div></fieldset></div></fieldset></div></fieldset>';
    assert.equal($(af.container).html(), desthtml, "生成的html合法!");
    var result = af.tryGetJson();

    assert.ok(!!result, "获取数据成功检测");
    assert.deepEqual(result, data, "比较获取的数据与原始数据");
});
QUnit.test("嵌套结构-测试配置冲突", function(assert) {
    var af = new AForm("frm", {
        fields: {
            "a": {label: "ALLA"},
            "x": {label: "X", fields: {
                z: {
                    fields: {
                        a: {label: "XZA"}
                    }
                }
            }}
        }
    });
    var data = {
        x: {
            y: {
                "a": 1,
                "b": 2
            },
            z: {
                "a": 3
            }
        }
    };
    af.render(data);
    var desthtml = '<fieldset style=\";border:none\" class=\"json-form-element json-Object\"><legend style=\"display: none;\"><label cmd=\"aform_array_collapse_fieldset\" class=\"json-form-collapser json-form-ctrl-un-collapse\" id=\"json_form_collapser_1\"></label></legend><div class=\"json-form-fdset\" style=\"display:\"><fieldset name=\"x\" style=\";\" class=\"json-form-element json-Object\"><legend style=\"display:\"><label cmd=\"aform_array_collapse_fieldset\" class=\"json-form-collapser json-form-ctrl-un-collapse\" id=\"json_form_collapser_2\">X</label></legend><div class=\"json-form-fdset\" style=\"display:\"><fieldset name=\"y\" style=\";\" class=\"json-form-element json-Object\"><legend style=\"display:\"><label cmd=\"aform_array_collapse_fieldset\" class=\"json-form-collapser json-form-ctrl-un-collapse\" id=\"json_form_collapser_3\">y</label></legend><div class=\"json-form-fdset\" style=\"display:\"><div jpath=\".x.y.a\" style=\"\" class=\"json-form-element json-basic-element json-Number form-group\"><label class=\"json-field-label  label_a\" style=\";display:\" for=\"ele_json_4\">ALLA：</label><input data-gen=\"aform\" jpath=\".x.y.a\" class=\"json-field-input form-control\" id=\"ele_json_4\" type=\"text\" name=\"a\" value=\"\"></div><div jpath=\".x.y.b\" style=\"\" class=\"json-form-element json-basic-element json-Number form-group\"><label class=\"json-field-label  label_b\" style=\";display:\" for=\"ele_json_5\">b：</label><input data-gen=\"aform\" jpath=\".x.y.b\" class=\"json-field-input form-control\" id=\"ele_json_5\" type=\"text\" name=\"b\" value=\"\"></div></div></fieldset><fieldset name=\"z\" style=\";\" class=\"json-form-element json-Object\"><legend style=\"display:\"><label cmd=\"aform_array_collapse_fieldset\" class=\"json-form-collapser json-form-ctrl-un-collapse\" id=\"json_form_collapser_6\">z</label></legend><div class=\"json-form-fdset\" style=\"display:\"><div jpath=\".x.z.a\" style=\"\" class=\"json-form-element json-basic-element json-Number form-group\"><label class=\"json-field-label  label_a\" style=\";display:\" for=\"ele_json_7\">XZA：</label><input data-gen=\"aform\" jpath=\".x.z.a\" class=\"json-field-input form-control\" id=\"ele_json_7\" type=\"text\" name=\"a\" value=\"\"></div></div></fieldset></div></fieldset></div></fieldset>';
    assert.equal($(af.container).html(), desthtml, "生成的html合法!");
    var result = af.tryGetJson();
    assert.deepEqual(result, data, "比较获取的数据与原始数据");
});
QUnit.test("schema测试-local", function(assert) {
    var conf = {
        schemaMode: "local",
        fields: {
            a: {},
            b: {}
        }
    };
    var af = new AForm("frm", conf);
    af.render({c: 33});
    var desthtml = '<fieldset style=\";border:none\" class=\"json-form-element json-Object\"><legend style=\"display: none;\"><label cmd=\"aform_array_collapse_fieldset\" class=\"json-form-collapser json-form-ctrl-un-collapse\" id=\"json_form_collapser_1\"></label></legend><div class=\"json-form-fdset\" style=\"display:\"><div jpath=\".a\" style=\"\" class=\"json-form-element json-basic-element json-String form-group\"><label class=\"json-field-label  label_a\" style=\";display:\" for=\"ele_json_2\">a：</label><input data-gen=\"aform\" jpath=\".a\" class=\"json-field-input form-control\" id=\"ele_json_2\" type=\"text\" name=\"a\" value=\"\"></div><div jpath=\".b\" style=\"\" class=\"json-form-element json-basic-element json-String form-group\"><label class=\"json-field-label  label_b\" style=\";display:\" for=\"ele_json_3\">b：</label><input data-gen=\"aform\" jpath=\".b\" class=\"json-field-input form-control\" id=\"ele_json_3\" type=\"text\" name=\"b\" value=\"\"></div></div></fieldset>';
    assert.equal($(af.container).html(), desthtml, "生成的html合法!");
});
QUnit.test("schema测试-merge", function(assert) {
    var conf = {
        schemaMode: "merge",
        fields: {
            a: {},
            b: {}
        }
    };
    var af = new AForm("frm", conf);
    af.render({c: 33});
    var desthtml = '<fieldset style=\";border:none\" class=\"json-form-element json-Object\"><legend style=\"display: none;\"><label cmd=\"aform_array_collapse_fieldset\" class=\"json-form-collapser json-form-ctrl-un-collapse\" id=\"json_form_collapser_1\"></label></legend><div class=\"json-form-fdset\" style=\"display:\"><div jpath=\".c\" style=\"\" class=\"json-form-element json-basic-element json-Number form-group\"><label class=\"json-field-label  label_c\" style=\";display:\" for=\"ele_json_2\">c：</label><input data-gen=\"aform\" jpath=\".c\" class=\"json-field-input form-control\" id=\"ele_json_2\" type=\"text\" name=\"c\" value=\"\"></div></div></fieldset>';
    assert.equal($(af.container).html(), desthtml, "生成的html合法!");
});
QUnit.test("布局-inline", function(assert) {
    var conf = {
        fields: {
            a: {inline: true, width: "100px"},
            b: {inline: true, width: "100px", break: true},
            c: {hideLabel: true, hideLabel: true}
        }
    };
    var af = new AForm("frm", conf);
    af.render();
    var desthtml = '<fieldset style=\";border:none\" class=\"json-form-element json-Object\"><legend style=\"display: none;\"><label cmd=\"aform_array_collapse_fieldset\" class=\"json-form-collapser json-form-ctrl-un-collapse\" id=\"json_form_collapser_1\"></label></legend><div class=\"json-form-fdset\" style=\"display:\"><div jpath=\".a\" style=\";display:inline-block;*display:inline;*zoom:1;width:100px\" class=\"json-form-element json-basic-element json-String form-group json-form-inline\"><label class=\"json-field-label  label_a\" style=\";display:\" for=\"ele_json_2\">a：</label><input data-gen=\"aform\" jpath=\".a\" class=\"json-field-input form-control\" id=\"ele_json_2\" type=\"text\" name=\"a\" value=\"\"></div><div jpath=\".b\" style=\";display:inline-block;*display:inline;*zoom:1;width:100px\" class=\"json-form-element json-basic-element json-String form-group json-form-inline\"><label class=\"json-field-label  label_b\" style=\";display:\" for=\"ele_json_3\">b：</label><input data-gen=\"aform\" jpath=\".b\" class=\"json-field-input form-control\" id=\"ele_json_3\" type=\"text\" name=\"b\" value=\"\"></div><br style=\"clear:both\"><div jpath=\".c\" style=\"\" class=\"json-form-element json-basic-element json-String form-group\"><label class=\"json-field-label  label_c\" style=\";display:none\" for=\"ele_json_4\">c：</label><input data-gen=\"aform\" jpath=\".c\" class=\"json-field-input form-control\" id=\"ele_json_4\" type=\"text\" name=\"c\" value=\"\"></div></div></fieldset>';
    assert.equal($(af.container).html(), desthtml, "生成的html合法!");
});
QUnit.test("输入控件类型", function(assert) {
    var conf = {
        fields: {
            a: {label: "a", type: "textarea"},//文本区域
            b: {label: "b", type: "radio", datalist: [
                {text: "男", value: "male"},
                {text: "女", value: "female"}
            ]}//单选，选项使用datalist定义
        }
    };
    var af = new AForm("frm", conf);
    af.render({
        a: "a",
        b: "female"
    });
    var desthtml = '<fieldset style=\";border:none\" class=\"json-form-element json-Object\"><legend style=\"display: none;\"><label cmd=\"aform_array_collapse_fieldset\" class=\"json-form-collapser json-form-ctrl-un-collapse\" id=\"json_form_collapser_1\"></label></legend><div class=\"json-form-fdset\" style=\"display:\"><div jpath=\".a\" style=\"\" class=\"json-form-element json-basic-element json-String form-group\"><label class=\"json-field-label  label_a\" style=\";display:\" for=\"ele_json_2\">a：</label><textarea data-gen=\"aform\" jpath=\".a\" class=\"json-field-input form-control\" id=\"ele_json_2\" name=\"a\">a</textarea></div><div jpath=\".b\" style=\"\" class=\"json-form-element json-basic-element json-String form-group\"><label class=\"json-field-label  label_b\" style=\";display:\" for=\"ele_json_3\">b：</label><span jpath=\".b\" class=\"json-field-input form-control\" id=\"ele_json_3\"><label><input data-gen=\"aform\" name=\"b\" type=\"radio\" value=\"male\">男</label><label><input data-gen=\"aform\" name=\"b\" type=\"radio\" checked=\"\" value=\"female\">女</label></span></div></div></fieldset>';
    assert.equal($(af.container).html(), desthtml, "生成的html合法!");
});
QUnit.test("样式与属性定义", function(assert) {
    var conf = {
        fields: {
            a: {label: "a", ctrlCssText: "a-style", cssText: "a-css-text"},//文本区域
            b: {label: "b", labelCssText: "b-label-style", ctrlAttr: {
                "max": 10,
                "min": 2
            }}//单选，选项使用datalist定义
        }
    };
    var af = new AForm("frm", conf);
    af.render({
        a: "a",
        b: "female"
    });
    var desthtml = '<fieldset style=\";border:none\" class=\"json-form-element json-Object\"><legend style=\"display: none;\"><label cmd=\"aform_array_collapse_fieldset\" class=\"json-form-collapser json-form-ctrl-un-collapse\" id=\"json_form_collapser_1\"></label></legend><div class=\"json-form-fdset\" style=\"display:\"><div jpath=\".a\" style=\"a-css-text\" class=\"json-form-element json-basic-element json-String form-group\"><label class=\"json-field-label  label_a\" style=\";display:\" for=\"ele_json_2\">a：</label><input data-gen=\"aform\" jpath=\".a\" style=\"a-style\" class=\"json-field-input form-control\" id=\"ele_json_2\" type=\"text\" name=\"a\" value=\"\"></div><div jpath=\".b\" style=\"\" class=\"json-form-element json-basic-element json-String form-group\"><label class=\"json-field-label  label_b\" style=\"b-label-style;display:\" for=\"ele_json_3\">b：</label><input data-gen=\"aform\" max=\"10\" min=\"2\" jpath=\".b\" class=\"json-field-input form-control\" id=\"ele_json_3\" type=\"text\" name=\"b\" value=\"\"></div></div></fieldset>';
    assert.equal($(af.container).html(), desthtml, "生成的html合法!");
});
QUnit.test("验证", function(assert) {
    AForm.registerValidator(">2",{
        rule:function(v){
            return v.length > 2;
        },
        errorMsg:"必须大于2"
    });
    var conf = {
        fields: {
            a: {label: "a", required: true},
            b: {label: "b", pattern: "\\d+", patternErrorMsg: "must be number"},
            c: {label: "c", validators: {
                rule: function(v) {
                    return v.indexOf("http") == 0;
                },
                errorMsg: "must begin with http"
            }
            },
            d: {label: "d", validators: ">2"}
        }
    };
    var af = new AForm("frm", conf);
    var data = {
        a: "o",
        b: "123",
        c: "http://"
    };
    af.render(data);
    var desthtml = '<fieldset style=\";border:none\" class=\"json-form-element json-Object\"><legend style=\"display: none;\"><label cmd=\"aform_array_collapse_fieldset\" class=\"json-form-collapser json-form-ctrl-un-collapse\" id=\"json_form_collapser_1\"></label></legend><div class=\"json-form-fdset\" style=\"display:\"><div jpath=\".a\" style=\"\" class=\"json-form-element json-basic-element json-String form-group\"><label class=\"json-field-label  label_a\" style=\";display:\" for=\"ele_json_2\">a：<span class=\"json-form-required\">*</span></label><input data-gen=\"aform\" jpath=\".a\" required=\"\" class=\"json-field-input form-control\" id=\"ele_json_2\" type=\"text\" name=\"a\" value=\"\"></div><div jpath=\".b\" style=\"\" class=\"json-form-element json-basic-element json-String form-group\"><label class=\"json-field-label  label_b\" style=\";display:\" for=\"ele_json_3\">b：</label><input data-gen=\"aform\" jpath=\".b\" pattern=\"\\d+\" class=\"json-field-input form-control\" id=\"ele_json_3\" type=\"text\" name=\"b\" value=\"\"></div><div jpath=\".c\" style=\"\" class=\"json-form-element json-basic-element json-String form-group\"><label class=\"json-field-label  label_c\" style=\";display:\" for=\"ele_json_4\">c：</label><input data-gen=\"aform\" jpath=\".c\" class=\"json-field-input form-control\" id=\"ele_json_4\" type=\"text\" name=\"c\" value=\"\"></div></div></fieldset>';
    assert.equal($(af.container).html(), desthtml, "生成的html合法!");

    //测试1
    af.render({
        a: ""
    });
    var result = af.tryGetJson();
    assert.equal(result, null, "比较获取的数据与原始数据");
    //测试1
    af.render({
        b: "x"
    });
    var result = af.tryGetJson();
    assert.equal(result, null, "比较获取的数据与原始数据");
    //测试1
    af.render({
        c: "ss"
    });
    var result = af.tryGetJson();
    assert.equal(result, null, "比较获取的数据与原始数据");
    //测试1
    af.render({
        d: "s"
    });
    var result = af.tryGetJson();
    assert.equal(result, null, "比较获取的数据与原始数据");
});
QUnit.test("数据适配器", function(assert) {
    AForm.registerAdapter("myadp",{
        beforeRender: function(v) {
            return v + "_";
        },
        beforeGet: function(v) {
            return v+"__";
        }
    });
    var conf = {
        fields: {
            a: {label: "a", valueAdapter: {
                beforeRender: function(v) {
                    return v + "b";
                },
                beforeGet: function(v) {
                    return "x";
                }
            }
            },
            d:{label:"d",valueAdapter:"myadp"}
        },
        valueAdapter: {//增加了两个额外字段
            beforeRender: function(obj) {
                obj["b"] = "b";
                return obj;
            },
            beforeGet: function(obj) {
                obj.c = "c";
                return obj;
            }
        }
    };
    var af = new AForm("frm", conf);
    var data = {
        a: "a",
        d:"ddd"
    };
    af.render(data);
    assert.equal($("input[name=a]", af.container).val(), "ab", "比较a渲染后的值");
    assert.equal($("input[name=d]", af.container).val(), "ddd_", "比较a渲染后的值");
    var result = af.tryGetJson();
    assert.deepEqual(result, {
        a: "x",
        b: "b",
        c: "c",
        d:"ddd___"
    }, "比较获取的数据是否是x");
});
