// =========================================================================
// 🔢 HP計算用ヘルパー：四捨五入・切り上げではなく、常に小数第一位で「切り捨て」る
// 例: 10.45 → 10.4 / 10.49 → 10.4
// （浮動小数点の誤差対策として、ごく小さいイプシロンを足してから切り捨てる）
// =========================================================================
function truncateToOneDecimal(value) {
    return Math.floor((value + 1e-9) * 10) / 10;
}

// =========================================================================
// 👹 敵データ定義
// =========================================================================
const enemyTypes = {

//通常敵
    goblin:   { name:"Goblin",    icon:"👺", hpRate:1.00, atkRate:1.00, blockRate:1.00, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 125 },
    knight:   { name:"Knight",    icon:"🛡️", hpRate:0.60, atkRate:1.25, blockRate:0.50, immuneNormal:false, immuneStatus:true , statusDouble:false, rewardGold: 175 },
    slime:    { name:"Slime",     icon:"🟢", hpRate:1.00, atkRate:1.00, blockRate:0.00, immuneNormal:true , immuneStatus:false, statusDouble:true , rewardGold: 150 },
    fenrir:   { name:"Fenrir",    icon:"🐺", hpRate:0.75, atkRate:0.80, blockRate:1.00, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 200 },
    zombie:   { name:"Zombie",    icon:"🧟", hpRate:0.75, atkRate:1.00, blockRate:0.75, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 175 },
    golem:    { name:"Golem",     icon:"🗿", hpRate:0.75, atkRate:0.90, blockRate:1.00, immuneNormal:false, immuneStatus:false, statusDouble:false, neverPoison:true, rewardGold: 225 },
    spirit:   { name:"Spirit",    icon:"👻", hpRate:0.60, atkRate:1.00, blockRate:0.75, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 225 },
    thief:    { name:"Thief",     icon:"🏴‍☠️", hpRate:0.75, atkRate:1.00, blockRate:1.00, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 125 },
    clown:    { name:"Clown",     icon:"🤡", hpRate:1.25, atkRate:0.00, blockRate:0.00, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 175 },
    phoenix:  { name:"Phoenix",   icon:"🐦‍🔥", hpRate:1.25, atkRate:1.00, blockRate:1.00, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 225 },
    beast:    { name:"Beast",     icon:"🦁", hpRate:1.50, atkRate:0.90, blockRate:1.50, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 150 },
    bull:     { name:"Bull",      icon:"🐂", hpRate:1.25, atkRate:0.75, blockRate:1.00, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 150 },
    shadow:   { name:"Shadow",    icon:"👥", hpRate:1.00, atkRate:1.00, blockRate:1.25, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 150 },
    robot:    { name:"Robot",     icon:"🤖", hpRate:1.00, atkRate:1.00, blockRate:1.25, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 150 },
    witch:    { name:"Witch",     icon:"🧙‍♂️", hpRate:1.25, atkRate:0.75, blockRate:1.00, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 175 },
    reaper:   { name:"Reaper",    icon:"🩻", hpRate:0.75, atkRate:1.25, blockRate:0.75, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 200 },
    ork:      { name:"Ork",       icon:"🐗", hpRate:0.80, atkRate:0.65, blockRate:0.80, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 225 },
    bee:      { name:"Bee",       icon:"🐝", hpRate:0.50, atkRate:1.25, blockRate:0.25, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 175 },
    undoll:   { name:"Undoll",    icon:"🪆", hpRate:0.80, atkRate:0.75, blockRate:0.50, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 175 },
    assassin: { name:"Assassin",  icon:"🥷", hpRate:0.75, atkRate:1.85, blockRate:0.75, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 175 },
    greedy:   { name:"Greedy",    icon:"🦹", hpRate:0.75, atkRate:1.00, blockRate:0.75, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 175 },
    trait:    { name:"Trait",     icon:"👽", hpRate:0.80, atkRate:0.80, blockRate:1.00, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 200 },
    bastion:  { name:"Bastion",   icon:"💠", hpRate:0.85, atkRate:0.85, blockRate:1.75, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 175 },
    gunner:   { name:"Gunner",    icon:"🔫", hpRate:0.90, atkRate:0.90, blockRate:0.90, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 175 },
    bat:     { name:"Bat",        icon:"🦇", hpRate:0.95, atkRate:0.85, blockRate:0.85, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 200 },
    sight:    { name:"Sight",     icon:"👁️‍🗨️", hpRate:0.75, atkRate:0.60, blockRate:1.00, immuneNormal:false, immuneStatus:false, statusDouble:false, neverFreeze:true, physicalResist:0.5, rewardGold: 200 },
    luna:     { name:"Luna",      icon:"🌕", hpRate:1.00, atkRate:0.75, blockRate:0.50, immuneNormal:false, immuneStatus:false, statusDouble:false, neverFreeze:true, physicalResist:0.5, neverStun:true, rewardGold: 200 },
    tempest:  { name:"Tempest",   icon:"🌪️", hpRate:0.85, atkRate:0.90, blockRate:0.75, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 175 },
    puppeteer:{ name:"Puppeteer", icon:"🎭", hpRate:1.00, atkRate:0.90, blockRate:0.75, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 175 },
    salamander:{ name:"Salamander",icon:"🦎",hpRate:1.00, atkRate:0.90, blockRate:0.50, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 150 },


//ボス
    dragon: { name:"Dragon",  icon:"🐉", hpRate:2.00, atkRate:1.25, blockRate:1.50, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 600 },
    magica: { name:"Magica",  icon:"🔮", hpRate:1.50, atkRate:0.85, blockRate:1.00, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 600 },
    boost:  { name:"Boost",   icon:"🪓", hpRate:1.00, atkRate:1.65, blockRate:0.75, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 600 },

};

