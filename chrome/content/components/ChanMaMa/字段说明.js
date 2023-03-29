// 基础分析数据结构
const data1 = {
  basic_data: {
    // 基础数据
    author_id: "61070806273", // 达人id
    nickname: "朱瓜瓜●", // 达人名称
    avatar:
      "https://p26.douyinpic.com/7be800178b5fd7d2aad3~tplv-dy-shrink:188:188.jpeg?from=2956013662&s=PackSourceEnum_USER_PROFILE&se=true&sh=188_188&sc=avatar&l=202103311600410101502112071D02F436", // 达人头像
    product_count: 4, // ？？
    signature: "欢迎优秀人才(主博)ZJXY3333商?GGCMZS品牌蓝v合作：ziru7088", // 简介
    birthday: "", // 生日
    province: "广东", // 省份
    city: "广州", // 城市
    label: "美妆", // 分类
    manual_label: "美妆", // 自定义分类？？
    verification_type: 0, // 认证类型：0 未知，1 个人，2 蓝v
    verify_name: "", // 认证名称
    commerce: 1, // 是否开通商品橱窗：0 否，1 是
    live_room_id: "6917251160617585411", // 直播间id
    live_room_status: 4, // 直播间状态，数字含义？？？
    gender: 1, // 性别：0 男，1 女，2 未知
    unique_id: "19733746", // 抖音号
    short_id: "19733746", // ？？
    total_comment: 378, // 总评论数
    follower_count: 3078646, // 总粉丝数
    following_count: 508, // 关注人数
    total_share: 13, // 总转发数
    total_favorited: 4525577, // 总点赞数
    aweme_count: 213, // ？？
    is_fav: 0, // ？？
    is_notice: 0, // ？？
    show_following_follower: 0, // ？？
    follower_incr: -1664, // 较昨日粉丝增量
    digg_incr: -90, // 较昨日点赞增量
    share_incr: 0, // 较昨日转发增量
    comment_incr: 0, // 较昨日评论增量
    update_time: 1617177664, // 更新时间
    mark_delete: 0, // ？？
    url: "https://www.iesdouyin.com/share/user/61070806273", // 抖音链接？
    fans_club_total: 438098, // 粉丝团总人数
    start_index: 0, // ？？
    fans_group: 0, // ？？
    income: 0, // ？？
    expense: 0, // ？？
    author_sales_rank: {
      // ？？
      type: "",
      rank: 0,
      day: ""
    },
    author_fans_rank: {
      // ？？
      type: "",
      rank: 0,
      day: ""
    },
    total_room_ticket_count: 3928543, // 音浪收入
    pay_score: 994984, // 送出抖币
    history_aweme_count: 3523, // 历史视频数
    single_tags: {
      // 个人标签
      first: "美妆", // 第一标签
      second: ["美妆测评种草"], // 第二标签
      primary: true // 是否是主标签
    },
    live_room_scheduled_time: "", // ？？
    mcn_name: "", // mcn机构名称
    mcn_id: 0, // mcn机构id
    reputation: {
      // 带货口碑
      author_id: "",
      score: 4.46, // 评分
      level: 2, // 等级
      percentage: 37.31 // 领先于百分之xx同行
    }
  },
  xintu_data: {
    // 星图数据
    aweme_score: {
      // 视频星图
      error_code: 0,
      description: "",
      update_timestamp: 1616680916, // 更新时间
      nick_name: "",
      unique_id: "19733746",
      spread_score: 56.3, // 传播指数
      shop_score: 61.8, // 种草指数
      cp_score: 73.8, // 性价比指数
      growth_score: 44.5, // 涨粉指数
      cooperation_score: 83.2, // 合作指数
      star_score: 60 // 视频星图指数
    },
    live_score: {
      // 直播星图
      spread_score: 94.88, // 传播指数
      shop_score: 55.85, // 种草指数
      growth_score: 67.12, // 涨粉指数
      cooperation_score: 67.37, // 合作指数
      star_score: 74.31 // 直播星图指数
    }
  },
  koubei_data: {
    // 带货口碑图表
    charts: [
      {
        author_id: "61070806273",
        date: "202010", // 月份（横坐标）
        score: 4.86, // 评分（纵坐标）
        time_node: 1601481600 // 时间节点？
      },
      {
        author_id: "61070806273",
        date: "202011",
        score: 4.59,
        time_node: 1604160000
      },
      {
        author_id: "61070806273",
        date: "202012",
        score: 4.46,
        time_node: 1606752000
      },
      {
        author_id: "61070806273",
        date: "202101",
        score: 3.97,
        time_node: 1609430400
      },
      {
        author_id: "61070806273",
        date: "202102",
        score: 3.97,
        time_node: 1612108800
      },
      {
        author_id: "61070806273",
        date: "202103",
        score: 4.46,
        time_node: 1614528000
      }
    ]
  },
  pinlei_data: {
    // 带货品类
    category: [
      // 上架商品品类
      "美妆护理",
      "零食食品",
      "生活电器",
      "家居宠物",
      "女鞋/男鞋/箱包",
      "母婴玩具",
      "医药保健",
      "生鲜蔬果",
      "汽配摩托",
      "珠宝饰品",
      "男装",
      "女装"
    ],
    brand_name: [
      // 上架商品品牌
      "Three Squirrels/三只松鼠",
      "松下（Panasonic）",
      "CARSLAN/卡姿兰",
      "PERFECT DIARY/完美日记",
      "OSM/欧诗漫",
      "冰希黎",
      "colorkey",
      "一叶子",
      "DONGINBI 1899",
      "理肤泉",
      "美宝莲",
      "AHC（美容护肤）",
      "BY－HEALTH/汤臣倍健",
      "认养一头牛",
      "半饱粒粒",
      "三只松鼠(Three Squirrels)",
      "Qdsuh/巧迪尚惠",
      "Latue Seed/劳斯·帅特",
      "飞乐思",
      "莫小仙",
      "花迷",
      "Kans/韩束",
      "Missha/谜尚",
      "Y.N.M",
      "珀莱雅（PROYA）",
      "乐扣乐扣（LOCK&LOCK）",
      "VT（美妆）",
      "零度企鹅",
      "五谷磨房",
      "BIO-G/高肌能",
      "SULWHASOO/雪花秀",
      "ZHOU HEI YA/周黑鸭",
      "李施德林",
      "Dora Dosun/朵拉朵尚",
      "PROYA/珀莱雅",
      "L'OREAL /欧莱雅",
      "优资莱",
      "GELLE FRERES/婕珞芙",
      "Boitown/冰希黎",
      "炊达人",
      "A.H.C/爱和纯",
      "Hapsode/悦芙媞",
      "3CE/三熹玉",
      "可丽金",
      "kafellon/凯芙兰",
      "谷雨",
      "TAYOHYA/多样屋",
      "大希地",
      "Avene/雅漾",
      "Moiidea/莫耶",
      "一叶子(One leaf)",
      "One Leaf/一叶子",
      "COGI/高姿",
      "Joyoung/九阳",
      "二阳",
      "秋梅",
      "Marubi/丸美",
      "TIMAGE/彩棠",
      "彩棠",
      "春光(CHUNGUANG)",
      "HUGGAH/呼嘎",
      "unny club",
      "ALIS"
    ]
  },
  zhibo_data: {
    // 直播概览
    total_live_count: 100, // 历史总场次
    avg_live_time: 14768, // 平均开播时长，单位秒
    week_count: 0, // 本周开播场次
    month_count: 4, // 本月开播场次
    avg_week_count: 2, // 周平均开播场次
    avg_month_count: 9, // 月平均开播场次
    avg_user_value: 0, // ??
    avg_room_ticket_count: 0, // 近30天场均销售数量？
    avg_live_volume: 0, // 近30天场均音浪收入
    avg_live_amount: 0, // 近30天场均销售额
    avg_daily_uv: 0, // 每天的uv
    avg_interaction_rate: 0, // ?
    thirty_days_live_count: 0, // 近30天直播场次
    avg_online_time: 0
  },
  shipin_data: {
    // 视频概览
    author_id: "61070806273",
    history_aweme_count: 3523, // 历史视频数
    average_digg: 1270.0689753051377, // 平均点赞
    average_digg_percent: 0.0004125414144091713, // 平均赞粉比
    average_aweme_duration: 15.342965938120921, // 视频平均时长
    average_week_aweme_count: 17, // 周均视频个数
    average_month_aweme_count: 76, // 月均视频个数
    follower_count: 3078646, // 粉丝数量
    product_aweme_count_30: 0, // 近30天预估销量
    product_aweme_amount_30: 0 // 近30天预估销售额
  },
  dianshang_data: {
    // 电商概览
    total_product_count: 1905, // 历史商品数
    category_rate: {
      // 品类占比
      aweme_rate: 0.21, // 视频占比
      live_rate: 99.79 // 直播占比
    },
    category_per_rate: [
      // 商品品类占比饼图
      {
        rate: 52.76,
        title: "美妆护理"
      },
      {
        rate: 13.33,
        title: "珠宝饰品"
      },
      {
        rate: 11.39,
        title: "零食食品"
      },
      {
        rate: 22.52,
        title: "其他"
      }
    ],
    total_category_count: 19, // 商品品类数量
    brand_rate: {
      // 品牌占比
      aweme_rate: 0.21, // 视频占比
      live_rate: 99.79 // 直播占比
    },
    brand_per_rate: [
      // 品牌占比饼图
      {
        rate: 2.47,
        title: "Three Squirrels/三只松鼠"
      },
      {
        rate: 1.99,
        title: "PROYA/珀莱雅"
      },
      {
        rate: 1.89,
        title: "PERFECT DIARY/完美日记"
      },
      {
        rate: 1.78,
        title: "CARSLAN/卡姿兰"
      },
      {
        rate: 1.47,
        title: "CHANDO/自然堂"
      },
      {
        rate: 90.39,
        title: "其他"
      }
    ],
    total_brand_count: 112, // 商品品牌数
    platform_rate: {
      // 来源平台占比
      aweme_rate: 0.21, // 视频占比
      live_rate: 99.79 // 直播占比
    },
    platform_per_rate: [
      // 历史商品来自平台占比饼图
      {
        rate: 0.21,
        title: "其他"
      },
      {
        rate: 66.88,
        title: "小店"
      },
      {
        rate: 26.88,
        title: "淘宝"
      },
      {
        rate: 4.88,
        title: "天猫"
      },
      {
        rate: 1.15,
        title: "京东"
      }
    ],
    total_platform_count: 5, // 来源平台
    top_category: [
      // 排名靠前品类
      "美妆护理",
      "珠宝饰品",
      "零食食品",
      "鲜花家纺",
      "女装",
      "家居宠物",
      "生活电器",
      "运动户外",
      "女鞋/男鞋/箱包",
      "男装",
      "医药保健",
      "图书音像",
      "母婴玩具",
      "3C数码",
      "汽配摩托",
      "生鲜蔬果",
      "内衣",
      "家具建材"
    ],
    top_brand: [
      // 排名靠前品牌
      "Three Squirrels/三只松鼠",
      "PROYA/珀莱雅",
      "PERFECT DIARY/完美日记",
      "CARSLAN/卡姿兰",
      "CHANDO/自然堂",
      "La Chapelle/拉夏贝尔",
      "Latue Seed/劳斯·帅特",
      "Winona/薇诺娜",
      "Marubi/丸美",
      "松下（Panasonic）",
      "Maybelline/美宝莲",
      "OSM/欧诗漫",
      "三只松鼠(Three Squirrels)",
      "Kans/韩束",
      "薇诺娜(WINONA)",
      "浪莎",
      "ALIS",
      "Boitown/冰希黎",
      "珀莱雅",
      "一叶子",
      "冰希黎",
      "3CE/三熹玉",
      "colorkey",
      "百雀羚",
      "理肤泉",
      "La Chapelle SPORT",
      "7．Modifier",
      "美宝莲",
      "DONGINBI 1899",
      "AHC（美容护肤）",
      "浪漫日记(LANGMANRIJI)",
      "红地球",
      "CANDIE＇S",
      "VT（美妆）",
      "BY－HEALTH/汤臣倍健",
      "认养一头牛",
      "geoskincare/纽西之谜",
      "良品铺子(BESTORE)",
      "水星家纺(MERCURY)",
      "SULWHASOO/雪花秀",
      "GELLE FRERES/婕珞芙",
      "飞乐思",
      "花迷",
      "Avene/雅漾",
      "TIMAGE/彩棠",
      "UKIWI/纽西小精灵",
      "半饱粒粒",
      "Qdsuh/巧迪尚惠",
      "GULINAZA/古力娜扎",
      "POTENT/葆伦特",
      "Hapsode/悦芙媞",
      "可丽金",
      "Olay/玉兰油",
      "莫小仙",
      "小仙炖",
      "大希地",
      "雅漾(Avene)",
      "法颂",
      "一叶子(One leaf)",
      "COGI/高姿",
      "Missha/谜尚",
      "彩棠",
      "春夏",
      "MayStar",
      "Puella",
      "CEMOY",
      "Y.N.M",
      "珀莱雅（PROYA）",
      "乐扣乐扣（LOCK&LOCK）",
      "AHC（化妆品）",
      "零度企鹅",
      "美迪惠尔",
      "睿嫣润膏",
      "五谷磨房",
      "金路达",
      "三只松鼠",
      "BIO-G/高肌能",
      "ZHOU HEI YA/周黑鸭",
      "李施德林",
      "Dora Dosun/朵拉朵尚",
      "云耕物作",
      "L'OREAL /欧莱雅",
      "Civier/姿维雅",
      "拉贝缇",
      "优资莱",
      "炊达人",
      "A.H.C/爱和纯",
      "ANYA/韩雅",
      "荷乐士",
      "kafellon/凯芙兰",
      "谷雨",
      "TAYOHYA/多样屋",
      "Moiidea/莫耶",
      "韩汝",
      "荣耀",
      "One Leaf/一叶子",
      "Joyoung/九阳",
      "二阳",
      "秋梅",
      "Saky/舒客",
      "Mamonde/梦妆",
      "田七",
      "春光(CHUNGUANG)",
      "HUGGAH/呼嘎",
      "Abby's Choice",
      "RED DRAGONFLY",
      "unny club",
      "La Babite",
      "Onlyou",
      "VT°",
      "A.H.C"
    ],
    top_platform: {
      // 排名最高的平台
      name: "小店", // 名称
      rate: 66.88 // 占比
    }
  }
};
console.log(data1);

