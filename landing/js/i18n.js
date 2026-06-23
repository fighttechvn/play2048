/* go2048 landing — lightweight i18n.
 * English lives inline in index.html (the baseline). This file holds the
 * translations for the other locales and swaps [data-i18n] innerHTML on change.
 * Persists choice in localStorage("go2048.lang"); auto-detects device language.
 * Arabic flips the document to RTL. */
(function () {
  "use strict";

  var LANGS = ["en", "vi", "ko", "zh", "ja", "ar"];
  var RTL = { ar: true };
  var STORE = "go2048.lang";

  var T = {
    vi: {
      "nav.games": "Trò chơi", "nav.features": "Tính năng", "nav.how": "Cách chơi",
      "nav.play": "Chơi online", "nav.download": "Tải về", "nav.sdk": "SDK", "nav.support": "Hỗ trợ",
      "store.getiton": "Tải trên", "store.betaon": "Bản beta trên", "store.noinstall": "Không cài đặt", "store.playonline": "Chơi online",
      "theme.system": "◐ Hệ thống", "theme.light": "☀ Sáng", "theme.dark": "☾ Tối",
      "hero.eyebrow": "3 trò chơi trí tuệ · Miễn phí · Ngoại tuyến",
      "hero.h1": "Cả một kho <span class=\"grad\">đố vui trí tuệ</span> — 2048, Zip &amp; Patch",
      "hero.sub": "Chọn một trò chơi từ bảng Khám phá và bắt đầu ngay. go2048 gồm 2048 cổ điển cùng Zip (nối số) và Patch (xếp hình logic) — mỗi game 99 màn, hiệu ứng mượt mà, giao diện sáng &amp; tối, sáu ngôn ngữ và hoàn toàn không theo dõi.",
      "cta.playnow": "▶ Chơi ngay", "cta.download": "Tải ứng dụng",
      "hero.meta1": "3 trò chơi · mỗi game 99 màn", "hero.meta2": "Không quảng cáo, không theo dõi",
      "games.eyebrow": "Một ứng dụng, ba câu đố", "games.h2": "Cả một trung tâm game trí tuệ trong túi bạn",
      "games.p": "Mở bảng Khám phá và vào thẳng bất kỳ trò chơi nào — mỗi game có 99 màn được tinh chỉnh kỹ và độ khó tăng dần mượt mà.",
      "games.tag.merge": "Ghép", "games.tag.path": "Đường nối", "games.tag.logic": "Logic",
      "games.go2048.p": "2048 cổ điển. Vuốt và ghép các số giống nhau để đạt 2048 — và hơn thế nữa.",
      "games.zip.p": "Vẽ một đường liền mạch qua mọi ô, đi qua các số 1→N theo đúng thứ tự.",
      "games.patch.p": "Chia lưới thành các hình chữ nhật sao cho mỗi hình chứa đúng một số bằng diện tích của nó.",
      "feat.eyebrow": "Vì sao chọn go2048", "feat.h2": "Một sân chơi nhỏ đầy câu đố trí tuệ — làm thật chỉn chu",
      "feat.p": "Ba trò chơi tự tay xây dựng trong một ứng dụng gọn gàng, hiện đại và đề cao quyền riêng tư.",
      "m1.h3": "Ba game trong một", "m1.p": "go2048, Zip và Patch — chọn từ bảng Khám phá và đổi bất cứ lúc nào.",
      "m1.li1": "Mỗi câu đố có 99 màn được tinh chỉnh kỹ", "m1.li2": "Hiệu ứng mượt mà và phản hồi rung", "m1.li3": "Tự động lưu tiến trình và điểm cao nhất",
      "m2.h3": "Riêng tư từ thiết kế", "m2.p": "Không tài khoản, không phân tích, không mạng quảng cáo. Không gì rời khỏi thiết bị của bạn.",
      "m2.li1": "Không thu thập dữ liệu — điểm số chỉ ở trên máy bạn", "m2.li2": "Hoạt động hoàn toàn ngoại tuyến", "m2.li3": "Không cần đăng ký, không cần cấp quyền",
      "m3.h3": "Giao diện sáng &amp; tối", "m3.p": "Chế độ tối tinh tế và bàn cờ sáng cổ điển — theo hệ thống hoặc tự chọn.",
      "m3.li1": "Hệ thống / Sáng / Tối, ghi nhớ giữa các phiên", "m3.li2": "Màu ô 2048 ấm áp, tương phản cao",
      "m4.h3": "Sáu ngôn ngữ", "m4.p": "Chơi bằng ngôn ngữ của bạn — bao gồm cả bố cục phải-sang-trái cho tiếng Ả Rập.",
      "m4.li2": "Tự động nhận diện ngôn ngữ thiết bị",
      "q1.h3": "Chơi bằng một ngón", "q1.p": "Bố cục dọc gọn gàng, vừa với mọi điện thoại, máy tính bảng hay cửa sổ máy tính.",
      "q2.h3": "Tiếp tục bất cứ lúc nào", "q2.p": "Đóng lại rồi quay lại — bàn chơi và điểm cao nhất luôn được lưu.",
      "q3.h3": "Không quảng cáo, không bao giờ", "q3.p": "Không banner, không pop-up, không gián đoạn. Chỉ có câu đố.",
      "q4.h3": "Chơi mọi nơi", "q4.p": "Cùng những trò chơi đó trên web, iOS và Android từ một mã nguồn duy nhất.",
      "q5.h3": "Vượt qua mốc 2048", "q5.p": "Đạt mục tiêu rồi tiếp tục ghép để lập kỷ lục cá nhân mới.",
      "q6.h3": "Nhỏ gọn &amp; tức thì", "q6.p": "Tải trong chớp mắt và chạy mượt ngay cả trên thiết bị cũ.",
      "stats.l1": "Trò chơi trí tuệ", "stats.l2": "Màn mỗi game", "stats.l3": "Ngôn ngữ", "stats.l4": "Trình theo dõi &amp; quảng cáo",
      "how.eyebrow": "Học trong 60 giây", "how.h2": "Cách chơi", "how.p": "Mỗi trò chơi dễ bắt đầu nhưng khó dừng lại.",
      "s1.h3": "go2048 — ghép", "s1.p": "Vuốt để trượt mọi ô. Hai số bằng nhau ghép thành gấp đôi. Leo tới 2048 và xa hơn.",
      "s2.h3": "Zip — nối", "s2.p": "Vẽ một đường liên tục qua mọi ô, đi qua các chấm số từ 1 đến N theo thứ tự.",
      "s3.h3": "Patch — chia", "s3.p": "Cắt lưới thành các hình chữ nhật sao cho mỗi hình chứa đúng một số bằng diện tích của nó.",
      "ctaband.h2": "Sẵn sàng chơi?", "ctaband.p": "Mở hub và chơi thử cả ba trò chơi ngay trên trình duyệt, hoặc cài go2048 lên điện thoại.",
      "footer.about": "Một hub câu đố trí tuệ nhanh, hiện đại, đề cao quyền riêng tư — go2048, Zip và Patch. Bởi FightTech.",
      "footer.col.play": "Chơi", "footer.col.game": "Trò chơi", "footer.col.legal": "Pháp lý",
      "footer.link.github": "Mã nguồn trên GitHub", "footer.link.privacy": "Chính sách bảo mật", "footer.link.terms": "Điều khoản sử dụng",
      "footer.rights": "Bảo lưu mọi quyền.", "footer.disclaimer": "2048 là một ý tưởng câu đố mở; go2048 là một bản dựng độc lập."
    },

    ko: {
      "nav.games": "게임", "nav.features": "특징", "nav.how": "플레이 방법",
      "nav.play": "온라인 플레이", "nav.download": "다운로드", "nav.sdk": "SDK", "nav.support": "지원",
      "store.getiton": "다운로드", "store.betaon": "베타", "store.noinstall": "설치 불필요", "store.playonline": "온라인 플레이",
      "theme.system": "◐ 시스템", "theme.light": "☀ 라이트", "theme.dark": "☾ 다크",
      "hero.eyebrow": "두뇌 게임 3종 · 무료 · 오프라인",
      "hero.h1": "주머니 속 <span class=\"grad\">두뇌 퍼즐</span> — 2048, Zip &amp; Patch",
      "hero.sub": "Discover 허브에서 게임을 골라 바로 시작하세요. go2048에는 클래식 2048과 Zip(숫자 경로), Patch(도형 논리)가 들어 있습니다 — 각 99레벨, 부드러운 애니메이션, 라이트 &amp; 다크 테마, 6개 언어, 그리고 추적은 전혀 없습니다.",
      "cta.playnow": "▶ 지금 플레이", "cta.download": "앱 다운로드",
      "hero.meta1": "게임 3종 · 각 99레벨", "hero.meta2": "광고·추적 없음",
      "games.eyebrow": "앱 하나, 퍼즐 셋", "games.h2": "주머니 속 두뇌 게임 허브",
      "games.p": "Discover 대시보드를 열어 어떤 게임이든 바로 시작하세요 — 각 게임마다 정교하게 다듬은 99레벨과 매끄러운 난이도 곡선을 제공합니다.",
      "games.tag.merge": "병합", "games.tag.path": "경로", "games.tag.logic": "논리",
      "games.go2048.p": "클래식 2048. 같은 숫자를 밀어 합쳐 2048 — 그 이상까지 도달하세요.",
      "games.zip.p": "모든 칸을 지나는 하나의 끊김 없는 선을 그어 숫자 1→N을 순서대로 통과하세요.",
      "games.patch.p": "격자를 직사각형으로 나누어 각 직사각형이 자신의 넓이와 같은 숫자 하나만 포함하게 하세요.",
      "feat.eyebrow": "go2048를 선택하는 이유", "feat.h2": "제대로 만든 작은 두뇌 퍼즐 아케이드",
      "feat.p": "깔끔하고 현대적이며 개인정보를 우선하는 앱 하나에 직접 만든 게임 셋.",
      "m1.h3": "게임 3종을 하나로", "m1.p": "go2048, Zip, Patch — Discover 허브에서 골라 언제든 전환하세요.",
      "m1.li1": "퍼즐마다 정교하게 다듬은 99레벨", "m1.li2": "매끄러운 애니메이션과 햅틱 피드백", "m1.li3": "진행 상황과 최고 점수를 자동 저장",
      "m2.h3": "설계부터 프라이버시", "m2.p": "계정도, 분석도, 광고 네트워크도 없습니다. 어떤 것도 기기를 벗어나지 않습니다.",
      "m2.li1": "데이터 수집 제로 — 점수는 기기에만 저장", "m2.li2": "완전한 오프라인 작동", "m2.li3": "가입 불필요, 권한 요청 없음",
      "m3.h3": "다크 &amp; 라이트 테마", "m3.p": "세련된 다크 모드와 클래식한 라이트 보드 — 시스템을 따르거나 직접 선택하세요.",
      "m3.li1": "시스템 / 라이트 / 다크, 세션 간 기억", "m3.li2": "따뜻하고 대비가 높은 2048 타일 색상",
      "m4.h3": "6개 언어", "m4.p": "모국어로 플레이하세요 — 아랍어를 위한 완전한 오른쪽-왼쪽 레이아웃 포함.",
      "m4.li2": "기기 언어를 자동 감지",
      "q1.h3": "한 손 엄지 조작", "q1.p": "어떤 폰, 태블릿, 데스크톱 창에도 맞는 깔끔한 세로 레이아웃.",
      "q2.h3": "언제든 이어하기", "q2.p": "껐다가 다시 와도 — 보드와 최고 점수는 항상 저장됩니다.",
      "q3.h3": "광고 없음, 영원히", "q3.p": "배너도, 팝업도, 방해도 없습니다. 오직 퍼즐만.",
      "q4.h3": "어디서나 플레이", "q4.p": "하나의 코드베이스로 웹, iOS, Android에서 동일한 게임을.",
      "q5.h3": "2048을 넘어 계속", "q5.p": "목표를 달성한 뒤에도 계속 합쳐 새로운 최고 기록에 도전하세요.",
      "q6.h3": "가볍고 즉시 실행", "q6.p": "순식간에 로드되고 구형 기기에서도 부드럽게 작동합니다.",
      "stats.l1": "두뇌 게임", "stats.l2": "게임당 레벨", "stats.l3": "언어", "stats.l4": "추적기 &amp; 광고",
      "how.eyebrow": "60초면 배운다", "how.h2": "플레이 방법", "how.p": "모든 게임이 시작은 쉽고 멈추기는 어렵습니다.",
      "s1.h3": "go2048 — 병합", "s1.p": "밀어서 모든 타일을 이동. 같은 숫자 둘이 두 배로 합쳐집니다. 2048, 그 너머까지.",
      "s2.h3": "Zip — 연결", "s2.p": "모든 칸을 지나는 하나의 연속된 경로를 그려 번호 점을 1부터 N까지 순서대로 지나가세요.",
      "s3.h3": "Patch — 분할", "s3.p": "격자를 직사각형으로 잘라 각 직사각형이 자신의 넓이와 같은 숫자 하나를 포함하게 하세요.",
      "ctaband.h2": "플레이할 준비 됐나요?", "ctaband.p": "허브를 열어 브라우저에서 세 게임을 바로 즐기거나, go2048을 휴대폰에 설치하세요.",
      "footer.about": "빠르고 현대적이며 개인정보를 우선하는 두뇌 퍼즐 허브 — go2048, Zip, Patch. FightTech 제작.",
      "footer.col.play": "플레이", "footer.col.game": "게임", "footer.col.legal": "법적 고지",
      "footer.link.github": "GitHub 소스", "footer.link.privacy": "개인정보 처리방침", "footer.link.terms": "이용약관",
      "footer.rights": "모든 권리 보유.", "footer.disclaimer": "2048은 공개된 퍼즐 콘셉트이며, go2048은 독립적으로 제작된 빌드입니다."
    },

    zh: {
      "nav.games": "游戏", "nav.features": "功能", "nav.how": "玩法",
      "nav.play": "在线玩", "nav.download": "下载", "nav.sdk": "SDK", "nav.support": "支持",
      "store.getiton": "下载于", "store.betaon": "测试版", "store.noinstall": "免安装", "store.playonline": "在线玩",
      "theme.system": "◐ 系统", "theme.light": "☀ 浅色", "theme.dark": "☾ 深色",
      "hero.eyebrow": "3 款益智游戏 · 免费 · 离线",
      "hero.h1": "口袋里的<span class=\"grad\">益智谜题</span> — 2048、Zip 与 Patch",
      "hero.sub": "从「发现」面板选一款游戏即可开玩。go2048 集合了经典 2048、Zip（数字连线）和 Patch（形状逻辑）——每款 99 关，动画顺滑，深浅双主题，六种语言，绝无任何追踪。",
      "cta.playnow": "▶ 立即开玩", "cta.download": "下载应用",
      "hero.meta1": "3 款游戏 · 每款 99 关", "hero.meta2": "无广告无追踪",
      "games.eyebrow": "一个应用，三种谜题", "games.h2": "口袋里的益智游戏中心",
      "games.p": "打开「发现」面板，直接进入任意游戏——每款都有 99 个精心调校的关卡和平滑的难度曲线。",
      "games.tag.merge": "合并", "games.tag.path": "连线", "games.tag.logic": "逻辑",
      "games.go2048.p": "经典 2048。滑动并合并相同数字，冲向 2048，乃至更高。",
      "games.zip.p": "画一条贯穿每个格子的连续线，依次经过数字 1→N。",
      "games.patch.p": "将网格分割成矩形，使每个矩形恰好包含一个与其面积相等的数字。",
      "feat.eyebrow": "为什么选 go2048", "feat.h2": "一个用心打造的小型益智游戏厅",
      "feat.p": "三款纯手工打造的游戏，集于一个简洁、现代、注重隐私的应用之中。",
      "m1.h3": "三合一游戏", "m1.p": "go2048、Zip 和 Patch——从「发现」面板挑选，随时切换。",
      "m1.li1": "每款谜题 99 个精调关卡", "m1.li2": "顺滑动画与触感反馈", "m1.li3": "自动保存进度与最高分",
      "m2.h3": "隐私优先设计", "m2.p": "无账号、无分析、无广告网络。任何数据都不会离开你的设备。",
      "m2.li1": "零数据收集——分数只保存在本地", "m2.li2": "完全离线运行", "m2.li3": "无需注册，无需任何权限",
      "m3.h3": "深色与浅色主题", "m3.p": "精致的深色模式与经典的浅色棋盘——跟随系统，或自行选择。",
      "m3.li1": "系统／浅色／深色，跨会话记忆", "m3.li2": "温暖、高对比的 2048 方块配色",
      "m4.h3": "六种语言", "m4.p": "用你的语言畅玩——包括为阿拉伯语提供的完整从右到左布局。",
      "m4.li2": "自动检测设备语言",
      "q1.h3": "单手拇指友好", "q1.p": "简洁的竖屏布局，适配任何手机、平板或桌面窗口。",
      "q2.h3": "随时继续", "q2.p": "关掉再回来——棋盘和最高分始终为你保存。",
      "q3.h3": "永无广告", "q3.p": "没有横幅，没有弹窗，没有打扰。只有谜题。",
      "q4.h3": "处处可玩", "q4.p": "同一套代码，在网页、iOS 和 Android 上呈现相同的游戏。",
      "q5.h3": "突破 2048 继续", "q5.p": "达成目标后继续合并，刷新你的个人最佳。",
      "q6.h3": "小巧即开", "q6.p": "瞬间加载，即便在旧设备上也运行流畅。",
      "stats.l1": "益智游戏", "stats.l2": "每款关卡", "stats.l3": "语言", "stats.l4": "追踪器与广告",
      "how.eyebrow": "60 秒就学会", "how.h2": "玩法", "how.p": "每款游戏都易上手，却让人欲罢不能。",
      "s1.h3": "go2048 — 合并", "s1.p": "滑动让所有方块移动。两个相同数字合并翻倍。一路冲上 2048，乃至更高。",
      "s2.h3": "Zip — 连线", "s2.p": "描绘一条贯穿每个格子的连续路径，按 1 到 N 的顺序经过数字圆点。",
      "s3.h3": "Patch — 分割", "s3.p": "将网格切成矩形，使每个矩形包含一个等于其面积的数字。",
      "ctaband.h2": "准备好开玩了吗？", "ctaband.p": "打开中心，在浏览器里立刻试玩全部三款游戏，或将 go2048 安装到手机上。",
      "footer.about": "一个快速、现代、隐私优先的益智谜题中心——go2048、Zip 和 Patch。由 FightTech 出品。",
      "footer.col.play": "开玩", "footer.col.game": "游戏", "footer.col.legal": "法律",
      "footer.link.github": "GitHub 源码", "footer.link.privacy": "隐私政策", "footer.link.terms": "使用条款",
      "footer.rights": "保留所有权利。", "footer.disclaimer": "2048 是一个开放的谜题概念；go2048 是独立开发的版本。"
    },

    ja: {
      "nav.games": "ゲーム", "nav.features": "特長", "nav.how": "遊び方",
      "nav.play": "オンラインで遊ぶ", "nav.download": "ダウンロード", "nav.sdk": "SDK", "nav.support": "サポート",
      "store.getiton": "入手:", "store.betaon": "ベータ版", "store.noinstall": "インストール不要", "store.playonline": "オンライン",
      "theme.system": "◐ システム", "theme.light": "☀ ライト", "theme.dark": "☾ ダーク",
      "hero.eyebrow": "3つの脳トレ · 無料 · オフライン",
      "hero.h1": "ポケットの中の<span class=\"grad\">脳トレパズル</span> — 2048・Zip・Patch",
      "hero.sub": "「発見」ハブから好きなゲームを選んですぐにプレイ。go2048 にはクラシックな 2048、Zip（数字の道）、Patch（図形ロジック）を収録 — 各99レベル、なめらかなアニメーション、ライト &amp; ダークテーマ、6言語、そしてトラッキングは一切なし。",
      "cta.playnow": "▶ 今すぐプレイ", "cta.download": "アプリをダウンロード",
      "hero.meta1": "3ゲーム · 各99レベル", "hero.meta2": "広告・追跡なし",
      "games.eyebrow": "1つのアプリに3つのパズル", "games.h2": "ポケットに収まる脳トレゲームのハブ",
      "games.p": "「発見」ダッシュボードを開けば、どのゲームにもすぐにアクセス — それぞれ丁寧に調整した99レベルと、なめらかな難易度カーブを用意。",
      "games.tag.merge": "マージ", "games.tag.path": "パス", "games.tag.logic": "ロジック",
      "games.go2048.p": "定番の 2048。同じ数字をスライドして合体させ、2048 — そしてその先へ。",
      "games.zip.p": "すべてのマスを通る一筆書きの線を引き、数字を 1→N の順にたどります。",
      "games.patch.p": "グリッドを長方形に分割し、それぞれが自身の面積と一致する数字をちょうど1つ含むようにします。",
      "feat.eyebrow": "go2048 を選ぶ理由", "feat.h2": "しっかり作り込んだ小さな脳トレパズルの遊び場",
      "feat.p": "手作りの3つのゲームを、シンプルでモダン、プライバシー第一のアプリに凝縮。",
      "m1.h3": "3つのゲームが1つに", "m1.p": "go2048・Zip・Patch — 「発見」ハブから選び、いつでも切り替え。",
      "m1.li1": "各パズルに丁寧に調整した99レベル", "m1.li2": "なめらかなアニメーションと触覚フィードバック", "m1.li3": "進行状況とベストスコアを自動保存",
      "m2.h3": "設計からプライバシー重視", "m2.p": "アカウントなし、解析なし、広告ネットワークなし。データは端末から出ません。",
      "m2.li1": "データ収集ゼロ — スコアは端末内のみ", "m2.li2": "完全オフラインで動作", "m2.li3": "登録不要、権限要求なし",
      "m3.h3": "ダーク &amp; ライトテーマ", "m3.p": "洗練されたダークモードとクラシックなライト盤 — システムに追従、または自分で選択。",
      "m3.li1": "システム／ライト／ダーク、次回も記憶", "m3.li2": "温かみのある高コントラストな2048タイル配色",
      "m4.h3": "6つの言語", "m4.p": "自分の言語でプレイ — アラビア語向けの完全な右から左へのレイアウトにも対応。",
      "m4.li2": "デバイスの言語を自動判別",
      "q1.h3": "片手の親指で快適", "q1.p": "スマホ・タブレット・デスクトップのどの画面にも合う、すっきりした縦レイアウト。",
      "q2.h3": "いつでも再開", "q2.p": "閉じてもまた戻れる — 盤面とベストスコアは常に保存。",
      "q3.h3": "広告は一切なし", "q3.p": "バナーもポップアップも中断もなし。あるのはパズルだけ。",
      "q4.h3": "どこでも遊べる", "q4.p": "一つのコードベースで、Web・iOS・Android に同じゲームを。",
      "q5.h3": "2048を超えて続行", "q5.p": "目標を達成しても合体を続け、自己ベストを更新。",
      "q6.h3": "軽量で瞬時に起動", "q6.p": "一瞬で読み込み、古い端末でもなめらかに動作。",
      "stats.l1": "脳トレゲーム", "stats.l2": "ゲームごとのレベル", "stats.l3": "言語", "stats.l4": "トラッカーと広告",
      "how.eyebrow": "60秒で覚えられる", "how.h2": "遊び方", "how.p": "どのゲームも始めるのは簡単、やめるのは難しい。",
      "s1.h3": "go2048 — マージ", "s1.p": "スワイプで全タイルを移動。同じ数字2つが倍に合体。2048、そしてその先へ。",
      "s2.h3": "Zip — つなぐ", "s2.p": "すべてのマスを通る連続した経路を描き、番号の点を1からNまで順に通過。",
      "s3.h3": "Patch — 分割", "s3.p": "グリッドを長方形に切り分け、それぞれが面積に等しい数字を1つ含むようにします。",
      "ctaband.h2": "遊ぶ準備はいい？", "ctaband.p": "ハブを開いてブラウザで3つのゲームをすぐに試すか、go2048 をスマホにインストール。",
      "footer.about": "高速・モダン・プライバシー第一の脳トレパズルハブ — go2048・Zip・Patch。FightTech 制作。",
      "footer.col.play": "プレイ", "footer.col.game": "ゲーム", "footer.col.legal": "法的事項",
      "footer.link.github": "GitHub のソース", "footer.link.privacy": "プライバシーポリシー", "footer.link.terms": "利用規約",
      "footer.rights": "全著作権所有。", "footer.disclaimer": "2048 はオープンなパズルのコンセプトであり、go2048 は独立した制作物です。"
    },

    ar: {
      "nav.games": "الألعاب", "nav.features": "المميزات", "nav.how": "طريقة اللعب",
      "nav.play": "العب أونلاين", "nav.download": "تنزيل", "nav.sdk": "SDK", "nav.support": "الدعم",
      "store.getiton": "متوفر على", "store.betaon": "نسخة بيتا على", "store.noinstall": "بدون تثبيت", "store.playonline": "العب أونلاين",
      "theme.system": "◐ النظام", "theme.light": "☀ فاتح", "theme.dark": "☾ داكن",
      "hero.eyebrow": "3 ألعاب ذهنية · مجاني · بدون إنترنت",
      "hero.h1": "جيبك مليء بـ<span class=\"grad\">ألغاز الذكاء</span> — 2048 وZip وPatch",
      "hero.sub": "اختر لعبة من لوحة «اكتشف» وابدأ فورًا. يجمع go2048 لعبة 2048 الكلاسيكية مع Zip (مسارات الأرقام) وPatch (منطق الأشكال) — 99 مرحلة لكل لعبة، حركات سلسة، وضعان فاتح &amp; داكن، ست لغات، وبدون أي تتبع إطلاقًا.",
      "cta.playnow": "▶ العب الآن", "cta.download": "حمّل التطبيق",
      "hero.meta1": "3 ألعاب · 99 مرحلة لكل لعبة", "hero.meta2": "بلا إعلانات أو تتبع",
      "games.eyebrow": "تطبيق واحد، ثلاثة ألغاز", "games.h2": "مركز ألعاب ذهنية كامل في جيبك",
      "games.p": "افتح لوحة «اكتشف» وانتقل مباشرة إلى أي لعبة — لكل منها 99 مرحلة مضبوطة بعناية ومنحنى صعوبة متدرّج بسلاسة.",
      "games.tag.merge": "دمج", "games.tag.path": "مسار", "games.tag.logic": "منطق",
      "games.go2048.p": "لعبة 2048 الكلاسيكية. مرّر وادمج الأرقام المتطابقة للوصول إلى 2048 وما بعده.",
      "games.zip.p": "ارسم خطًا متصلًا واحدًا يمر بكل خانة، ويمر بالأرقام من 1 إلى N بالترتيب.",
      "games.patch.p": "قسّم الشبكة إلى مستطيلات بحيث يحتوي كل مستطيل على رقم واحد فقط يساوي مساحته.",
      "feat.eyebrow": "لماذا go2048", "feat.h2": "صالة ألعاب صغيرة من ألغاز الذكاء — مصنوعة بإتقان",
      "feat.p": "ثلاث ألعاب مصنوعة يدويًا في تطبيق واحد أنيق وعصري يضع الخصوصية أولًا.",
      "m1.h3": "ثلاث ألعاب في واحد", "m1.p": "go2048 وZip وPatch — اخترها من لوحة «اكتشف» وبدّل في أي وقت.",
      "m1.li1": "99 مرحلة مضبوطة بعناية في كل لغز", "m1.li2": "حركات سلسة واستجابة لمسية", "m1.li3": "حفظ تلقائي لتقدّمك وأفضل نتائجك",
      "m2.h3": "الخصوصية بالتصميم", "m2.p": "بلا حساب، بلا تحليلات، بلا شبكات إعلانية. لا شيء يغادر جهازك.",
      "m2.li1": "صفر جمع للبيانات — تبقى نتيجتك على جهازك", "m2.li2": "يعمل بدون إنترنت تمامًا", "m2.li3": "بلا تسجيل، وبلا أذونات مطلوبة",
      "m3.h3": "وضعان داكن &amp; فاتح", "m3.p": "وضع داكن أنيق ولوحة فاتحة كلاسيكية — يتبع نظامك أو اختر بنفسك.",
      "m3.li1": "النظام / فاتح / داكن، ويُحفظ بين الجلسات", "m3.li2": "ألوان مربعات 2048 دافئة وعالية التباين",
      "m4.h3": "ست لغات", "m4.p": "العب بلغتك — بما في ذلك تخطيط كامل من اليمين إلى اليسار للعربية.",
      "m4.li2": "يكتشف لغة جهازك تلقائيًا",
      "q1.h3": "مريحة بإبهام واحد", "q1.p": "تصميم رأسي أنيق يناسب أي هاتف أو جهاز لوحي أو نافذة سطح مكتب.",
      "q2.h3": "استأنف في أي وقت", "q2.p": "أغلقها وعُد — تُحفظ لوحتك وأفضل نتيجة دائمًا.",
      "q3.h3": "بلا إعلانات أبدًا", "q3.p": "بلا لافتات، بلا نوافذ منبثقة، بلا مقاطعات. فقط اللغز.",
      "q4.h3": "يعمل في كل مكان", "q4.p": "الألعاب نفسها على الويب وiOS وAndroid من قاعدة شيفرة واحدة.",
      "q5.h3": "تجاوز 2048 وواصل", "q5.p": "حقّق الهدف وواصل الدمج لتسجيل رقم قياسي شخصي جديد.",
      "q6.h3": "صغيرة وفورية", "q6.p": "يُحمَّل في لمح البصر ويعمل بسلاسة حتى على الأجهزة القديمة.",
      "stats.l1": "ألعاب ذهنية", "stats.l2": "مراحل لكل لعبة", "stats.l3": "لغات", "stats.l4": "متعقّبات وإعلانات",
      "how.eyebrow": "تتعلّمها في 60 ثانية", "how.h2": "طريقة اللعب", "how.p": "كل لعبة سهلة البداية ويصعب تركها.",
      "s1.h3": "go2048 — دمج", "s1.p": "مرّر لتحريك كل المربعات. يندمج رقمان متساويان ليتضاعفا. اصعد إلى 2048 وأبعد.",
      "s2.h3": "Zip — وصل", "s2.p": "ارسم مسارًا متصلًا واحدًا عبر كل خانة، مارًّا بالنقاط المرقّمة من 1 إلى N بالترتيب.",
      "s3.h3": "Patch — تقسيم", "s3.p": "قسّم الشبكة إلى مستطيلات بحيث يحتوي كل منها على رقم واحد يساوي مساحته.",
      "ctaband.h2": "جاهز للعب؟", "ctaband.p": "افتح المركز وجرّب الألعاب الثلاث فورًا في متصفحك، أو ثبّت go2048 على هاتفك.",
      "footer.about": "مركز ألغاز ذهنية سريع وعصري يضع الخصوصية أولًا — go2048 وZip وPatch. من FightTech.",
      "footer.col.play": "اللعب", "footer.col.game": "اللعبة", "footer.col.legal": "قانوني",
      "footer.link.github": "المصدر على GitHub", "footer.link.privacy": "سياسة الخصوصية", "footer.link.terms": "شروط الاستخدام",
      "footer.rights": "جميع الحقوق محفوظة.", "footer.disclaimer": "2048 فكرة لغز مفتوحة؛ وgo2048 نسخة مستقلة."
    }
  };

  var nodes = [].slice.call(document.querySelectorAll("[data-i18n]"));
  var base = nodes.map(function (n) { return n.innerHTML; }); // English baseline

  function detect() {
    try {
      var saved = localStorage.getItem(STORE);
      if (saved && LANGS.indexOf(saved) >= 0) return saved;
    } catch (e) {}
    var nav = ((navigator.language || navigator.userLanguage || "en") + "").toLowerCase();
    var code = nav.split("-")[0];
    if (code === "zh") return "zh";
    return LANGS.indexOf(code) >= 0 ? code : "en";
  }

  function apply(lang) {
    if (LANGS.indexOf(lang) < 0) lang = "en";
    var dict = T[lang] || {};
    nodes.forEach(function (n, i) {
      var k = n.getAttribute("data-i18n");
      n.innerHTML = dict[k] != null ? dict[k] : base[i];
    });
    var html = document.documentElement;
    html.setAttribute("lang", lang);
    html.setAttribute("dir", RTL[lang] ? "rtl" : "ltr");
    try { localStorage.setItem(STORE, lang); } catch (e) {}
    var sel = document.getElementById("langSelect");
    if (sel) sel.value = lang;
  }

  apply(detect());

  var sel = document.getElementById("langSelect");
  if (sel) sel.addEventListener("change", function () { apply(sel.value); });
})();