// =========================================================================
// 📖 敵の説明データ（ゲーム説明書「敵について」と戦闘中の敵説明欄の、唯一の情報源）
// ここを編集すれば、説明書と戦闘中の表示の両方に自動的に反映される。
// key: enemy.data.name と一致させる（バトル中の説明表示の参照キー）
// displayName: 説明書に表示する名前（見出し）
// =========================================================================
const ENEMY_MANUAL_DATA = [
    { key: "Goblin",   displayName: "Goblin",   icon: "👺",       tag: "",                                             gold: "125G",
      desc: "特徴なし。" },
    { key: "Knight",   displayName: "Knight",   icon: "🛡️",       tag: "【状態異常無効】",                              gold: "175G",
      desc: "毒、火傷、凍結、スタンなどの状態異常を一切受け付けない。" },
    { key: "Slime",    displayName: "Slime",    icon: "🟢",       tag: "【物理攻撃無効 / 状態異常ダメージ2倍】",         gold: "150G",
      desc: "攻撃系のカードが効かない。毒や火傷を付与すると2倍のダメージを与える。" },
    { key: "Fenrir",   displayName: "Fenrir",   icon: "🐺",       tag: "【コスト偶数カード使用不可】",                   gold: "200G",
      desc: "コストが0,2,4...といったコストが偶数のカードは使うことが出来ない。コストが奇数の1,3,5...といったカードを使おう。" },
    { key: "Zombie",   displayName: "Zombie",   icon: "🧟",       tag: "【自己再生】",                                   gold: "175G",
      desc: "前のターンにプレイヤーが与えたダメージの33.3%を吸収し、自身の最大HPの5%を毎ターン回復する。" },
    { key: "Golem",    displayName: "Golem",    icon: "🗿",       tag: "【反射ダメージ / 毒無効】",                      gold: "225G",
      desc: "物理攻撃を加えるたび、プレイヤーが毎回「3」の固定反射ダメージを受ける。また、毒は完全に効かない。" },
    { key: "Spirit",   displayName: "Spirit",   icon: "👻",       tag: "【奇数物理無効 / 偶数状態異常無効】",            gold: "225G",
      desc: "・<strong>奇数ターン（1, 3, 5...）</strong>: 物理攻撃が完全に無効。状態異常が効く。<br>・<strong>偶数ターン（2, 4, 6...）</strong>: 物理攻撃が通るが、すべての状態異常が無効。<br>" },
    { key: "Thief",    displayName: "Thief",    icon: "🏴‍☠️",      tag: "【ゴールド強奪 / 毎ターン4%で逃走】",           gold: "125G+奪われたG",
      desc: "プレイヤーのHPにダメージを与えるたびに、懐から「50G」をスり盗る。さらに、毎ターン終了時に8%の確率で戦闘から逃亡する。" },
    { key: "Clown",    displayName: "Clown",    icon: "🤡",       tag: "【防御無視/ランダム2回行動）】",                 gold: "175G",
      desc: "毎ターンランダムな行動を2回連続で繰り出す。お互いのブロックを無視して直撃する。" },
    { key: "Phoenix",  displayName: "Phoenix",  icon: "🐦‍🔥",      tag: "【確率復活】",                                   gold: "225G",
      desc: "HPを0に削りきっても確率でその場で復活を遂げ、最大HPの10%分の再生する。" },
    { key: "Beast",    displayName: "Beast",    icon: "🦁",       tag: "【無傷時攻撃1.5倍】",                            gold: "150G",
      desc: "このターン中に一度も敵のHPを減らさなかった場合、次ターンの攻撃力が1.5倍に跳ね上がる。" },
    { key: "Bull",     displayName: "Bull",     icon: "🐂",       tag: "【毎ターン攻撃力1.1倍】",                        gold: "150G",
      desc: "ターンを経過するごとに「1.1倍」ずつ上昇させていく。" },
    { key: "Shadow",   displayName: "Shadow",   icon: "👥",       tag: "【5枚プレイ毎に攻撃力+5】",                      gold: "150G",
      desc: "毎ターン、カードを「5枚」使用するたびに、敵自身の攻撃力を恒久的に「+5」上昇させる。毎ターン4枚まで使うことを推奨する。" },
    { key: "Robot",    displayName: "Robot",    icon: "🤖",       tag: "【漏電付与】",                                   gold: "150G",
      desc: "プレイヤーに漏電（🔋）状態を付与する。敵を倒したときに漏電のダメージも受けるので注意。" },
    { key: "Witch",    displayName: "Witch",    icon: "🧙‍♂️",      tag: "【カテゴリ封印 / 1/3で忘却】",                   gold: "175G",
      desc: "毎ターンランダムな特定のカードカテゴリ（攻撃、防御、状態異常、回復）を指定して使用禁止にしてくる。さらに、1/3の確率でプレイヤーに「忘却（❓）」を付与する。" },
    { key: "Reaper",   displayName: "Reaper",   icon: "🩻",       tag: "【即死攻撃/カード追加】",                        gold: "200G",
      desc: "プレイヤーのHPが20%以下のとき即死させる。この戦闘中のみデッキに5枚\"呪い\"カードを追加する。" },
    { key: "Ork",      displayName: "Ork",      icon: "🐗",       tag: "【攻撃・防御2倍】",                              gold: "225G",
      desc: "敵のHPが半分以下のとき、攻撃力と防御力をそれぞれ2倍にする。" },
    { key: "Bee",      displayName: "Bee",      icon: "🐝",       tag: "【確率回避】",                                   gold: "175G",
      desc: "体力は低いものの、プレイヤーの攻撃や状態異常のダメージが33%で外れてしまう。" },
    { key: "Undoll",   displayName: "Undoll",   icon: "🪆",       tag: "【カード追加】",                                 gold: "175G",
      desc: "デッキに15枚\"呪い\"カードを追加する。戦闘が終わるとデッキから15枚\"呪い\"カードを削除する。1/3の確率で未熟（🔰）を付与する。" },
    { key: "Assassin", displayName: "Assasin",  icon: "🥷",       tag: "【偶数ターンに攻撃】",                           gold: "175G",
      desc: "偶数ターンのときに攻撃を行う。奇数ターンは攻撃しない。" },
    { key: "Greedy",   displayName: "Greedy",   icon: "🦹",       tag: "【カード略奪】",                                 gold: "175G",
      desc: "毎ターン、15%の確率でデッキの中からランダムに1枚奪われる。Greedyを倒しても奪われたカードは戻ってこない。" },
    { key: "Trait",    displayName: "Trait",    icon: "👽",       tag: "【ランダム特徴】",                               gold: "200G",
      desc: "以下の特性の中からランダムに2つ選ばれる。物理無効化、状態異常無効化、毎ターン攻撃力増加、毎ターン回復、漏電付与、忘却を付与、未熟を付与。なお、物理無効化または状態異常無効化が選ばれたとき、特性をその1つのみとする。" },
    { key: "Bastion",  displayName: "Bastion",  icon: "💠",       tag: "【防御貫通不可】",                               gold: "175G",
      desc: "ブロックが0にならない限り、物理攻撃、毒、火傷もダメージが通らない。ブロックを無視するダメージも例外なく防御で受け止められてしまう。" },
    { key: "Gunner",   displayName: "Gunner",   icon: "🔫",       tag: "【完全防御を撃ち抜く】",                         gold: "175G",
      desc: "プレイヤーの防御で攻撃を完全に防がれた時、ダメージを1.5倍にしてから防御を差し引いて攻撃する。防御を高く積みすぎると逆に大ダメージを受ける。" },
    { key: "Bat",      displayName: "Bat",      icon: "🦇",       tag: "【毎ターン過労付与＋手札破壊】",                 gold: "200G",
      desc: "毎ターン、プレイヤーに「過労」状態を付与し、さらに手札からランダムに2枚を捨て札に送る。" },
    { key: "Sight",    displayName: "Sight",    icon: "👁️‍🗨️",      tag: "【呪い付与・物理半減・凍結耐性】",               gold: "200G",
      desc: "「呪い」カードを5枚追加する。プレイヤーに「過労」状態を付与する。物理攻撃によるダメージを半分に軽減する。" },
    { key: "Luna",     displayName: "Luna",     icon: "🌕",       tag: "【フェーズ変化・呪い付与】",                     gold: "200G",
      desc: "「呪い」カードを5枚追加する。スタン状態にならない。物理攻撃によるダメージを半分に軽減する。<br>体力が半分より多いときは、毎ターン自身の最大HPの5%回復する。<br>体力が半分以下になると攻撃力が1.33倍になる。呪いカードを5枚追加し、1/3の確率でプレイヤーに「忘却」を付与する。<br>倒すと、追加した呪いカードのうち5枚だけが削除される。" },
    { key: "Tempest",  displayName: "Tempest",  icon: "🌪️",       tag: "【カード使用時に手札をデッキへ巻き戻す】",       gold: "175G",
      desc: "カードを1枚使用するたびに、その使用したカード以外の残りの手札を全てデッキへ戻してシャッフルする。" },
    { key: "Puppeteer", displayName: "Puppeteer", icon: "🎭",      tag: "【手札のカードを操る】",                         gold: "175G",
      desc: "戦闘開始時、手札の中からランダムに1枚を「操られ」状態にする。操られたカードを使用すると、通常の効果に加えてPuppeteer自身が最大HPの15%回復してしまう。" },
    { key: "Salamander", displayName: "Salamander", icon: "🦎",    tag: "【火傷を力に変える】",                           gold: "150G",
      desc: "火傷によるダメージを受けるたびに、攻撃力が1.25倍になる。火傷を主体としたデッキには強力なカウンターとなるため注意。" },
    { key: "Dragon",   displayName: "Dragon",   icon: "🐉",       tag: "【回復系BOSS（状態回復 / 自己再生）】",          gold: "600G", isBoss: true,
      desc: "ボスの1体。常にスタン状態を無効化する。1/3で未熟を付与する。1/4の確率で、Dragonにかかっているすべての状態異常を完全に消去する。さらに、ターン終了時にHPが「10」回復し、1/3の確率でさらに追加で「10」回復する。" },
    { key: "Magica",   displayName: "Magica",   icon: "🔮",       tag: "【妨害系BOSS（漏電・未熟付与/カテゴリ封印）】",  gold: "600G", isBoss: true,
      desc: "ボスの1体。常にスタン状態を無効化する。1/3で未熟を付与する。毎ターンランダムな特定のカードカテゴリ（攻撃、防御、状態異常、回復）を使用禁止かつ漏電を付与する。" },
    { key: "Boost",    displayName: "Boost",    icon: "🪓",       tag: "【攻撃系BOSS（攻撃力増加）】",                   gold: "600G", isBoss: true,
      desc: "ボスの1体。常にスタン状態を無効化する。1/3で未熟を付与する。攻撃力を1.1倍してくる。カードを1枚使うごとに敵の攻撃力を+1する。" }
];