// 直播分析数据结构
const data2 = {
  seven: {
    // 7天数据
    statistical_data: {
      summary: {
        // 统计信息
        live_count: 1, // 直播场次
        live_product_count: 1, // 带货场次
        total_ticket: 5207, // 累计音浪
        avg_ticket: 5207, // 场均音浪
        total_volume: 1425, // 总销量
        avg_volume: 1425, // 场均销量
        total_amount: 12825, // 总销售额
        avg_amount: 12825, // 场均销售额
        product_size: 2, // 上架商品
        product_rate: 1.67, // 带货转化率
        total_user: 85138, // 直播观看人数？
        avg_uv: 0 // 场均uv价值
      },
      trends: [
        // 直播观看人次趋势
        {
          date: "2021-01-13", // 直播日期
          timestamp: 1610467200, // 时间戳
          total_user: 85138, // 观看人数
          live_records: [
            // 直播记录
            {
              room_id: "6917251160617585411", // 直播间id
              room_title: "瓜瓜开播啦", // 直播间名称
              live_cover:
                "https://p6-webcast-dycdn.byteimg.com/img/mosaic-legacy/7be800178b5fd7d2aad3~tplv-obj.image", // 封面图
              begin_time: 1610548077, // 开始时间
              room_finish_time: 1610550054, // 结束时间
              user_peak: 16386, // 用户峰值
              status: 4, // 直播状态，含义未知
              room_ticket_count: 5207, // 音浪？？
              product_size: 2, // 上架商品
              is_take_product: true, // 是否带货
              volume: 1425, // 销量
              amount: 12825, // 销售额
              source: 5, // ？？
              has_volume: true, // 是否有销量？？
              is_notice: false, // ??
              total_user: 85138, // 总人次
              watch_cnt: 125155, // ??
              is_go_detail: false, // ??
              gift_uv_count: 3459, //??
              warm_aweme_count: 0, // ??
              warm_aweme_id: "", // ??
              is_estimate: false, // ??
              average_residence_time: 240 // 平均停留时间，秒
            }
          ],
          amount: 12825, // 总销售额
          uv_value: 0, // uv价值
          uv_value_list: [], // uv价值列表
          avg_online: 0 // 场均在线？？
        },
        {
          date: "2021-01-14",
          timestamp: 1609516800,
          total_user: 0,
          live_records: [],
          amount: 0,
          uv_value: 0,
          uv_value_list: [],
          avg_online: 0
        }
      ],
      durations: [
        // 直播时长饼图分布
        {
          duration: "＜30分钟",
          count: 0
        },
        {
          duration: "0.5~1小时",
          count: 1
        },
        {
          duration: "1~2小时",
          count: 0
        },
        {
          duration: "2~4小时",
          count: 0
        },
        {
          duration: "＞4小时",
          count: 0
        }
      ],
      week_days: [
        // 直播开播时间统计柱状图
        {
          week_day: 1, // 周一
          count: 0 // 开播场次
        },
        {
          week_day: 2, // 周二
          count: 0
        },
        {
          week_day: 3, // 周三
          count: 1
        },
        {
          week_day: 4, // 周四
          count: 0
        },
        {
          week_day: 5, // 周五
          count: 0
        },
        {
          week_day: 6, // 周六
          count: 0
        },
        {
          week_day: 7, // 周日
          count: 0
        }
      ]
    },
    record_data: {
      // 直播记录
      list: [
        {
          room_id: "6917251160617585411", // 直播间id
          room_title: "瓜瓜开播啦", // 直播间名称
          live_cover:
            "https://p6-webcast-dycdn.byteimg.com/img/mosaic-legacy/7be800178b5fd7d2aad3~tplv-obj.image", // 封面图
          begin_time: 1610548077, // 开始时间
          room_finish_time: 1610550054, // 结束时间
          user_peak: 16386, // 人气峰值
          status: 4, // 直播状态，含义未知
          room_ticket_count: 5207, // 礼物收入
          product_size: 2, // 上架商品
          is_take_product: true, // 是否带货
          volume: 1425, // 销量
          amount: 12825, // 销售额
          source: 5, // ？？
          has_volume: true, // 是否有销量？？
          is_notice: false, // ??
          total_user: 85138, // 总人次
          watch_cnt: 125155, // ??
          is_go_detail: false, // ??
          gift_uv_count: 3459, //??
          warm_aweme_count: 0, // ??
          warm_aweme_id: "", // ??
          is_estimate: false, // ??
          average_residence_time: 240 // 平均停留时间，秒
        }
      ],
      page_info: {
        page: 1,
        totalCount: 1,
        totalPage: 1,
        size: 10
      },
      total_product_count: 2, // 上架商品
      total_volume: 1425, // 销量
      total_amount: 12825, // 销售额
      total_room_ticket_count: 5207, // 音浪？？
      has_live_room: true // 是否有直播间？？
    }
  },
  fifteen: {}, // 15天数据
  thirty: {} // 30天数据
};

