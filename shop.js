// shop.js

// フィールド一覧
const fieldMaster = [
    { id:"atk_up", name:"ダメージ強化", desc:"ダメージを全て+1(重複可)", type:"field" },
    { id:"def_up", name:"防御強化", desc:"ターン開始時、自分の防御が+2(重複可)", type:"field" },
    { id:"draw_up", name:"ドロー強化", desc:"毎ターン開始時、1/3の確率で1枚多く引く", type:"field" },
    { id:"heavy_burn", name:"大火傷", desc:"火傷によるダメージが10に増加", type:"field" },
    { id:"boss_scout", name:"ボス偵察", desc:"20階と40階のボスの名前が事前に分かるようになる", type:"field" }
];

let shopSelectionCount = 0; 
let isShopActive = false;

// ─── 🛒 通常ショップ用 ノード生成関数群 ───

// ① カード用
function createCardNode(card, container, isOnSale = false) {
    let basePrice = 50; 
    if (card.rarity === "uncommon") basePrice = 50;
    if (card.rarity === "rare")     basePrice = 100;
    if (card.rarity === "legend")   basePrice = 150;
    if (card.rarity === "space")    basePrice = 150;
    let price = basePrice + (card.cost * 50);

    if (isOnSale) {
        price = Math.max(0, price - 100);
    }

    const div = document.createElement("div");
    const costClass = card.cost >= 3 ? "cost-3" : `cost-${card.cost}`;
    div.className = `card rewardCard ${card.rarity} cat-${card.cat} ${costClass}`;
    
    // カード効果文に「nkai」マスタリーの動的ダメージ表記を追加
    let displayDesc = card.desc || "";
    if (card.type === "nkai") {
        const currentCount = (window.player.status && window.player.status.nkaiCount) || 0;
        const currentDamage = (card.value || 0) + currentCount;
        displayDesc = `${card.desc}（現在: ${currentDamage}ダメ）`;
    }
    
    if (isOnSale) {
        div.innerHTML = `<h3>${card.name} <span style="color:lightblue;">[セール]</span></h3><p>Cost:${card.cost}</p><p>${displayDesc}</p><p style="color:lightblue; font-weight:bold; font-size:16px; margin-top:5px;">🪙 ${price}G</p>`;
    } else {
        div.innerHTML = `<h3>${card.name}</h3><p>Cost:${card.cost}</p><p>${displayDesc}</p><p style="color:gold; font-weight:bold; font-size:16px; margin-top:5px;">🪙 ${price}G</p>`;
    }
    
    div.onclick = function(){
        if(!isShopActive) return;
        if(player.gold < price) { customAlert("ゴールドが足りません！"); return; }
        
        player.gold -= price;
        const currentSlot = window.currentSlot || 0;
        const currentDeck = savedDecks[currentSlot];
        currentDeck[card.id] = (currentDeck[card.id] || 0) + 1;
        deck.push(copyCard(card));
        
        if (typeof hand !== 'undefined') {
            hand.push(copyCard(card));
            if (typeof renderHand === 'function') renderHand();
        }
        
        shopSelectionCount--;
        const rewardTitle = document.getElementById("rewardTitle");
        if(rewardTitle) rewardTitle.innerText = `ショップ（残り: ${shopSelectionCount}個） | 💰所持: ${player.gold}G`;
        
        div.style.opacity = "0.4";
        div.style.pointerEvents = "none";
        processShopClick();
    };
    container.appendChild(div);
}

