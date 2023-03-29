# 禅妈妈数据爬取
> 登录页面：https://www.chanmama.com/login
> 账号：13417600247
> 密码：Teamtopap55
> 登录后顶部菜单选择 达人 > 达人库

## 功能说明：
1. 列表页最右侧新增爬虫按钮，点击按钮添加爬虫任务，[查看列表](https://www.chanmama.com/bloggerRank?keyword=)
2. 定时拉取爬虫任务列表，添加到队列，顺序执行，执行完一个通知后台此任务已完成
 + 每条列表数据，进去详情爬取详情数据，[查看详情](https://www.chanmama.com/authorDetail/93643211519)
 + 数据入库

## 接口分析：
1. 列表接口：
```js
// https://api-service.chanmama.com/v1/home/author/search?page=1&reputation_level=-1&star_category=&star_sub_category=&product_category=&keyword=&gender=-1&age=&fans_gender=-1&fans_age=&follower_count=&product_platform=&province=&fans_province=&contact=0&is_commerce=0&is_live=0&is_sell_live=0&is_star_author=0&verification_type=0&sort=inc_follower&order_by=desc&size=40

```
2. 详情接口：`https://api-service.chanmama.com/v1/author/detail/info?author_id=用户id`

## 设计说明
1. 初始化时，给表格最后一列加上 `+` 按钮，点击按钮调用添加任务接口
2. 初始化时，定时查询任务列表接口
 + 如果有任务，则等待执行所有任务后再执行定时查询
 + 否则，继续定时查询
3. 执行任务逻辑
① 任务列表第一个任务出栈，执行以下方法：
 + 聚合基础分析数据，调用接口上传数据，上传完延时随机秒继续直播分析
 + 直播基础分析数据，调用接口上传数据，上传完延时随机秒继续视频分析
 + 视频分析分析数据，调用接口上传数据，上传完延时随机秒继续电商分析
 + 电商分析分析数据，调用接口上传数据，上传完延时随机秒继续视频分析
 + 粉丝分析分析数据，调用接口上传数据，完成单个达人分析

如果任务列表为空，则执行完毕；否则，继续任务①
