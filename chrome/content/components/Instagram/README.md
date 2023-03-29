# Instagram爬虫
## 爬取博主信息
### 爬取信息
* 博主所在地 Location of the post？？？
* 博主名称 Account name
* 账号链接 Link of the account
* 帖子数量 Number of post of the account
* 关注数量 Number of like of the post
* 粉丝数量 

### 分析
> 用户信息不是通过接口获取的，页面本身在服务器构造好，插入到一段script中
> 经过赋值到windows来完成初始化

经过分析，页面初始化信息如下展示：
```js
const initialData = window._sharedData // 初始化信息
const posterInfo = initialData.entry_data.ProfilePage[0].graphql.user // 博主信息
const posterId = posterInfo.id // 博主id

const firstPostList = posterInfo.edge_owner_to_timeline_media // 帖子首页列表内容，用户帖子内容分析

// 上传到后台的博主数据
const uploadUserInfo = {
  biography: posterInfo.biography,// 博主所在地 Location of the post？？？
  account_name: posterInfo.full_name,// 博主名称 Account name
  link: location.href,// 账号链接 Link of the account
  post_count: posterInfo.edge_owner_to_timeline_media.count,// 帖子数量 Number of post of the account
  follower_count: posterInfo.edge_followed_by.count,// 粉丝数量 Number offollowers of the account
}
```


## 爬取帖子列表（posts）
### 爬取内容
列表项
* 帖子点赞数 Number of like of the post
* 帖子评论数 Number of comments of the post
* 帖子链接 Link of the post
* 评论里@了的account信息列表
  - 账号名称
  - 账号链接
  - 帖子数量
  - 关注数量
  - 粉丝数量

### 分析
获取博文列表接口为：
```js
// 博文列表
$.get('https://www.instagram.com/graphql/query/', {
  query_hash: '8c2a529969ee035a5063f2fc8602a0fd', // 每一个博主的hash都不一样，需要再分析从何处取
  variables: {
    id: '博主id',
    first: 12,
    after: '初始化内容/上一个博文列表返回的 page_info.end_cursor 的内容'
  }
}).then(data => {
  console.log(data)
  const list = data.map(item => {
    return {
      like_count: item.edge_media_preview_like.count, // 帖子点赞数
      comment_count: item.edge_media_to_comment.count,// 帖子评论数
      shortcode: item.shortcode,
      link: `https://www.instagram.com/p/${item.shortcode}`// 帖子链接
      location: item.location.name, // 帖子发布地点 Location of the post
      quote_by_account_list: [] // 被@的用户信息列表，见下面的接口
    }
  })
})
```

```js
// 博文评论信息
// 示例地址
$ajax.get('https://www.instagram.com/graphql/query/', {
  query_hash: '2efa04f61586458cef44441f474eee7c',
  variables: {
    shortcode: "页面的短链接代码，通过 location.pathname.split('/')[2] 获取",
    child_comment_count: 3,
    fetch_comment_count: 40,
    parent_comment_count: 24,
    has_threaded_comments: true
  }
}).then(data => {
  console.log(data) // 评论字段分析
  // 评论列表
  const list = data.edge_media_to_parent_comment.edges
  // 筛选出被@的列表
  // 被@的判断逻辑：的posts的文本里@了的account的数据
  const quote_by_list = data.edge_media_to_caption.edges.filter(item => item.node.text)
  // 被@ 作者名称列表，只能拿到名称
  const quoteAccountList = []
  quote_by_list.forEach(item => {
    const accounts = item.split(' ').filter(v => v.includes('@'))
    quoteAccountList.push(...accounts)
  })
  // 再通过名称列表去爬用户的信息
  // 爬完用户的信息再聚合到博文列表 quote_by_account_list 字段
})
```
评论字段分析
```json

```

## 爬取已标记列表（tagged）
### 爬取内容
列表项
* 帖子点赞数 Number of like of the post
* 帖子评论数 Number of comments of the post
* 帖子链接 Link of the post
* tag了博主的account信息列表
  - 账号名称
  - 账号链接
  - 帖子数量
  - 关注数量
  - 粉丝数量

### 分析
获取已标记列表：
```js
// ajax
$ajax.get('https://www.instagram.com/graphql/query/', {
  query_hash: '8c2a529969ee035a5063f2fc8602a0fd', // 每一个博主的hash都不一样，需要再分析从何处取
  variables: {
    id: '博主id',
    first: 12,
    after: '初始化内容/上一个博文列表返回的 page_info.end_cursor 的内容'
  }
})
```