// 视频分析
const data3 = {
  seven: {
    // 7天数据
    statistical_data: {
      // 视频统计、视频时长发布、视频发布时间统计
      summary: {
        // 统计
        aweme_count: 1, // 视频数
        product_aweme_count: 0, // 带货视频数
        avg_digg: 9264, // 平均点赞
        avg_comment: 2040, // 平均评论
        avg_share: 329, // 平均转发
        total_digg: 9264, // 总点赞
        total_comment: 2040, // 总评论
        total_share: 329, // 总转发
        digg_max: 9264, // 最大点赞数
        digg_min: 9264, // 最低点赞数
        comment_max: 2040, // 最大评论数
        comment_min: 2040, // 最低评论数
        share_max: 329, // 最大转发数
        share_min: 329 // 最低转发数
      },
      durations: [
        // 视频时长分布饼图
        {
          duration: "<15秒",
          count: 0
        },
        {
          duration: "15~30秒",
          count: 0
        },
        {
          duration: "30~60秒",
          count: 0
        },
        {
          duration: "1~2分钟",
          count: 1
        },
        {
          duration: "＞2分钟",
          count: 0
        }
      ],
      times: [
        // 视频发布时间统计柱状图
        {
          hour: 0,
          count: 0
        },
        {
          hour: 1,
          count: 0
        },
        {
          hour: 2,
          count: 0
        },
        {
          hour: 3,
          count: 0
        },
        {
          hour: 4,
          count: 0
        },
        {
          hour: 5,
          count: 0
        },
        {
          hour: 6,
          count: 0
        },
        {
          hour: 7,
          count: 0
        },
        {
          hour: 8,
          count: 0
        },
        {
          hour: 9,
          count: 0
        },
        {
          hour: 10,
          count: 0
        },
        {
          hour: 11,
          count: 0
        },
        {
          hour: 12,
          count: 0
        },
        {
          hour: 13,
          count: 0
        },
        {
          hour: 14,
          count: 0
        },
        {
          hour: 15,
          count: 0
        },
        {
          hour: 16,
          count: 0
        },
        {
          hour: 17,
          count: 0
        },
        {
          hour: 18,
          count: 0
        },
        {
          hour: 19,
          count: 0
        },
        {
          hour: 20,
          count: 1
        },
        {
          hour: 21,
          count: 0
        },
        {
          hour: 22,
          count: 0
        },
        {
          hour: 23,
          count: 0
        }
      ]
    },
    chart_data: {
      // 点赞数据、评论数据、转发数据
      add: [
        // 增量
        {
          total_favorited: -90, // 点赞增量
          total_comment: 0, // 评论增量
          total_share: 0, // 转发增量
          follower_count: -2049, // 粉丝增量
          fans_club_total: 0, // 粉丝团增量
          time_node: 1609430400 // 时间节点
        },
        {
          total_favorited: -132,
          total_comment: 0,
          total_share: 0,
          follower_count: -2287,
          fans_club_total: 0,
          time_node: 1609516800
        }
      ],
      total: [
        // 总量
        {
          total_favorited: 4518848, // 点赞总量
          total_comment: 528, // 评论总量
          total_share: 31, // 转发总量
          follower_count: 3261785, // 粉丝总量
          fans_club_total: 0, // 粉丝团总量
          time_node: 1609430400 // 时间节点
        },
        {
          total_favorited: 4518716,
          total_comment: 528,
          total_share: 31,
          follower_count: 3259498,
          fans_club_total: 0,
          time_node: 1609516800
        }
      ]
    },
    video_data: {
      // Ta的视频
      page_info: {
        page: 1,
        pageSize: 8,
        totalCount: 1,
        totalPage: 1
      },
      search_results: [
        // 视频列表
        {
          aweme_id: "6917959028203179267", // 视频id
          aweme_title:
            "你们的瓜瓜在越来越努力，越来越好好的努力工作和生活！爱你们的瓜瓜❤ @DOU+小助手", // 标题
          author_id: "61070806273", // 作者id
          aweme_cover:
            "https://p11.douyinpic.com/tos-cn-p-0015/6f4cc329fd93489abae2d6607e43a494_1610712872~tplv-dy-360p.jpeg?from=4257465056", // 分娩图
          aweme_url:
            "https://www.iesdouyin.com/share/video/6917959028203179267/?region=CN&mid=6917959102220339976&u_code=0&titleType=title&did=MS4wLjABAAAAry13dHazZOE8boucXLjjgPY40AfnogAv2wagXL8QusgSxDjiELwQY84GPACQnBST&iid=MS4wLjABAAAAFfZvwK1y4LjFWgrgSUu4nKHg_4x8wWkfd8c1SBWF92pXlq6hf9G3UaePdEId4T8W&with_sec_did=1", // 视频地址
          duration: 84589, // 时长
          digg_count: 9264, // 点赞数
          comment_count: 2040, // 评论数
          share_count: 329, // 转发数
          forward_count: 4, // ??
          download_count: 120, // 下载数
          play_count: 0, // 播放数
          good_sales: 0, // 商品销量？？
          music_id: "6917959102220339976", // 背景音乐id
          promotion_id: null,
          his_promotion_id: null,
          aweme_create_time: 1610712869, // 发布时间
          update_time: 0, // 更新时间
          add_time: 0,
          label: "美妆", // 分类？
          hot_words: null, // 热词？
          hot_words_info: null,
          a1: 0,
          a2: 0,
          a3: 0,
          a4: 0,
          a5: 0,
          a6: 0,
          g0: 0,
          g1: 0,
          g2: 0,
          province_analysis: null,
          city_analysis: null,
          mm_index: 0,
          mark_delete: 0,
          exist: true,
          product_count: 0,
          total_volume: 0,
          total_amount: 0,
          warm_live_count: 0,
          warm_room_id: "***"
        }
      ]
    }
  },
  fifteen: {}, // 15天数据，结构和7填数据一致
  thirty: {} // 30天数据，结构和7填数据一致
};