// 敵データ(enemy.data)から説明文を取得する（見つからない場合は空文字を返す）
// ※ ENEMY_MANUAL_DATAが唯一の情報源。説明書と戦闘中の表示は両方ここを参照する。
function getEnemyDescription(enemyData) {
    if (!enemyData || !enemyData.name) return "";
    const entry = ENEMY_MANUAL_DATA.find(e => e.key === enemyData.name);
    return entry ? entry.desc : "";
}

// 📖 説明書「敵について」タブのアコーディオンHTMLを、ENEMY_MANUAL_DATAから自動生成する
// ここを直接編集する必要はない。敵の説明を変えたい時はENEMY_MANUAL_DATAを編集すればよい。
function renderEnemyManualHtml() {
    let html = `<div class="enemy-accordion">`;

    ENEMY_MANUAL_DATA.forEach(e => {
        const isBoss = !!e.isBoss;
        const itemStyle = isBoss
            ? `margin-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5px; border: 1px solid #e43f5a; border-radius: 4px;`
            : `margin-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5px;`;
        const headerStyle = isBoss
            ? `cursor: pointer; padding: 5px; font-weight: bold; display: flex; justify-content: space-between; align-items: center; background: rgba(228,63,90,0.15);`
            : `cursor: pointer; padding: 5px; font-weight: bold; display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.05); border-radius: 4px;`;
        const detailStyle = isBoss
            ? `display: none; padding: 10px; background: rgba(0,0,0,0.3); font-size: 20px; color: #eee; line-height: 1.5;`
            : `display: none; padding: 10px; background: rgba(0,0,0,0.2); font-size: 20px; color: #ccc; line-height: 1.5;`;
        const nameLabel = `${e.displayName} ${e.icon}${isBoss ? " (BOSS)" : ""}`;
        const tagHtml = e.tag ? `<strong style="color: #00adb5;">${e.tag}</strong>` : "";

        html += `
            <div class="enemy-item" style="${itemStyle}">
                <div class="enemy-header" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'block' ? 'none' : 'block'; this.classList.toggle('active');" style="${headerStyle}">
                    <span>${nameLabel}</span>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        ${tagHtml}
                        <span style="color: gold;">${e.gold}</span>
                    </div>
                </div>
                <div class="enemy-detail" style="${detailStyle}">
                    ${e.desc}
                </div>
            </div>`;
    });

    html += `</div>`;
    return html;
}