// ② フィールド用 (一律150G)
function createFieldNode(field, container, isOnSale = false) {
    let price = 150;
    if (isOnSale) {
        price = Math.max(0, price - 100);
    }

    const div = document.createElement("div");
    div.className = `card rewardCard field-effect-card field-rarity`;
    
    if (isOnSale) {
        div.innerHTML = `<h3 style='color:lightblue'>【フィールド】</h3><h4>${field.name} <span style="color:lightblue;">[セール]</span></h4><p style='font-size:12px;'>${field.desc}</p><p style="color:lightblue; font-weight:bold; font-size:16px; margin-top:5px;">🪙 ${price}G</p>`;
    } else {
        div.innerHTML = `<h3 style='color:#00adb5'>【フィールド】</h3><h4>${field.name}</h4><p style='font-size:12px;'>${field.desc}</p><p style="color:gold; font-weight:bold; font-size:16px; margin-top:5px;">🪙 ${price}G</p>`;
    }
    
    div.onclick = function(){
        if(!isShopActive) return;
        if(player.gold < price) { customAlert("ゴールドが足りません！"); return; }
        
        player.gold -= price;
        if(field.id === "atk_up") player.fields.atk_up++;
        if(field.id === "def_up") player.fields.def_up ++;
        if(field.id === "draw_up") player.fields.draw_up = 1;
        if(field.id === "heavy_burn") player.fields.heavy_burn = 1;
        if(field.id === "boss_scout") {player.fields.boss_scout = 1;
	    const bossNameMap = { dragon: "ドラゴン 🐉", magica: "マギカ 🔮", boost: "ブースト 🪓" };
            const b20Name = bossNameMap[window.boss20] || window.boss20 || "不明";
            const b40Name = bossNameMap[window.boss40] || window.boss40 || "不明";
            customAlert(`👁️ 【ボス偵察】\n\n20階ボス: ${b20Name}\n40階ボス: ${b40Name}`);
        }

        
        shopSelectionCount--;
        const rewardTitle = document.getElementById("rewardTitle");
        if(rewardTitle) rewardTitle.innerText = `ショップ（残り: ${shopSelectionCount}個） | 💰所持: ${player.gold}G`;
        
        div.style.opacity = "0.4";
        div.style.pointerEvents = "none";
        processShopClick();
    };
    container.appendChild(div);
}

// ③ ポーション用 (一律150G)
function createPotionNode(potionType, container, isOnSale = false) {
    let price = 150;
    if (isOnSale) {
        price = Math.max(0, price - 100);
    }

    const div = document.createElement("div");
    div.className = `card rewardCard common`;
    let pName = (typeof getPotionName === 'function') ? getPotionName(potionType) : potionType + " Potion";
    
    let pDesc = "戦闘中に使用可能な強力な薬品。";
    if (potionType === "heal") {
        pDesc = "プレイヤーのHPを 15 回復する。";
    } else if (potionType === "energy") {
        pDesc = "エネルギーを +2 する。";
    } else if (potionType === "block") {
        pDesc = "プレイヤーの防御値を +20 させる。";
    } else if (potionType === "draw") {
        pDesc = "山札からカードを 3 枚引く。";
    } else if (potionType === "acid") {
	pDesc = "相手のブロックを 0 にして 毒5 を付与"
    } else if (potionType === "vessel") {
        pDesc = "2回飲むとポーションスロットが1つ増える。";
    }
    
    if (isOnSale) {
        div.innerHTML = `<h3 style='color:lightblue'>【ポーション】</h3><h4>${pName} <span style="color:lightblue;">[セール]</span></h4><p style='font-size:12px; min-height:32px; color:#ccc;'>${pDesc}</p><p style="color:#ff4757; font-weight:bold; font-size:16px; margin-top:5px;">🪙 ${price}G</p>`;
    } else {
        div.innerHTML = `<h3 style='color:#00adb5'>【ポーション】</h3><h4>${pName}</h4><p style='font-size:12px; min-height:32px; color:#ccc;'>${pDesc}</p><p style="color:gold; font-weight:bold; font-size:16px; margin-top:5px;">🪙 ${price}G</p>`;
    }

    div.onclick = function(){
        if(!isShopActive) return;
        window.playerPotions = window.playerPotions || [];
        window.maxPotionSlots = window.maxPotionSlots || 1;
        if (window.playerPotions.length >= window.maxPotionSlots) {
            customAlert(`🎒 ポーションスロットが満杯です！（最大${window.maxPotionSlots}個）`);
            return;
        }
        if(player.gold < price) { customAlert("ゴールドが足りません！"); return; }
        
        player.gold -= price;
        window.playerPotions.push(potionType);
        customAlert(`${pName} を購入しました！`);
        
        shopSelectionCount--;
        const rewardTitle = document.getElementById("rewardTitle");
        if(rewardTitle) rewardTitle.innerText = `ショップ（残り: ${shopSelectionCount}個） | 💰所持: ${player.gold}G`;
        
        div.style.opacity = "0.4";
        div.style.pointerEvents = "none";
        processShopClick();
    };
    container.appendChild(div);
}

