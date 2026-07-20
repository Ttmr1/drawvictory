const allCardsMaster = [

// ==========================================
// ⚔️ cat: "atk" (攻撃系)
// ==========================================
// type: "attack" -> id順
{ id: 101, name: "3ダメージ", cost: 0, desc: "", type: "attack", value: 3, rarity: "common", cat: "atk", isInitial: true },
{ id: 102, name: "6ダメージ", cost: 1, desc: "", type: "attack", value: 6, rarity: "common", cat: "atk", isInitial: true },
{ id: 103, name: "9ダメージ", cost: 2, desc: "", type: "attack", value: 9, rarity: "common", cat: "atk", isInitial: true },

{ id: 1101, name: "4ダメージ", cost: 0, desc: "", type: "attack", value: 4, rarity: "uncommon", cat: "atk", isInitial: false },
{ id: 1102, name: "7ダメージ", cost: 1, desc: "", type: "attack", value: 7, rarity: "uncommon", cat: "atk", isInitial: false },
{ id: 1103, name: "10ダメージ", cost: 2, desc: "", type: "attack", value: 10, rarity: "uncommon", cat: "atk", isInitial: false },

{ id: 2101, name: "12ダメージ", cost: 1, desc: "", type: "attack", value: 12, rarity: "rare", cat: "atk", isInitial: false },
{ id: 2102, name: "15ダメージ", cost: 2, desc: "", type: "attack", value: 15, rarity: "rare", cat: "atk", isInitial: false },
{ id: 2103, name: "18ダメージ", cost: 3, desc: "", type: "attack", value: 18, rarity: "rare", cat: "atk", isInitial: false },

{ id: 3101, name: "20ダメージ", cost: 2, desc: "", type: "attack", value: 20, rarity: "legend", cat: "atk", isInitial: false },
{ id: 3102, name: "23ダメージ", cost: 3, desc: "", type: "attack", value: 23, rarity: "legend", cat: "atk", isInitial: false },
{ id: 3103, name: "26ダメージ", cost: 4, desc: "", type: "attack", value: 26, rarity: "legend", cat: "atk", isInitial: false },

{ id: 4101, name: "28ダメージ", cost: 3, desc: "", type: "attack", value: 28, rarity: "space", cat: "atk", isInitial: false },
{ id: 4102, name: "31ダメージ", cost: 4, desc: "", type: "attack", value: 31, rarity: "space", cat: "atk", isInitial: false },
{ id: 4103, name: "34ダメージ", cost: 5, desc: "", type: "attack", value: 34, rarity: "space", cat: "atk", isInitial: false },



// type: "burnplus" -> id順
{ id: 1104, name: "5ダメージ+追加ダメージ", cost: 3, desc: "5ダメージ、敵が火傷状態なら+10ダメージ", type: "burnplus", value: 5, status: 10, rarity: "uncommon", cat: "atk", isInitial: false },
{ id: 2104, name: "10ダメージ+追加ダメージ", cost: 3, desc: "10ダメージ、敵が火傷状態なら+13ダメージ", type: "burnplus", value: 10, status: 13, rarity: "rare", cat: "atk", isInitial: false },
{ id: 3104, name: "10ダメージ+追加ダメージ", cost: 4, desc: "10ダメージ+敵が火傷状態なら+20ダメージ", type: "burnplus", value: 10, status: 20, rarity: "legend", cat: "atk", isInitial: false },
{ id: 4104, name: "10ダメージ+追加ダメージ", cost: 4, desc: "10ダメージ+敵が火傷状態なら+25ダメージ", type: "burnplus", value: 15, status: 25, rarity: "space", cat: "atk", isInitial: false },


// type: "blockAttackFull" -> id順
{ id: 1105, name: "防御値→ダメージ", cost: 0, desc: "防御分ダメージ、その後に防御を0", type: "blockAttackFull", rarity: "uncommon", cat: "atk", isInitial: false },


// type: "curseBurst" -> id順
{ id: 1106, name: "呪いの枚数×8ダメ", cost: 2, desc: "手札にある呪いカードの枚数×8ダメージ。", type: "curseBurst", value: 8, rarity: "uncommon", cat: "atk", isInitial: false },


// type: "discardSaber" -> id順
{ id: 1107, name: "捨て札の枚数分ダメージ", cost: 2, desc: "", type: "discardSaber", value: 0, rarity: "uncommon", cat: "atk", isInitial: false },


// type: "elementalFeast" -> id順
{ id: 1108, name: "状態異常なら15ダメージ", cost: 2, desc: "敵に火傷・毒・凍結がすべて入っているなら15ダメージ。", type: "elementalFeast", value: 15, rarity: "uncommon", cat: "atk", isInitial: false },
{ id: 2108, name: "状態異常なら20ダメージ", cost: 2, desc: "敵に火傷・毒・凍結がすべて入っているなら20ダメージ。", type: "elementalFeast", value: 20, rarity: "rare", cat: "atk", isInitial: false },
{ id: 3108, name: "状態異常なら25ダメージ", cost: 2, desc: "敵に火傷・毒・凍結がすべて入っているなら25ダメージ。", type: "elementalFeast", value: 25, rarity: "legend", cat: "atk", isInitial: false },


// type: "enemyhpmaxdamage" -> id順
{ id: 1109, name: "敵のHPがMAXなら25ダメージ", cost: 2, desc: "", type: "enemyhpmaxdamage", value: 25, rarity: "uncommon", cat: "atk", isInitial: false },
{ id: 2109, name: "敵のHPがMAXなら35ダメージ", cost: 3, desc: "", type: "enemyhpmaxdamage", value: 35, rarity: "rare", cat: "atk", isInitial: false },
{ id: 3109, name: "敵のHPがMAXなら45ダメージ", cost: 4, desc: "", type: "enemyhpmaxdamage", value: 45, rarity: "legend", cat: "atk", isInitial: false },
{ id: 4109, name: "敵のHPがMAXなら55ダメージ", cost: 5, desc: "", type: "enemyhpmaxdamage", value: 55, rarity: "space", cat: "atk", isInitial: false },


// type: "energyAttack" -> id順
{ id: 1110, name: "エネルギー×3ダメージ", cost: 2, desc: "残りエネルギー×3ダメージしてエネルギーを0", type: "energyAttack", value: 3, rarity: "uncommon", cat: "atk", isInitial: false },
{ id: 2110, name: "エネルギー×4ダメージ", cost: 3, desc: "残りエネルギー×4ダメージしてエネルギーを0", type: "energyAttack", value: 4, rarity: "rare", cat: "atk", isInitial: false },
{ id: 3110, name: "エネルギー×5ダメージ", cost: 4, desc: "残りエネルギー×5ダメージしてエネルギーを0", type: "energyAttack", value: 5, rarity: "legend", cat: "atk", isInitial: false },


// type: "execute" -> id順
{ id: 1111, name: "敵HP30以下なら30ダメージ", cost: 4, desc: "敵HP30以下なら30ダメージ", type: "execute", value: 30, rarity: "uncommon", cat: "atk", isInitial: false },
{ id: 2111, name: "敵HP35以下なら35ダメージ", cost: 4, desc: "敵HP35以下なら35ダメージ", type: "execute", value: 35, rarity: "rare", cat: "atk", isInitial: false },
{ id: 3111, name: "敵HP40以下なら40ダメージ", cost: 5, desc: "敵HP40以下なら40ダメージ", type: "execute", value: 40, rarity: "legend", cat: "atk", isInitial: false },
{ id: 4111, name: "敵HP50以下なら50ダメージ", cost: 6, desc: "敵HP50以下なら50ダメージ", type: "execute", value: 50, rarity: "space", cat: "atk", isInitial: false },


// type: "gambling" -> id順
{ id: 1112, name: "20%敵即死、80%自傷", cost: 5, desc: "20%の確率で敵即死(ボス無効)、80%で最大HPの40%自傷。", type: "gambling", value: 20, penaltyRate: 0.40, rarity: "uncommon", cat: "atk", isInitial: false },
{ id: 2112, name: "20%敵即死、80%自傷", cost: 5, desc: "20%の確率で敵即死(ボス無効)、80%で最大HPの33%自傷。", type: "gambling", value: 20, penaltyRate: 0.33, rarity: "rare", cat: "atk", isInitial: false },
{ id: 3112, name: "25%敵即死、75%自傷", cost: 5, desc: "25%の確率で敵即死(ボス無効)、75%で最大HPの33%自傷。", type: "gambling", value: 25, penaltyRate: 0.33, rarity: "legend", cat: "atk", isInitial: false },
{ id: 4112, name: "25%敵即死、75%自傷", cost: 5, desc: "25%の確率で敵即死(ボス無効)、75%で最大HPの27%自傷。", type: "gambling", value: 25, penaltyRate: 0.27, rarity: "space", cat: "atk", isInitial: false },


// type: "handSacrifice" -> id順
{ id: 1113, name: "手札破壊×6ダメージ", cost: 5, desc: "手札を全て破壊した枚数×6ダメージ", type: "handSacrifice", value: 6, rarity: "uncommon", cat: "atk", isInitial: false },
{ id: 2113, name: "手札破壊×7ダメージ", cost: 5, desc: "手札を全て破壊した枚数×7ダメージ", type: "handSacrifice", value: 7, rarity: "rare", cat: "atk", isInitial: false },
{ id: 3113, name: "手札破壊×8ダメージ", cost: 5, desc: "手札を全て破壊した枚数×8ダメージ", type: "handSacrifice", value: 8, rarity: "legend", cat: "atk", isInitial: false },


// type: "hpAttack" -> id順
{ id: 1114, name: "HP-20+30ダメージ", cost: 1, desc: "HP20消費して30ダメージ", type: "hpAttack", hpCost: 20, value: 30, rarity: "uncommon", cat: "atk", isInitial: false },
{ id: 2114, name: "HP-30+35ダメージ", cost: 2, desc: "HP30消費して35ダメージ", type: "hpAttack", hpCost: 30, value: 35, rarity: "rare", cat: "atk", isInitial: false },
{ id: 3114, name: "HP-30+42ダメージ", cost: 2, desc: "HP30消費して42ダメージ", type: "hpAttack", hpCost: 30, value: 42, rarity: "legend", cat: "atk", isInitial: false },


// type: "hpmindamage" -> id順
{ id: 1115, name: "自分のHP5%以下なら50ダメージ", cost: 5, desc: "", type: "hpmindamage", nowhp: 5, value: 50, rarity: "uncommon", cat: "atk", isInitial: false },
{ id: 2115, name: "自分のHP5%以下なら50ダメージ", cost: 4, desc: "", type: "hpmindamage", nowhp: 5, value: 50, rarity: "rare", cat: "atk", isInitial: false },
{ id: 3115, name: "自分のHP10%以下なら50ダメージ", cost: 4, desc: "", type: "hpmindamage", nowhp: 10, value: 50, rarity: "legend", cat: "atk", isInitial: false },


// type: "nkai" -> id順

{ id: 1116, name: "使用した数ダメージ", cost: 3, desc: "使うたびにダメージを+1", type: "nkai", value: 0, rarity: "uncommon", cat: "atk", isInitial: false },
{ id: 2116, name: "8ダメージ+使用した数ダメージ", cost: 3, desc: "8ダメージ+使うたびにダメージを+1", type: "nkai", value: 8, rarity: "rare", cat: "atk", isInitial: false },


// type: "shieldBash" -> id順
{ id: 1117, name: "8ダメ+7ブロック", cost: 3, desc: "", type: "shieldBash", value: 8, blockValue: 7, rarity: "uncommon", cat: "atk", isInitial: false },
{ id: 2117, name: "12ダメ+12ブロック", cost: 4, desc: "", type: "shieldBash", value: 12, blockValue: 12, rarity: "rare", cat: "atk", isInitial: false },
{ id: 3117, name: "15ダメ+16ブロック", cost: 5, desc: "", type: "shieldBash", value: 15, blockValue: 16, rarity: "legend", cat: "atk", isInitial: false },



//
{ id: 1118, name: "フィールドダメージ", cost: 2, desc: "所持しているフィールド枚数×2ダメージ", type: "fieldAttack", value: 2, rarity: "uncommon", cat: "atk", isInitial: false },
{ id: 2118, name: "フィールドダメージ", cost: 2, desc: "所持しているフィールド枚数×2.5ダメージ", type: "fieldAttack", value: 2.5, rarity: "rare", cat: "atk", isInitial: false },
{ id: 3118, name: "フィールドダメージ", cost: 2, desc: "所持しているフィールド枚数×3ダメージ", type: "fieldAttack", value: 3, rarity: "legend", cat: "atk", isInitial: false },


//
{ id: 1119, name: "連続ダメージ", cost: 2, desc: "20%外れるまで3ダメ", type: "straight", value: 3,p:0.20, rarity: "uncommon", cat: "atk", isInitial: false },
{ id: 2119, name: "連続ダメージ", cost: 2, desc: "15%外れるまで3ダメ", type: "straight", value: 3,p:0.15, rarity: "rare", cat: "atk", isInitial: false },
{ id: 3119, name: "連続ダメージ", cost: 3, desc: "15%外れるまで5ダメ", type: "straight", value: 5,p:0.15, rarity: "legend", cat: "atk", isInitial: false },



// type: "VsBoost" -> id順
{ id: 1120, name: "対boost", cost: 3, desc: "敵がboostなら25ダメージ", type: "VsBoost", value: 25, rarity: "uncommon", cat: "atk", isInitial: false },
{ id: 2120, name: "対boost", cost: 3, desc: "敵がboostなら33ダメージ", type: "VsBoost", value: 33, rarity: "rare", cat: "atk", isInitial: false },
{ id: 3120, name: "対boost", cost: 3, desc: "敵がboostなら40ダメージ", type: "VsBoost", value: 40, rarity: "legend", cat: "atk", isInitial: false },


// type: "VsDragon" -> id順
{ id: 1121, name: "対dragon", cost: 3, desc: "敵がdragonなら25ダメージ", type: "VsDragon", value: 25, rarity: "uncommon", cat: "atk", isInitial: false },
{ id: 2121, name: "対dragon", cost: 3, desc: "敵がdragonなら33ダメージ", type: "VsDragon", value: 33, rarity: "rare", cat: "atk", isInitial: false },
{ id: 3121, name: "対dragon", cost: 3, desc: "敵がdragonなら40ダメージ", type: "VsDragon", value: 40, rarity: "legend", cat: "atk", isInitial: false },

// type: "VsMagica" -> id順
{ id: 1122, name: "対magica", cost: 3, desc: "敵がmagicaなら25ダメージ", type: "VsMagica", value: 25, rarity: "uncommon", cat: "atk", isInitial: false },
{ id: 2122, name: "対magica", cost: 3, desc: "敵がmagicaなら33ダメージ", type: "VsMagica", value: 33, rarity: "rare", cat: "atk", isInitial: false },
{ id: 3122, name: "対magica", cost: 3, desc: "敵がmagicaなら40ダメージ", type: "VsMagica", value: 40, rarity: "legend", cat: "atk", isInitial: false },

// type: "pierceAttack" -> id順
{ id: 1123, name: "貫通", cost: 2, desc: "敵の防御値を無視して6ダメージ", type: "pierceAttack", value: 6, rarity: "uncommon", cat: "atk", isInitial: false },
{ id: 2123, name: "貫通", cost: 2, desc: "敵の防御値を無視して11ダメージ", type: "pierceAttack", value: 11, rarity: "rare", cat: "atk", isInitial: false },
{ id: 3123, name: "貫通", cost: 2, desc: "敵の防御値を無視して16ダメージ", type: "pierceAttack", value: 16, rarity: "legend", cat: "atk", isInitial: false },

// ==========================================
// 🛡️ cat: "blk" (防御系)
// ==========================================
// type: "block" -> id順
{ id: 201, name: "3ブロック", cost: 0, desc: "", type: "block", value: 3, rarity: "common", cat: "blk", isInitial: true },
{ id: 202, name: "7ブロック", cost: 1, desc: "", type: "block", value: 7, rarity: "common", cat: "blk", isInitial: true },
{ id: 203, name: "11ブロック", cost: 2, desc: "", type: "block", value: 11, rarity: "common", cat: "blk", isInitial: true },

{ id: 1201, name: "4ブロック", cost: 0, desc: "", type: "block", value: 4, rarity: "uncommon", cat: "blk", isInitial: false },
{ id: 1202, name: "8ブロック", cost: 1, desc: "", type: "block", value: 8, rarity: "uncommon", cat: "blk", isInitial: false },
{ id: 1203, name: "12ブロック", cost: 2, desc: "", type: "block", value: 12, rarity: "uncommon", cat: "blk", isInitial: false },

{ id: 2201, name: "9ブロック", cost: 1, desc: "", type: "block", value: 9, rarity: "rare", cat: "blk", isInitial: false },
{ id: 2202, name: "13ブロック", cost: 2, desc: "", type: "block", value: 13, rarity: "rare", cat: "blk", isInitial: false },
{ id: 2203, name: "17ブロック", cost: 3, desc: "", type: "block", value: 17, rarity: "rare", cat: "blk", isInitial: false },

{ id: 3201, name: "14ブロック", cost: 2, desc: "", type: "block", value: 14, rarity: "legend", cat: "blk", isInitial: false },
{ id: 3202, name: "18ブロック", cost: 3, desc: "", type: "block", value: 18, rarity: "legend", cat: "blk", isInitial: false },
{ id: 3203, name: "22ブロック", cost: 4, desc: "", type: "block", value: 22, rarity: "legend", cat: "blk", isInitial: false },

{ id: 4201, name: "19ブロック", cost: 3, desc: "", type: "block", value: 19, rarity: "space", cat: "blk", isInitial: false },
{ id: 4202, name: "23ブロック", cost: 4, desc: "", type: "block", value: 23, rarity: "space", cat: "blk", isInitial: false },
{ id: 4203, name: "27ブロック", cost: 5, desc: "", type: "block", value: 27, rarity: "space", cat: "blk", isInitial: false },

// type: "curseWall" -> id順
{ id: 1204, name: "呪いの枚数×8ブロック", cost: 1, desc: "手札にある呪いカードの枚数×8のブロック。", type: "curseWall", value: 8, rarity: "uncommon", cat: "blk", isInitial: false },

// ==========================================
// 💖 cat: "rec" (回復系)
// ==========================================
// type: "heal" -> id順
{ id: 301, name: "3回復", cost: 1, desc: "", type: "heal", value: 3, rarity: "common", cat: "rec", isInitial: true },
{ id: 302, name: "5回復", cost: 2, desc: "", type: "heal", value: 5, rarity: "common", cat: "rec", isInitial: true },
{ id: 303, name: "8回復", cost: 3, desc: "", type: "heal", value: 8, rarity: "common", cat: "rec", isInitial: true },

{ id: 1301, name: "4回復", cost: 1, desc: "", type: "heal", value: 4, rarity: "uncommon", cat: "rec", isInitial: false },
{ id: 1302, name: "6回復", cost: 2, desc: "", type: "heal", value: 6, rarity: "uncommon", cat: "rec", isInitial: false },
{ id: 1303, name: "9回復", cost: 3, desc: "", type: "heal", value: 9, rarity: "uncommon", cat: "rec", isInitial: false },

{ id: 2301, name: "7回復", cost: 2, desc: "", type: "heal", value: 7, rarity: "rare", cat: "rec", isInitial: false },
{ id: 2302, name: "10回復", cost: 3, desc: "", type: "heal", value: 10, rarity: "rare", cat: "rec", isInitial: false },
{ id: 2303, name: "13回復", cost: 4, desc: "", type: "heal", value: 13, rarity: "rare", cat: "rec", isInitial: false },

{ id: 3301, name: "12回復", cost: 3, desc: "", type: "heal", value: 12, rarity: "legend", cat: "rec", isInitial: false },
{ id: 3302, name: "16回復", cost: 4, desc: "", type: "heal", value: 16, rarity: "legend", cat: "rec", isInitial: false },
{ id: 3303, name: "19回復", cost: 5, desc: "", type: "heal", value: 19, rarity: "legend", cat: "rec", isInitial: false },


// type: "healBlock" -> id順
{ id: 304, name: "2回復+4ブロック", cost: 2, desc: "", type: "healBlock", value: 2, valueblock: 4, rarity: "common", cat: "rec", isInitial: true },
{ id: 1304, name: "3回復+5ブロック", cost: 2, desc: "", type: "healBlock", value: 3, valueblock: 5, rarity: "uncommon", cat: "rec", isInitial: false },
{ id: 2304, name: "6回復+10ブロック", cost: 3, desc: "", type: "healBlock", value: 6, valueblock: 10, rarity: "rare", cat: "rec", isInitial: false },
{ id: 3304, name: "7回復+12ブロック", cost: 4, desc: "", type: "healBlock", value: 7, valueblock: 12, rarity: "legend", cat: "rec", isInitial: false },


// type: "hpminheal" -> id順
{ id: 1305, name: "自分のHP25%以下ならHPを10回復する", cost: 2, desc: "", type: "hpminheal", nowhp: 25, value: 10, rarity: "uncommon", cat: "rec", isInitial: false },
{ id: 2305, name: "自分のHP30%以下ならHPを10回復する", cost: 2, desc: "", type: "hpminheal", nowhp: 30, value: 10, rarity: "rare", cat: "rec", isInitial: false },
{ id: 3305, name: "自分のHP35%以下ならHPを10回復する", cost: 2, desc: "", type: "hpminheal", nowhp: 35, value: 10, rarity: "legend", cat: "rec", isInitial: false },

// type: "randomHeal" -> id順
{ id: 1306, name: "確率回復", cost: 3, desc: "1/3で12回復、2/3で6回復", type: "randomHeal", value: 12, value1: 6, rarity: "uncommon", cat: "rec", isInitial: false },
{ id: 2306, name: "確率回復", cost: 3, desc: "1/3で16回復、2/3で6回復", type: "randomHeal", value: 16, value1: 6, rarity: "rare", cat: "rec", isInitial: false },
{ id: 3306, name: "確率回復", cost: 4, desc: "1/3で20回復、2/3で11回復", type: "randomHeal", value: 20, value1: 11, rarity: "legend", cat: "rec", isInitial: false },

// ==========================================
// 🧪 cat: "abn" (状態異常・デバフ系)
// ==========================================

// type: "buffHeal" -> id順
{ id: 401, name: "ヒール3(3T)", cost: 2, desc: "3回復(3ターン)", type: "buffHeal", status: 3, turn: 3, rarity: "common", cat: "abn", isInitial: true },
{ id: 1401, name: "ヒール4(3T)", cost: 2, desc: "4回復(3ターン)", type: "buffHeal", status: 4, turn: 3, rarity: "uncommon", cat: "abn", isInitial: false },
{ id: 2401, name: "ヒール6(3T)", cost: 4, desc: "6回復(3ターン)", type: "buffHeal", status: 6, turn: 3, rarity: "rare", cat: "abn", isInitial: false },
{ id: 3401, name: "ヒール7(3T)", cost: 4, desc: "7回復(3ターン)", type: "buffHeal", status: 7, turn: 3, rarity: "legend", cat: "abn", isInitial: false },

// type: "poisonOnly" -> id順
{ id: 402, name: "毒4", cost: 1, desc: "", type: "poisonOnly", status: 4, rarity: "common", cat: "abn", isInitial: true },
{ id: 1402, name: "毒5", cost: 1, desc: "", type: "poisonOnly", status: 5, rarity: "uncommon", cat: "abn", isInitial: false },
{ id: 2402, name: "毒10", cost: 2, desc: "", type: "poisonOnly", status: 10, rarity: "rare", cat: "abn", isInitial: false },
{ id: 3402, name: "毒13", cost: 3, desc: "", type: "poisonOnly", status: 13, rarity: "legend", cat: "abn", isInitial: false },
{ id: 4402, name: "毒15", cost: 4, desc: "", type: "poisonOnly", status: 15, rarity: "space", cat: "abn", isInitial: false },

// type: "poisonAttack" -> id順
{ id: 403, name: "3ダメ+毒3", cost: 1, desc: "", type: "poisonAttack", value: 3, status: 3, rarity: "common", cat: "abn", isInitial: true },
{ id: 1403, name: "7ダメ+毒3", cost: 1, desc: "", type: "poisonAttack", value: 7, status: 3, rarity: "uncommon", cat: "abn", isInitial: false },
{ id: 2403, name: "15ダメ+毒5", cost: 3, desc: "", type: "poisonAttack", value: 15, status: 5, rarity: "rare", cat: "abn", isInitial: false },
{ id: 3403, name: "15ダメ+毒10", cost: 4, desc: "", type: "poisonAttack", value: 15, status: 10, rarity: "legend", cat: "abn", isInitial: false },

// type: "burnAttack" -> id順
{ id: 404, name: "火傷", cost: 1, desc: "", type: "burnAttack", value: 0, status: 3, rarity: "common", cat: "abn", isInitial: true },
{ id: 1404, name: "3ダメ+火傷", cost: 1, desc: "", type: "burnAttack", value: 3, status: 1, rarity: "uncommon", cat: "abn", isInitial: false },
{ id: 2404, name: "10ダメ+火傷", cost: 3, desc: "", type: "burnAttack", value: 10, status: 1, rarity: "rare", cat: "abn", isInitial: false },
{ id: 3404, name: "15ダメ+火傷", cost: 4, desc: "", type: "burnAttack", value: 15, status: 1, rarity: "legend", cat: "abn", isInitial: false },

// type: "poisonBurn" -> id順
{ id: 1405, name: "毒4+火傷", cost: 1, desc: "", type: "poisonBurn", status: 3, rarity: "uncommon", cat: "abn", isInitial: false },
{ id: 2405, name: "毒6+火傷", cost: 1, desc: "", type: "poisonBurn", status: 5, rarity: "rare", cat: "abn", isInitial: false },

// type: "freezeAttack" -> id順
{ id: 406, name: "凍結1", cost: 2, desc: "敵の攻撃66%にする(1ターン)", type: "freezeAttack",value:0, status: 1, rarity: "common", cat: "abn", isInitial: true },
{ id: 1406, name: "7ダメージ+凍結1", cost: 2, desc: "7ダメージ+敵の攻撃66%にする(1ターン)", type: "freezeAttack", value: 7, status: 1, rarity: "uncommon", cat: "abn", isInitial: false },
{ id: 2406, name: "凍結2", cost: 3, desc: "敵の攻撃66%にする(2ターン)", type: "freezeAttack", value: 0, status: 2, rarity: "rare", cat: "abn", isInitial: false },

// type: "stunAttack" -> id順
{ id: 407, name: "スタン", cost: 4, desc: "1/4で行動不能", type: "stunAttack", value: 0, rarity: "common", cat: "abn", isInitial: true },
{ id: 1407, name: "5ダメージ+スタン", cost: 4, desc: "5ダメージ+1/4で行動不能", type: "stunAttack", value: 5, rarity: "uncommon", cat: "abn", isInitial: false },
{ id: 2407, name: "15ダメージ+スタン", cost: 6, desc: "15ダメージ+1/4で行動不能", type: "stunAttack", value: 15, rarity: "rare", cat: "abn", isInitial: false },
{ id: 3407, name: "20ダメージ+スタン", cost: 7, desc: "20ダメージ+1/4で行動不能", type: "stunAttack", value: 20, rarity: "legend", cat: "abn", isInitial: false },

// type: "adrenaline" -> id順
{ id: 1408, name: "各攻撃+3", cost: 3, desc: "攻撃系の攻撃力が+3される。(1ターン)", type: "adrenaline", value: 3, rarity: "uncommon", cat: "abn", isInitial: false },
{ id: 2408, name: "各攻撃+4", cost: 3, desc: "攻撃系の攻撃力が+4される。(1ターン)", type: "adrenaline", value: 4, rarity: "rare", cat: "abn", isInitial: false },
{ id: 3408, name: "各攻撃+7", cost: 4, desc: "攻撃系の攻撃力が+7される。(1ターン)", type: "adrenaline", value: 7, rarity: "legend", cat: "abn", isInitial: false },

// type: "counterSetup" -> id順
{ id: 1409, name: "カウンター2T", cost: 1, desc: "受けた敵の物理攻撃を1.5倍のダメージを敵に与える(2ターン)", type: "counterSetup", value: 2, rarity: "uncommon", cat: "abn", isInitial: false },
{ id: 2409, name: "カウンター3T", cost: 1, desc: "受けた敵の物理攻撃を1.5倍のダメージを敵に与える(3ターン)", type: "counterSetup", value: 3, rarity: "rare", cat: "abn", isInitial: false },

// type: "leakblk" -> id順
{ id: 1410, name: "耐電1T", cost: 1, desc: "漏電のダメージを半分(1ターン)", type: "leakblk", value: 1, rarity: "uncommon", cat: "abn", isInitial: false },
{ id: 2410, name: "耐電2T", cost: 1, desc: "漏電のダメージを半分(2ターン)", type: "leakblk", value: 2, rarity: "rare", cat: "abn", isInitial: false },

// type: "poisonpoison" -> id順
{ id: 1411, name: "猛毒", cost: 2, desc: "敵の毒の効果を全て1.5倍かつ残り1ターン", type: "poisonpoison", value: 1.5, turn: 1, rarity: "uncommon", cat: "abn", isInitial: false },
{ id: 2411, name: "猛毒", cost: 3, desc: "敵の毒の効果を全て1.5倍かつ残り2ターン", type: "poisonpoison", value: 1.5, turn: 2, rarity: "rare", cat: "abn", isInitial: false },


{ id: 1412, name: "ループ", cost: 3, desc: "ループ状態を付与", type: "timeLoop", rarity: "uncommon", cat: "abn", isInitial: false },
{ id: 2412, name: "ループ", cost: 2, desc: "ループ状態を付与", type: "timeLoop", rarity: "rare", cat: "abn", isInitial: false },

// type: "buffMeditation" -> id順
{ id: 1414, name: "瞑想", cost: 1, desc: "瞑想状態を付与する(2ターン)", type: "buffMeditation", turn: 2, rarity: "uncommon", cat: "abn", isInitial: false },

// type: "grantAbsoluteZero" -> id順
{ id: 1415, name: "絶対零度", cost: 2, desc: "絶対零度状態を付与する(1ターン)", type: "grantAbsoluteZero", turn: 1, rarity: "uncommon", cat: "abn", isInitial: false },
{ id: 2415, name: "絶対零度", cost: 4, desc: "絶対零度状態を付与する(1T,50%の確率で2Tになる)", type: "grantAbsoluteZero", turn: 1, bonusChance: 0.5, bonusTurn: 2, rarity: "rare", cat: "abn", isInitial: false },

// type: "freezeThenAbsoluteZero" -> id順
{ id: 1416, name: "超絶対零度", cost: 5, desc: "敵を凍結状態にして絶対零度状態を付与する(1T)", type: "freezeThenAbsoluteZero", freezeTurn: 1, turn: 1, rarity: "uncommon", cat: "abn", isInitial: false },
{ id: 2416, name: "超絶対零度", cost: 7, desc: "敵を凍結状態にして絶対零度状態を付与する(1T、50%の確率で2Tになる)", type: "freezeThenAbsoluteZero", freezeTurn: 1, turn: 1, bonusChance: 0.5, bonusTurn: 2, rarity: "rare", cat: "abn", isInitial: false },



// ==========================================
// 🃏 cat: "oth" (その他・特殊効果系)
// ==========================================

// type: "resetHand" -> id順
{ id: 501, name: "手札を7枚にする", cost: 4, desc: "手札が7枚になるよう引く", type: "resetHand", value: 7, rarity: "common", cat: "oth", isInitial: true },
{ id: 1501, name: "手札を6枚にする", cost: 3, desc: "手札が6枚になるよう引く", type: "resetHand", value: 6, rarity: "uncommon", cat: "oth", isInitial: false },

// type: "DiscardDraw" -> id順
{ id: 502, name: "1枚捨て、2枚引く", cost: 1, desc: "手札から1枚捨て、2枚引く。", type: "DiscardDraw", value: 1, draw: 2, rarity: "common", cat: "oth", isInitial: true },
{ id: 1502, name: "4枚捨て、6枚引く", cost: 1, desc: "手札から4枚捨て、その後6枚引く。", type: "DiscardDraw", value: 4, draw: 6, rarity: "uncommon", cat: "oth", isInitial: false },
{ id: 2502, name: "2枚捨て、4枚引く", cost: 2, desc: "手札から2枚捨て、その後4枚引く。", type: "DiscardDraw", value: 2, draw: 4, rarity: "rare", cat: "oth", isInitial: false },
{ id: 3502, name: "4枚引く", cost: 3, desc: "", type: "DiscardDraw", value: 0, draw: 4, rarity: "legend", cat: "oth", isInitial: false },

// type: "comboPlus" -> id順
//{ id: 1503, name: "コンボアップ", cost: 2, desc: "2ターンの間、コンボボーナスが4になる", type: "comboPlus", value: 4, turn: 2, rarity: "uncommon", cat: "oth", isInitial: false },

// type: "energy" -> id順
{ id: 1504, name: "エネルギー+1", cost: 0, desc: "", type: "energy", value: 1, rarity: "uncommon", cat: "oth", isInitial: false },

// type: "nextCopy" -> id順
{ id: 1505, name: "コピー", cost: 1, desc: "この直後に使用するカードを1枚コピー", type: "nextCopy", rarity: "uncommon", cat: "oth", isInitial: false },

// type: "redrawAll" -> id順
{ id: 1506, name: "引き直し", cost: 2, desc: "手札をすべて捨て、捨てた枚数カードを引く", type: "redrawAll", value: 0, rarity: "uncommon", cat: "oth", isInitial: false },

// type: "camouflage" -> id順
{ id: 1508, name: "超攻撃型をバランス型", cost: 4, desc: "敵の「超攻撃型」を「バランス型」にする(2T)", type: "camouflage", duration: 2, rarity: "uncommon", cat: "oth", isInitial: false },
{ id: 2508, name: "超攻撃型をバランス型", cost: 4, desc: "敵の「超攻撃型」を「バランス型」にする(3T)", type: "camouflage", duration: 3, rarity: "uncommon", cat: "oth", isInitial: false },

{ id: 1509, name: "攻撃型をバランス型", cost: 4, desc: "敵の「攻撃型」を「バランス型」にする(2T)", type: "camouflage", target: "attack", duration: 2, rarity: "uncommon", cat: "oth", isInitial: false },
{ id: 2509, name: "攻撃型をバランス型", cost: 4, desc: "敵の「攻撃型」を「バランス型」にする(3T)", type: "camouflage", target: "attack", duration: 3, rarity: "uncommon", cat: "oth", isInitial: false },

{ id: 1510, name: "防御型をバランス型", cost: 4, desc: "敵の「防御型」を「バランス型」にする(2T)", type: "camouflage", target: "defense", duration: 2, rarity: "uncommon", cat: "oth", isInitial: false },
{ id: 2510, name: "防御型をバランス型", cost: 4, desc: "敵の「防御型」を「バランス型」にする(3T)", type: "camouflage", target: "defense", duration: 3, rarity: "uncommon", cat: "oth", isInitial: false },

{ id: 1511, name: "超防御型をバランス型", cost: 4, desc: "敵の「超防御型」を「バランス型」にする(2T)", type: "camouflage", target: "super_defense", duration: 2, rarity: "uncommon", cat: "oth", isInitial: false },
{ id: 2511, name: "超防御型をバランス型", cost: 4, desc: "敵の「超防御型」を「バランス型」にする(3T)", type: "camouflage", target: "super_defense", duration: 3, rarity: "uncommon", cat: "oth", isInitial: false },


// type: "predictEnemy" -> id順
{ id: 1512, name: "攻撃予知", cost: 2, desc: "敵の型がわかる(1T)", type: "predictEnemy", turn: 1, rarity: "uncommon", cat: "oth", isInitial: false },
{ id: 2512, name: "攻撃予知", cost: 3, desc: "敵の型がわかる(2T)", type: "predictEnemy", turn: 2, rarity: "rare", cat: "oth", isInitial: false },

// type: "purifyCurse" -> id順
{ id: 1513, name: "呪い削除", cost: 1, desc: "デッキの呪いをすべて除去、その後このカードも除去する", type: "purifyCurse", rarity: "uncommon", cat: "oth", isInitial: false },

// type: "nextTurnEnergy" -> id順
{ id: 1514, name: "エネルギー予約", cost: 2, desc: "次ターンにエネルギーを+2する", type: "nextTurnEnergy", value: 2,plusValue:0, rarity: "uncommon", cat: "oth", isInitial: false },
{ id: 2514, name: "エネルギー予約", cost: 2, desc: "次ターンにエネルギーを+2する。さらに33%で+1", type: "nextTurnEnergy", value: 2,plusValue:1,plusP:0.33, rarity: "rare", cat: "oth", isInitial: false },

// type: "firstCardDraw" -> id順
{ id: 1515, name: "幸先の一手", cost: 1, desc: "1ターン目かつ最初に使用すればカードを3枚引く", type: "firstCardDraw", value: 3, rarity: "uncommon", cat: "oth", isInitial: false },
{ id: 2515, name: "幸先の一手", cost: 0, desc: "1ターン目かつ最初に使用すればカードを3枚引く", type: "firstCardDraw", value: 3, rarity: "rare", cat: "oth", isInitial: false },


// ==========================================
// 👻 cat: "none" (呪いなど)
// ==========================================
// type: "curse" -> id順
{ id: 0, name: "呪い", cost: 1, desc: "自分に10ダメージ", type: "curse", value: 10, rarity: "none", cat: "none", isInitial: false }

];