// =========================================================================
// 🧪 敵の生成とステータス初期化
// =========================================================================
/**
 * 現在の階層に応じた敵をランダム（または固定）で選定し、ステータスを初期化して返す
 */
function initEnemyStatus() {

    //const pool = ["robot"]
    const pool = ["goblin","knight","slime", "fenrir", "zombie", "golem", "spirit", "thief", "clown","phoenix","beast","bull","shadow","robot","witch","reaper", "ork", "bee","undoll","assassin","greedy","trait","bastion","gunner","bat","sight","luna","tempest","puppeteer","salamander"];

// ─── 敵の種類の選定 ───

    if (floor === 20) {
        // ゲーム開始時に固定した20階のボス
        type = window.boss20; 
    } 
    else if (floor === 40) {
        // ゲーム開始時に固定した40階のボス
        type = window.boss40; 
    } 
    else if (floor === 1) {
        // 1階はゴブリン固定
        player.darkMarketCount = 0;

	type = pool[Math.floor(Math.random() * pool.length)];
        //type = "luna";
	//1階はエリアなし
	window.currentArea = "none";
    }
    else {
        // 通常プールからランダムに1つ選ぶ
        type = pool[Math.floor(Math.random() * pool.length)];
    }

    
    const baseHp  = 20 + floor * 7.31; 
    const baseAtk =  3 + floor * 1.11;  
    
    let diffRateHp  = 1.0;
    let diffRateAtk = 1.0;

    if (window.difficulty === "easy")    diffRateHp  = 0.75; //easy    0.75倍
    if (window.difficulty === "easy")    diffRateAtk = 0.75; //easy    0.75倍

    if (window.difficulty === "normal")   diffRateHp  = 1.00; //nomal   1.00倍
    if (window.difficulty === "normal")   diffRateAtk = 1.00; //nomal   1.00倍

    if (window.difficulty === "hard")    diffRateHp  = 1.25; //hard    1.25倍
    if (window.difficulty === "hard")    diffRateAtk = 1.25; //hard    1.25倍

    if (window.difficulty === "lunatic") diffRateHp  = 1.50; //lunatic 1.50倍
    if (window.difficulty === "lunatic") diffRateAtk = 1.50; //lunatic 1.50倍

    const data = enemyTypes[type];

    // 💀 エリート戦：通常の敵から抽選された内容に対して、攻撃・体力・防御を1.25倍、
    //    報酬ゴールドを1.5倍（25の倍数に切り捨て）した専用ステータスを適用する
    const isEliteType = type !== "dragon" && type !== "magica" && type !== "boost";
    const isElite = !!window.isEliteBattle && isEliteType;
    window.isEliteBattle = false; // 使用後は必ずリセットしておく（次の戦闘に持ち越さない）

    const effectiveData = isElite
        ? Object.assign({}, data, {
            hpRate: data.hpRate * 1.25,
            atkRate: data.atkRate * 1.25,
            blockRate: data.blockRate * 1.25,
            rewardGold: Math.floor((data.rewardGold * 1.5) / 25) * 25,
            isElite: true
        })
        : data;

    setTimeout(() => {
        decideEnemyNextStyle();
    }, 50);

    // 敵の初期ステータスオブジェクトを作成して返す
    return {
        data: effectiveData,
        hp: truncateToOneDecimal(baseHp * effectiveData.hpRate * diffRateHp),
        maxHp: truncateToOneDecimal(baseHp * effectiveData.hpRate * diffRateHp),
        attack: Math.floor(baseAtk * effectiveData.atkRate * diffRateAtk),
        block: 0,
        status: { 
            poisonList: [], 
            burn: 0, 
            freeze: 0,
            stun: 0
        }
    };
}


