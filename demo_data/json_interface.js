cbGenForm({
    "meta": {
        "name": "这是接口名",
        "description": "这是接口的详细描述",
        "type": ["GET", "POST"],
        "responseMap": [
            {
                "rule": [
                    {
                        "type": "response",
                        "property": "status",
                        "value": "-1"
                    }
                ],
                "schema": "responseError"
            },
            {
                "rule": [
                    {
                        "type": "request",
                        "property": "search",
                        "pattern": "[A-Z]"
                    },
                    {
                        "type": "response",
                        "property": "status",
                        "value": "1"
                    }
                ],
                "schema": "response2"
            }
        ]
    },
    "request": {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",
        "required": ["search"],
        "properties": {
            "search": {
                "type": "string",
                "description": "搜索关键字"
            },
            "type": {
                "type": "string",
                "description": "区分mobile、pc接口"
            }
        }
    },
    "response": {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",
        "required": ["status"],
        "properties": {
            "status": {
                "type": "integer",
                "description": "状态码",
                "enum": [200, 400, 500],
                "default": 200
            },
            "data": {
                "type": "object",
                "description": "服务端返回的的正常数据",
                "properties": {
                    "items": {
                        "type": "array",
                        "description": "搜索返回结果列表",
                        "maxItems": 4,
                        "minItems": 1,
                        "items": {
                            "type": "object",
                            "properties": {
                                "itemId": {
                                    "type": "number",
                                    "description": "商品ID"
                                },
                                "title": {
                                    "type": "string",
                                    "description": "商品标题",
                                    "maxLength": 26,
                                    "minLength": 18
                                },
                                "pic": {
                                    "type": "string",
                                    "description": "商品图片",
                                    "format": "PARAM_PIC_SIZE_344_228"
                                }
                            }
                        }
                    },
                    "key": {
                        "type": "string",
                        "description": "搜索关键字"
                    },
                    "total": {
                        "type": "number",
                        "description": "商品总数"
                    }
                }
            }
        }
    },
    "response2": {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",
        "required": ["status"],
        "properties": {
            "status": {
                "type": "integer"
            }
        }
    },
    "responseError": {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",
        "required": ["status"],
        "properties": {
            "status": {
                "type": "integer"
            }
        }
    }
});