let deck = [];
let hand = [];
let discardPile = [];

function copyCard(card) {
    return JSON.parse(JSON.stringify(card));
}

function randomCard() {
    // -----------------------------
    // レアリティ・タイプ抽選 (合計100%)
    // uncommon : 45% (0.00 〜 0.44)
    // rare     : 70% (0.45 〜 0.69)
    // legend   : 15% (0.70 〜 0.84)
    // space    :  5% (0.85 〜 0.89)
    // field    :  5% (0.90 〜 0.94)
    // potion   :  5% (0.95 〜 0.99)
    // -----------------------------

const roll = Math.random();
let rarity = "uncommon";

if (roll < 0.45) {
    rarity = "uncommon";
} else if (roll < 0.70) {
    rarity = "rare";
} else if (roll < 0.85) {
    rarity = "legend";
} else if (roll < 0.90) {
    rarity = "space";
} else if (roll < 0.95) {
    rarity = "field";
} else {
    rarity = "potion";
}


let pool = allCardsMaster.filter(c => {

    if (c.isInitial) return false;
    if (c.rarity === "common") return false;
    if (c.rarity === "none") return false;

    if (c.rarity !== rarity) return false;

    // フィールドカードの重複判定
    if (rarity === "field") {

        // atk_up, def_up は重複可なので何もしない
        if (c.id !== "atk_up" && c.id !== "def_up") {

            if ((player.fields?.[c.id] || 0) >= 1) {
                return false;
            }
        }
    }

    return true;
});

    // 💡 万が一、抽選したレアリティのプールが空だった場合は、安全のために 'uncommon' のプールを再取得する
    if (pool.length === 0 && rarity !== "uncommon") {
        pool = allCardsMaster.filter(c =>
            !c.isInitial &&
            c.rarity === "uncommon"
        );
    }

    // それでも空なら null を返す（安全対策）
    if (pool.length === 0) return null;
    const selected = pool[Math.floor(Math.random() * pool.length)];

    if (typeof copyCard === 'function') {
        return copyCard(selected);
    }
    return { ...selected };
}