// 电商分析
const data4 = {
  seven: {
    // 7天数据
    list: [
      // 商品列表
      {
        product_id: "3458623526729304782", // 商品id
        product_title: "帆布包", // 商品名称
        product_url:
          "https://haohuo.jinritemai.com/views/product/item2?id=3458623526729304782&origin_type=3002070010&origin_id=99514375927_3458623526729304782&alkey=1128_99514375927_0_3458623526729304782_010&sec_author_id=MS4wLjABAAAA2I9NdgAKZrz9e0tLm1csyDMNqLESPDm34TdYYqXe8-I&c_biz_combo=8", // 商品链接
        product_image:
          "https://cdn-images.chanmama.com/douyin/product/4c5497c49ca7de38fb491324e48fdc10.jpeg?source=https%3A%2F%2Fp1.pstatp.com%2Fimg%2Ftemai%2F4bb24b8fcbd362e20ceab5d5c10d2753www640-640~tplv-resize%3A200%3A0.jpg", // 封面图
        aweme_count: 0, // 视频数
        month_aweme_count: 0, // 本月视频数？？
        month_room_count: 0, // 本月直播场次？
        first_aweme_id: "",
        first_room_id: "6917251160617585411", // 直播间id？
        room_count: 1, // 直播场次
        platform: "jinritemai", // 平台
        price: 9, // 商品价格
        commission_rate: 0, // 佣金比例
        volume: 1425, // 销量
        amount: 12825, // 销售额
        room_amount: 12825, // 直播销售额
        room_volume: 1425, // 直播销量
        aweme_volume: 0, // 视频销量
        aweme_amount: 0, // 视频销售额
        category: "其他", // 分类
        v2_category: {
          // ??
          big: "女鞋/男鞋/箱包", // 大类
          first: "潮流箱包", // 一级分类
          second: "", // 二级分类
          third: "" // 三级分类
        },
        brand_name: "其他", // 品牌
        r: ["6917251160617585411"],
        a: null
      },
      {
        product_id: "3454704482812863084",
        product_title: "19 女士蕾丝上衣6850",
        product_url:
          "https://haohuo.jinritemai.com/views/product/item2?id=3454704482812863084&origin_type=3002070010&origin_id=99514375927_3454704482812863084&alkey=1128_99514375927_0_3454704482812863084_010&sec_author_id=MS4wLjABAAAA2I9NdgAKZrz9e0tLm1csyDMNqLESPDm34TdYYqXe8-I&c_biz_combo=8",
        product_image:
          "https://cdn-images.chanmama.com/douyin/product/2ee06b75ccc8e5cea0b97a1ba2747195.jpeg?source=https%3A%2F%2Fp1.pstatp.com%2Fimg%2Ftemai%2F3a03f4c7643d0de10c165a770bd2949awww800-800~tplv-resize%3A200%3A0.jpg",
        aweme_count: 0,
        month_aweme_count: 0,
        month_room_count: 0,
        first_aweme_id: "",
        first_room_id: "6917251160617585411",
        room_count: 1,
        platform: "jinritemai",
        price: 399,
        commission_rate: 0,
        volume: 0,
        amount: 0,
        room_amount: 0,
        room_volume: 0,
        aweme_volume: 0,
        aweme_amount: 0,
        category: "其他",
        v2_category: {
          big: "女装",
          first: "特色女装",
          second: "",
          third: ""
        },
        brand_name: "其他",
        r: ["6917251160617585411"],
        a: null
      }
    ],
    total_volume: 1425, // 累计销量
    total_amount: 12825, // 累计销售额
    total_room_count: 1, // 关联直播
    total_aweme_count: 0, // 关联视频
    category: [
      {
        id: "女鞋/男鞋/箱包",
        name: "女鞋/男鞋/箱包",
        value: 1,
        sub: [
          {
            id: "潮流箱包",
            name: "潮流箱包",
            value: 0,
            sub: []
          }
        ]
      },
      {
        id: "女装",
        name: "女装",
        value: 1,
        sub: [
          {
            id: "特色女装",
            name: "特色女装",
            value: 0,
            sub: []
          }
        ]
      }
    ],
    brand: [
      {
        id: "其他",
        name: "其他",
        value: 2,
        sub: null
      }
    ],
    platform: [
      {
        id: "jinritemai",
        name: "jinritemai",
        value: 2,
        sub: null
      }
    ],
    page_info: {
      page: 1,
      totalCount: 2, // 累计商品数
      totalPage: 1
    }
  },
  fifteen: {}, // 15天数据
  thirty: {} // 30天数据
};