// ─── 🌌 闇市専用 ノード生成関数群 (無限購入用) ───

// ① 闇市カード用
function createDarkCardNode(card, container, isOnSale = false) {
    let basePrice = 50; 
    if (card.rarity === "uncommon") basePrice = 50;
    if (card.rarity === "rare")     basePrice = 100;
    if (card.rarity === "legend")   basePrice = 150;

    let costPrice = 0;
    if (card.cost >= 2) {
        costPrice = (card.cost - 1) * 50;
    }

    let price = basePrice + costPrice;
    if (isOnSale) {
        price = Math.max(0, price - 100);
    }

    const div = document.createElement("div");
    const costClass = card.cost >= 3 ? "cost-3" : `cost-${card.cost}`;
    div.className = `card rewardCard ${card.rarity} cat-${card.cat} ${costClass}`;
    
    let displayDesc = card.desc || "";
    if (card.type === "nkai") {
        const currentCount = (window.player.status && window.player.status.nkaiCount) || 0;
        const currentDamage = (card.value || 0) + currentCount;
        displayDesc = `${card.desc}（現在: ${currentDamage}ダメ）`;
    }
    
    if (isOnSale) {
        div.innerHTML = `<h3>${card.name} <span style="color:lightblue;">[セール]</span></h3><p>Cost:${card.cost}</p><p>${displayDesc}</p><p style="color:lightblue; font-weight:bold; font-size:16px; margin-top:5px;">🪙 ${price}G</p>`;
    } else {
        div.innerHTML = `<h3>${card.name}</h3><p>Cost:${card.cost}</p><p>${displayDesc}</p><p style="color:gold; font-weight:bold; font-size:16px; margin-top:5px;">🪙 ${price}G</p>`;
    }
    
    div.onclick = function(){
        if(player.gold < price) { customAlert("ゴールドが足りません！"); return; }
        player.gold -= price;

        const currentSlot = window.currentSlot || 0;
        const currentDeck = savedDecks[currentSlot];
        currentDeck[card.id] = (currentDeck[card.id] || 0) + 1;
        deck.push(copyCard(card));

        if (typeof hand !== 'undefined') {
            hand.push(copyCard(card));
            if (typeof renderHand === 'function') renderHand();
        }

        const rewardTitle = document.getElementById("rewardTitle");
        if(rewardTitle) rewardTitle.innerText = `🌌 闇市（購入制限なし・戻るボタンで退店） | 💰所持: ${player.gold}G`;
        if(typeof updateUI === 'function') updateUI();

        div.style.opacity = "0.4";
        div.style.pointerEvents = "none";
    };
    container.appendChild(div);
}

// ② 闇市フィールド用 (一律100G)
function createDarkFieldNode(field, container, isOnSale = false) {
    let price = 100; 
    if (isOnSale) {
        price = Math.max(0, price - 100);
    }

    const div = document.createElement("div");
    div.className = `card rewardCard field-effect-card field-rarity`;
    
    if (isOnSale) {
        div.innerHTML = `<h3 style='color:lightblue'>【フィールド】</h3><h4>${field.name} <span style="color:lightblue;">[セール]</span></h4><p style='font-size:12px;'>${field.desc}</p><p style="color:lightblue; font-weight:bold; font-size:16px; margin-top:5px;">🪙 ${price}G</p>`;
    } else {
        div.innerHTML = `<h3 style='color:#e43f5a'>【フィールド】</h3><h4>${field.name}</h4><p style='font-size:12px;'>${field.desc}</p><p style="color:gold; font-weight:bold; font-size:16px; margin-top:5px;">🪙 ${price}G</p>`;
    }
    
    div.onclick = function(){
        if(player.gold < price) { customAlert("ゴールドが足りません！"); return; }
        player.gold -= price;
        
        if(field.id === "atk_up") player.fields.atk_up++;
        if(field.id === "def_up") player.fields.def_up ++;
        if(field.id === "draw_up") player.fields.draw_up = 1;
        if(field.id === "heavy_burn") player.fields.heavy_burn = 1;
        if(field.id === "boss_scout") {player.fields.boss_scout = 1;
	    const bossNameMap = { dragon: "ドラゴン 🐉", magica: "マギカ 🔮", boost: "ブースト 🪓" };
            const b20Name = bossNameMap[window.boss20] || window.boss20 || "不明";
            const b40Name = bossNameMap[window.boss40] || window.boss40 || "不明";
            customAlert(`👁️ 【ボス偵察】\n\n20階ボス: ${b20Name}\n40階ボス: ${b40Name}`);
        }
        
        const rewardTitle = document.getElementById("rewardTitle");
        if(rewardTitle) rewardTitle.innerText = `🌌 闇市（購入制限なし・戻るボタンで退店） | 💰所持: ${player.gold}G`;
        if(typeof updateUI === 'function') updateUI();
        
        div.style.opacity = "0.4";
        div.style.pointerEvents = "none";
    };
    container.appendChild(div);
}