function initBattleDeck() {
    deck = [];
    hand = [];
    discardPile = [];
    
    const currentDeck = savedDecks[currentSlot] || {};
    let temp = [];
    
    for (let id in currentDeck) {
        const count = currentDeck[id];
        const master = allCardsMaster.find(c => c.id == id);
        if (master) {
            for (let i = 0; i < count; i++) {
                temp.push(copyCard(master));
            }
        }
    }
    
    for (let i = temp.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [temp[i], temp[j]] = [temp[j], temp[i]];
    }
    deck = temp;
}


function drawOneCard() {
    if (deck.length === 0) {
        // 💡 【仕様通り】捨て札はクリア（空に）する
        discardPile = [];

        // 💡 マップのマスターデータ(savedDecks)からベースとなる全カードを一度生成する
        const currentDeck = savedDecks[currentSlot] || {};
        let allPool = [];
        
        for (let id in currentDeck) {
            const count = currentDeck[id];
            const master = allCardsMaster.find(c => c.id == id);
            if (master) {
                for (let i = 0; i < count; i++) {
                    allPool.push(copyCard(master)); // コピーをプールに投入
                }
            }
        }

        // ✨【追加ロジック】全カードプールから、現在「手札(hand)」にあるカードを枚数分だけ差し引く
        // 手札にあるカードのIDをカウントする
        let handCounts = {};
        hand.forEach(c => {
            if (c && c.id !== undefined) {
                handCounts[c.id] = (handCounts[c.id] || 0) + 1;
            }
        });

        // プールから手札の分を除外して、新しい山札の候補(temp)を作る
        let temp = [];
        allPool.forEach(card => {
            if (handCounts[card.id] && handCounts[card.id] > 0) {
                // 手札に存在するカードなので山札には戻さず、カウントを1減らす
                handCounts[card.id]--;
            } else {
                // 手札にない（または avian 既に手札分の除外が終わった）カードは山札に戻す
                temp.push(card);
            }
        });

        // 万が一、手札が30枚以上あるなどして引けるカードが残っていない場合の安全対策
        if (temp.length === 0) {
            return; 
        }
        
        // 🎲 フィッシャー・イェーツのシャッフルアルゴリズムで確実にシャッフル
        for (let i = temp.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [temp[i], temp[j]] = [temp[j], temp[i]];
        }
        
        // 新しい山札としてセット
        deck = temp;
    }
    
    // 山札の先頭から手札に加える
    const card = deck.pop();
    if (card) {
        hand.push(card);
    }
}