function applyEnemyTurnStartTraits() {
    if (!enemy.data) return;

    // スピリットの特性（ターンごとに無効属性を入れ替え）
    if (enemy.data.name === "Spirit") {
        if (window.battleTurnCount % 2 !== 0) {
            // 奇数ターン：物理攻撃無効
            enemy.data.immuneNormal = true;
            enemy.data.immuneStatus = false;
        } else {
            // 偶数ターン：状態異常無効
            enemy.data.immuneNormal = false;
            enemy.data.immuneStatus = true;
        }
    }
}

// 🦇 Bat：毎ターン、プレイヤーに過労を付与し、手札からランダムに2枚捨て札へ送る
function applyBatTurnEffect() {
    if (!(window.inBattle && enemy.data && enemy.data.name === "Bat")) return;

    player.status.fatigue = 1;

    let discarded = 0;
    for (let i = 0; i < 2 && window.hand && hand.length > 0; i++) {
        const randIndex = Math.floor(Math.random() * hand.length);
        const [discardedCard] = hand.splice(randIndex, 1);
        discardPile.push(discardedCard);
        discarded++;
    }
}

// 👁️‍🗨️ Sight：毎ターン、プレイヤーに過労を付与する（手札破壊はない）
function applySightTurnEffect() {
    if (!(window.inBattle && enemy.data && enemy.data.name === "Sight")) return;

    player.status.fatigue = 1;
}

// 🌕/🌑 Luna：体力が半分より多い間は毎ターン自己回復、半分以下になると1/4で忘却を付与する
function applyLunaTurnEffect() {
    if (!(window.inBattle && enemy.data && enemy.data.name === "Luna")) return;

    const isPhase2 = enemy.status.lunaPhase2 || (enemy.hp <= enemy.maxHp / 2);

    if (!isPhase2) {
        // 🌕 体力が半分より多い間：毎ターン自身の最大HPの5%回復
        const healAmount = Math.min(enemy.maxHp/20, enemy.maxHp - enemy.hp);
        if (healAmount > 0) {
            enemy.hp += healAmount;
            enemy.hp = truncateToOneDecimal(enemy.hp);
        }
    } else {
        // 🌑 体力が半分以下：1/4の確率でプレイヤーに忘却(手札を隠す)を付与
        if (Math.random() < (1 / 4)) {
            player.status.amnesia = 1;
            if (typeof renderHand === 'function') renderHand();
        }
    }

    if (typeof updateUI === 'function') updateUI();
}