// ③ 闇市ポーション用 (一律100G)
function createDarkPotionNode(potionType, container, isOnSale = false) {
    let price = 100; 
    if (isOnSale) {
        price = Math.max(0, price - 100);
    }

    const div = document.createElement("div");
    div.className = `card rewardCard common`;
    let pName = (typeof getPotionName === 'function') ? getPotionName(potionType) : potionType + " Potion";
    
    if (isOnSale) {
        div.innerHTML = `<h3 style='color:lightblue'>【ポーション】</h3><h4>${pName} <span style="color:lightblue;">[セール]</span></h4><p style='font-size:12px;'>戦闘中に使用可能な強力な薬品。</p><p style="color:lightblue; font-weight:bold; font-size:16px; margin-top:5px;">🪙 ${price}G</p>`;
    } else {
        div.innerHTML = `<h3 style='color:#e43f5a'>【ポーション】</h3><h4>${pName}</h4><p style='font-size:12px;'>戦闘中に使用可能な強力な薬品。</p><p style="color:gold; font-weight:bold; font-size:16px; margin-top:5px;">🪙 ${price}G</p>`;
    }
    
    div.onclick = function(){
        window.playerPotions = window.playerPotions || [];
        window.maxPotionSlots = window.maxPotionSlots || 1;
        if (window.playerPotions.length >= window.maxPotionSlots) {
            customAlert(`🎒 ポーションスロットが満杯です！（最大${window.maxPotionSlots}個）`);
            return;
        }
        if(player.gold < price) { customAlert("ゴールドが足りません！"); return; }
        
        player.gold -= price;
        window.playerPotions.push(potionType);
        customAlert(`${pName} を購入しました！`);
        
        const rewardTitle = document.getElementById("rewardTitle");
        if(rewardTitle) rewardTitle.innerText = `🌌 闇市（購入制限なし・戻るボタンで退店） | 💰所持: ${player.gold}G`;
        if(typeof updateUI === 'function') updateUI();
        
        div.style.opacity = "0.4";
        div.style.pointerEvents = "none";
    };
    container.appendChild(div);
}