function drawHand() {
    hand = [];
    let drawCount = 5;
    if (player.fields.draw_up && Math.random() < (2 / 3)) drawCount = 6;
    for (let i = 0; i < drawCount; i++) { drawOneCard(); }
    renderHand();
    if (typeof updateUI === 'function') updateUI();
}


function renderHand() {
    const handDiv = document.getElementById("hand");
    if (!handDiv) return;

    handDiv.innerHTML = "";
    const total = hand.length;

    hand.forEach((card, index) => {
        // 1. 忘却デバフ（amnesia）が1以上かチェック
        const isAmnesia = (window.player && window.player.status && window.player.status.amnesia > 0);

        // 2. 本来表示するべき説明文（desc）のベースを決定する
        let targetDesc = card.desc;

        if (card.type === "nkai" && !isAmnesia) {
            const currentCount = (window.player && window.player.status && player.status.nkaiCount) || 0;
            const baseValue = card.value || 0;
            targetDesc = `現在: ${baseValue + currentCount +1}ダメージ`;
        }

        // 3. 忘却中なら「？」、正常なら決定した名前・説明文をセットする
        const displayName = isAmnesia ? "？？？" : card.name;
        const displayDesc = isAmnesia ? "？？？" : targetDesc; // ここを targetDesc に変更


        const div = document.createElement("div");
        const costClass = `cost-${card.cost}`;
        div.className = `card ${card.rarity} cat-${card.cat} ${costClass}`;

        // 画面には displayDesc を表示
        div.innerHTML = `<h3>${displayName}</h3><p>Cost:${card.cost}</p><p>${displayDesc}</p>`;

        let spacing = 125;
        if (total > 6) {
            spacing = Math.max(50, 800 / total);
        }

        const center = (total - 1) / 2;
        const offset = (index - center) * spacing;
        const rotation = (index - center) * (total > 8 ? 4 : 6);
        const yOffset = Math.abs(index - center) * (total > 8 ? 3 : 5);

        div.style.left = `calc(50% + ${offset}px - 60px)`;
        div.style.setProperty("--card-rotate", `${rotation}deg`);
        div.style.setProperty("--card-y", `${yOffset}px`);

        div.style.zIndex = index + 10;

        div.onclick = () => {
            try {
                if (typeof playCard === 'function') playCard(index);
            } catch (e) {
                console.error("カード使用エラー:", e);
            }
        };
        handDiv.appendChild(div);
    });
}