// 🎭 Puppeteer：戦闘開始時、手札からランダムに1枚を「操られ」状態にする
function applyPuppeteerBattleStart() {
    if (!(window.inBattle && enemy.data && enemy.data.name === "Puppeteer")) return;
    if (!window.hand || hand.length === 0) return;

    const idx = Math.floor(Math.random() * hand.length);
    hand[idx].puppeted = true;
    customAlert("🎭 パペッティアが手札の1枚を操っている…！使うと敵が回復してしまう。");
}

// =========================================================================
// 💰 撃破時ゴールド（報酬金）の計算
// =========================================================================
function getEnemyKillRewardGold() {
    if (!enemy.data) return 0;
    
    // シーフ（Thief）だけは「奪われた金」を加算する特殊な処理を行う
    if (enemy.data.name === "Thief") {
        return (window.thiefStolenGold || 0) + enemy.data.rewardGold;
    }

    // それ以外の敵は、enemyTypes で定義した rewardGold をそのまま返す（見つからない場合は0）
    return enemy.data.rewardGold || 0;
}

// =========================================================================
// 🎯 敵にダメージを与える関数
// =========================================================================
// 凍結・絶対零度への耐性判定
// Sightなどは常時耐性を持つが、Lunaは体力が半分より多い間（フェーズ1）のみ耐性を持ち、
// フェーズ2（体力半分以下）になると凍結・絶対零度が効くようになる
function isFreezeAndAbsoluteZeroImmune() {
    if (!enemy.data || !enemy.data.neverFreeze) return false;
    if (enemy.data.name === "Luna" && enemy.status && enemy.status.lunaPhase2) {
        return false; // Lunaはフェーズ2に入ると耐性を失う
    }
    return true;
}

// 🛡️ 物理攻撃無効かどうか（enemyTypesの恒久フラグ、またはTraitのランダム特性の両方を見る）
function isEnemyImmuneToNormal() {
    if (!enemy || !enemy.data) return false;
    return !!enemy.data.immuneNormal || !!(enemy.status && enemy.status.immuneNormal);
}

// ☠️ 状態異常無効かどうか（enemyTypesの恒久フラグ、またはTraitのランダム特性の両方を見る）
function isEnemyImmuneToStatusEffects() {
    if (!enemy || !enemy.data) return false;
    return !!enemy.data.immuneStatus || !!(enemy.status && enemy.status.immuneStatus);
}

