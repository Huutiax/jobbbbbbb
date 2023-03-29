# tiktok商品一键上架
输入系统sku，拉取商品信息，填入tiktok商品模板

[js修改react form表单内容](https://github.com/facebook/react/issues/11488)
[示例](https://codepen.io/gkitarp/pen/pdNRKP)，需要将js修改内容改为上面的内容
Log this component data to the console

```js
let input = document.getElementById('myinput'); 
let lastValue = input.value;
input.value = 'new value';
let event = new Event('input', { bubbles: true });
// hack React15
event.simulated = true;
// hack React16 内部定义了descriptor拦截value，此处重置状态
let tracker = input._valueTracker;
if (tracker) {
  tracker.setValue(lastValue);
}
input.dispatchEvent(event);
```

1. 商品图片上传接口
上传图片分三步走：
+ 获取上传授权信息，token等，调用接口
```js
// 获取上传授权
//req
$.get(`https://api16-normal-sg.tiktokglobalshop.com/api/v1/multimedia/image/upload_token/get?locale=zh-CN&language=zh-CN&aid=6556&app_name=i18n_ecom_shop&device_id=0&fp=verify_krdbg78c_zPRz34MS_1SuV_4T0t_8JHP_iv0sR4AXTRqM&device_platform=web&cookie_enabled=true&screen_width=1920&screen_height=1080&browser_language=zh-CN&browser_platform=MacIntel&browser_name=Mozilla&browser_version=5.0%20%28Macintosh%3B%20Intel%20Mac%20OS%20X%2010_13_6%29%20AppleWebKit%2F537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome%2F91.0.4472.164%20Safari%2F537.36&browser_online=true&timezone_name=Asia%2FShanghai&_signature=_02B4Z6wo00101qHskCAAAIDArXFhtBgl4Pqh7JSAAMiO4f`)

// res
res = {
  code: 0,
  message: "success",
  data:{
    access_key_id: "AKTPMWI3ODQxNDZhMTI4NDA1OThkM2Q5YWEzYmYxZjdlNzg",
    secret_access_key: "e5IzJTuq4MCTxEd2GcGG0lwyIcBoBZ71IU/1/7SqMviEZscgUEoq1yALEXTxH5qE",
    session_token: "STS2eyJMVEFjY2Vzc0tleUlkIjoiQUtMVE5EVmtaak0xWm1SaFpEZzNORGs1T1RrM01qQmtNelJoTW1VNFlqUmtabVkiLCJBY2Nlc3NLZXlJZCI6IkFLVFBNV0kzT0RReE5EWmhNVEk0TkRBMU9UaGtNMlE1WVdFelltWXhaamRsTnpnIiwiU2lnbmVkU2VjcmV0QWNjZXNzS2V5IjoiMldWVTMxRGhQaHk1N0VuMEZOTW9ZeSs3L1dqS05YcWlEZG10NHNoREQyc2NsNkdaa1AvZ1gzcllqMnJJVjk1YkRIUG9aTE1tOUtzb0J2ZDZRUENpOFdmQ3htOGk3TFlDRVVrdUFEbzVhU0E9IiwiRXhwaXJlZFRpbWUiOjE2MjY5Mzg4NzgsIlBvbGljeVN0cmluZyI6IntcIlN0YXRlbWVudFwiOlt7XCJFZmZlY3RcIjpcIkFsbG93XCIsXCJBY3Rpb25cIjpbXCJJbWFnZVg6QXBwbHlJbWFnZVVwbG9hZFwiLFwiSW1hZ2VYOkNvbW1pdEltYWdlVXBsb2FkXCJdLFwiUmVzb3VyY2VcIjpbXCJ0cm46SW1hZ2VYOio6KjpTZXJ2aWNlSWQvYXBobHV2NHh3Y1wiXX1dfSIsIlNpZ25hdHVyZSI6IjIxNGViOWYxYmQ1M2ZmODBmZjg2OWM3NmM0N2M1NDg4ZjM5N2NjZGZkOWI2MzgyZDczMmE3MTUxNmY1ZmYzMWMifQ==",
    expired_time: "2021-07-22T07:27:58Z",
    current_time: "2021-07-22T07:17:58Z"
  }
}
```

+ 第一步后，获取图片存储位置和上传地址
```js
// req
$.get('https://imagex.ap-singapore-1.bytedanceapi.com/?Action=ApplyImageUpload&Version=2018-08-01&ServiceId=aphluv4xwc&s=zjj8x4jhl68')

// res
res = {
  ResponseMetadata: {
      RequestId: "202107220717590101012480554A018D6C",
      Action: "ApplyImageUpload",
      Version: "2018-08-01",
      Service: "imagex",
      Region: "ap-singapore-1"
  },
  Result: {
    UploadAddress: {
      StoreInfos: [
        {
          StoreUri: "tos-alisg-i-aphluv4xwc-sg/c873232ed9c640cc82ab552f9a41030d",
          Auth: "SpaceKey/aphluv4xwc/1:tULzdU9lKqjkYrTTmxnpIyvNZ5o9B8XavPoVdF9bleY=:ZGVhZGxpbmU6IDE2MjY5Mzg4Nzk=:Yzg3MzIzMmVkOWM2NDBjYzgyYWI1NTJmOWE0MTAzMGQ=",
          UploadID: "2fbf35d17a9b41ef8c2e130bc9800c6c"
        }
      ],
      UploadHosts: [
        "tos-d-alisg16-up.byteoversea.com"
      ],
      UploadHeader: null,
      SessionKey: "eyJhcHBJZCI6IiIsImJpelR5cGUiOiIiLCJmaWxlVHlwZSI6ImltYWdlIiwibGVnYWwiOiIiLCJ1cmkiOiJ0b3MtYWxpc2ctaS1hcGhsdXY0eHdjLXNnL2M4NzMyMzJlZDljNjQwY2M4MmFiNTUyZjlhNDEwMzBkIiwidXNlcklkIjoiIn0=",
      AdvanceOption: {
        Parallel: 0,
        Stream: 0,
        SliceSize: 0,
        EncryptionKey: ""
      }
    },
    InnerUploadAddress: {
      UploadNodes: [
        {
          Vid: "",
          StoreInfos: [
            {
              StoreUri: "tos-alisg-i-aphluv4xwc-sg/c873232ed9c640cc82ab552f9a41030d",
              Auth: "SpaceKey/aphluv4xwc/1:tULzdU9lKqjkYrTTmxnpIyvNZ5o9B8XavPoVdF9bleY=:ZGVhZGxpbmU6IDE2MjY5Mzg4Nzk=:Yzg3MzIzMmVkOWM2NDBjYzgyYWI1NTJmOWE0MTAzMGQ=",
              UploadID: "2fbf35d17a9b41ef8c2e130bc9800c6c"
            }
          ],
          UploadHost: "tos-d-alisg16-up.byteoversea.com",
          UploadHeader: null,
          Type: "",
          SessionKey: "eyJhcHBJZCI6IiIsImJpelR5cGUiOiIiLCJmaWxlVHlwZSI6ImltYWdlIiwibGVnYWwiOiIiLCJ1cmkiOiJ0b3MtYWxpc2ctaS1hcGhsdXY0eHdjLXNnL2M4NzMyMzJlZDljNjQwY2M4MmFiNTUyZjlhNDEwMzBkIiwidXNlcklkIjoiIn0=",
          NodeConfig: null
        }
      ],
      AdvanceOption: {
        Parallel: 0,
        Stream: 0,
        SliceSize: 0,
        EncryptionKey: ""
      }
    },
    RequestId: "202107220717590101012480554A018D6C",
    SDKParam: null
  }
}
```

+ 根据上一步后去的上传地址，上传图片
```js
// req
$.put(`https://tos-d-alisg16-up.byteoversea.com/${上一步获取的上传前缀}/${上一步获取的存储路径}`, {data: blob?})

// res
res = {
  Version: "",
  success: 0,
  error: {
    code: 200,
    error: "",
    error_code: 0,
    message: ""
  },
  payload: {
    hash: "0f005054",
    key: "14e6156be9dc44f5977b1ea015e30a84"
  }
}
```

```js
// 商品图片上传接口
const url = 'https://imagex.ap-singapore-1.bytedanceapi.com/?Action=ApplyImageUpload&Version=2018-08-01&ServiceId=aphluv4xwc&s=zid94fhkr7o'
'https://imagex.ap-singapore-1.bytedanceapi.com/?Action=CommitImageUpload&Version=2018-08-01&SessionKey=eyJhcHBJZCI6IiIsImJpelR5cGUiOiIiLCJmaWxlVHlwZSI6ImltYWdlIiwibGVnYWwiOiIiLCJ1cmkiOiJ0b3MtYWxpc2ctaS1hcGhsdXY0eHdjLXNnLzkxMWMzMjc5M2E0ZTQ2ZmY4ZDQyMmU0NGQwOWJlYjgxIiwidXNlcklkIjoiIn0=&ServiceId=aphluv4xwc'

// 创建商品接口
const createUrl = `https://api16-normal-useast1a.tiktokglobalshop.com/api/v1/product/local/product/create?locale=zh-CN&language=zh-CN&aid=6556&app_name=i18n_ecom_shop&device_id=0&fp=verify_krdbg78c_zPRz34MS_1SuV_4T0t_8JHP_iv0sR4AXTRqM&device_platform=web&cookie_enabled=true&screen_width=1920&screen_height=1080&browser_language=zh-CN&browser_platform=MacIntel&browser_name=Mozilla&browser_version=5.0%20%28Macintosh%3B%20Intel%20Mac%20OS%20X%2010_13_6%29%20AppleWebKit%2F537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome%2F91.0.4472.164%20Safari%2F537.36&browser_online=true&timezone_name=Asia%2FShanghai&_signature=_02B4Z6wo00101rU.7ngAAIDAuaIf7KViqOa1P-rAAM3D7d`

blob:https://seller.tiktokglobalshop.com/85eb9097-35e0-433f-9152-4fe23024a567
```

```json
{
    "product_id":"1729382620556331218",
    "product_name":"Test product by qian",
    "category_id":"600003",
    "brand_id":"0",
    "model":"",
    "images":[
        {
            "uri":"tos-alisg-i-aphluv4xwc-sg/25723d11037b41dd8d9e3693308331d8",
            "width":800,
            "height":800
        }
    ],
    "description":"<p>size: xx</p><p>color: xx</p><p>sex: xx</p>",
    "warranty_period":-1,
    "warranty_policy":"",
    "packing_list":"",
    "package_weight":"0.01",
    "sale_properties":[
        {
            "id":"100000",
            "is_custom":false,
            "text":"Colour",
            "has_image":true,
            "values":[
                {
                    "id":"6987596190368155397",
                    "name":"gray",
                    "image":{
                        "uri":"tos-alisg-i-aphluv4xwc-sg/aad3fb965a664aa98d851fdadbb7933a",
                        "width":800,
                        "height":800
                    }
                }
            ]
        },
        {
            "id":"6987594438562334470",
            "has_image":false,
            "is_custom":true,
            "text":"Size",
            "values":[
                {
                    "id":"6987594438562383622",
                    "name":"s",
                    "is_custom":true
                },
                {
                    "id":"6987594438562400006",
                    "name":"m",
                    "is_custom":true
                }
            ]
        }
    ],
    "video":"",
    "skus":[
        {
            "id":"1729382620605352146",
            "quantities":[
                {
                    "warehouse_id":"6985062539067393794",
                    "available_quantity":1
                }
            ],
            "seller_sku":"",
            "base_price":{
                "region":"GB",
                "currency":"GBP",
                "sale_price":"24",
                "localized_dutiable_price":"20"
            },
            "properties":[
                {
                    "id":"100000",
                    "name":"Colour",
                    "value_id":"6987596190368155397",
                    "value_name":"gray"
                },
                {
                    "id":"6987594438562334470",
                    "name":"Size",
                    "value_id":"6987594438562383622",
                    "value_name":"s"
                }
            ]
        },
        {
            "id":"1729382620605417682",
            "quantities":[
                {
                    "warehouse_id":"6985062539067393794",
                    "available_quantity":1
                }
            ],
            "seller_sku":"",
            "base_price":{
                "region":"GB",
                "currency":"GBP",
                "sale_price":"24",
                "localized_dutiable_price":"20"
            },
            "properties":[
                {
                    "id":"100000",
                    "name":"Colour",
                    "value_id":"6987596190368155397",
                    "value_name":"gray"
                },
                {
                    "id":"6987594438562334470",
                    "name":"Size",
                    "value_id":"6987594438562400006",
                    "value_name":"m"
                }
            ]
        }
    ],
    "categories":[
        {
            "name_key":"magellan_600001",
            "parent_id":"0",
            "id":"600001",
            "is_leaf":false,
            "level":1
        },
        {
            "name_key":"magellan_600002",
            "parent_id":"600001",
            "id":"600002",
            "is_leaf":false,
            "level":2
        },
        {
            "name_key":"magellan_600003",
            "parent_id":"600002",
            "id":"600003",
            "is_leaf":true,
            "level":3
        }
    ],
    "qualification_code_images":[

    ],
    "certificate_images":[

    ],
    "qualification_info":[
        {
            "id":"6956786487312566022"
        }
    ],
    "package_height":10,
    "package_width":10,
    "package_length":10
}
```