// =========================================================================
// 📊 ビルダー画面（初期デッキ構築・制限チェック用）の処理
// =========================================================================

// ───【追加・変更箇所 ①】ページを更新(F5)してもローカルストレージから初期データを復元する ───
function initBuilder() {
    // state.js でロードされたスロット番号をそのまま引き継ぐ
    changeSlot(window.currentSlot); 
}

// 引数に「, forceClear = false」を追加します
function changeSlot(slotIndex, forceClear = false) {
    currentSlot = slotIndex;
    
    // ───【追加・変更箇所 ②】選択したスロット番号をブラウザに保存 ───
    localStorage.setItem("mini_spire_current_slot", slotIndex);
    
    for (let i = 0; i < 3; i++) {
        const btn = document.getElementById(`slotBtn${i}`);
        if (btn) {
            if (i === slotIndex) btn.classList.add("active");
            else btn.classList.remove("active");
        }
    }

    // もしデータそのものが存在しなければ空のオブジェクトを作る
    if (!savedDecks[slotIndex]) {
        savedDecks[slotIndex] = {};
    }

    // ───【修正箇所】もし「forceClear」が true の場合は、初期簡易デッキの自動セットをスキップする ───
    if (Object.keys(savedDecks[slotIndex]).length === 0 && !forceClear) {
        // 通常の切り替え時に空だった場合のみ、今まで通りデフォルト初期デッキがセットされます
        savedDecks[slotIndex] = {
            101: 2, // 3ダメージ    × 2枚
            102: 3, // 6ダメージ    × 3枚
            103: 3, // 9ダメージ    × 3枚

            201: 4, // 3ブロック    × 4枚
            202: 5, // 7ブロック    × 5枚
            203: 1, // 11ブロック   × 1枚

            301: 1, // 3回復        × 1枚
            302: 1, // 5回復        × 1枚

            401: 1, // ヒール3(3T)  × 1枚
            402: 2, // 毒5          × 2枚
            403: 2, // 3ダメ+毒3    × 2枚
            404: 1, // 3ダメ+火傷   × 1枚
            405: 2, // 毒3+火傷     × 2枚
            406: 1, // 凍結2        × 1枚

            502: 1, // 1枚捨て2引く × 1枚
        };
        // デフォルトセットを適用した時もストレージに保存する
        localStorage.setItem("mini_spire_saved_decks", JSON.stringify(window.savedDecks));
    }
    
    // 画面（入力欄やカードリスト）を再描画する関数
    renderBuilder();
}