// ─── 通常ショップ ───
function openShopMenu(){
    inBattle = false;
    isShopActive = true;
    shopSelectionCount = 2; 

    const rewardTitle = document.getElementById("rewardTitle");
    if(rewardTitle) rewardTitle.innerText = `ショップ（残り: ${shopSelectionCount}個） | 💰所持: ${player.gold}G`;
    const rewardScreen = document.getElementById("rewardScreen");
    if(rewardScreen) rewardScreen.style.display = "flex";
    const rewardArea = document.getElementById("rewardCards");
    if(!rewardArea) return;
    rewardArea.innerHTML = "";

    const skipBtn = rewardScreen.querySelector("button[onclick*='skip']");
    if(skipBtn) {
        skipBtn.style.display = "block"; 
        skipBtn.onclick = function() {
            isShopActive = false;
            rewardScreen.style.display = "none";
            checkShopDeckOverflowAndLeave();
        };
    }

//ショップの確率
    const shopProbabilities = [
        { type: "uncommon",   chance: 0.40 },
        { type: "rare",     chance: 0.17 },
        { type: "legend",   chance: 0.06 }, 
        { type: "space",   chance: 0.02 },
        { type: "field",    chance: 0.20 },
        { type: "potion",   chance: 0.15 }
    ];

    let displayedFields = [];
    let displayedPotions = [];

//ショップのみセールの確率
    const isSaleActive = Math.random() < 0.20;

//ショップでの商品の数
    for(let i=0; i<6; i++){
        const rand = Math.random();
        let cumulativeChance = 0;
        let selectedType = "common";

        for (const prob of shopProbabilities) {
            cumulativeChance += prob.chance;
            if (rand <= cumulativeChance) {
                selectedType = prob.type;
                break;
            }
        }

        const isThisItemOnSale = (i === 0 && isSaleActive);

        if (selectedType === "potion") {
            const potionTypes = ["heal", "energy", "block", "draw","acid"]
                .concat((window.vesselDrinkCount || 0) < 2 ? ["vessel"] : []);
            let availablePotions = potionTypes.filter(p => !displayedPotions.includes(p));
            if (availablePotions.length === 0) availablePotions = potionTypes;
            
            const pType = availablePotions[Math.floor(Math.random() * availablePotions.length)];
            displayedPotions.push(pType);
            
            createPotionNode(pType, rewardArea, isThisItemOnSale);

        } else if (selectedType === "field") {
            let availableFields = fieldMaster.filter(f => {
                if(f.id === "heavy_burn" && (player.fields.heavy_burn > 0 || displayedFields.includes("heavy_burn"))) return false;
                if(f.id === "draw_up" && (player.fields.draw_up > 0 || displayedFields.includes("draw_up"))) return false;
                if(f.id === "boss_scout" && (player.fields.boss_scout > 0 || displayedFields.includes("boss_scout"))) return false;
                return true;
            });

            if(availableFields.length === 0) {
                createCardNode(randomCard(), rewardArea, isThisItemOnSale);
            } else {
                const selectedField = availableFields[Math.floor(Math.random()*availableFields.length)];
                if(selectedField.id === "heavy_burn" || selectedField.id === "draw_up"||selectedField.id === "boss_scout") {
                    displayedFields.push(selectedField.id);
                }
                createFieldNode(selectedField, rewardArea, isThisItemOnSale);
            }

        } else {
            let card = (typeof randomCard === 'function') ? randomCard(selectedType) : null;
            if(!card && typeof allCardsMaster !== 'undefined') {
                const filtered = allCardsMaster.filter(c => c.rarity === selectedType);
                const fallbackPool = allCardsMaster.filter(c => c.rarity !== "common" && c.rarity !== "none");
                card = filtered.length > 0 ? filtered[Math.floor(Math.random() * filtered.length)] : fallbackPool[Math.floor(Math.random() * fallbackPool.length)];
            }
            createCardNode(card || randomCard(), rewardArea, isThisItemOnSale);
        }
    }
}