function damageEnemy(amount, ignoreBlock = false, isPierce = false, cardCat = null) {
    if (!inBattle) return;

    // 🐝Bee（蜂）の特性判定：33%の確率で攻撃や状態異常（スリップダメージ等含む）を完全無効化
    if (enemy.data && enemy.data.name === "Bee") {
        if (Math.random() < 0.33) {
            // 無効化ポップアップを表示
            if (typeof createDamagePopup === 'function') {
                createDamagePopup("🛡️ INVALID", true);
            }
            // 戦闘ログに表示（グローバル変数がある場合）
            if (typeof logText !== 'undefined' && typeof logArea !== 'undefined') {
                logText += `<div style="color:#ffcc00; font-weight:bold;">🐝 Bee：攻撃や異常状態を無効化した！</div>`;
                logArea.innerHTML = logText;
            }
            if (typeof updateUI === 'function') updateUI();
            return; // ここで処理を終了し、一切のダメージ・変動を発生させない
        }
    }

    let finalDamage = amount;

    // 💠 Bastion（バスティオン）の特性：防御値が0になるまでは、毒・火傷などブロック無視のダメージも防御で受け止める
    if (enemy.data && enemy.data.name === "Bastion") {
        ignoreBlock = false;
    }

    if (!ignoreBlock && finalDamage > 0) {
        if (window.player && window.player.fields && window.player.fields.atk_up) {
            finalDamage += window.player.fields.atk_up;
        }
    }

    // 👻【特性判定】敵の特性（SpiritやSlime）によるダメージの無効・倍率化を最初に行う
    if (enemy.data && finalDamage > 0) {

        // 🛡️ 汎用の物理攻撃無効判定（Traitの「物理無効」特性や、今後追加する immuneNormal:true の敵に対応）
        //    物理攻撃（ブロックを参照する通常攻撃、または貫通攻撃）のみを無効化し、毒・火傷などのDoTダメージ(ignoreBlock=true)は対象外
        if (isEnemyImmuneToNormal()) {
            if (!ignoreBlock || isPierce) {
                finalDamage = 0;
            }
        }

        // ① スピリット（Spirit）の特性
        if (enemy.data.name === "Spirit") {
            const isOddTurn = (window.battleTurnCount % 2 !== 0);

            if (isOddTurn) {
                // 奇数ターンは【物理無効】。物理攻撃（!ignoreBlock）、または貫通（isPierce）ならダメージを0にする
                if (!ignoreBlock || isPierce) {
                    finalDamage = 0;
                }
            } else {
                // 偶数ターンは【状態異常無効】。状態異常ダメージ（ignoreBlock=true）ならダメージを0にする
                if (ignoreBlock) {
                    finalDamage = 0;
                }
            }
        }
        
        // ② スライム（Slime）の特性
        if (enemy.data.name === "Slime") {
            if (isPierce) {
                // 貫通は物理無効の敵には効かない（0ダメージ）
                finalDamage = 0;
            } else if (!ignoreBlock) {
                finalDamage = 0;
            } else {
                finalDamage = finalDamage * 2;
            }
        }

	        // ③ アサシンの特性
        if (enemy.data.name === "Assassin") {
            const isOddTurn = (window.battleTurnCount % 2 !== 0);

            if (isOddTurn) {
                // 奇数ターンは攻撃しない
                enemy.atkRate=0;
            }
        }

        // ④ physicalResist特性：攻撃系(cat:"atk")カードのダメージのみ軽減する
        //    （ブロック系・回復系・状態異常系カードや、毒・火傷などのDoTダメージは対象外）
        if (enemy.data.physicalResist && enemy.data.physicalResist < 1 && enemy.data.name === "sight") {
            if (cardCat === "atk") {
                finalDamage = truncateToOneDecimal(finalDamage * enemy.data.physicalResist);
            }
        }
        if (enemy.data.physicalResist && enemy.data.physicalResist < 1 && enemy.data.name === "Luna" && !(enemy.status && enemy.status.lunaPhase2)) {
            if (cardCat === "atk") {
                finalDamage = truncateToOneDecimal(finalDamage * enemy.data.physicalResist);
            }
        }

    }

    // 🛡️【ブロック計算】無効化されずに残った物理ダメージに対して、ブロック（盾）の計算を行う
    if (!ignoreBlock && enemy.block > 0 && finalDamage > 0) {
        const blocked = Math.min(enemy.block, finalDamage);
        finalDamage -= blocked;
        enemy.block -= blocked;

        // ✨ 追加ポイント1: ブロックで防いだ数値をポップアップ
        if (typeof createDamagePopup === 'function' && blocked > 0) {
            createDamagePopup(`🛡️ ${blocked}`, true);
        }
    }

    // 💥【HP減少処理】実際にブロックを突き破ってダメージが残った場合
    if (finalDamage > 0) {
        // 残ったダメージを敵のHPから差し引く
        enemy.hp -= finalDamage;
        if (enemy.hp < 0) enemy.hp = 0;
        enemy.hp = truncateToOneDecimal(enemy.hp); // 浮動小数点の誤差を防ぎ、小数第一位に揃える

        // ✨ 追加ポイント2: 実際に敵のHPが減ったタイミングでダメージ音頭数値を表示！
        if (typeof createDamagePopup === 'function') {
            createDamagePopup(finalDamage, true); 
        }

        // 🗿 ゴーレム（Golem）の反射特性
        if (enemy.data && enemy.data.name === "Golem" && !ignoreBlock) {
            player.hp = Math.max(0, player.hp - 3);
        }

        // 🧟 ゾンビの特性用（そのターンに受けた物理ダメージを蓄積）
        if (enemy.data && enemy.data.name === "Zombie") {
            window.zombieDamageTakenThisTurn = (window.zombieDamageTakenThisTurn || 0) + finalDamage;
        }

        // 🦁 獣（Beast）の特性用（ダメージを受けたらフラグを立てる）
        if (enemy.data && enemy.data.name === "Beast") {
            window.beastDamagedThisTurn = true;
        }

        // 🌕 Luna：体力が半分以下になった瞬間（1回だけ）に発動する変化
        if (enemy.data && enemy.data.name === "Luna" && enemy.hp > 0 && !enemy.status.lunaPhase2) {
            if (enemy.hp <= enemy.maxHp / 2) {
                enemy.status.lunaPhase2 = true;

                // アイコンを新月に変更（enemy.dataは全Lunaで共有されるテンプレートなので、
                // ここでは直接DOMを書き換える。enemy.dataそのものは書き換えない）
                const enemyIconEl = document.getElementById("enemyIcon");
                if (enemyIconEl) enemyIconEl.innerText = "🌑";

                // 攻撃力を1.33倍に変更
                enemy.attack = Math.floor(enemy.attack * 1.33);

                // 呪いカードをさらに5枚デッキに追加（倒しても削除されない5枚とは別に、こちらも削除対象外）
                const slot = window.currentSlot || 0;
                if (!window.savedDecks[slot]) window.savedDecks[slot] = {};
                window.savedDecks[slot][0] = (window.savedDecks[slot][0] || 0) + 5;

                customAlert("🌑 敵の姿が変わった！");
            }
        }
    }

    // 敵のHPが0になった瞬間に、monster.js にある復活関数を実行する
    if (enemy.hp === 0 && enemy.data && enemy.data.name === "Phoenix") {
        if (typeof tryPhoenixRevive === 'function') {
            const revived = tryPhoenixRevive();
            if (revived) {
                if (typeof updateUI === 'function') updateUI();
                return;
            }
        }
    }

    // HPやブロックが変動したのでUI（画面表示）を更新
    if (typeof updateUI === 'function') updateUI();
}