function renderBuilder() {
    const container = document.getElementById("builderLeft");
    if (!container) return;
    container.innerHTML = "";


const currentDeck = (window.savedDecks && window.savedDecks[currentSlot]) || {};
    const initialMasterCards = allCardsMaster.filter(c => c.isInitial);

    // カテゴリごとに並べる
    builderCategories.forEach(cat => {
        const catCards = initialMasterCards.filter(c => c.cat === cat.key);
        if (catCards.length === 0) return;


        const catDiv = document.createElement("div");
        catDiv.className = "category-title";
        catDiv.style.fontWeight = "bold";
        catDiv.style.marginTop = "20px";
        catDiv.style.marginBottom = "10px";
        catDiv.style.color = "#00adb5";
        catDiv.innerText = `${cat.name}`;
        container.appendChild(catDiv);

        // カテゴリ内のカードを1枚ずつループしてHTML要素を生成
        catCards.forEach(card => {
            const count = currentDeck[card.id] || 0;
            const div = document.createElement("div");
            
            // style.cssの「.card」やカテゴリごとの色（cat-atkなど）が適用されるクラスを付与
            const costClass = card.cost >= 3 ? "cost-3" : `cost-${card.cost}`;
            div.className = `card ${card.rarity} cat-${card.cat} ${costClass}`;
            div.style.display = "inline-block";
            div.style.margin = "10px";
            div.style.verticalAlign = "top";
            div.style.position = "relative";

            let noticeText = "";

            
            // カードの見た目と、枚数調整用の「-」「+」ボタンをカード内部に配置
            div.innerHTML = `
                <p style="font-size:15px; min-height:20px;">${card.name}</p>
                <p style="font-size:13px; min-height:20px;">Cost: ${card.cost}</p>
                <p style="font-size:12px; min-height:20px;">${card.desc}${noticeText}</p>
                <div class="builder-item-ctrl" style="margin-top:5px; display:flex; justify-content:center; align-items:center; gap:10px;">
                    <button onclick="adjustBuilderCard(${card.id}, -1)" style="padding:2px 8px; cursor:pointer;">-</button>
                    <span class="count" style="font-weight:bold; color:gold; font-size:16px; min-width:20px; text-align:center;">${count}</span>
                    <button onclick="adjustBuilderCard(${card.id}, 1)" style="padding:2px 8px; cursor:pointer;">+</button>
                </div>
            `;
            container.appendChild(div);
        });
    });

    // 最後に制限チェックを実行して画面の「開始ボタン」の状態を更新
    if (typeof checkValidation === 'function') {
        checkValidation();
    }
}