// 粉丝分析
const data5 = {
  seven: {
    trend_data: {
      // 趋势数据，粉丝趋势，粉丝团趋势
      add: [
        // 增量
        {
          total_favorited: -21,
          total_comment: 0,
          total_share: 0,
          follower_count: -1659, // 粉丝增量
          fans_club_total: 0, // 粉丝团增量
          time_node: 1614614400 // 时间节点
        },
        {
          total_favorited: -23,
          total_comment: 0,
          total_share: 0,
          follower_count: -1725,
          fans_club_total: 0,
          time_node: 1614700800
        }
      ],
      total: [
        // 总量
        {
          total_favorited: 4525185,
          total_comment: 0,
          total_share: 0,
          follower_count: 3131392, // 粉丝总量
          fans_club_total: 0, // 粉丝团总量
          time_node: 1614614400
        },
        {
          total_favorited: 4525162,
          total_comment: 0,
          total_share: 0,
          follower_count: 3129667,
          fans_club_total: 0,
          time_node: 1614700800
        }
      ]
    },
    ff: {
      // 粉丝性别分布、粉丝地域分布、粉丝年龄分布、粉丝活跃时间分布
      active_day: [
        // 粉丝活跃时间发布柱状图，周一到周5按小时统计
        {
          rate: 19.710144927536234,
          title: "15"
        },
        {
          rate: 18.55072463768116,
          title: "18"
        },
        {
          rate: 17.971014492753625,
          title: "16"
        },
        {
          rate: 14.492753623188406,
          title: "17"
        },
        {
          rate: 8.405797101449275,
          title: "19"
        },
        {
          rate: 6.3768115942028984,
          title: "22"
        },
        {
          rate: 5.797101449275362,
          title: "21"
        },
        {
          rate: 5.797101449275362,
          title: "20"
        },
        {
          rate: 1.7391304347826086,
          title: "23"
        },
        {
          rate: 1.1594202898550725,
          title: "0"
        }
      ],
      active_week: [
        // 周末统计
        {
          rate: 98.84057971014492,
          title: "6" // 周六
        },
        {
          rate: 1.1594202898550725,
          title: "7" // 周日
        }
      ],
      age: [
        // 年龄分布饼图
        {
          rate: 1.7428460784232946,
          title: "<18"
        },
        {
          rate: 15.991826443761484,
          title: "18-23"
        },
        {
          rate: 32.75839396211491,
          title: "24-30"
        },
        {
          rate: 36.92595186500449,
          title: "31-40"
        },
        {
          rate: 9.769212388870121,
          title: "41-50"
        },
        {
          rate: 2.811769261825702,
          title: ">50"
        }
      ],
      city: [], // 城市分布
      cons: [
        // 星座分布
        {
          rate: 100,
          title: "魔羯座"
        }
      ],
      gender: {
        // 性别比例
        female: 88.04383538169769,
        male: 11.95616461830231
      },
      has_feature: true,
      province: [
        // 省份比例
        {
          rate: 50.123456789,
          title: "河南"
        },
        {
          rate: 49.876543211,
          title: "江苏"
        }
      ]
    }
  },
  fifteen: {}, // 15天数据
  thrity: {} // 30天数据
};
