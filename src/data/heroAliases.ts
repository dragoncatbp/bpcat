/**
 * 英雄别名/简称映射
 * 用于搜索功能，支持中文简称、英文简称、民间俗称等
 */

export interface HeroAlias {
  heroId: number;
  aliases: string[]; // 所有别名，包括中文简称、英文简称、民间俗称等
}

// 英雄别名表（7.40c版本）- 包含官方简称、玩家俗称、民间称呼
export const heroAliases: HeroAlias[] = [
  // 敏捷英雄
  { heroId: 1, aliases: ['am', '敌法', 'df', '敌法师', 'magina', '玛吉纳'] },
  { heroId: 6, aliases: ['dr', '小黑', 'xh', '卓尔游侠', 'traxex', '崔希丝', '黑弓'] },
  { heroId: 8, aliases: ['jugg', '剑圣', 'js', '主宰', '尤涅若', 'yurnero', '奶棒人'] },
  { heroId: 9, aliases: ['pom', '白虎', 'bh', '米拉娜', '月女', 'potm'] },
  { heroId: 10, aliases: ['mor', '水人', 'sr', '变体精灵', 'morph', '汪汪'] },
  { heroId: 12, aliases: ['pl', '猴子', 'hz', '幻影长矛手', '大圣', '孙猴子', '假猴'] },
  { heroId: 32, aliases: ['sa', '隐刺', 'yc', '力丸', '隐刀', '隐形刺客', '背刺'] },
  { heroId: 35, aliases: ['sniper', '火枪', 'hq', '狙击手', '矮子', '火枪手', 'karl'] },
  { heroId: 41, aliases: ['fv', '虚空', 'xk', '虚空假面', 'jb脸', '假面', 'time', 'timewalker'] },
  { heroId: 44, aliases: ['pa', '幻刺', 'hc', '幻影刺客', '幻刺', '暴击', '恩赐解脱'] },
  { heroId: 46, aliases: ['ta', '圣堂', 'st', '圣堂刺客', '圣堂', '隐匿', '灵能陷阱'] },
  { heroId: 48, aliases: ['luna', '月骑', 'yq', '露娜', '月女', '月光', '月刃'] },
  { heroId: 56, aliases: ['clinkz', '小骷髅', 'xkl', '克林克兹', '骨弓', '骷髅射手', '燃烧之军'] },
  { heroId: 63, aliases: ['weaver', '蚂蚁', 'my', '编织者', '时光倒流', '缩地', '连击'] },
  { heroId: 67, aliases: ['spe', '幽鬼', 'yg', 'ug', '墨丘利', 'mercurial', '幽鬼之刃', '折射'] },
  { heroId: 89, aliases: ['naga', '小娜迦', 'xnj', '娜迦海妖', '海妖', '睡', '催眠'] },
  { heroId: 93, aliases: ['slark', '小鱼', 'xy', '斯拉克', '暗影之舞', '偷属性', '能量转移'] },
  { heroId: 94, aliases: ['medusa', '美杜莎', 'mds', '一姐', '蛇发女妖', 'gorgon', '石化凝视', '分裂箭'] },
  { heroId: 95, aliases: ['troll', '巨魔', 'jm', '巨魔战将', '战将', '狂战士之怒', '热血战魂'] },
  { heroId: 109, aliases: ['tb', '恐怖利刃', 'kbl', '魂断', '倒影', '惑幻', '魔化'] },
  { heroId: 114, aliases: ['mk', '大圣', 'ds3', '齐天大圣', '猴子', '真猴', '七十二变', '猴子猴孙'] },
  { heroId: 120, aliases: ['pango', '滚滚', 'gg', '石鳞剑士', '甲盾冲击', '虚张声势', '地雷滚滚'] },
  { heroId: 123, aliases: ['hoodwink', '松鼠', 'ss2', '森海飞霞', '爆栗出击', '野地奇袭', '一箭穿心'] },
  { heroId: 126, aliases: ['void', '紫猫', 'zm', '虚无之灵', '无影拳', '异化', '太虚之径'] },
  { heroId: 145, aliases: ['kez', '凯', 'kai', '天隼', '翔影之钗', '利爪狂舞', '影武长刀'] },
  
  // 力量英雄
  { heroId: 2, aliases: ['fw', 'axe', '斧王', '蒙哥·卡恩', 'mogul khan', '狂战士之吼', '战斗饥渴', '斩杀'] },
  { heroId: 7, aliases: ['es', '小牛', 'xn', '撼地者', '神牛', '撼地神牛', '回音击', '沟壑', '强化图腾'] },
  { heroId: 16, aliases: ['sk', '沙王', 'sw', '克里瑟历斯', 'crixalis', '地震', '掘地穿刺', '腐尸毒'] },
  { heroId: 18, aliases: ['sven', '斯温', 'sw2', '流浪剑客', '流浪', '风暴之锤', '巨力挥舞', '神之力量'] },
  { heroId: 19, aliases: ['tiny', '小小', 'xx', '山岭巨人', '山岭', '投掷', '山崩', '长大'] },
  { heroId: 23, aliases: ['kunkka', '船长', 'cz', '昆卡', '海军上将', '幽灵船', '洪流', '潮汐使者'] },
  { heroId: 27, aliases: ['slardar', '大鱼', 'dy', '大鱼人', '斯拉达', '斯拉达', '守卫冲刺', '鱼人碎击', '侵蚀雾霭'] },
  { heroId: 28, aliases: ['th', '潮汐', 'cx', '潮汐猎人', '猎人', '毁灭', '锚击', '海妖外壳', '巨浪'] },
  { heroId: 38, aliases: ['bm', '兽王', 'sw2', '卡林', 'karroch', '原始咆哮', '野性之斧', '野性呼唤'] },
  { heroId: 42, aliases: ['wk', '骷髅王', 'klw', '冥魂大帝', 'snk', ' skeleton king', '冥魂续命', '吸血灵魂', '殊死一搏'] },
  { heroId: 49, aliases: ['dk', '龙骑', 'lq', '龙骑士', '戴维安', 'davion', '真龙形态', '火焰气息', '神龙摆尾'] },
  { heroId: 51, aliases: ['cw', '发条', 'fl', '发条技师', '框', '框起来', '弹幕冲击', '能量齿轮', '照明火箭', '发射钩爪'] },
  { heroId: 54, aliases: ['naix', '小狗', 'xg', '噬魂鬼', 'lifestealer', '狂暴', '盛宴', '撕裂伤口', '感染'] },
  { heroId: 60, aliases: ['ns', '夜魔', 'ym2', '暗夜魔王', '巴拉那', 'balanar', '虚空', '伤残恐惧', '黑暗飞行', '黑暗时间'] },
  { heroId: 65, aliases: ['bat', '蝙蝠', 'bf', '蝙蝠骑士', '蝙蝠', '粘性燃油', '烈焰破击', '火焰飞行', '燃烧枷锁'] },
  { heroId: 69, aliases: ['doom', '末日', 'mr', '末日使者', '路西法', 'lucifer', '末日', '吞噬', '焦土', '阎刃'] },
  { heroId: 70, aliases: ['ursa', '拍拍', 'pp', '熊战士', '拍拍熊', '熊战士', '震撼大地', '怒意狂击', '激怒'] },
  { heroId: 71, aliases: ['sb', '白牛', 'bn', '裂魂人', '巴拉森', 'barathrum', '暗影冲刺', '巨力重击', '位面空洞', '幽冥一击'] },
  { heroId: 73, aliases: ['alch', '炼金', 'lj', '炼金术士', '拉泽尔', 'razel', '酸性喷雾', '不稳定的化合物', '地精的贪婪', '化学狂暴'] },
  { heroId: 77, aliases: ['lycan', '狼人', 'lr', '贝恩霍勒', 'banehallow', '召狼', '嗥叫', '野性驱使', '变身'] },
  { heroId: 78, aliases: ['brew', '熊猫', 'xm2', '酒仙', '曼吉克斯', 'mangix', '雷霆一击', '醉拳', '元素分离'] },
  { heroId: 80, aliases: ['ld', '德鲁伊', 'dly', ' syllabear', '熊德', '熊灵', '召熊', '缠绕之爪', '野蛮咆哮'] },
  { heroId: 81, aliases: ['ck', '混沌', 'hd', '混沌骑士', '奈文摩尔', 'kunkka', '混沌之箭', '现实裂隙', '混沌一击', '幻术'] },
  { heroId: 82, aliases: ['meepo', '米波', 'mb', '狗头人', '地卜师', '狗头', '忽悠', '地之束缚', '洗劫', '分则能成'] },
  { heroId: 83, aliases: ['tree', '大树', 'ds2', '树精卫士', 'rooftrellen', '自然卷握', '寄生种子', '活体护甲', '疯狂生长'] },
  { heroId: 85, aliases: ['undying', '尸王', 'sw3', '不朽尸王', '不死', '墓碑', '噬魂', '腐朽', '血肉傀儡'] },
  { heroId: 96, aliases: ['centaur', '人马', 'rm', '半人马战行者', '布拉德瓦登', '马蹄践踏', '双刃剑', '反击', '奔袭冲撞'] },
  { heroId: 97, aliases: ['magnus', '猛犸', 'mm', '马格纳斯', '半人猛犸', '震荡波', '授予力量', '獠牙冲刺', '两极反转'] },
  { heroId: 98, aliases: ['timber', '伐木机', 'fmj', '伐木机', '瑞兹拉克', '死亡旋风', '伐木锯链', '活性护甲', '锯齿飞轮'] },
  { heroId: 99, aliases: ['bb', '刚背', 'gb', '钢背兽', '刚毛后背', '粘稠鼻液', '刺针扫射', '战意'] },
  { heroId: 100, aliases: ['tusk', '海民', 'hm', '巨牙海民', '雪球', '寒冰碎片', '摔角行家', '海象神拳', '破冰者'] },
  { heroId: 103, aliases: ['et', '大牛', 'dn', '上古巨神', '牛头人酋长', '回音重踏', '灵体游魂', '自然秩序', '裂地沟壑'] },
  { heroId: 104, aliases: ['lc', '军团', 'jt', '军团指挥官', '特蕾丝汀', '压倒性优势', '强攻', '勇气之霎', '决斗'] },
  { heroId: 106, aliases: ['ember', '火猫', 'hm2', '灰烬之灵', '炘', '残焰', '烧灼锁链', '无影拳', '火焰壁垒'] },
  { heroId: 107, aliases: ['earth', '土猫', 'tm', '大地之灵', '考林', '巨石翻滚', '巨石冲击', '地磁之握', '磁化'] },
  { heroId: 108, aliases: ['underlord', '孽主', 'nz', '深渊领主', '深渊', 'azgalor', '火焰风暴', '恶魔之扉', '衰退光环', '黑暗之门'] },
  { heroId: 110, aliases: ['phoenix', '凤凰', 'fh', '伊卡洛斯', '凤凰冲击', '烈火精灵', '烈日炙烤', '超新星'] },
  { heroId: 129, aliases: ['mars', '玛尔斯', 'mes', '战神', '战神玛尔斯', '战神之矛', '神之谴戒', '护身甲盾', '热血竞技场'] },
  { heroId: 136, aliases: ['dawnbreaker', '破晓辰星', 'pxcx', '破晓', 'valora', '星破天惊', '上界重锤', '熠熠生辉', '天光现世'] },
  { heroId: 137, aliases: ['marci', '玛西', 'mx', '米拉娜的侍女', '过肩摔', '回身踢', '健体术', '怒拳破'] },
  { heroId: 138, aliases: ['primal', '兽', 'shou', '獸', 'primal beast', '原始野兽', '野蛮冲撞', '震荡波', '践踏', '捶'] },
  
  // 智力英雄
  { heroId: 3, aliases: ['bane', '祸乱', 'hlzy', '祸乱之源', '阿特洛波斯', 'atropos', '噩梦', '虚弱', '蚀脑', '恶魔的掌握'] },
  { heroId: 4, aliases: ['bs', '血魔', 'xm', '嗜血狂魔', '史德利古尔', '血怒', '血祭', '嗜血渴望', '割裂'] },
  { heroId: 5, aliases: ['cm', '冰女', 'bn', '水晶室女', '莉莱', 'rilai', '冰霜新星', '冰封禁制', '光环', '极寒领域'] },
  { heroId: 11, aliases: ['sf', '影魔', 'ym', '奈文摩尔', 'nevermore', '毁灭阴影', '支配死灵', '魔王降临', '魂之挽歌'] },
  { heroId: 13, aliases: ['puck', '帕克', 'pk', '仙女龙', '相位转移', '幻象法球', '新月之痕', '梦境缠绕'] },
  { heroId: 14, aliases: ['pudge', '屠夫', 'tf', '帕吉', '胖子', '钩', '肉钩', '腐烂', '堆积腐肉', '肢解'] },
  { heroId: 15, aliases: ['razor', '电棍', 'dg', '剃刀', '电魂', '风暴之眼', '等离子场', '静电连接', '不稳定电流'] },
  { heroId: 17, aliases: ['st', '蓝猫', 'lm', '风暴之灵', '风暴', '残影', '电子涡流', '超负荷', '球状闪电'] },
  { heroId: 20, aliases: ['vs', '复仇', 'fc', '复仇之魂', '仙德尔莎', '魔法箭', '恐怖波动', '命令光环', '移形换位'] },
  { heroId: 21, aliases: ['wr', '风行', 'fx', '风行者', '莱瑞蕾', '束缚击', '强力击', '风行', '集中火力'] },
  { heroId: 22, aliases: ['zeus', '宙斯', 'zs', '弧光', '雷神', '雷神之怒', '弧形闪电', '雷击', '静电场'] },
  { heroId: 25, aliases: ['lina', '火女', 'hn', '莉娜', '秀逗魔导士', '龙破斩', '光击阵', '炽魂', '神灭斩'] },
  { heroId: 26, aliases: ['lion', '恶魔巫师', 'emws', '莱恩', '羊', '变羊', '裂地尖刺', '妖术', '法力吸取', '死亡之指'] },
  { heroId: 30, aliases: ['wd', '巫医', 'wy', '扎瓦克', '麻痹药剂', '巫毒疗法', '诅咒', '死亡守卫'] },
  { heroId: 31, aliases: ['lich', '巫妖', 'wy2', '埃希克斯托', '寒霜爆发', '霜冻护甲', '阴邪凝视', '连环霜冻'] },
  { heroId: 33, aliases: ['enigma', '谜团', 'mt', '谜团', '午夜凋零', '憎恶', '转化', '黑洞'] },
  { heroId: 34, aliases: ['tk', '修补匠', 'xbg', 'tinker', '鲍什', '激光', '热导飞弹', '进击的机械', '再装填'] },
  { heroId: 36, aliases: ['nec', 'necro', '死灵法', 'slf', '死灵法师', '瘟疫法师', '死亡脉冲', '施虐之心', '幽魂护罩', '死神镰刀'] },
  { heroId: 37, aliases: ['wl', '术士', 'ss', '戴穆林', '术士', '致命连接', '暗言术', '剧变', '混乱之祭'] },
  { heroId: 39, aliases: ['qop', '女王', 'nw', '痛苦女王', '阿卡莎', '暗影突袭', '闪烁', '痛苦尖叫', '超声冲击波'] },
  { heroId: 40, aliases: ['veno', '剧毒', 'jd', '剧毒术士', '莱瑟尔', '剧毒新星', '瘴气', '毒刺', '瘟疫守卫'] },
  { heroId: 43, aliases: ['dp', '死亡先知', 'swxz', '克罗贝露丝', '克罗贝鲁斯', '食腐蝠群', '沉默魔法', '吸魂巫术', '驱使恶灵'] },
  { heroId: 45, aliases: ['pugna', '骨法', 'gf', '帕格纳', '湮灭法师', '幽冥爆轰', '衰老', '幽冥守卫', '生命汲取'] },
  { heroId: 47, aliases: ['viper', '毒龙', 'dl', '冥界亚龙', '蝮蛇', '毒性攻击', '幽冥剧毒', '腐蚀皮肤', '蝮蛇突袭'] },
  { heroId: 50, aliases: ['dazzle', '暗牧', 'am2', '戴泽', '暗影牧师', '剧毒之触', '薄葬', '暗影波', '编织'] },
  { heroId: 52, aliases: ['ts', '老鹿', 'll', '拉席克', '受折磨的灵魂', '撕裂大地', '恶魔赦令', '闪电风暴', '脉冲新星'] },
  { heroId: 53, aliases: ['np', '先知', 'xz', ' Furion', '法里奥', '先知', '传送', '发芽', '自然之怒'] },
  { heroId: 55, aliases: ['ds', '黑贤', 'hx', '黑暗贤者', '依什卡菲尔', '真空', '离子外壳', '奔腾', '复制之墙'] },
  { heroId: 57, aliases: ['omni', '全能', 'qn', '全能骑士', '普里斯特', '洗礼', '驱逐', '退化光环', '守护天使'] },
  { heroId: 58, aliases: ['enchant', '小鹿', 'xl', '魅惑魔女', '艾尤', '推进', '魅惑', '自然之助', '不可侵犯'] },
  { heroId: 59, aliases: ['huskar', '神灵', 'sl', '哈斯卡', '殉道者', '心炎', '沸血之矛', '狂战士之血', '牺牲'] },
  { heroId: 61, aliases: ['brood', '蜘蛛', 'zz', '育母蜘蛛', '布蕾克·艾拉齐娜', '蜘蛛', '孵化蜘蛛', '麻痹之咬', '极度饥渴'] },
  { heroId: 62, aliases: ['bh', '赏金', 'sj', '赏金猎人', '刚铎', '投掷飞镖', '忍术', '暗影步', '追踪术'] },
  { heroId: 64, aliases: ['jakiro', '双头龙', 'stl', '杰奇洛', 'jak', '冰火交加', '冰封路径', '液态火', '万火焚身'] },
  { heroId: 66, aliases: ['chen', '圣骑士', 'sqs', '陈', '神圣劝化', '赎罪', '忠诚考验', '上帝之手'] },
  { heroId: 68, aliases: ['aa', '冰魂', 'bh2', '远古冰魄', '卡尔德', '寒霜之足', '冰霜漩涡', '极寒之触', '冰晶爆轰'] },
  { heroId: 72, aliases: ['gyro', '飞机', 'fj', '矮人直升机', '奥雷尔', '火箭弹幕', '追踪导弹', '高射火炮', '召唤飞弹'] },
  { heroId: 74, aliases: ['invoker', '卡尔', 'ke', '祈求者', '卡厄斯', 'qwer', '元素', '冰墙', '陨石', '声波', '刷新'] },
  { heroId: 75, aliases: ['silencer', '沉默', 'cm2', '沉默术士', '诺崇', '奥术诅咒', '智慧之刃', '遗言', '全领域静默'] },
  { heroId: 76, aliases: ['od', '黑鸟', 'hn2', '殁境神蚀者', '哈沃德', '奥术天球', '星体禁锢', '精华变迁', '神智之蚀'] },
  { heroId: 79, aliases: ['sd', '毒狗', 'dg2', '暗影恶魔', '艾瑞达', '崩裂禁锢', '灵魂猎手', '暗影剧毒', '邪恶净化'] },
  { heroId: 84, aliases: ['ogre', '蓝胖', 'lp', '食人魔魔法师', '阿格隆', '火焰爆轰', '引燃', '嗜血术', '多重施法'] },
  { heroId: 86, aliases: ['rubick', '拉比克', 'lbk', '大魔导师', '魔导师', '隔空取物', '弱化能流', '奥术至尊', '技能窃取'] },
  { heroId: 87, aliases: ['disruptor', '干扰者', 'grz', '萨尔', '雷霆之击', '恶念瞥视', '动能力场', '静态风暴'] },
  { heroId: 88, aliases: ['nyx', '小强', 'xq', '司夜刺客', '阿努比', '穿刺', '法力燃烧', '尖刺外壳', '复仇'] },
  { heroId: 90, aliases: ['kotl', '光法', 'gf2', '光之守卫', '以斯拉', '冲击波', '法力流失', '查克拉魔法', '召回', '致盲之光'] },
  { heroId: 91, aliases: ['io', '小精灵', 'xjl', '艾欧', '精灵', '幽魂', '过载', '羁绊', '降临'] },
  { heroId: 92, aliases: ['visage', '死灵龙', 'sll', '维萨吉', '石像鬼', '石像形态', '灵魂超度', '陵卫斗篷', '佣兽'] },
  { heroId: 101, aliases: ['sky', '天怒', 'tn', '天怒法师', '龙鹰', '秘法鹰隼', '震荡光弹', '上古封印', '神秘之耀'] },
  { heroId: 102, aliases: ['abaddon', '亚巴顿', 'ybd', '魔霭领主', '迷雾缠绕', '无光之盾', '魔霭诅咒', '回光返照'] },
  { heroId: 105, aliases: ['techies', '炸弹人', 'zdr', '工程师', '埋布地雷', '自杀攻击', '麻痹陷阱', '遥控炸弹', '雷区标识'] },
  { heroId: 111, aliases: ['oracle', '神谕者', 'syz', '奈里夫', '气运之末', '命运敕令', '涤罪之焰', '虚妄之诺'] },
  { heroId: 112, aliases: ['ww', '冰龙', 'bl', '寒冬飞龙', '傲洛斯', '严寒烧灼', '碎裂冲击', '极寒之拥', '寒冬诅咒'] },
  { heroId: 113, aliases: ['arc', '电狗', 'dg3', '天穹守望者', '泽特', '乱流', '磁场', '闪光幽魂', '风暴双雄'] },
  { heroId: 119, aliases: ['willow', '花仙子', 'hxz', '邪影芳灵', '米波', '荆棘迷宫', '暗影之境', '诅咒王冠', '作祟'] },
  { heroId: 121, aliases: ['grim', '墨客', 'mk2', '天涯墨客', '岩珠', '幻影之拥', '命运之笔', '墨涌', '缚魂'] },
  { heroId: 128, aliases: ['snapfire', '老奶奶', 'lnn', '电炎绝手', '碧翠丝', '散射弹幕', '龙炎饼干', '电光石火', '蜥蜴绝吻'] },
  { heroId: 131, aliases: ['ringmaster', '百戏大王', 'bxdw', '朗戈', '戏法', 'mc', '百戏'] },
  { heroId: 141, aliases: ['muerta', '琼英碧灵', 'qybl', 'muerta', '亡魂', '散弹', '双枪', '枪'] },
  { heroId: 147, aliases: ['largo', '劳戈', 'lg', 'bard', '青蛙', '吟游诗人'] },
];

// 构建搜索索引
const searchIndex = new Map<number, string[]>();
heroAliases.forEach(({ heroId, aliases }) => {
  searchIndex.set(heroId, aliases.map(a => a.toLowerCase()));
});

// 搜索英雄
export function searchHeroes(query: string): number[] {
  if (!query.trim()) return [];
  
  const normalizedQuery = query.toLowerCase().trim();
  const results: number[] = [];
  
  heroAliases.forEach(({ heroId, aliases }) => {
    // 完全匹配别名
    if (aliases.some(alias => alias.toLowerCase() === normalizedQuery)) {
      if (!results.includes(heroId)) {
        results.push(heroId);
      }
      return;
    }
    
    // 模糊匹配（包含）
    if (aliases.some(alias => alias.toLowerCase().includes(normalizedQuery))) {
      if (!results.includes(heroId)) {
        results.push(heroId);
      }
    }
  });
  
  return results;
}

// 获取英雄别名
export function getHeroAliases(heroId: number): string[] {
  const hero = heroAliases.find(h => h.heroId === heroId);
  return hero?.aliases || [];
}