function adjustBuilderCard(cardId, amount) {
    const currentDeck = savedDecks[currentSlot];
    const currentCount = currentDeck[cardId] || 0;
    const nextCount = currentCount + amount;

    if (nextCount < 0) return;

    if (amount > 0) {
        let total = 0;
        for (let id in currentDeck) { total += currentDeck[id]; }
    }

    if (nextCount === 0) {
        delete currentDeck[cardId];
    } else {
        currentDeck[cardId] = nextCount;
    }

    //枚数が変わるたびに最新の全スロットデータをブラウザに自動保存 ───
    localStorage.setItem("mini_spire_saved_decks", JSON.stringify(window.savedDecks));

    renderBuilder();
}


function checkValidation() {
    const currentDeck = savedDecks[currentSlot] || {};
    let totalCards = 0;
    let specialCardCount = 0; // id: 501 と 1501 の合計カウント用
    let errors = [];

    // デッキ内のカードをループ処理
    for (let id in currentDeck) {
        const count = currentDeck[id];
        totalCards += count;
    }

    // 表示用HTMLの作成
    let statusHtml = `<div><strong>現在の合計枚数: ${totalCards} / 30 枚</strong></div><br>`;


    if (specialCardCount > 1) {
        errors.push(`・「エネルギー+1」はデッキに合計1枚までしか入れられません。`);
    }

    // 2. 【合計枚数チェック】30枚ちょうどか
    if (totalCards !== 30) {
        errors.push(`・初期山札は必ずちょうど【30枚】にしてください。（現在: ${totalCards}枚）`);
    }

    const statusDiv = document.getElementById("validationStatus");
    const startBtn = document.getElementById("startGameBtn") || document.getElementById("realStartBtn");

    // エラーがある場合の処理（ボタンを無効化）
    if (errors.length > 0) {
        statusHtml += `<span style="color:#ff4a4a; font-weight:bold;">⚠️ 構築エラー:<br>${errors.join("<br>")}</span>`;
        if (statusDiv) statusDiv.innerHTML = statusHtml;
        if (startBtn) {
            startBtn.disabled = true;
            startBtn.style.background = "#555";
            startBtn.style.cursor = "not-allowed";
        }
    // 全ての条件をクリアした場合（ボタンを有効化）
    } else {
        statusHtml += `<span style="color:#4caf50; font-weight:bold;">✅ 条件クリア！ゲームを開始できます。</span>`;
        if (statusDiv) statusDiv.innerHTML = statusHtml;
        if (startBtn) {
            startBtn.disabled = false;
            startBtn.style.background = "#4caf50";
            startBtn.style.cursor = "pointer";
        }
    }
}
function pressStartGame() {
    player.darkMarketCount = 0;
    const startScreen = document.getElementById("startScreen");
    if (startScreen) startScreen.style.display = "none";
    if (typeof restartGame === 'function') restartGame();
    

//15階、30階のボスを選択
    determineBossesForRun();
}


function checkDeckOverflowAndManage() {
    const skipBtn = document.getElementById("rewardScreen")?.querySelector("button[onclick*='skip']");
    if(skipBtn) skipBtn.style.display = "block";
    
    const rewardScreen = document.getElementById("rewardScreen");
    if (rewardScreen) rewardScreen.style.display = "none";
    
 
   if(typeof openMap === 'function') openMap();
}

