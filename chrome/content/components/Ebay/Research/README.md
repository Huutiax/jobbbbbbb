# Ebay Research页插件
## 注意事项
> 此插件需要登录ebay专用账号，由于怕被封号，所以需要在固定服务器上使用  
开发调试此插件比较麻烦，需要在服务器上开发调试  
或者使用拷贝下来的`test.html`来测试.

服务器信息如下： 
```js
// 如果账号密码不正确，请联系jack
const config = {
  ip: '192.168.5.22',
  account: 'alien-wolf',
  password: '9cX5qawxK'
}
```

## 注意事项
ebay比较狗，时间段选择参数，每次去查询时，会调用接口保存该时间段，去到新页面的时候会使用该时间段
接口：
```json
// https://www.ebay.com.au/sh/research/api/preference?module=lastDateRange
// PUT
// data
{
  "lastPredefinedRange": "",
  "lastCustomDateRange": "1617897600000, 1618329600000" // 起止时间段
}
```

## 测试链接
[drill bits](https://www.ebay.com.au/sh/research?keywords=drill+bits&dayRange=CUSTOM&endDate=1620316800000&marketplace=EBAY-AU&startDate=1612800000000&offset=0&limit=50&categoryId=50382&tabName=SOLD&tz=Asia%2FShanghai)