// =========================================================================
// 🩻 呪いカード削除ロジック(死神、アンドール)
// =========================================================================
function removeReaperCursesFromSavedDecks() {
    const slot = window.currentSlot || 0;
    if(enemy.data && enemy.data.name === "Reaper"){
        if (window.savedDecks && window.savedDecks[slot] && window.savedDecks[slot][0] !== undefined) {
        // 呪いカード(id=0)の枚数を5枚減らす
            window.savedDecks[slot][0] -= 5;
        
        // 0枚以下になった場合はオブジェクトからキーごと削除する
            if (window.savedDecks[slot][0] <= 0) {
                delete window.savedDecks[slot][0];
            }
            console.log("🧹 死神戦が終了したため、呪いカードを5枚削除しました。");
        }
    }
    if(enemy.data && enemy.data.name === "Undoll"){
        if (window.savedDecks && window.savedDecks[slot] && window.savedDecks[slot][0] !== undefined) {
        // 呪いカード(id=0)の枚数を15枚減らす
            window.savedDecks[slot][0] -= 15;
        
        // 0枚以下になった場合はオブジェクトからキーごと削除する
            if (window.savedDecks[slot][0] <= 0) {
                delete window.savedDecks[slot][0];
            }
            console.log("🧹 アンドール戦が終了したため、呪いカードを15枚削除しました。");
        }


    }

    // 🌕 Luna：倒した時に呪いカードを5枚だけ削除する（戦闘中に追加された合計10枚のうち5枚は残り続ける）
    if(enemy.data && enemy.data.name === "Luna"){
        if (window.savedDecks && window.savedDecks[slot] && window.savedDecks[slot][0] !== undefined) {
            window.savedDecks[slot][0] -= 5;

            if (window.savedDecks[slot][0] <= 0) {
                delete window.savedDecks[slot][0];
            }
            console.log("🧹 Lunaを倒したため、呪いカードを5枚削除しました。");
        }
    }

}




// =========================================================================
// 🐦‍🔥 不死鳥の復活ロジック
// =========================================================================
function tryPhoenixRevive(){
    if(!enemy.data || enemy.data.name !== "Phoenix") return false;
    if(enemy.hp > 0) return false;

    if(Math.random() < (1 / window.phoenixReviveChance)){
        const healAmount = Math.floor(enemy.maxHp * 0.1);
        enemy.hp = healAmount;
        window.phoenixReviveChance += 0.5;

        customAlert(
            `🐦‍🔥 不死鳥が復活した！\n` +
            `HPを ${healAmount} 回復！\n` +
            `次回復活確率: 1/${window.phoenixReviveChance}`
        );

        if(typeof updateUI === 'function'){
            updateUI();
        }
        return true;
    }
    return false;
}


// 敵の行動スタイル定義と倍率
window.aiStyles = {
    super_attack: { name: "超攻撃特化のようだ！", atkRate: 1.5, blkRate: 0 },
    attack:       { name: "攻撃特化のようだ！",   atkRate: 1.25, blkRate: 0.5 },
    balance:      { name: "バランスを重視している", atkRate: 1.0, blkRate: 1.0 },
    defense:      { name: "防御特化のようだ！",   atkRate: 0.75, blkRate: 2 },
    super_defense:{ name: "超防御特化のようだ！", atkRate: 0.5, blkRate: 4 }
};

// ランダムにスタイルを1つ決定してUIを更新する関数
function decideEnemyNextStyle() {
    const keys = Object.keys(window.aiStyles);
    let randomKey = keys[Math.floor(Math.random() * keys.length)];
    
    // ★カモフラージュ状態かつ、抽選結果が対象スタイルと一致する場合、強制的に「バランス型」にする
if (enemy.status.camouflageTurns > 0) {
        const targetStyle = enemy.status.camouflageTarget || 'super_attack';
        if (randomKey === targetStyle) {
            randomKey = 'balance';
            enemy.status.behaviorControlled = true; // 制御が継続している場合
            console.log(`カモフラージュ効果により${targetStyle}をバランス型に変更しました。`);
        }
    } else {
        // ───効果が切れたら表示フラグを完全にオフにする ───
        enemy.status.behaviorControlled = false;
    }
    window.enemy.nextStyleKey = randomKey;
    
    if (typeof updateUI === 'function') updateUI();
}

//ボスの候補(ゲーム開始時に決定)
function determineBossesForRun() {
    const bossPool20 = ["dragon", "magica","boost"]; 
    const chosenBoss20 = bossPool20[Math.floor(Math.random() * bossPool20.length)];
    window.boss20 = chosenBoss20;

    
    const bossPool40 = ["dragon", "magica","boost"]; 
    const chosenBoss40 = bossPool40[Math.floor(Math.random() * bossPool40.length)];
    window.boss40 = chosenBoss40;
}