// ★ マップ画面からデッキ一覧を表示・確認するためのカスタム関数
function showMapDeckManager() {
    const rewardScreen = document.getElementById("rewardScreen");
    const rewardTitle = document.getElementById("rewardTitle");
    const rewardArea = document.getElementById("rewardCards");
    
    if(!rewardScreen || !rewardArea) return;

    // マップ画面を一時的に非表示にする
    const mapScreen = document.getElementById("mapScreen");
    if (mapScreen) {
        mapScreen.style.display = "none"; 
    }
    // 安全対策としてデッキ確認画面の重ね順を最高値にする
    rewardScreen.style.zIndex = "10005"; 

    // 現在のセーブスロットからデッキを取得
    const currentDeck = savedDecks[currentSlot];
    
    // 現在の総デッキ枚数を計算
    let totalCards = 0;
    for (let id in currentDeck) {
        totalCards += currentDeck[id];
    }

    if (rewardTitle) {
        rewardTitle.innerHTML = `📜 現在のデッキ（合計: ${totalCards}枚）`;
    }

    rewardArea.innerHTML = "";

    // 常に「マップに戻る」ボタンを表示する
    const skipBtn = rewardScreen.querySelector("button[onclick*='skip']");
    if(skipBtn) {
        skipBtn.style.display = "block";
        
        // 💡 削除モード中なら「完了ボタン」に見た目と文字を変える
        if (window.isRestRoomDeletionMode) {
            skipBtn.innerText = "カード削除を完了してマップに戻る";
            skipBtn.style.background = "#4caf50"; // 緑色などにして目立たせる
            skipBtn.style.color = "white";
        } else {
            skipBtn.innerText = "戻る";
            skipBtn.style.background = ""; 
            skipBtn.style.color = "";
        }

        skipBtn.onclick = function() {
            // 💡 削除モードを終了してマップへ帰還する処理
            if (window.isRestRoomDeletionMode) {
                window.isRestRoomDeletionMode = false;
                customAlert("カード削除処理を終了しました。マップに戻ります。");
                
                rewardScreen.style.display = "none";
                rewardScreen.style.zIndex = ""; 

                // 休憩所処理を完全に終了させてマップへ戻す
                if (typeof finishRestRoom === "function") {
                    finishRestRoom(); 
                } else if (typeof openMap === "function") {
                    openMap();
                }
            } else {
                // 通常時の「戻る」処理
                rewardScreen.style.display = "none";
                rewardScreen.style.zIndex = ""; 
                if(typeof openMap === 'function') openMap();
            }
        };
    }

    
    // 1. 各条件の並び順（インデックス）を定義
    const catPriority = {
        atk: 0,
        blk: 1,
        rec: 2,
        abn: 3,
        oth: 4
    };

    const rarityPriority = {
        common: 0,
        uncommon: 1,
        rare: 2,
        legend: 3,
        space: 4
    };

    // 2. 現在のデッキに入っている有効なカードのマスターデータを配列に集める
    let deckCardsList = [];
    for (let id in currentDeck) {
        if (currentDeck[id] <= 0) continue;
        const master = allCardsMaster.find(c => c.id == id);
        if (master) {
            deckCardsList.push(master);
        }
    }

    // 3. 指定された優先順位でソートを実行
    deckCardsList.sort((a, b) => {
        // ① カテゴリ
        const aCat = catPriority[a.cat] ?? 999;
        const bCat = catPriority[b.cat] ?? 999;

        if (aCat !== bCat) {
            return aCat - bCat;
        }

        // ② ID下2桁
        const aId = Number(a.id) % 100;
        const bId = Number(b.id) % 100;

        if (aId !== bId) {
            return aId - bId;
        }

        // ③ レアリティ
        const aRare = rarityPriority[a.rarity] ?? 999;
        const bRare = rarityPriority[b.rarity] ?? 999;

        return aRare - bRare;
    });

    // ソート済みの配列を元に画面に一覧表示
    if (deckCardsList.length > 0) {
        deckCardsList.forEach(master => {
            const id = master.id;
            const div = document.createElement("div");
            div.className = `card rewardCard ${master.rarity} cat-${master.cat}`;

            const displayCost = (master.cost !== undefined && master.cost !== null) ? master.cost : "-";
            
            div.innerHTML = `
                <h3>${master.name}</h3>
                <p>コスト: ${displayCost}</p>
                <p>所持数: ${currentDeck[id]}枚</p>
                <p>${master.desc}</p>
            `;
            
            div.onclick = function() {
                // 💡 休憩所のカード削除モード時の割り込みロジック（複数枚対応）
                if (window.isRestRoomDeletionMode) {
                    const currentCardId = id; // id は master.id
                    const currentSlot = window.currentSlot || 0;
                    const currentDeck = savedDecks[currentSlot];

                    // 1. まず25ゴールド持っているかチェック
                    if ((player.gold || 0) < 25) {
                        customAlert("ゴールドが足りないため、これ以上カードを削除できません！");
                        return;
                    }

                    // ★★★【追加】削除する前に現在の合計枚数をリアルタイムに再計算★★★
                    let checkTotal = 0;
                    for (let dId in currentDeck) {
                        checkTotal += currentDeck[dId];
                    }

                    // デッキ枚数が20枚以下なら削除を絶対に拒否する
                    if (checkTotal <= 20) {
                        customAlert(`これ以上カードを削除できません！デッキの最低枚数は20枚です。\n(現在: ${checkTotal}枚)`);
                        return;
                    }

                    if (currentDeck && currentDeck[currentCardId] && currentDeck[currentCardId] > 0) {
                        // 2. デッキから実際に1枚減らす
                        currentDeck[currentCardId]--;
                        
                        // 3. 削除枚数分（1枚あたり25ゴールド）を消費
                        player.gold = Math.max(0, player.gold - 25);
                        
                        customAlert(`「${master.name}」を1枚削除しました。`);
                        
                        // 4. ストレージへ即時保存
                        localStorage.setItem("mini_spire_saved_decks", JSON.stringify(window.savedDecks));

                        // 5. 画面を閉じずに、表示されている枚数やタイトルをリアルタイムで更新する
                        let afterTotal = 0;
                        for (let dId in currentDeck) { afterTotal += currentDeck[dId]; }
                        if (rewardTitle) {
                            rewardTitle.innerHTML = `📜 現在のデッキ（合計: ${afterTotal}枚）<br><span style="color:#ffae42; font-size:14px; font-weight:bold;">【削除モード中】カードを選ぶと25Gで削除できます（所持: ${player.gold}G）</span>`;
                        }

                        // 所持数が0枚になったらカード要素を非表示、まだあるなら枚数表示を更新
                        if (currentDeck[currentCardId] <= 0) {
                            div.style.display = "none";
                        } else {
                            const countText = div.querySelector("p:nth-of-type(2)");
                            if (countText) countText.innerText = `所持数: ${currentDeck[currentCardId]}枚`;
                        }

                        // 画面上のヘッダー金利表示などのUIを更新する関数があれば呼ぶ
                        if (typeof updateUI === "function") updateUI();
                        return; 
                    } else {
                        customAlert("エラー: 選択されたカードがデッキにありません。");
                        return;
                    }
                }

                // 通常時のクリック処理（詳細表示など）
                customAlert(`「${master.name}」は現在デッキに ${currentDeck[id]} 枚編成されています。`);
            };

            rewardArea.appendChild(div);
        });
    } else {
        rewardArea.innerHTML = "<p style='text-align:center; width:100%; color:#aaa;'>デッキにカードがありません。</p>";
    }

    // 画面をモーダルとして表示
    rewardScreen.style.display = "flex";
}



// 難易度を切り替える関数
function selectDifficulty(diff) {
    window.difficulty = diff;
    
    // 💡 難易度設定を自動保存
    localStorage.setItem("mini_spire_difficulty", diff);

    const diffs = ["easy", "normal", "hard", "lunatic"];
    
    diffs.forEach(d => {
        const btn = document.getElementById(`diffBtn_${d}`);
        if (btn) {
            if (d === diff) {
                btn.style.background = "#00adb5";
                btn.style.borderColor = "#00adb5";
                btn.style.fontWeight = "bold";
            } else {
                btn.style.background = "#333";
                btn.style.borderColor = "#555";
                btn.style.fontWeight = "normal";
            }
        }
    });
}


// 現在のデッキスロットを完全に空（0枚）にする関数
function clearCurrentDeckSlot() {
    const slot = window.currentSlot || 0;
    
    if (confirm(`スロット ${slot + 1} のデッキをすべて削除して空にしてもよろしいですか？`)) {
        // 現在のスロットを完全に空にする
        window.savedDecks[slot] = {};
        
        // ローカルストレージに空の状態を保存
        localStorage.setItem("mini_spire_saved_decks", JSON.stringify(window.savedDecks));
        
        // 第2引数に true を渡して、初期カードの自動補充をブロックしながら再描画
        changeSlot(slot, true);
        
        customAlert(`スロット ${slot + 1} を完全に空（0枚）にしました。`);
    }
}