// ─── 🌌 闇市（Dark Market）イベント ───
function triggerDarkMarket() {
    inBattle = false;
    isShopActive = true;

    player.darkMarketCount = (player.darkMarketCount || 0) + 1;
    player.maxHp -= 10;
    if (player.maxHp < 1) player.maxHp = 1; 
    if (player.hp > player.maxHp) player.hp = player.maxHp;
    
    if (typeof updateUI === 'function') updateUI(); 
    
    customAlert(`🌌 闇市に足を踏み入れた… 代償として最大HPが-10された！\n(現在HP: ${player.hp} / ${player.maxHp})`);

    const rewardTitle = document.getElementById("rewardTitle");
    if(rewardTitle) rewardTitle.innerText = `🌌 闇市（購入制限なし・戻るボタンで退店） | 💰所持: ${player.gold}G`;
    
    const rewardScreen = document.getElementById("rewardScreen");
    if(rewardScreen) rewardScreen.style.display = "flex";
    
    const rewardArea = document.getElementById("rewardCards");
    if(!rewardArea) return;
    rewardArea.innerHTML = "";

    const skipBtn = rewardScreen.querySelector("button[onclick*='skip']");
    if(skipBtn) {
        skipBtn.style.display = "block";
        skipBtn.innerText = "闇市を去る";
        skipBtn.onclick = function() {
            isShopActive = false;
            rewardScreen.style.display = "none";

            const currentSlot = window.currentSlot || 0;
            const currentDeck = savedDecks[currentSlot];
            let total = 0;
            for (let id in currentDeck) { total += currentDeck[id]; }

            if (total > 30 && typeof checkDeckOverflowAndManage === 'function') {
                checkDeckOverflowAndManage();
            } else {
                if(typeof openMap === 'function') openMap();
            }
        };
    }

//闇市の確率
    const probabilities = [
        { type: "uncommon",   chance: 0.20 },
        { type: "rare",       chance: 0.35 },
        { type: "legend",     chance: 0.15 },
        { type: "space",      chance: 0.05 },
        { type: "field",      chance: 0.15 },
        { type: "potion",     chance: 0.10 }
    ];

    let displayedFields = [];
    let displayedPotions = [];

//セールをしない
    const isSaleActive = false;

//闇市の商品の数
    for (let i = 0; i < 12; i++) {
        const rand = Math.random();
        let cumulativeChance = 0;
        let selectedType = "common";

        for (const prob of probabilities) {
            cumulativeChance += prob.chance;
            if (rand <= cumulativeChance) {
                selectedType = prob.type;
                break;
            }
        }

//セールを無効
        const isThisItemOnSale = false;

        if (selectedType === "potion") {
            const potionTypes = ["heal", "energy", "block", "draw","acid"]
                .concat((window.vesselDrinkCount || 0) < 2 ? ["vessel"] : []);
            let availablePotions = potionTypes.filter(p => !displayedPotions.includes(p));
            if (availablePotions.length === 0) availablePotions = potionTypes;
            
            const pType = availablePotions[Math.floor(Math.random() * availablePotions.length)];
            displayedPotions.push(pType);
            createDarkPotionNode(pType, rewardArea, isThisItemOnSale);
            
        } else if (selectedType === "field") {
            let availableFields = fieldMaster.filter(f => {
                if(f.id === "heavy_burn" && (player.fields.heavy_burn > 0 || displayedFields.includes("heavy_burn"))) return false;
                if(f.id === "draw_up" && (player.fields.draw_up > 0 || displayedFields.includes("draw_up"))) return false;
		if(f.id === "boss_scout" && (player.fields.boss_scout > 0 || displayedFields.includes("boss_scout"))) return false;
		
                return true;
            });
            
            if(availableFields.length === 0) {
                createDarkCardNode(randomCard(), rewardArea, isThisItemOnSale);
            } else {
                const selectedField = availableFields[Math.floor(Math.random() * availableFields.length)];
                if(selectedField.id === "heavy_burn" || selectedField.id === "draw_up"||selectedField.id === "boss_scout") {
                    displayedFields.push(selectedField.id);
                }
                createDarkFieldNode(selectedField, rewardArea, isThisItemOnSale);
            }
            
        } else {
            let card = (typeof randomCard === 'function') ? randomCard(selectedType) : null;
            if(!card && typeof allCardsMaster !== 'undefined') {
                const filtered = allCardsMaster.filter(c => c.rarity === selectedType);
                const fallbackPool = allCardsMaster.filter(c => c.rarity !== "common" && c.rarity !== "none");
                card = filtered.length > 0 ? filtered[Math.floor(Math.random() * filtered.length)] : fallbackPool[Math.floor(Math.random() * fallbackPool.length)];
            }
            if(card) {
                createDarkCardNode(card, rewardArea, isThisItemOnSale);
            }
        }
    }
}

// ─── その他ショップ制御・判定 ───
function processShopClick() {
    if(shopSelectionCount <= 0) {
        isShopActive = false;
        const rewardScreen = document.getElementById("rewardScreen");
        if(rewardScreen) rewardScreen.style.display = "none"; 
        checkShopDeckOverflowAndLeave(); 
    }
}

function checkShopDeckOverflowAndLeave() {
    localStorage.setItem("mini_spire_current_slot", window.currentSlot);
    const currentSlot = window.currentSlot || 0;
    const currentDeck = savedDecks[currentSlot];
    let total = 0;
    for (let id in currentDeck) { total += currentDeck[id]; }

    if (total > 30 && typeof checkDeckOverflowAndManage === 'function') {
        checkDeckOverflowAndManage();	
    } else {
        if(typeof openMap === 'function') openMap();
    }
}