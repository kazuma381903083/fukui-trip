window.TRIP = {
  "map": {
    "source": "地球地図日本（国土地理院） / dataofjapan。地点は施設案内などに基づく地域内の代表位置。",
    "nodes": [
      {
        "id": "fukui",
        "name": "福井駅・市街地",
        "lon": 136.2233,
        "lat": 36.062,
        "dx": 5,
        "dy": 37,
        "anchor": "middle",
        "place": "car",
        "description": "新幹線とレンタカーの拠点。Day 2はホテルに車を置き、煙やへ徒歩。Day 3は車を返して駅へ。",
        "label": "福井駅",
        "tease": "旅のはじまりも、帰り道も。"
      },
      {
        "id": "dinosaur",
        "name": "恐竜博物館",
        "lon": 136.5065,
        "lat": 36.0828,
        "dx": 17,
        "dy": -19,
        "anchor": "start",
        "place": "dinosaur",
        "description": "Day 1・11:00入館。臨時駐車場なら13:00頃、園内駐車なら13:30頃までに見学を終える目安。",
        "photo": "dinosaur.webp",
        "label": "恐竜博物館",
        "stamp": "dinosaur",
        "tease": "見上げる先に、太古の世界。"
      },
      {
        "id": "weaving",
        "name": "ゆめおーれ勝山",
        "lon": 136.5031,
        "lat": 36.0619,
        "dx": 18,
        "dy": 31,
        "anchor": "start",
        "place": "weaving",
        "description": "Day 1・15:00〜16:00の手織り体験。終了後は寄り道せず、あわらの宿へ。",
        "label": "ゆめおーれ",
        "stamp": "weaving",
        "tease": "糸を重ねて、旅の思い出に。"
      },
      {
        "id": "awara",
        "name": "あわら温泉・長谷川",
        "lon": 136.1942,
        "lat": 36.2296,
        "dx": 17,
        "dy": -22,
        "anchor": "start",
        "place": "hasegawa",
        "description": "Day 1は17:30到着予定。翌朝09:00に出発して、日本海側の東尋坊へ。",
        "label": "あわら温泉",
        "stamp": "hasegawa",
        "tease": "今日の思い出を、湯にほどく。"
      },
      {
        "id": "tojinbo",
        "name": "東尋坊",
        "lon": 136.1256,
        "lat": 36.2375,
        "dx": -16,
        "dy": -20,
        "anchor": "end",
        "place": "tojinbo",
        "description": "Day 2・09:30〜10:30の海岸散策。雨や強風なら短縮して、休憩を。",
        "photo": "tojinbo.webp",
        "label": "東尋坊",
        "stamp": "tojinbo",
        "tease": "青の向こうで、深呼吸。"
      },
      {
        "id": "mikuni",
        "name": "三国・海鮮ランチ",
        "lon": 136.147,
        "lat": 36.225,
        "dx": -23,
        "dy": 37,
        "anchor": "end",
        "place": "lunch",
        "description": "Day 2・11:00のみくに隠居処が第一候補、未予約。12:15退出を目標にESHIKOTOへ。",
        "label": "三国ランチ",
        "tease": "海辺のお昼は、おいしい予感。"
      },
      {
        "id": "eshikoto",
        "name": "ESHIKOTO",
        "lon": 136.3467,
        "lat": 36.0967,
        "dx": -6,
        "dy": -25,
        "anchor": "middle",
        "place": "eshikoto",
        "description": "Day 2・13:15〜14:00。九頭竜川のほとりで酒の買い物と景色を。運転する人は試飲をしません。",
        "label": "ESHIKOTO",
        "tease": "川の眺めと、お土産えらび。"
      },
      {
        "id": "eiheiji",
        "name": "永平寺",
        "lon": 136.3555,
        "lat": 36.0555,
        "dx": 18,
        "dy": 25,
        "anchor": "start",
        "place": "eiheiji",
        "description": "Day 2・14:30〜16:00に参拝。福井市へ戻り、17:00頃ホテルにチェックイン。",
        "photo": "eiheiji.webp",
        "label": "永平寺",
        "stamp": "eiheiji",
        "tease": "杉木立の奥で、ひと呼吸。"
      },
      {
        "id": "ichijo",
        "name": "一乗谷",
        "lon": 136.2984,
        "lat": 36.015,
        "dx": -8,
        "dy": 32,
        "anchor": "middle",
        "place": "museum",
        "description": "Day 3は09:45〜11:45に博物館、昼食後13:00〜14:30に遺跡へ。ガイドは予約調整中。15:00に一乗谷を出発。",
        "photo": "ichijodani.webp",
        "label": "一乗谷",
        "stamp": "ruins",
        "tease": "昔の町へ、歩幅をゆるめて。"
      }
    ],
    "days": [
      {
        "n": 1,
        "title": "東の勝山へ。最後は、あわらの湯。",
        "short": "福井 → 勝山 → あわら",
        "color": "#aa633b",
        "nodes": [
          "fukui",
          "dinosaur",
          "weaving",
          "awara"
        ],
        "note": "09:30に車を受け取り、勝山で博物館と手織り体験。夕方に北西のあわらへ。",
        "finish": "17:30 長谷川到着予定"
      },
      {
        "n": 2,
        "title": "海から川辺、永平寺を経て福井市へ。",
        "short": "あわら → 三国 → 永平寺 → 福井",
        "color": "#247e8a",
        "nodes": [
          "awara",
          "tojinbo",
          "mikuni",
          "eshikoto",
          "eiheiji",
          "fukui"
        ],
        "note": "09:00に宿を出発して日本海へ。午後は内陸へ向かい、夜は福井市内を徒歩で。",
        "finish": "17:00頃 ホテル ／ 20:45 煙や"
      },
      {
        "n": 3,
        "title": "南東の一乗谷へ。福井駅に戻って乾杯。",
        "short": "福井 → 一乗谷 → 福井駅",
        "color": "#737640",
        "nodes": [
          "fukui",
          "ichijo",
          "fukui"
        ],
        "note": "09:00にホテルを出発。一乗谷の博物館・遺跡を巡り、給油・返却を済ませて駅へ。",
        "finish": "返却目標16:00〜16:30 ／ 新幹線18:18"
      }
    ]
  },
  "days": [
    {
      "n": 1,
      "date": "2026-09-21",
      "short": "9.21",
      "weekday": "MON",
      "jp": "月",
      "title": "太古に出会い、糸を織り、<br>湯にほどける。",
      "lead": "恐竜の世界を歩き、自分の手で布を織る。<br>一日の終わりは、あわらの湯と会席に。",
      "area": "福井駅 → 勝山 → あわら温泉",
      "stay": "越前あわら温泉 長谷川",
      "focus": "15:00 手織り体験 ／ 17:30 旅館到着予定",
      "note": "恐竜博物館は連休の交通規制に注意。臨時駐車場の場合は13:00頃を目安に見学を終え、帰りのシャトルへ。",
      "image": "dinosaur.webp",
      "rows": [
        [
          "05:45頃",
          "東京駅到着目標",
          "朝食・飲み物は事前購入が安心"
        ],
        [
          "06:16",
          "東京駅発",
          "かがやき501号"
        ],
        [
          "車内",
          "朝食・休憩",
          "早朝出発なので少し休む"
        ],
        [
          "09:12",
          "福井駅着",
          "東口へ移動"
        ],
        [
          "09:30",
          "レンタカー受付・受取",
          "手続き、車両確認、ナビ設定"
        ],
        [
          "09:45頃",
          "勝山方面へ出発目安",
          "受取手続き次第で前後"
        ],
        [
          "10:30頃",
          "恐竜博物館周辺到着目標",
          "入館時刻ではなく、エリア到着目標"
        ],
        [
          "11:00〜",
          "恐竜博物館",
          "予約済み入館枠"
        ],
        [
          "13:00〜13:30",
          "見学終了・移動開始",
          "臨時駐車場利用時は早めに切り上げ"
        ],
        [
          "移動前後",
          "軽い昼食",
          "長い飲食待ちは避ける"
        ],
        [
          "14:30頃",
          "ゆめおーれ勝山到着目標",
          "駐車、トイレ、受付"
        ],
        [
          "15:00〜16:00",
          "手織り体験",
          "予約済み・固定"
        ],
        [
          "16:00",
          "勝山出発",
          "終了後は追加観光を入れない"
        ],
        [
          "17:15〜17:30",
          "長谷川チェックイン",
          "予約上の予定は17:30"
        ],
        [
          "到着後",
          "温泉・休憩",
          "夕食時刻に合わせる"
        ],
        [
          "夕食",
          "旅館の「結会席」",
          "19:00希望の場合は宿へ確認"
        ],
        [
          "夜",
          "温泉・部屋で休憩",
          "翌日に疲れを残さない"
        ]
      ],
      "events": [
        {
          "time": "05:45頃",
          "title": "東京駅到着目標",
          "note": "朝食・飲み物は事前購入が安心",
          "place": null,
          "at": "2026-09-21T05:45:00+09:00",
          "fixed": false
        },
        {
          "time": "06:16",
          "title": "東京駅発",
          "note": "かがやき501号",
          "place": null,
          "at": "2026-09-21T06:16:00+09:00",
          "fixed": true
        },
        {
          "time": "車内",
          "title": "朝食・休憩",
          "note": "早朝出発なので少し休む",
          "place": null,
          "at": null,
          "fixed": false
        },
        {
          "time": "09:12",
          "title": "福井駅着",
          "note": "東口へ移動",
          "place": null,
          "at": "2026-09-21T09:12:00+09:00",
          "fixed": false
        },
        {
          "time": "09:30",
          "title": "レンタカー受付・受取",
          "note": "手続き、車両確認、ナビ設定",
          "place": "car",
          "at": "2026-09-21T09:30:00+09:00",
          "fixed": false
        },
        {
          "time": "09:45頃",
          "title": "勝山方面へ出発目安",
          "note": "受取手続き次第で前後",
          "place": null,
          "at": "2026-09-21T09:45:00+09:00",
          "fixed": false
        },
        {
          "time": "10:30頃",
          "title": "恐竜博物館周辺到着目標",
          "note": "入館時刻ではなく、エリア到着目標",
          "place": "dinosaur",
          "at": "2026-09-21T10:30:00+09:00",
          "fixed": false
        },
        {
          "time": "11:00〜",
          "title": "恐竜博物館",
          "note": "予約済み入館枠",
          "place": "dinosaur",
          "at": "2026-09-21T11:00:00+09:00",
          "fixed": true
        },
        {
          "time": "13:00〜13:30",
          "title": "見学終了・移動開始",
          "note": "臨時駐車場利用時は早めに切り上げ",
          "place": null,
          "at": "2026-09-21T13:00:00+09:00",
          "fixed": false
        },
        {
          "time": "移動前後",
          "title": "軽い昼食",
          "note": "長い飲食待ちは避ける",
          "place": null,
          "at": null,
          "fixed": false
        },
        {
          "time": "14:30頃",
          "title": "ゆめおーれ勝山到着目標",
          "note": "駐車、トイレ、受付",
          "place": "weaving",
          "at": "2026-09-21T14:30:00+09:00",
          "fixed": false
        },
        {
          "time": "15:00〜16:00",
          "title": "手織り体験",
          "note": "予約済み・固定",
          "place": "weaving",
          "at": "2026-09-21T15:00:00+09:00",
          "fixed": true
        },
        {
          "time": "16:00",
          "title": "勝山出発",
          "note": "終了後は追加観光を入れない",
          "place": null,
          "at": "2026-09-21T16:00:00+09:00",
          "fixed": false
        },
        {
          "time": "17:15〜17:30",
          "title": "長谷川チェックイン",
          "note": "予約上の予定は17:30",
          "place": "hasegawa",
          "at": "2026-09-21T17:15:00+09:00",
          "fixed": false
        },
        {
          "time": "到着後",
          "title": "温泉・休憩",
          "note": "夕食時刻に合わせる",
          "place": null,
          "at": null,
          "fixed": false
        },
        {
          "time": "夕食",
          "title": "旅館の「結会席」",
          "note": "19:00希望の場合は宿へ確認",
          "place": "hasegawa",
          "at": null,
          "fixed": false
        },
        {
          "time": "夜",
          "title": "温泉・部屋で休憩",
          "note": "翌日に疲れを残さない",
          "place": null,
          "at": null,
          "fixed": false
        }
      ]
    },
    {
      "n": 2,
      "date": "2026-09-22",
      "short": "9.22",
      "weekday": "TUE",
      "jp": "火",
      "title": "海から、<br>酒と祈りの里へ。",
      "lead": "日本海の青と、三国の旬の魚。<br>川辺の酒文化から、静かな永平寺へ。",
      "area": "あわら → 三国 → 永平寺町 → 福井市",
      "stay": "ホテルフジタ福井",
      "focus": "14:00 ESHIKOTO出発目安 ／ 20:45 煙や",
      "note": "昼食や移動が遅れたら、ESHIKOTOのカフェを省略。ホテル到着後の休憩を大切に。運転する人は試飲をしません。",
      "image": "tojinbo.webp",
      "rows": [
        [
          "07:30または08:00",
          "長谷川で朝食",
          "開始時刻は宿に確認"
        ],
        [
          "08:30〜09:00",
          "支度・精算",
          "入湯税等の追加精算を確認"
        ],
        [
          "09:00",
          "チェックアウト",
          "東尋坊へ"
        ],
        [
          "09:30〜10:30",
          "東尋坊散策",
          "陸上から景色を楽しむ"
        ],
        [
          "10:30〜11:00",
          "三国の昼食店へ移動",
          "駐車・受付込み"
        ],
        [
          "11:00〜12:15",
          "みくに隠居処で昼食予定",
          "未予約。事前予約を優先"
        ],
        [
          "12:15〜13:15",
          "ESHIKOTOへ移動",
          "混雑・駐車を含む計画枠"
        ],
        [
          "13:15〜14:00",
          "ESHIKOTO",
          "酒の買い物、景色、空いていればカフェ"
        ],
        [
          "14:00〜14:30",
          "永平寺へ移動",
          "駐車・徒歩込み"
        ],
        [
          "14:30〜16:00",
          "大本山永平寺",
          "約90分"
        ],
        [
          "16:00〜17:00",
          "福井市へ移動・駐車",
          "ホテルへ"
        ],
        [
          "17:00頃",
          "ホテルフジタ福井チェックイン",
          "以降は徒歩移動"
        ],
        [
          "17:00〜20:15",
          "休憩・身支度・近場の散歩",
          "必要なら早めに少量の軽食"
        ],
        [
          "20:20頃",
          "ホテル出発",
          "徒歩で煙やへ"
        ],
        [
          "20:45〜",
          "煙やで夕食",
          "予約済み・固定"
        ],
        [
          "食後",
          "徒歩でホテルへ",
          "二軒目は基本旅程に入れない"
        ]
      ],
      "events": [
        {
          "time": "07:30または08:00",
          "title": "長谷川で朝食",
          "note": "開始時刻は宿に確認",
          "place": "hasegawa",
          "at": "2026-09-22T07:30:00+09:00",
          "fixed": false
        },
        {
          "time": "08:30〜09:00",
          "title": "支度・精算",
          "note": "入湯税等の追加精算を確認",
          "place": null,
          "at": "2026-09-22T08:30:00+09:00",
          "fixed": false
        },
        {
          "time": "09:00",
          "title": "チェックアウト",
          "note": "東尋坊へ",
          "place": null,
          "at": "2026-09-22T09:00:00+09:00",
          "fixed": false
        },
        {
          "time": "09:30〜10:30",
          "title": "東尋坊散策",
          "note": "陸上から景色を楽しむ",
          "place": "tojinbo",
          "at": "2026-09-22T09:30:00+09:00",
          "fixed": false
        },
        {
          "time": "10:30〜11:00",
          "title": "三国の昼食店へ移動",
          "note": "駐車・受付込み",
          "place": null,
          "at": "2026-09-22T10:30:00+09:00",
          "fixed": false
        },
        {
          "time": "11:00〜12:15",
          "title": "みくに隠居処で昼食予定",
          "note": "未予約。事前予約を優先",
          "place": "lunch",
          "at": "2026-09-22T11:00:00+09:00",
          "fixed": false
        },
        {
          "time": "12:15〜13:15",
          "title": "ESHIKOTOへ移動",
          "note": "混雑・駐車を含む計画枠",
          "place": "eshikoto",
          "at": "2026-09-22T12:15:00+09:00",
          "fixed": false
        },
        {
          "time": "13:15〜14:00",
          "title": "ESHIKOTO",
          "note": "酒の買い物、景色、空いていればカフェ",
          "place": "eshikoto",
          "at": "2026-09-22T13:15:00+09:00",
          "fixed": false
        },
        {
          "time": "14:00〜14:30",
          "title": "永平寺へ移動",
          "note": "駐車・徒歩込み",
          "place": "eiheiji",
          "at": "2026-09-22T14:00:00+09:00",
          "fixed": false
        },
        {
          "time": "14:30〜16:00",
          "title": "大本山永平寺",
          "note": "約90分",
          "place": "eiheiji",
          "at": "2026-09-22T14:30:00+09:00",
          "fixed": false
        },
        {
          "time": "16:00〜17:00",
          "title": "福井市へ移動・駐車",
          "note": "ホテルへ",
          "place": null,
          "at": "2026-09-22T16:00:00+09:00",
          "fixed": false
        },
        {
          "time": "17:00頃",
          "title": "ホテルフジタ福井チェックイン",
          "note": "以降は徒歩移動",
          "place": "fujita",
          "at": "2026-09-22T17:00:00+09:00",
          "fixed": false
        },
        {
          "time": "17:00〜20:15",
          "title": "休憩・身支度・近場の散歩",
          "note": "必要なら早めに少量の軽食",
          "place": null,
          "at": "2026-09-22T17:00:00+09:00",
          "fixed": false
        },
        {
          "time": "20:20頃",
          "title": "ホテル出発",
          "note": "徒歩で煙やへ",
          "place": null,
          "at": "2026-09-22T20:20:00+09:00",
          "fixed": false
        },
        {
          "time": "20:45〜",
          "title": "煙やで夕食",
          "note": "予約済み・固定",
          "place": "kemuriya",
          "at": "2026-09-22T20:45:00+09:00",
          "fixed": true
        },
        {
          "time": "食後",
          "title": "徒歩でホテルへ",
          "note": "二軒目は基本旅程に入れない",
          "place": null,
          "at": null,
          "fixed": false
        }
      ]
    },
    {
      "n": 3,
      "date": "2026-09-23",
      "short": "9.23",
      "weekday": "WED",
      "jp": "水",
      "title": "城下町の記憶と、<br>帰り際の一杯。",
      "lead": "一乗谷の暮らしに、ゆっくり思いを巡らす。<br>車を返したら、福井の酒でもう一度乾杯。",
      "area": "福井市 → 一乗谷 → 福井駅 → 東京",
      "stay": "18:18 福井発 → 21:20 東京着",
      "focus": "15:00 一乗谷出発 ／ 返却目標16:00〜16:30",
      "note": "一乗谷ガイドは予約調整中。手配できなければ同じ時間帯に自主見学。帰路が混んだら駅の角打ちを省略します。",
      "image": "ichijodani.webp",
      "rows": [
        [
          "07:30〜08:30頃",
          "朝食・身支度",
          "朝食場所は未確定"
        ],
        [
          "09:00",
          "ホテルチェックアウト",
          "荷物をレンタカーへ"
        ],
        [
          "09:00〜09:45",
          "一乗谷へ移動",
          "駐車・入館準備込み"
        ],
        [
          "09:45〜11:45",
          "一乗谷朝倉氏遺跡博物館",
          "約2時間を確保"
        ],
        [
          "11:45〜12:45",
          "昼食・遺跡方面への移動",
          "食事だけで1時間使わない"
        ],
        [
          "12:45頃",
          "ガイド集合場所到着目標",
          "集合場所は予約時に確定"
        ],
        [
          "13:00〜14:30",
          "遺跡をガイド付きで見学予定",
          "ガイド未予約"
        ],
        [
          "14:30〜15:00",
          "トイレ・車へ移動・調整時間",
          "長い追加散策はしない"
        ],
        [
          "15:00",
          "一乗谷出発",
          "基本の出発締切"
        ],
        [
          "15:35〜15:55頃",
          "福井市内で給油",
          "道路状況で前後"
        ],
        [
          "16:00〜16:30",
          "レンタカー返却",
          "予約上は17:00"
        ],
        [
          "16:45〜17:15",
          "みずもとで角打ち",
          "返却完了後。混雑時は省略"
        ],
        [
          "17:15〜17:40",
          "土産・軽食・トイレ",
          "買い物を終える"
        ],
        [
          "17:45頃",
          "新幹線改札へ",
          "ホーム・号車を確認"
        ],
        [
          "18:18",
          "福井駅発",
          "かがやき582号"
        ],
        [
          "21:20",
          "東京駅着",
          "旅行終了"
        ]
      ],
      "events": [
        {
          "time": "07:30〜08:30頃",
          "title": "朝食・身支度",
          "note": "朝食場所は未確定",
          "place": null,
          "at": "2026-09-23T07:30:00+09:00",
          "fixed": false
        },
        {
          "time": "09:00",
          "title": "ホテルチェックアウト",
          "note": "荷物をレンタカーへ",
          "place": null,
          "at": "2026-09-23T09:00:00+09:00",
          "fixed": false
        },
        {
          "time": "09:00〜09:45",
          "title": "一乗谷へ移動",
          "note": "駐車・入館準備込み",
          "place": null,
          "at": "2026-09-23T09:00:00+09:00",
          "fixed": false
        },
        {
          "time": "09:45〜11:45",
          "title": "一乗谷朝倉氏遺跡博物館",
          "note": "約2時間を確保",
          "place": "museum",
          "at": "2026-09-23T09:45:00+09:00",
          "fixed": false
        },
        {
          "time": "11:45〜12:45",
          "title": "昼食・遺跡方面への移動",
          "note": "食事だけで1時間使わない",
          "place": null,
          "at": "2026-09-23T11:45:00+09:00",
          "fixed": false
        },
        {
          "time": "12:45頃",
          "title": "ガイド集合場所到着目標",
          "note": "集合場所は予約時に確定",
          "place": "ruins",
          "at": "2026-09-23T12:45:00+09:00",
          "fixed": false
        },
        {
          "time": "13:00〜14:30",
          "title": "遺跡をガイド付きで見学予定",
          "note": "ガイド未予約",
          "place": "ruins",
          "at": "2026-09-23T13:00:00+09:00",
          "fixed": false
        },
        {
          "time": "14:30〜15:00",
          "title": "トイレ・車へ移動・調整時間",
          "note": "長い追加散策はしない",
          "place": null,
          "at": "2026-09-23T14:30:00+09:00",
          "fixed": false
        },
        {
          "time": "15:00",
          "title": "一乗谷出発",
          "note": "基本の出発締切",
          "place": null,
          "at": "2026-09-23T15:00:00+09:00",
          "fixed": false
        },
        {
          "time": "15:35〜15:55頃",
          "title": "福井市内で給油",
          "note": "道路状況で前後",
          "place": "fuel",
          "at": "2026-09-23T15:35:00+09:00",
          "fixed": false
        },
        {
          "time": "16:00〜16:30",
          "title": "レンタカー返却",
          "note": "予約上は17:00",
          "place": "car",
          "at": "2026-09-23T16:00:00+09:00",
          "fixed": false
        },
        {
          "time": "16:45〜17:15",
          "title": "みずもとで角打ち",
          "note": "返却完了後。混雑時は省略",
          "place": "mizumoto",
          "at": "2026-09-23T16:45:00+09:00",
          "fixed": false
        },
        {
          "time": "17:15〜17:40",
          "title": "土産・軽食・トイレ",
          "note": "買い物を終える",
          "place": null,
          "at": "2026-09-23T17:15:00+09:00",
          "fixed": false
        },
        {
          "time": "17:45頃",
          "title": "新幹線改札へ",
          "note": "ホーム・号車を確認",
          "place": null,
          "at": "2026-09-23T17:45:00+09:00",
          "fixed": false
        },
        {
          "time": "18:18",
          "title": "福井駅発",
          "note": "かがやき582号",
          "place": null,
          "at": "2026-09-23T18:18:00+09:00",
          "fixed": true
        },
        {
          "time": "21:20",
          "title": "東京駅着",
          "note": "旅行終了",
          "place": null,
          "at": "2026-09-23T21:20:00+09:00",
          "fixed": false
        }
      ]
    }
  ],
  "places": [
    {
      "id": "car",
      "day": 1,
      "name": "トヨタレンタカー 福井駅東口店",
      "kind": "交通",
      "address": "福井県福井市日之出2-2-18",
      "phone": "0776-24-0100",
      "status": "予約済み",
      "time": "09:30受取 / 返却予約17:00",
      "intro": "受取時にETC・給油条件・操作方法を確認。",
      "map": "https://www.google.com/maps/search/?api=1&query=%E7%A6%8F%E4%BA%95%E7%9C%8C%E7%A6%8F%E4%BA%95%E5%B8%82%E6%97%A5%E4%B9%8B%E5%87%BA2-2-18",
      "directions": "https://www.google.com/maps/dir/?api=1&destination=%E7%A6%8F%E4%BA%95%E7%9C%8C%E7%A6%8F%E4%BA%95%E5%B8%82%E6%97%A5%E4%B9%8B%E5%87%BA2-2-18"
    },
    {
      "id": "dinosaur",
      "day": 1,
      "name": "福井県立恐竜博物館",
      "kind": "太古",
      "address": "福井県勝山市村岡町寺尾51-11",
      "phone": "0779-88-0001",
      "status": "予約・支払済み",
      "time": "11:00 入館枠",
      "intro": "特別展と常設展。駐車場所に合わせて退出を前倒し。",
      "map": "https://www.google.com/maps/search/?api=1&query=%E7%A6%8F%E4%BA%95%E7%9C%8C%E5%8B%9D%E5%B1%B1%E5%B8%82%E6%9D%91%E5%B2%A1%E7%94%BA%E5%AF%BA%E5%B0%BE51-11",
      "directions": "https://www.google.com/maps/dir/?api=1&destination=%E7%A6%8F%E4%BA%95%E7%9C%8C%E5%8B%9D%E5%B1%B1%E5%B8%82%E6%9D%91%E5%B2%A1%E7%94%BA%E5%AF%BA%E5%B0%BE51-11"
    },
    {
      "id": "weaving",
      "day": 1,
      "name": "ゆめおーれ勝山",
      "kind": "体験",
      "address": "福井県勝山市昭和町1-7-40",
      "phone": "0779-87-1200",
      "status": "予約済み",
      "time": "15:00–16:00",
      "intro": "一本ずつ糸を重ねて、自分だけの旅の記念を。",
      "map": "https://www.google.com/maps/search/?api=1&query=%E7%A6%8F%E4%BA%95%E7%9C%8C%E5%8B%9D%E5%B1%B1%E5%B8%82%E6%98%AD%E5%92%8C%E7%94%BA1-7-40",
      "directions": "https://www.google.com/maps/dir/?api=1&destination=%E7%A6%8F%E4%BA%95%E7%9C%8C%E5%8B%9D%E5%B1%B1%E5%B8%82%E6%98%AD%E5%92%8C%E7%94%BA1-7-40"
    },
    {
      "id": "hasegawa",
      "day": 1,
      "name": "越前あわら温泉 長谷川",
      "kind": "温泉",
      "address": "福井県あわら市二面48-14",
      "phone": "0776-77-2164",
      "status": "予約・支払済み",
      "time": "17:30 到着予定",
      "intro": "結会席と温泉。夕食19:00開始は希望・未確定。",
      "map": "https://www.google.com/maps/search/?api=1&query=%E7%A6%8F%E4%BA%95%E7%9C%8C%E3%81%82%E3%82%8F%E3%82%89%E5%B8%82%E4%BA%8C%E9%9D%A248-14",
      "directions": "https://www.google.com/maps/dir/?api=1&destination=%E7%A6%8F%E4%BA%95%E7%9C%8C%E3%81%82%E3%82%8F%E3%82%89%E5%B8%82%E4%BA%8C%E9%9D%A248-14"
    },
    {
      "id": "tojinbo",
      "day": 2,
      "name": "東尋坊",
      "kind": "海",
      "address": "福井県坂井市三国町安島 東尋坊",
      "phone": "",
      "status": "訪問予定",
      "time": "09:30–10:30",
      "intro": "日本海に立ち上がる岩の柱。海岸を歩き、景色を楽しむ。",
      "map": "https://www.google.com/maps/search/?api=1&query=%E7%A6%8F%E4%BA%95%E7%9C%8C%E5%9D%82%E4%BA%95%E5%B8%82%E4%B8%89%E5%9B%BD%E7%94%BA%E5%AE%89%E5%B3%B6%20%E6%9D%B1%E5%B0%8B%E5%9D%8A",
      "directions": "https://www.google.com/maps/dir/?api=1&destination=%E7%A6%8F%E4%BA%95%E7%9C%8C%E5%9D%82%E4%BA%95%E5%B8%82%E4%B8%89%E5%9B%BD%E7%94%BA%E5%AE%89%E5%B3%B6%20%E6%9D%B1%E5%B0%8B%E5%9D%8A"
    },
    {
      "id": "lunch",
      "day": 2,
      "name": "みくに隠居処",
      "kind": "食",
      "address": "福井県坂井市三国町宿3-7-22",
      "phone": "0776-82-8558",
      "status": "未予約",
      "time": "11:00–12:15 希望",
      "intro": "秋の甘えび旬彩御膳が第一候補。席と提供可否を確認。",
      "map": "https://www.google.com/maps/search/?api=1&query=%E7%A6%8F%E4%BA%95%E7%9C%8C%E5%9D%82%E4%BA%95%E5%B8%82%E4%B8%89%E5%9B%BD%E7%94%BA%E5%AE%BF3-7-22",
      "directions": "https://www.google.com/maps/dir/?api=1&destination=%E7%A6%8F%E4%BA%95%E7%9C%8C%E5%9D%82%E4%BA%95%E5%B8%82%E4%B8%89%E5%9B%BD%E7%94%BA%E5%AE%BF3-7-22"
    },
    {
      "id": "eshikoto",
      "day": 2,
      "name": "ESHIKOTO",
      "kind": "酒文化",
      "address": "福井県吉田郡永平寺町下浄法寺12-17",
      "phone": "0776-63-1030",
      "status": "訪問予定",
      "time": "13:15–14:00",
      "intro": "九頭竜川を眺めて、酒の買い物。空いていればacoyaへ。",
      "map": "https://www.google.com/maps/search/?api=1&query=%E7%A6%8F%E4%BA%95%E7%9C%8C%E5%90%89%E7%94%B0%E9%83%A1%E6%B0%B8%E5%B9%B3%E5%AF%BA%E7%94%BA%E4%B8%8B%E6%B5%84%E6%B3%95%E5%AF%BA12-17",
      "directions": "https://www.google.com/maps/dir/?api=1&destination=%E7%A6%8F%E4%BA%95%E7%9C%8C%E5%90%89%E7%94%B0%E9%83%A1%E6%B0%B8%E5%B9%B3%E5%AF%BA%E7%94%BA%E4%B8%8B%E6%B5%84%E6%B3%95%E5%AF%BA12-17"
    },
    {
      "id": "eiheiji",
      "day": 2,
      "name": "大本山永平寺",
      "kind": "祈り",
      "address": "福井県吉田郡永平寺町志比5-15",
      "phone": "0776-63-3102",
      "status": "当日参拝予定",
      "time": "14:30–16:00",
      "intro": "杉木立と回廊に包まれる、静かな90分。",
      "map": "https://www.google.com/maps/search/?api=1&query=%E7%A6%8F%E4%BA%95%E7%9C%8C%E5%90%89%E7%94%B0%E9%83%A1%E6%B0%B8%E5%B9%B3%E5%AF%BA%E7%94%BA%E5%BF%97%E6%AF%945-15",
      "directions": "https://www.google.com/maps/dir/?api=1&destination=%E7%A6%8F%E4%BA%95%E7%9C%8C%E5%90%89%E7%94%B0%E9%83%A1%E6%B0%B8%E5%B9%B3%E5%AF%BA%E7%94%BA%E5%BF%97%E6%AF%945-15"
    },
    {
      "id": "fujita",
      "day": 2,
      "name": "ホテルフジタ福井",
      "kind": "宿",
      "address": "福井県福井市大手3-12-20",
      "phone": "0776-27-8811",
      "status": "予約・支払済み",
      "time": "17:00頃 到着予定",
      "intro": "素泊まり。大手駐車場に車を置き、夜は徒歩で。",
      "map": "https://www.google.com/maps/search/?api=1&query=%E7%A6%8F%E4%BA%95%E7%9C%8C%E7%A6%8F%E4%BA%95%E5%B8%82%E5%A4%A7%E6%89%8B3-12-20",
      "directions": "https://www.google.com/maps/dir/?api=1&destination=%E7%A6%8F%E4%BA%95%E7%9C%8C%E7%A6%8F%E4%BA%95%E5%B8%82%E5%A4%A7%E6%89%8B3-12-20"
    },
    {
      "id": "kemuriya",
      "day": 2,
      "name": "旬香逎燈 煙や",
      "kind": "食と酒",
      "address": "福井県福井市大手2-7-23",
      "phone": "050-5486-7791",
      "status": "席予約済み",
      "time": "20:45 夕食",
      "intro": "郷土の味と福井酒。焼き物、発酵食品、地元野菜を少しずつ。",
      "map": "https://www.google.com/maps/search/?api=1&query=%E7%A6%8F%E4%BA%95%E7%9C%8C%E7%A6%8F%E4%BA%95%E5%B8%82%E5%A4%A7%E6%89%8B2-7-23",
      "directions": "https://www.google.com/maps/dir/?api=1&destination=%E7%A6%8F%E4%BA%95%E7%9C%8C%E7%A6%8F%E4%BA%95%E5%B8%82%E5%A4%A7%E6%89%8B2-7-23"
    },
    {
      "id": "museum",
      "day": 3,
      "name": "一乗谷朝倉氏遺跡博物館",
      "kind": "歴史",
      "address": "福井県福井市安波賀中島町8-10",
      "phone": "0776-41-7700",
      "status": "当日購入予定",
      "time": "09:45–11:45",
      "intro": "模型と出土品から、戦国の城下町を知る。約2時間を確保。",
      "map": "https://www.google.com/maps/search/?api=1&query=%E7%A6%8F%E4%BA%95%E7%9C%8C%E7%A6%8F%E4%BA%95%E5%B8%82%E5%AE%89%E6%B3%A2%E8%B3%80%E4%B8%AD%E5%B3%B6%E7%94%BA8-10",
      "directions": "https://www.google.com/maps/dir/?api=1&destination=%E7%A6%8F%E4%BA%95%E7%9C%8C%E7%A6%8F%E4%BA%95%E5%B8%82%E5%AE%89%E6%B3%A2%E8%B3%80%E4%B8%AD%E5%B3%B6%E7%94%BA8-10"
    },
    {
      "id": "soba",
      "day": 3,
      "name": "一乗谷あさくら水の駅",
      "kind": "そば",
      "address": "福井県福井市安波賀中島町1-1-1",
      "phone": "0776-41-2777",
      "status": "未予約",
      "time": "11:45–12:45 移動込み",
      "intro": "越前おろしそばで昼休み。ガイドの集合時刻を優先。",
      "map": "https://www.google.com/maps/search/?api=1&query=%E7%A6%8F%E4%BA%95%E7%9C%8C%E7%A6%8F%E4%BA%95%E5%B8%82%E5%AE%89%E6%B3%A2%E8%B3%80%E4%B8%AD%E5%B3%B6%E7%94%BA1-1-1",
      "directions": "https://www.google.com/maps/dir/?api=1&destination=%E7%A6%8F%E4%BA%95%E7%9C%8C%E7%A6%8F%E4%BA%95%E5%B8%82%E5%AE%89%E6%B3%A2%E8%B3%80%E4%B8%AD%E5%B3%B6%E7%94%BA1-1-1"
    },
    {
      "id": "ruins",
      "day": 3,
      "name": "一乗谷朝倉氏遺跡・復原町並",
      "kind": "歴史",
      "address": "福井県福井市城戸ノ内町 一乗谷朝倉氏遺跡",
      "phone": "0776-41-2330",
      "status": "予約調整中",
      "time": "13:00–14:30 希望",
      "intro": "博物館で知った町を、今度は自分の足で歩く。",
      "map": "https://www.google.com/maps/search/?api=1&query=%E7%A6%8F%E4%BA%95%E7%9C%8C%E7%A6%8F%E4%BA%95%E5%B8%82%E5%9F%8E%E6%88%B8%E3%83%8E%E5%86%85%E7%94%BA%20%E4%B8%80%E4%B9%97%E8%B0%B7%E6%9C%9D%E5%80%89%E6%B0%8F%E9%81%BA%E8%B7%A1",
      "directions": "https://www.google.com/maps/dir/?api=1&destination=%E7%A6%8F%E4%BA%95%E7%9C%8C%E7%A6%8F%E4%BA%95%E5%B8%82%E5%9F%8E%E6%88%B8%E3%83%8E%E5%86%85%E7%94%BA%20%E4%B8%80%E4%B9%97%E8%B0%B7%E6%9C%9D%E5%80%89%E6%B0%8F%E9%81%BA%E8%B7%A1"
    },
    {
      "id": "fuel",
      "day": 3,
      "name": "給油とレンタカー返却",
      "kind": "交通",
      "address": "福井県福井市御幸3-3-23",
      "phone": "0776-24-7441",
      "status": "返却予約済み",
      "time": "16:00–16:30 返却目標",
      "intro": "給油候補はENEOSセルフサン勝見店。返却予約は17:00。",
      "map": "https://www.google.com/maps/search/?api=1&query=%E7%A6%8F%E4%BA%95%E7%9C%8C%E7%A6%8F%E4%BA%95%E5%B8%82%E5%BE%A1%E5%B9%B83-3-23",
      "directions": "https://www.google.com/maps/dir/?api=1&destination=%E7%A6%8F%E4%BA%95%E7%9C%8C%E7%A6%8F%E4%BA%95%E5%B8%82%E5%BE%A1%E5%B9%B83-3-23"
    },
    {
      "id": "mizumoto",
      "day": 3,
      "name": "おさけとワイン みずもと",
      "kind": "酒",
      "address": "福井県福井市中央1-1-25 みずもと",
      "phone": "0776-29-7239",
      "status": "当日利用",
      "time": "16:45–17:15",
      "intro": "車の返却完了後に角打ち。混んでいたら土産を優先。",
      "map": "https://www.google.com/maps/search/?api=1&query=%E7%A6%8F%E4%BA%95%E7%9C%8C%E7%A6%8F%E4%BA%95%E5%B8%82%E4%B8%AD%E5%A4%AE1-1-25%20%E3%81%BF%E3%81%9A%E3%82%82%E3%81%A8",
      "directions": "https://www.google.com/maps/dir/?api=1&destination=%E7%A6%8F%E4%BA%95%E7%9C%8C%E7%A6%8F%E4%BA%95%E5%B8%82%E4%B8%AD%E5%A4%AE1-1-25%20%E3%81%BF%E3%81%9A%E3%82%82%E3%81%A8"
    }
  ],
  "checkedAt": "2026-09-10"
};
