// 1. 素材マスタデータ（選択肢）
// ※ price は「1gあたりの単価（円）」です（比重加味済み）
// ==========================================
// Perfume Formula Generator v2 - main.js
// ==========================================

// 1. 素材マスタデータ（選択肢）の初期値
const defaultMasterIngredients = [
  // --- Top Notes ---
  {
    name: "ベルガモット（FCF）",
    defaultDilution: 100,
    defaultNote: "Top",
    price: 278,
    maxSafeRatio: 0.4, // 溶液全体における限界濃度(%)
    isPhototoxic: true, // 光毒性フラグ
  },
  {
    name: "ブラックペッパー",
    defaultDilution: 100,
    defaultNote: "Top",
    price: 375,
  },
  { name: "マンダリン", defaultDilution: 100, defaultNote: "Top", price: 388 },
  { name: "ライム", defaultDilution: 100, defaultNote: "Top", price: 256 },
  { name: "カルダモン", defaultDilution: 100, defaultNote: "Top", price: 414 },
  // --- Middle Notes ---
  {
    name: "シダーウッド",
    defaultDilution: 100,
    defaultNote: "Middle",
    price: 197,
  },
  {
    name: "サンダルウッド",
    defaultDilution: 100,
    defaultNote: "Middle",
    price: 680,
  },
  {
    name: "フランキンセンス",
    defaultDilution: 100,
    defaultNote: "Middle",
    price: 438,
  },
  {
    name: "ゼラニウム",
    defaultDilution: 100,
    defaultNote: "Middle",
    price: 334,
  },
  {
    name: "ローズ・ダマスク",
    defaultDilution: 100,
    defaultNote: "Middle",
    price: 12791,
    maxSafeRatio: 0.02, // メチルオイゲノール規制に伴う限界濃度(%)
  },
  {
    name: "ジャスミン Abs.",
    defaultDilution: 25,
    defaultNote: "Middle",
    price: 529,
    maxSafeRatio: 0.6, // IFRA上限 0.6%
    carrierSolvent: "DPG",
  },
  { name: "Hedione", defaultDilution: 100, defaultNote: "Middle", price: 50 },
  // --- Base Notes ---
  { name: "パチュリ", defaultDilution: 100, defaultNote: "Base", price: 229 },
  { name: "ベチバー", defaultDilution: 100, defaultNote: "Base", price: 300 },
  {
    name: "ガイアックウッド",
    defaultDilution: 100,
    defaultNote: "Base",
    price: 272,
  },
  {
    name: "アンブレットシード",
    defaultDilution: 100,
    defaultNote: "Base",
    price: 387,
  },
  {
    name: "ベンゾイン Abs.",
    defaultDilution: 25,
    defaultNote: "Base",
    price: 212,
    maxSafeRatio: 1.9,
    carrierSolvent: "DPG",
  },
  {
    name: "Iso E Super",
    defaultDilution: 100,
    defaultNote: "Base",
    price: 48,
    gammaRatio: 8.0,
    isOTNE: true,
    olfactoryFatigue: "High",
  },
  {
    name: "Timbersilk",
    defaultDilution: 100,
    defaultNote: "Base",
    price: 48,
    gammaRatio: 15.0,
    isOTNE: true,
    olfactoryFatigue: "High",
  },
  {
    name: "Sylvamber",
    defaultDilution: 100,
    defaultNote: "Base",
    price: 79,
    gammaRatio: 22.0,
    isOTNE: true,
    olfactoryFatigue: "High",
  },
  {
    name: "Ambroxan",
    defaultDilution: 10,
    defaultNote: "Base",
    price: 440,
    olfactoryFatigue: "High",
    carrierSolvent: "Ethanol",
  },
  {
    name: "Habanolide",
    defaultDilution: 100,
    defaultNote: "Base",
    price: 74,
  },
  {
    name: "Galaxolide",
    defaultDilution: 100,
    defaultNote: "Base",
    price: 66,
  },
  {
    name: "Ambrettolide",
    defaultDilution: 100,
    defaultNote: "Base",
    price: 300,
  },
  {
    name: "Absolute Ambergris",
    defaultDilution: 100,
    defaultNote: "Base",
    price: 480,
  },
  {
    name: "カスタム（手入力）",
    defaultDilution: 100,
    defaultNote: "Middle",
    price: 0,
  },
];

// 初期データ
const defaultFormula = {
  perfumeName: "No.3.0 / ドライ・インセンスウッド",
  createDate: new Date().toISOString().split("T")[0],
  concept:
    "甘さを極限まで排除し、シダー、インセンス、ペッパーがパリッと知的に香る硬質なドライウッド。",
  solventMode: "auto",
  targetConcentration: 12.2,
  addedEthanol: 6.8,
  ingredients: [
    { note: "Top", name: "ベルガモット（FCF）", weight: 0.1, dilution: 100 },
    { note: "Top", name: "ブラックペッパー", weight: 0.04, dilution: 100 },
    { note: "Middle", name: "シダーウッド", weight: 0.15, dilution: 100 },
    { note: "Middle", name: "フランキンセンス", weight: 0.08, dilution: 100 },
    { note: "Base", name: "ガイアックウッド", weight: 0.03, dilution: 100 },
    { note: "Base", name: "Timbersilk", weight: 0.5, dilution: 100 },
    { note: "Base", name: "パチュリ", weight: 0.04, dilution: 100 },
    { note: "Base", name: "アンブレットシード", weight: 0.01, dilution: 100 },
    { note: "Base", name: "Ambroxan", weight: 0.25, dilution: 10 },
  ],
};

// ストレージからマスタを取得、なければ初期値をセット
let masterIngredients = [];
const savedMaster = localStorage.getItem("perfume_master_ingredients");
if (savedMaster) {
  try {
    masterIngredients = JSON.parse(savedMaster);

    // 🧬【自動パッチ】既存のセーブデータに新しいパラメータがない場合、初期マスタから自動補完
    // 🧬【自動パッチ】既存のセーブデータに新しいパラメータがない場合、初期マスタから自動補完
    masterIngredients.forEach((ing) => {
      const defaultIng = defaultMasterIngredients.find(
        (d) => d.name === ing.name,
      );
      if (defaultIng) {
        if (defaultIng.gammaRatio !== undefined)
          ing.gammaRatio = defaultIng.gammaRatio;
        if (defaultIng.maxSafeRatio !== undefined)
          ing.maxSafeRatio = defaultIng.maxSafeRatio;
        if (defaultIng.isPhototoxic !== undefined)
          ing.isPhototoxic = defaultIng.isPhototoxic;
        if (defaultIng.isOTNE !== undefined) ing.isOTNE = defaultIng.isOTNE;

        // 初期マスタに溶媒指定があれば、LocalStorageの記憶を強制的に最新版へ上書き同期
        if (defaultIng.carrierSolvent !== undefined)
          ing.carrierSolvent = defaultIng.carrierSolvent;
      }

      // 揮発速度の自動補完（カスタム香料でもノート分類から自動インテリジェンス割り当て）
      if (ing.evaporationRate === undefined) {
        const currentNote = ing.defaultNote || ing.note;
        if (currentNote === "Top") ing.evaporationRate = 10.0;
        else if (currentNote === "Middle") ing.evaporationRate = 3.0;
        else ing.evaporationRate = 0.5;
      }
      // 嗅覚疲労度の自動補完（Baseノートや未設定の素材にインテリジェンス割り当て）
      if (ing.olfactoryFatigue === undefined) {
        const defaultIng = defaultMasterIngredients.find(
          (d) => d.name === ing.name,
        );
        if (defaultIng && defaultIng.olfactoryFatigue !== undefined) {
          ing.olfactoryFatigue = defaultIng.olfactoryFatigue;
        } else {
          // マスタにないカスタム素材などはノートで自動判定
          const currentNote = ing.defaultNote || ing.note;
          ing.olfactoryFatigue =
            currentNote === "Base"
              ? "High"
              : currentNote === "Middle"
                ? "Medium"
                : "Low";
        }
      }
      if (ing.lots === undefined) ing.lots = []; // ロット格納用の子配列を保証
      // 希釈溶媒（キャリア）の自動補完パッチ
      if (ing.carrierSolvent === undefined) {
        const defaultIng = defaultMasterIngredients.find(
          (d) => d.name === ing.name,
        );
        if (defaultIng && defaultIng.carrierSolvent) {
          ing.carrierSolvent = defaultIng.carrierSolvent;
        } else {
          // マスタにないカスタム素材などは希釈率が100未満ならデフォルトでDPGと判定
          ing.carrierSolvent =
            ing.defaultDilution < 100 || ing.dilution < 100 ? "DPG" : "None";
        }
      }
    });
  } catch (e) {
    masterIngredients = [...defaultMasterIngredients];
  }
} else {
  masterIngredients = [...defaultMasterIngredients];
}

// データ自体を常に「T → M → Base → 名前順」に並び替える関数
function sortMasterIngredients() {
  const noteOrder = { Top: 1, Middle: 2, Base: 3 };
  // 「カスタム」行は常に一番最後に固定したいので確保しておく
  const customRow = masterIngredients.find(
    (ing) => ing.name === "カスタム（手入力）",
  ) || {
    name: "カスタム（手入力）",
    defaultDilution: 100,
    defaultNote: "Middle",
    price: 0,
  };

  // カスタムを除いた香料たちをソート
  let temp = masterIngredients.filter(
    (ing) => ing.name !== "カスタム（手入力）",
  );
  temp.sort((a, b) => {
    // 1. まずノート順（Top -> Middle -> Base）で比較
    if (noteOrder[a.defaultNote] !== noteOrder[b.defaultNote]) {
      return noteOrder[a.defaultNote] - noteOrder[b.defaultNote];
    }
    // 2. 同じノート内なら、名前のあいうえお・アルファベット順で整列
    return a.name.localeCompare(b.name, "ja");
  });

  // 最後にカスタムを末尾にくっつける
  temp.push(customRow);
  masterIngredients = temp;
}

sortMasterIngredients(); // 起動時に綺麗な並び順に整列させる
localStorage.setItem(
  "perfume_master_ingredients",
  JSON.stringify(masterIngredients),
);

let currentFormula = {};

// ページ読み込み時の初期化処理
window.addEventListener("DOMContentLoaded", () => {
  loadData();
  setupEventListeners();
  calculate();
  checkMacerationAlerts(); // 起動時に熟成バナーを自動チェック
});

function loadData() {
  const saved = localStorage.getItem("perfume_v2_data");
  if (saved) {
    try {
      currentFormula = JSON.parse(saved);
    } catch (e) {
      currentFormula = JSON.parse(JSON.stringify(defaultFormula));
    }
  } else {
    currentFormula = JSON.parse(JSON.stringify(defaultFormula));
  }

  document.getElementById("perfumeName").value = currentFormula.perfumeName;
  document.getElementById("createDate").value =
    currentFormula.createDate || new Date().toISOString().split("T")[0];
  document.getElementById("concept").value = currentFormula.concept;
  document.getElementById("solventMode").value = currentFormula.solventMode;
  document.getElementById("targetConcentration").value =
    currentFormula.targetConcentration;
  document.getElementById("addedEthanol").value = currentFormula.addedEthanol;

  toggleSolventModeUI(currentFormula.solventMode);
  renderTable();
}

function saveData() {
  currentFormula.perfumeName = document.getElementById("perfumeName").value;
  currentFormula.createDate = document.getElementById("createDate").value;
  currentFormula.concept = document.getElementById("concept").value;
  currentFormula.solventMode = document.getElementById("solventMode").value;
  currentFormula.targetConcentration =
    parseFloat(document.getElementById("targetConcentration").value) || 0;
  currentFormula.addedEthanol =
    parseFloat(document.getElementById("addedEthanol").value) || 0;

  currentFormula.ingredients = [];
  const rows = document.querySelectorAll("#ingredientsBody tr");
  rows.forEach((row) => {
    const note = row.querySelector(".row-note").value;
    const nameSelect = row.querySelector(".name-select");
    let name = nameSelect.value;
    if (name === "カスタム（手入力）") {
      name = row.querySelector(".custom-name-input").value;
    }
    const weight = parseFloat(row.querySelector(".weight-input").value) || 0;
    const dilution =
      parseFloat(row.querySelector(".dilution-input").value) || 0;

    currentFormula.ingredients.push({ note, name, weight, dilution });
  });

  localStorage.setItem("perfume_v2_data", JSON.stringify(currentFormula));
}

function renderTable() {
  const tbody = document.getElementById("ingredientsBody");
  tbody.innerHTML = "";
  currentFormula.ingredients.forEach((ing, index) => {
    tbody.appendChild(createRowElement(ing, index));
  });
}

function createRowElement(ing, index) {
  const tr = document.createElement("tr");
  tr.dataset.rowIndex = index;

  let noteOptions = "";
  ["Top", "Middle", "Base"].forEach((n) => {
    const selected = ing.note === n ? "selected" : "";
    noteOptions += `<option value="${n}" ${selected}>${n}</option>`;
  });

  let masterOptions = "";
  let isCustom = true;
  masterIngredients.forEach((master) => {
    if (master.name === "カスタム（手入力）") return;

    // 1. デフォルト（ロット指定なし）の選択肢
    const isSelectedDefault = ing.name === master.name;
    if (isSelectedDefault) isCustom = false;
    masterOptions += `<option value="${master.name}" ${isSelectedDefault ? "selected" : ""}>${master.name}</option>`;

    // 2. この香料に紐づくロット・ヴィンテージをすべて選択肢として子展開
    if (master.lots && master.lots.length > 0) {
      master.lots.forEach((lot) => {
        const lotValue = `${master.name}::${lot.lotNumber}`;
        const isSelectedLot = ing.name === lotValue;
        if (isSelectedLot) isCustom = false;
        masterOptions += `<option value="${lotValue}" ${isSelectedLot ? "selected" : ""}>${master.name} [ロット: ${lot.lotNumber} / 熟成:${lot.agingMonths}ヶ月]</option>`;
      });
    }
  });

  masterOptions += `<option value="カスタム（手入力）" ${isCustom ? "selected" : ""}>カスタム（手入力）</option>`;

  tr.innerHTML = `
        <td><select class="row-note" onchange="window.onRowValueChange()">${noteOptions}</select></td>
        <td>
            <div style="display: flex; flex-direction: column; gap: 5px;">
                <select class="name-select" onchange="window.onIngredientSelectChange(this)">${masterOptions}</select>
                <input type="text" class="custom-name-input" value="${isCustom ? ing.name : ""}" placeholder="香料名を入力" style="display: ${isCustom ? "block" : "none"};" oninput="window.onRowValueChange()">
            </div>
        </td>
        <td><input type="number" step="0.001" class="weight-input" value="${ing.weight}" oninput="window.onRowValueChange()"></td>
        <td><input type="number" step="1" class="dilution-input" value="${ing.dilution}" oninput="window.onRowValueChange()"></td>
        <td><span class="dry-weight-span">0.000</span> g</td>
        <td><button type="button" class="btn-delete" onclick="window.deleteRow(this)">削除</button></td>
    `;

  const dry = ing.weight * (ing.dilution / 100);
  tr.querySelector(".dry-weight-span").innerText = dry.toFixed(3);
  return tr;
}

window.onIngredientSelectChange = function (selectElement) {
  const tr = selectElement.closest("tr");
  const selectedValue = selectElement.value;
  const customInput = tr.querySelector(".custom-name-input");

  if (selectedValue === "カスタム（手入力）") {
    customInput.style.display = "block";
    customInput.value = "";
  } else {
    customInput.style.display = "none";
    // ロット識別キー(::)が含まれている場合は、前半の本体名だけを抽出してマスタ検索
    const searchName = selectedValue.includes("::")
      ? selectedValue.split("::")[0]
      : selectedValue;
    const master = masterIngredients.find((m) => m.name === searchName);
    if (master) {
      tr.querySelector(".row-note").value = master.defaultNote;
      tr.querySelector(".dilution-input").value = master.defaultDilution;
    }
  }
  window.onRowValueChange();
};

window.addNewRow = function () {
  currentFormula.ingredients.push({
    note: "Middle",
    name: "カスタム（手入力）",
    weight: 0.0,
    dilution: 100,
  });
  renderTable();
  calculate();
};

window.deleteRow = function (button) {
  const tr = button.closest("tr");
  const index = parseInt(tr.dataset.rowIndex);
  currentFormula.ingredients.splice(index, 1);
  renderTable();
  calculate();
};

function toggleSolventModeUI(mode) {
  document.getElementById("autoModeContainer").style.display =
    mode === "auto" ? "block" : "none";
  document.getElementById("manualModeContainer").style.display =
    mode === "auto" ? "none" : "block";
}

window.onRowValueChange = function () {
  saveData();
  calculate();
};

function calculate() {
  const solventMode = document.getElementById("solventMode").value;
  const targetConc =
    parseFloat(document.getElementById("targetConcentration").value) || 0;
  let manualAddedEthanol =
    parseFloat(document.getElementById("addedEthanol").value) || 0;

  let totalDryWeight = 0;
  let totalDiluentWeight = 0;

  // コスト集計用の箱
  let totalCost = 0;
  const ETHANOL_PRICE_PER_GRAM = 3; // 無水エタノール1gの単価（約3円と仮定）

  // グラフ用：各ノートの純分を個別に集計する箱
  let topTotal = 0;
  let middleTotal = 0;
  let baseTotal = 0;

  // ガンマ体シミュレーター用の集計箱
  let totalWoodyDryWeight = 0; // ガンマ体を持つウッディ素材のドライ総重量
  let totalGammaScore = 0; // ガンマ体スコアの蓄積
  let totalOilSolventWeight = 0; // DPG/IPMオイル溶媒の合計重量を溜める箱

  const rows = document.querySelectorAll("#ingredientsBody tr");
  const updatedIngredients = [];

  rows.forEach((row) => {
    const note = row.querySelector(".row-note").value;
    const nameSelect = row.querySelector(".name-select");
    let name = nameSelect.value;
    if (name === "カスタム（手入力）") {
      name = row.querySelector(".custom-name-input").value || "未命名";
    }
    const weight = parseFloat(row.querySelector(".weight-input").value) || 0;
    const dilution =
      parseFloat(row.querySelector(".dilution-input").value) || 0;

    const dryWeight = weight * (dilution / 100);
    const diluentWeight = weight - dryWeight;

    // ロット識別キーを分離し、マスタデータとロット固有データを個別に抽出
    let searchName = name;
    let lotInfo = null;
    if (name.includes("::")) {
      const parts = name.split("::");
      searchName = parts[0];
      const lotNum = parts[1];
      const master = masterIngredients.find((m) => m.name === searchName);
      if (master && master.lots) {
        lotInfo = master.lots.find((l) => l.lotNumber === lotNum);
      }
    }

    // 安全にマスタ情報を取得
    const masterInfo = masterIngredients.find((m) => m.name === searchName);

    // ⭕【修正：ここへ移動】masterInfoとdiluentWeightが確定した後に正しく溶媒を集計
    const carrierSolvent = masterInfo
      ? masterInfo.carrierSolvent || "None"
      : "None";
    if (carrierSolvent === "DPG" || carrierSolvent === "IPM") {
      totalOilSolventWeight += diluentWeight;
    }

    // ロット固有の単価があればそれを採用、なければ通常のデフォルト単価を採用
    let unitPrice = masterInfo ? masterInfo.price : 0;
    if (lotInfo && lotInfo.price !== undefined) {
      unitPrice = lotInfo.price;
    }

    const gammaRatio =
      masterInfo && masterInfo.gammaRatio ? masterInfo.gammaRatio : 0;

    totalCost += dryWeight * unitPrice; // 実質香料（ドライ）重量 × 1g単価

    // ウッディケミカル（ガンマ体を持つ素材）が処方に含まれていれば足し算
    if (gammaRatio > 0) {
      totalWoodyDryWeight += dryWeight;
      totalGammaScore += dryWeight * gammaRatio;
    }

    row.querySelector(".dry-weight-span").innerText = dryWeight.toFixed(3);

    totalDryWeight += dryWeight;
    totalDiluentWeight += diluentWeight;

    // グラフ用：ノートに合わせて個別の箱に足し算
    if (note === "Top") topTotal += dryWeight;
    else if (note === "Middle") middleTotal += dryWeight;
    else if (note === "Base") baseTotal += dryWeight;

    updatedIngredients.push({
      note,
      name,
      wetWeight: weight,
      dilution,
      dryWeight,
    });
  });

  let addedEthanolOutput = 0;
  let finalConcentration = 0;
  const warningBox = document.getElementById("warningBox");
  warningBox.style.display = "none";

  if (solventMode === "auto") {
    if (targetConc > 0 && totalDryWeight > 0) {
      const calculatedAdded =
        totalDryWeight * (100 / targetConc - 1) - totalDiluentWeight;
      if (calculatedAdded >= 0) {
        addedEthanolOutput = calculatedAdded;
        finalConcentration = targetConc;
      } else {
        addedEthanolOutput = 0;
        const maxPossibleConc =
          (totalDryWeight / (totalDryWeight + totalDiluentWeight)) * 100;
        finalConcentration = maxPossibleConc;
        warningBox.innerText = `⚠️ 再現不可能な賦香率です！\n現在の配合での「最大賦香率」は ${maxPossibleConc.toFixed(1)}% です。`;
        warningBox.style.display = "block";
      }
    }
  } else {
    addedEthanolOutput = manualAddedEthanol;
    const totalWeight =
      totalDryWeight + totalDiluentWeight + manualAddedEthanol;
    finalConcentration =
      totalWeight > 0 ? (totalDryWeight / totalWeight) * 100 : 0;
  }

  const totalEthanol = addedEthanolOutput + totalDiluentWeight;
  const finalTotalWeight = totalDryWeight + totalEthanol;

  document.getElementById("resAddedEthanol").innerText =
    addedEthanolOutput.toFixed(2);
  document.getElementById("resTotalEthanol").innerText =
    totalEthanol.toFixed(2);
  document.getElementById("resTotalDry").innerText = totalDryWeight.toFixed(4);
  document.getElementById("resTotalWeight").innerText =
    finalTotalWeight.toFixed(2);

  // エタノールの原価を足して、四捨五入して画面に表示
  totalCost += addedEthanolOutput * ETHANOL_PRICE_PER_GRAM;
  document.getElementById("resTotalCost").innerText =
    Math.round(totalCost).toLocaleString();

  document.getElementById("resConcentration").innerText =
    finalConcentration.toFixed(1);

  // IFRAアレルゲン＆光毒性セーフティ・チェック
  let ifraWarnings = [];
  let totalOTNEWetWeight = 0;

  updatedIngredients.forEach((ing) => {
    const searchName = ing.name.includes("::")
      ? ing.name.split("::")[0]
      : ing.name;
    const masterInfo = masterIngredients.find((m) => m.name === searchName);

    if (masterInfo) {
      if (masterInfo.isOTNE) {
        totalOTNEWetWeight += ing.wetWeight;
      }

      if (masterInfo.maxSafeRatio !== undefined) {
        const actualRatioInSolution =
          finalTotalWeight > 0 ? (ing.wetWeight / finalTotalWeight) * 100 : 0;

        if (actualRatioInSolution > masterInfo.maxSafeRatio) {
          let msg = `⚠️ <strong>IFRA基準超越</strong>: 【${searchName}】の製品内濃度（${actualRatioInSolution.toFixed(2)}%）が安全限界値（${masterInfo.maxSafeRatio}%）超え。`;
          if (masterInfo.isPhototoxic) {
            msg += ` 光毒性のリスクがあります。`;
          } else {
            msg += ` 感作性（アレルギー）のリスクがあります。`;
          }
          ifraWarnings.push(msg);
        }
      }
    }
  });

  const actualOTNERatio =
    finalTotalWeight > 0 ? (totalOTNEWetWeight / finalTotalWeight) * 100 : 0;
  if (actualOTNERatio > 20.0) {
    ifraWarnings.push(
      `⚠️ <strong>IFRA基準超越</strong>: 【OTNE系】の合計濃度（${actualOTNERatio.toFixed(2)}%）が安全限界値（20.0%）を超えています。`,
    );
  }

  // 🧪【新機能】総DPG/IPM量による物理品質・目詰まり警告
  const actualOilRatio =
    finalTotalWeight > 0 ? (totalOilSolventWeight / finalTotalWeight) * 100 : 0;
  if (actualOilRatio > 10.0) {
    ifraWarnings.push(
      `⚠️ <strong>物理品質警告</strong>: 非揮発性溶媒（DPG/IPMオイル）の製品内総濃度（${actualOilRatio.toFixed(1)}%）が安全圏である<strong>10.0%</strong>を超えています。スプレーノズルの物理的な目詰まりリスクや、トップノートの鮮やかな立ち上がりが重くブロックされる恐れがあります。`,
    );
  }

  // 警告ボックスへの表示反映
  const ifraBox = document.getElementById("ifraWarningBox");
  if (ifraBox) {
    if (ifraWarnings.length > 0) {
      ifraBox.innerHTML = ifraWarnings
        .map(
          (w) => `<div style="margin-bottom: 6px; font-size: 13px;">${w}</div>`,
        )
        .join("");
      ifraBox.style.display = "block";
    } else {
      ifraBox.style.display = "none";
    }
  }

  // 平均ガンマ体濃度の算出と描画
  const avgGammaRatio =
    totalWoodyDryWeight > 0 ? totalGammaScore / totalWoodyDryWeight : 0;

  const gammaRatioEl = document.getElementById("resGammaRatio");
  const gammaStatusEl = document.getElementById("resGammaStatus");

  if (gammaRatioEl && gammaStatusEl) {
    gammaRatioEl.innerText = avgGammaRatio.toFixed(1);

    if (totalWoodyDryWeight === 0) {
      gammaStatusEl.innerText = "-- ウッディケミカル未検出 --";
    } else if (avgGammaRatio >= 20.0) {
      gammaStatusEl.innerText =
        "✨ 超ハイパー・モレキュール領域！ (Molecule 01 超え)";
    } else if (avgGammaRatio >= 15.0) {
      gammaStatusEl.innerText = "🔥 本家同等：比類なきウッディの拡散性";
    } else if (avgGammaRatio >= 10.0) {
      gammaStatusEl.innerText = "🧪 標準的なイソEスーパー・コンプレックス";
    } else {
      gammaStatusEl.innerText = "🌱 マイルドなウッディ残香レイヤー";
    }
  }

  generateSheetText(
    updatedIngredients,
    addedEthanolOutput,
    totalEthanol,
    finalConcentration,
    finalTotalWeight,
  );

  if (typeof window.updatePyramidChart === "function") {
    window.updatePyramidChart(topTotal, middleTotal, baseTotal);
  }

  if (typeof window.updateDrydownChart === "function") {
    window.updateDrydownChart(updatedIngredients);
  }
}

function generateSheetText(
  ingredients,
  addedEthanol,
  totalEthanol,
  concentration,
  totalWeight,
) {
  const perfumeName = document.getElementById("perfumeName").value;
  const createDate = document.getElementById("createDate").value;
  const concept = document.getElementById("concept").value;

  let text = `【 No. / 試作名 】  ${perfumeName}\n【 作成日 】  ${createDate}\n\n【 コンセプト・目標 】\n${concept}\n\n`;
  text += `【 ベース・賦香率 】\n追加無水エタノール： ${addedEthanol.toFixed(2)}g\n実質エタノール総量： ${totalEthanol.toFixed(2)}g\n実質賦香率（濃度）： 約 ${concentration.toFixed(1)} ％\n完成総重量： ${totalWeight.toFixed(2)}g\n\n【 フォーミュラ（処方） 】\n`;

  ["Top", "Middle", "Base"].forEach((noteKey) => {
    const filtered = ingredients.filter((ing) => ing.note === noteKey);
    if (filtered.length > 0) {
      text += `[ ${noteKey} ]\n`;
      filtered.forEach((ing) => {
        const dilutionStr =
          ing.dilution < 100 ? ` (${ing.dilution}%溶液)` : ` (原液)`;

        // 暗号（::）が含まれている場合は、「香料名 (ロット: ロット番号)」の綺麗な形式に整形
        const displayName = ing.name.includes("::")
          ? `${ing.name.split("::")[0]} (ロット: ${ing.name.split("::")[1]})`
          : ing.name;

        text += `  - ${displayName}${dilutionStr}： ${ing.wetWeight.toFixed(3)}g\n`;
      });
    }
  });
  document.getElementById("outputSheet").value = text;
}

window.copyToClipboard = function () {
  const textarea = document.getElementById("outputSheet");
  textarea.select();
  document.execCommand("copy");
  alert("コピーしました！");
};

function setupEventListeners() {
  document.getElementById("solventMode").addEventListener("change", (e) => {
    toggleSolventModeUI(e.target.value);
    window.onRowValueChange();
  });
  document
    .getElementById("addedEthanol")
    .addEventListener("input", window.onRowValueChange);
  document
    .getElementById("targetConcentration")
    .addEventListener("input", window.onRowValueChange);
  document
    .getElementById("perfumeName")
    .addEventListener("input", window.onRowValueChange);
  document
    .getElementById("createDate")
    .addEventListener("change", window.onRowValueChange);
  document
    .getElementById("concept")
    .addEventListener("input", window.onRowValueChange);
}

// ==========================================
// 🖨️ PDF生成 ＆ ラボシート自動発行ロジック（パーセンテージ印字・文字拡大・確実版）
// ==========================================
window.generatePDF = function () {
  const pdfArea = document.getElementById("pdf-render-area");
  if (!pdfArea) return;

  // 1. 基本情報の同期
  document.getElementById("pdfPerfumeName").innerText =
    document.getElementById("perfumeName").value || "名称未設定";
  document.getElementById("pdfCreateDate").innerText =
    document.getElementById("createDate").value || "-";
  document.getElementById("pdfTargetConcentration").innerText =
    document.getElementById("targetConcentration").value + "%";
  document.getElementById("pdfConcept").innerText =
    document.getElementById("concept").value || "無し";

  const screenCost = document.getElementById("resTotalCost").innerText;
  document.getElementById("pdfTotalCost").innerText = screenCost + " 円";

  // 2. 処方テーブルの同期 ＆ ノートごとの重量計算
  const pdfBody = document.getElementById("pdfFormulaBody");
  pdfBody.innerHTML = "";

  let topTotal = 0,
    middleTotal = 0,
    baseTotal = 0;

  currentFormula.ingredients.forEach((ing) => {
    const tr = document.createElement("tr");
    const totalDry = currentFormula.ingredients.reduce(
      (sum, item) => sum + item.weight * (item.dilution / 100),
      0,
    );
    const myDry = ing.weight * (ing.dilution / 100);
    const pureRatio =
      totalDry > 0 ? ((myDry / totalDry) * 100).toFixed(2) : "0.00";

    if (ing.note === "Top") topTotal += myDry;
    else if (ing.note === "Middle") middleTotal += myDry;
    else if (ing.note === "Base") baseTotal += myDry;

    // PDF出力時も暗号（::）を綺麗な名前に分解して整形
    const displayName = ing.name.includes("::")
      ? `${ing.name.split("::")[0]} (ロット: ${ing.name.split("::")[1]})`
      : ing.name;

    tr.innerHTML = `
      <td class="center">${ing.dilution === 100 ? "原液" : "希釈 " + ing.dilution + "%"}</td>
      <td style="font-weight: bold;">${displayName}</td>
      <td class="num">${pureRatio}%</td>
      <td class="num">${ing.weight.toFixed(3)}g</td>
      <td class="num">${myDry.toFixed(4)}g</td>
    `;
    pdfBody.appendChild(tr);
  });

  // グラフ横のテキストエリアに数値を流し込む
  const allDry = topTotal + middleTotal + baseTotal;
  document.getElementById("pdfTopRatio").innerText =
    allDry > 0 ? ((topTotal / allDry) * 100).toFixed(1) + "%" : "0.0%";
  document.getElementById("pdfMiddleRatio").innerText =
    allDry > 0 ? ((middleTotal / allDry) * 100).toFixed(1) + "%" : "0.0%";
  document.getElementById("pdfBaseRatio").innerText =
    allDry > 0 ? ((baseTotal / allDry) * 100).toFixed(1) + "%" : "0.0%";

  document.getElementById("pdfTopWeight").innerText = topTotal.toFixed(3) + "g";
  document.getElementById("pdfMiddleWeight").innerText =
    middleTotal.toFixed(3) + "g";
  document.getElementById("pdfBaseWeight").innerText =
    baseTotal.toFixed(3) + "g";

  const addedEthanolOutput =
    parseFloat(document.getElementById("resAddedEthanol").innerText) || 0;
  const finalTotalWeight =
    parseFloat(document.getElementById("resTotalWeight").innerText) || 0;
  const finalConcentration =
    parseFloat(document.getElementById("resConcentration").innerText) || 0;

  const trEthanol = document.createElement("tr");
  trEthanol.innerHTML = `
    <td class="center">原液</td>
    <td>無水エタノール</td>
    <td class="num">-</td>
    <td class="num">${addedEthanolOutput.toFixed(3)}g</td>
    <td class="num">-</td>
  `;
  pdfBody.appendChild(trEthanol);

  const trTotal = document.createElement("tr");
  trTotal.className = "total-row";
  trTotal.innerHTML = `
    <td colspan="2" class="center">[総重量 / 最終着地]</td>
    <td class="center" style="font-size:9pt;">実質賦香率: ${finalConcentration}%</td>
    <td class="num">${finalTotalWeight.toFixed(3)}g</td>
    <td class="num">-</td>
  `;
  pdfBody.appendChild(trTotal);

  // 3. グラフの画像化
  const mainChartCanvas = document.getElementById("pyramidChart");
  const pdfGraphImg = document.getElementById("pdfGraphImage");
  if (mainChartCanvas && pdfGraphImg) {
    pdfGraphImg.src = mainChartCanvas.toDataURL("image/png");
  }

  // 4. 熟成ログの自動流し込み
  const pdfMacArea = document.getElementById("pdfMacerationLogArea");
  pdfMacArea.innerHTML = "";

  const currentName =
    document.getElementById("perfumeName").value || "名称未設定";
  const savedLogs = localStorage.getItem("perfume_maceration_logs");
  let logs = [];
  if (savedLogs) {
    try {
      logs = JSON.parse(savedLogs);
    } catch (e) {
      logs = [];
    }
  }

  const targetLogs = logs
    .filter((log) => log.recipeName === currentName)
    .reverse();

  if (targetLogs.length === 0) {
    pdfMacArea.innerHTML = `
      <div style="font-size: 9.5pt; color: #666; margin-bottom: 15px;">※「📓 熟成・評価ノート」タブでこの作品に対して記録した評価が、ここに自動で印字されます。</div>
      <div class="maceration-item"><div class="maceration-header">[Day 0 (調香直後)]</div></div>
      <div class="maceration-item"><div class="maceration-header">[Day 7 (1週間後)]</div></div>
      <div class="maceration-item"><div class="maceration-header">[Day 30 (1ヶ月後・完成)]</div></div>
    `;
  } else {
    targetLogs.forEach((log) => {
      const logDate = new Date(log.timestamp).toLocaleDateString("ja-JP");
      const div = document.createElement("div");
      div.setAttribute(
        "style",
        "margin-bottom: 15px; border-bottom: 1px dashed #ccc; padding-bottom: 10px;",
      );
      div.innerHTML = `
        <div style="font-weight: bold; font-size: 11pt; color: #111;">
          ■ ${log.days} <span style="font-size: 9pt; color: #555; font-weight: normal; margin-left: 10px;">(記録日: ${logDate})</span>
        </div>
        <div style="font-size: 13pt; color: #000; margin-top: 8px; white-space: pre-wrap; padding-left: 15px; line-height: 1.8;">${log.memo}</div>
      `;
      pdfMacArea.appendChild(div);
    });
  }

  // 5. 🚀 原点スキャン方式
  pdfArea.style.display = "block";

  const currentScrollY = window.scrollY;
  window.scrollTo(0, 0);

  const printTarget = pdfArea.querySelector(".pdf-template");

  const opt = {
    margin: [10, 10, 10, 10],
    filename: `Laboratory_Sheet_${currentName}.pdf`,
    image: { type: "jpeg", quality: 1.0 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  setTimeout(() => {
    html2pdf()
      .set(opt)
      .from(printTarget)
      .save()
      .then(() => {
        pdfArea.style.display = "none";
        window.scrollTo(0, currentScrollY);
      })
      .catch((err) => {
        pdfArea.style.display = "none";
        window.scrollTo(0, currentScrollY);
        alert("PDFの生成中にエラーが発生しました。");
      });
  }, 300);
};

// ==========================================
// 🌟 新機能：⚖️ ワンクリック・スケールアップ
// ==========================================
window.scaleUpFormula = function () {
  const currentTotalStr = document.getElementById("resTotalWeight").innerText;
  const currentTotal = parseFloat(currentTotalStr);
  const targetTotal = parseFloat(
    document.getElementById("targetScaleWeight").value,
  );

  if (isNaN(targetTotal) || targetTotal <= 0) {
    alert("目標の重量を正しく入力してください。");
    return;
  }
  if (currentTotal <= 0) {
    alert("現在の総重量が0のため、スケールアップできません。");
    return;
  }

  const ratio = targetTotal / currentTotal;

  const rows = document.querySelectorAll("#ingredientsBody tr");
  rows.forEach((row) => {
    const weightInput = row.querySelector(".weight-input");
    const currentWeight = parseFloat(weightInput.value) || 0;
    weightInput.value = (currentWeight * ratio).toFixed(3);
  });

  const solventMode = document.getElementById("solventMode").value;
  if (solventMode === "manual") {
    const ethanolInput = document.getElementById("addedEthanol");
    const currentEthanol = parseFloat(ethanolInput.value) || 0;
    ethanolInput.value = (currentEthanol * ratio).toFixed(2);
  }

  window.onRowValueChange();
  alert(`✅ 総重量を ${targetTotal.toFixed(1)}g にスケールアップしました！`);
};

// ==========================================
// 🌟 新機能：📊 香りのピラミッド可視化
// ==========================================
let pyramidChart = null;

window.updatePyramidChart = function (topWeight, middleWeight, baseWeight) {
  const ctx = document.getElementById("pyramidChart");
  if (!ctx) return;

  const total = topWeight + middleWeight + baseWeight;
  const dataValues =
    total === 0 ? [1, 1, 1] : [topWeight, middleWeight, baseWeight];
  const bgColors =
    total === 0
      ? ["#333333", "#333333", "#333333"]
      : ["#4bc0c0", "#ffce56", "#ff6384"];

  let displayPercentages = ["0.0", "0.0", "0.0"];
  if (total > 0) {
    let exact = dataValues.map((v) => (v / total) * 1000);
    let floored = exact.map((v) => Math.floor(v));
    let remainders = exact.map((v, i) => ({ val: v - floored[i], index: i }));

    let currentTotal = floored.reduce((a, b) => a + b, 0);
    let diff = 1000 - currentTotal;

    remainders.sort((a, b) => b.val - a.val);
    for (let i = 0; i < diff; i++) {
      floored[remainders[i].index]++;
    }
    displayPercentages = floored.map((v) => (v / 10).toFixed(1));
  }

  if (pyramidChart) {
    pyramidChart.data.datasets[0].data = dataValues;
    pyramidChart.data.datasets[0].backgroundColor = bgColors;
    pyramidChart.data.datasets[0].customPercentages = displayPercentages;
    pyramidChart.data.datasets[0].isEmpty = total === 0;
    pyramidChart.update();
  } else {
    pyramidChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Top", "Middle", "Base"],
        datasets: [
          {
            data: dataValues,
            backgroundColor: bgColors,
            borderWidth: 0,
            customPercentages: displayPercentages,
            isEmpty: total === 0,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
            labels: { color: "#e0e0e0" },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const dataset = context.dataset;
                if (dataset.isEmpty) return " データなし";
                const label = context.label || "";
                const val = context.raw;
                const percentage =
                  dataset.customPercentages[context.dataIndex] + "%";
                return `${label}: ${val.toFixed(3)}g (${percentage})`;
              },
            },
          },
        },
      },
    });
  }
};

// ==========================================
// 🌟 新機能：📊 バーチャル・ドライダウン（経時揮発グラフ）
// ==========================================
let drydownChart = null;

window.updateDrydownChart = function (ingredientsData) {
  const ctx = document.getElementById("drydownChart");
  if (!ctx) return;

  const timePoints = [0, 1, 3, 6];
  let topTimeline = [];
  let middleTimeline = [];
  let baseTimeline = [];

  timePoints.forEach((t) => {
    let tTotal = 0,
      mTotal = 0,
      bTotal = 0;

    ingredientsData.forEach((ing) => {
      const masterInfo = masterIngredients.find((m) => m.name === ing.name);
      let rate = 0.5;
      if (masterInfo && masterInfo.evaporationRate !== undefined) {
        rate = masterInfo.evaporationRate;
      } else {
        rate = ing.note === "Top" ? 10.0 : ing.note === "Middle" ? 3.0 : 0.5;
      }

      const k = rate * 0.1;
      const remainingWeight = ing.dryWeight * Math.exp(-k * t);

      if (ing.note === "Top") tTotal += remainingWeight;
      else if (ing.note === "Middle") mTotal += remainingWeight;
      else if (ing.note === "Base") bTotal += remainingWeight;
    });

    const sum = tTotal + mTotal + bTotal;
    if (sum > 0) {
      topTimeline.push(((tTotal / sum) * 100).toFixed(1));
      middleTimeline.push(((mTotal / sum) * 100).toFixed(1));
      baseTimeline.push(((bTotal / sum) * 100).toFixed(1));
    } else {
      topTimeline.push(0);
      middleTimeline.push(0);
      baseTimeline.push(0);
    }
  });

  if (drydownChart) {
    drydownChart.data.datasets[0].data = topTimeline;
    drydownChart.data.datasets[1].data = middleTimeline;
    drydownChart.data.datasets[2].data = baseTimeline;
    drydownChart.update();
  } else {
    drydownChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["0時間後 (塗布)", "1時間後", "3時間後", "6時間後"],
        datasets: [
          {
            label: "Top",
            data: topTimeline,
            borderColor: "#4bc0c0",
            backgroundColor: "rgba(75, 192, 192, 0.1)",
            tension: 0.3,
            fill: false,
          },
          {
            label: "Middle",
            data: middleTimeline,
            borderColor: "#ffce56",
            backgroundColor: "rgba(255, 206, 86, 0.1)",
            tension: 0.3,
            fill: false,
          },
          {
            label: "Base",
            data: baseTimeline,
            borderColor: "#ff6384",
            backgroundColor: "rgba(255, 99, 132, 0.1)",
            tension: 0.3,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            min: 0,
            max: 100,
            title: { display: true, text: "残香比率 (%)", color: "#818b9d" },
            ticks: { color: "#818b9d" },
            grid: { color: "#2c313a" },
          },
          x: { ticks: { color: "#818b9d" }, grid: { color: "#2c313a" } },
        },
        plugins: {
          legend: { labels: { color: "#d8dee9" } },
        },
      },
    });
  }
};

// ==========================================
// 🌟 新機能：📂 過去レシピの管理ロジック
// ==========================================
window.saveCurrentRecipe = function () {
  const perfumeName =
    document.getElementById("perfumeName").value || "名称未設定";
  const createDate = document.getElementById("createDate").value || "no-date";
  const safeName = perfumeName.replace(/[\/\\?%*:|"<>]/g, "_");
  const uniqueKey = `recipe_archive_${safeName}_${Date.now()}`;

  localStorage.setItem(uniqueKey, JSON.stringify(currentFormula));

  const indexSaved = localStorage.getItem("perfume_recipe_index");
  let recipeList = [];
  if (indexSaved) {
    try {
      recipeList = JSON.parse(indexSaved);
    } catch (e) {
      recipeList = [];
    }
  }

  recipeList.unshift(uniqueKey);
  localStorage.setItem("perfume_recipe_index", JSON.stringify(recipeList));

  updateRecipeSelectDropdown();
  document.getElementById("recipeLoadSelect").value = uniqueKey;

  alert(`💾 「${perfumeName}」を履歴に保存しました！`);
};

function updateRecipeSelectDropdown() {
  const select = document.getElementById("recipeLoadSelect");
  if (!select) return;

  const currentSelection = select.value;
  const indexSaved = localStorage.getItem("perfume_recipe_index");
  let recipeList = [];
  if (indexSaved) {
    try {
      recipeList = JSON.parse(indexSaved);
    } catch (e) {
      recipeList = [];
    }
  }

  const favSaved = localStorage.getItem("perfume_recipe_favorites");
  let favList = [];
  if (favSaved) {
    try {
      favList = JSON.parse(favSaved);
    } catch (e) {
      favList = [];
    }
  }

  select.innerHTML = "";

  if (recipeList.length === 0) {
    select.innerHTML =
      '<option value="">-- 保存された履歴がありません --</option>';
    return;
  }

  recipeList.sort((a, b) => {
    const aFav = favList.includes(a);
    const bFav = favList.includes(b);
    if (aFav && !bFav) return -1;
    if (!aFav && bFav) return 1;
    return 0;
  });

  recipeList.forEach((key) => {
    const rawData = localStorage.getItem(key);
    if (rawData) {
      try {
        const formula = JSON.parse(rawData);
        const option = document.createElement("option");
        option.value = key;
        const isFav = favList.includes(key);
        const favMark = isFav ? "⭐ " : "";
        option.innerText = `${favMark}${formula.perfumeName || "名称未設定"} (${formula.createDate || "-"})`;
        select.appendChild(option);
      } catch (e) {}
    }
  });

  if (currentSelection && recipeList.includes(currentSelection)) {
    select.value = currentSelection;
  }
}

window.loadSelectedRecipe = function () {
  const select = document.getElementById("recipeLoadSelect");
  const selectedKey = select.value;

  if (!selectedKey) {
    alert("復元するレシピを選択してください。");
    return;
  }

  const rawData = localStorage.getItem(selectedKey);
  if (!rawData) return;

  if (confirm("現在の入力内容が上書きされますが、よろしいですか？")) {
    try {
      currentFormula = JSON.parse(rawData);

      document.getElementById("perfumeName").value =
        currentFormula.perfumeName || "";
      document.getElementById("createDate").value =
        currentFormula.createDate || "";
      document.getElementById("concept").value = currentFormula.concept || "";
      document.getElementById("solventMode").value =
        currentFormula.solventMode || "auto";
      document.getElementById("targetConcentration").value =
        currentFormula.targetConcentration || 0;
      document.getElementById("addedEthanol").value =
        currentFormula.addedEthanol || 0;

      toggleSolventModeUI(currentFormula.solventMode);
      renderTable();
      calculate();

      localStorage.setItem("perfume_v2_data", rawData);
      alert("📂 レシピを画面に復元しました！");
    } catch (e) {
      alert("レシピの復元に失敗しました。");
    }
  }
};

window.toggleFavoriteRecipe = function () {
  const select = document.getElementById("recipeLoadSelect");
  const selectedKey = select.value;
  if (!selectedKey) {
    alert("レシピを選択してください。");
    return;
  }

  const favSaved = localStorage.getItem("perfume_recipe_favorites");
  let favList = [];
  if (favSaved) {
    try {
      favList = JSON.parse(favSaved);
    } catch (e) {
      favList = [];
    }
  }

  if (favList.includes(selectedKey)) {
    favList = favList.filter((k) => k !== selectedKey);
  } else {
    favList.push(selectedKey);
  }

  localStorage.setItem("perfume_recipe_favorites", JSON.stringify(favList));
  updateRecipeSelectDropdown();
};

window.deleteSelectedRecipe = function () {
  const select = document.getElementById("recipeLoadSelect");
  const selectedKey = select.value;
  if (!selectedKey) {
    alert("削除するレシピを選択してください。");
    return;
  }

  if (confirm("本当にこのレシピを削除しますか？（※復元できません）")) {
    const indexSaved = localStorage.getItem("perfume_recipe_index");
    let recipeList = [];
    if (indexSaved) {
      try {
        recipeList = JSON.parse(indexSaved);
      } catch (e) {
        recipeList = [];
      }
    }
    recipeList = recipeList.filter((k) => k !== selectedKey);
    localStorage.setItem("perfume_recipe_index", JSON.stringify(recipeList));

    const favSaved = localStorage.getItem("perfume_recipe_favorites");
    let favList = [];
    if (favSaved) {
      try {
        favList = JSON.parse(favSaved);
      } catch (e) {
        favList = [];
      }
    }
    favList = favList.filter((k) => k !== selectedKey);
    localStorage.setItem("perfume_recipe_favorites", JSON.stringify(favList));

    localStorage.removeItem(selectedKey);
    updateRecipeSelectDropdown();
    alert("🗑️ レシピを削除しました。");
  }
};

window.cloneSelectedRecipe = function () {
  const select = document.getElementById("recipeLoadSelect");
  const selectedKey = select.value;

  if (!selectedKey) {
    alert("派生元のレシピを選択してください。");
    return;
  }

  const rawData = localStorage.getItem(selectedKey);
  if (!rawData) return;

  try {
    const parentFormula = JSON.parse(rawData);
    let originalName = parentFormula.perfumeName || "No.1.0 / 新規処方";
    let newName = originalName;

    const match = originalName.match(/No\.(\d+)\.(\d+)/);
    if (match) {
      const major = match[1];
      const minor = parseInt(match[2], 10) + 1;
      newName = originalName.replace(/No\.\d+\.\d+/, `No.${major}.${minor}`);
    } else {
      newName = originalName + " _rev2";
    }

    currentFormula = JSON.parse(rawData);
    currentFormula.perfumeName = newName;
    currentFormula.createDate = new Date().toISOString().split("T")[0];
    currentFormula.parentRecipeKey = selectedKey;

    document.getElementById("perfumeName").value = currentFormula.perfumeName;
    document.getElementById("createDate").value = currentFormula.createDate;
    document.getElementById("concept").value = currentFormula.concept || "";
    document.getElementById("solventMode").value =
      currentFormula.solventMode || "auto";
    document.getElementById("targetConcentration").value =
      currentFormula.targetConcentration || 0;
    document.getElementById("addedEthanol").value =
      currentFormula.addedEthanol || 0;

    toggleSolventModeUI(currentFormula.solventMode);
    renderTable();
    calculate();

    localStorage.setItem("perfume_v2_data", JSON.stringify(currentFormula));
    alert(
      `🧬 系譜を繋ぎました！\n「${originalName}」の内容を引き継ぎ、新しく「${newName}」を起ち上げました。`,
    );
  } catch (e) {
    alert("レシピの派生処理に失敗しました。");
  }
};

window.addEventListener("DOMContentLoaded", () => {
  setTimeout(updateRecipeSelectDropdown, 100);
});

// ==========================================
// 🌐 タブ画面切り替えロジック
// ==========================================
window.switchTab = function (tabId) {
  const contents = document.querySelectorAll(".tab-content");
  contents.forEach((content) => content.classList.remove("active"));

  const buttons = document.querySelectorAll(".nav-btn");
  buttons.forEach((btn) => btn.classList.remove("active"));

  const targetContent = document.getElementById(tabId);
  if (targetContent) targetContent.classList.add("active");

  const clickedBtn = Array.from(buttons).find((btn) =>
    btn.getAttribute("onclick").includes(tabId),
  );
  if (clickedBtn) clickedBtn.classList.add("active");
};

// ==========================================
// 📦 在庫マスタ管理ロジック
// ==========================================
// 在庫一覧テーブルを描画する関数 (ロットヴィンテージ対応版)
function renderInventoryTable() {
  const tbody = document.getElementById("inventoryBody");
  const lotSelect = document.getElementById("lotTargetIngredient");
  if (!tbody) return;

  tbody.innerHTML = "";
  if (lotSelect)
    lotSelect.innerHTML = '<option value="">-- 対象香料を選択 --</option>';

  masterIngredients.forEach((ing, index) => {
    if (ing.name === "カスタム（手入力）") return;

    // ロット追加フォーム用の選択肢を動的注入
    if (lotSelect) {
      const opt = document.createElement("option");
      opt.value = ing.name;
      opt.innerText = ing.name;
      lotSelect.appendChild(opt);
    }

    // 紐づいているロットたちをネオンテキストのリストとして組み立てる
    let lotListHtml = "";
    if (ing.lots && ing.lots.length > 0) {
      lotListHtml = `<div style="font-size: 11px; color: #a0a0a0; margin-top: 6px; padding-left: 10px; border-left: 2px solid #9c27b0; line-height: 1.5;">`;
      ing.lots.forEach((l) => {
        lotListHtml += `<div>🍇 ロット: <strong>${l.lotNumber}</strong> (${l.purchaseDate || "日不明"}購入 / 熟成:${l.agingMonths}ヶ月) → <span style="color:#81c784;">${l.price}円/g</span></div>`;
      });
      lotListHtml += `</div>`;
    }

    const tr = document.createElement("tr");
    const noteClass = ing.defaultNote.toLowerCase();

    tr.innerHTML = `
      <td><span class="note-badge ${noteClass}">${ing.defaultNote}</span></td>
      <td>
        <div style="font-weight: bold; color: #fff;">${ing.name}</div>
        ${lotListHtml}
      </td>
      <td>${ing.defaultDilution}% 溶液 ${ing.carrierSolvent && ing.carrierSolvent !== "None" ? `<span style="font-size:11px; color:#ba68c8;">(${ing.carrierSolvent}希釈)</span>` : ""}</td>
      <td style="color: #81c784;">${ing.price.toLocaleString()} 円 / g <span style="font-size:10px; color:#666;">(Def)</span></td>
      <td>
        <button type="button" class="btn-delete" onclick="window.deleteMasterIngredient(${index})">削除</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

window.addMasterIngredient = function (event) {
  event.preventDefault();

  const name = document.getElementById("invName").value.trim();
  const defaultNote = document.getElementById("invNote").value;
  const defaultDilution =
    parseFloat(document.getElementById("invDilution").value) || 100;
  const price = parseFloat(document.getElementById("invPrice").value) || 0;
  const carrierSolvent = document.getElementById("invSolvent").value;
  const gammaRatio = parseFloat(document.getElementById("invGamma").value) || 0;

  // 1. まず重複チェックを行う（大文字・小文字を無視して同一判定）
  if (
    masterIngredients.some(
      (ing) => ing.name.toLowerCase() === name.toLowerCase(),
    )
  ) {
    alert("⚠️ その香料名は既に登録されています（大文字・小文字の違い含む）。");
    return;
  }

  // 2. 重複がなければ1回だけ配列に追加する
  masterIngredients.push({
    name,
    defaultDilution,
    defaultNote,
    price,
    carrierSolvent,
    gammaRatio,
  });

  sortMasterIngredients();

  localStorage.setItem(
    "perfume_master_ingredients",
    JSON.stringify(masterIngredients),
  );
  renderInventoryTable();
  renderTable();
  calculate();

  document.getElementById("inventoryForm").reset();
  alert(`✅ 「${name}」を新しく在庫マスタに登録しました！`);
};

window.deleteMasterIngredient = function (index) {
  const targetName = masterIngredients[index].name;
  if (
    confirm(
      `本当に「${targetName}」を在庫マスタから削除しますか？\n（※過去の処方に使われている場合はグラム計算に影響が出る可能性があります）`,
    )
  ) {
    masterIngredients.splice(index, 1);
    localStorage.setItem(
      "perfume_master_ingredients",
      JSON.stringify(masterIngredients),
    );
    renderInventoryTable();
    renderTable();
    calculate();
  }
};

window.addEventListener("DOMContentLoaded", () => {
  setTimeout(renderInventoryTable, 150);
});

// ==========================================
// 📓 熟成・評価ノート管理ロジック
// ==========================================
function updateMacerationRecipeSelect() {
  const select = document.getElementById("macRecipeKey");
  if (!select) return;

  const indexSaved = localStorage.getItem("perfume_recipe_index");
  let recipeList = [];
  if (indexSaved) {
    try {
      recipeList = JSON.parse(indexSaved);
    } catch (e) {
      recipeList = [];
    }
  }

  select.innerHTML = "";
  if (recipeList.length === 0) {
    select.innerHTML =
      '<option value="">-- 保存されたレシピがありません --</option>';
    return;
  }

  recipeList.forEach((key) => {
    const rawData = localStorage.getItem(key);
    if (rawData) {
      try {
        const formula = JSON.parse(rawData);
        const option = document.createElement("option");
        option.value = key;
        option.innerText = `${formula.perfumeName || "名称未設定"} (${formula.createDate || "-"})`;
        select.appendChild(option);
      } catch (e) {}
    }
  });
}

function renderMacerationTimeline() {
  const timeline = document.getElementById("macerationTimeline");
  if (!timeline) return;

  const savedLogs = localStorage.getItem("perfume_maceration_logs");
  let logs = [];
  if (savedLogs) {
    try {
      logs = JSON.parse(savedLogs);
    } catch (e) {
      logs = [];
    }
  }

  timeline.innerHTML = "";
  if (logs.length === 0) {
    timeline.innerHTML =
      '<p class="subtitle" style="text-align:center; padding:20px;">まだ記録されている評価ノートはありません。</p>';
    return;
  }

  logs.forEach((log, index) => {
    const div = document.createElement("div");
    div.className = "timeline-item";

    const logDate = new Date(log.timestamp).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    div.innerHTML = `
      <div class="timeline-header">
        <div>
          <span class="timeline-title">${log.recipeName}</span>
          <span class="timeline-tag" style="background-color: #2196f3; margin-left:5px;">${log.days}</span>
        </div>
        <div style="font-size:11px; color:#888; display:flex; align-items:center; gap:10px;">
          <span>${logDate}</span>
          <button type="button" class="btn-delete" style="padding:2px 6px; font-size:10px;" onclick="window.deleteMacerationLog(${index})">削除</button>
        </div>
      </div>
      <div class="timeline-body">${log.memo}</div>
    `;
    timeline.appendChild(div);
  });
}

window.addMacerationLog = function (event) {
  event.preventDefault();

  const recipeKey = document.getElementById("macRecipeKey").value;
  const days = document.getElementById("macDays").value;
  const memo = document.getElementById("macMemo").value.trim();

  if (!recipeKey) {
    alert("対象となるレシピを選択してください.");
    return;
  }

  const rawRecipe = localStorage.getItem(recipeKey);
  let recipeName = "不明なレシピ";
  if (rawRecipe) {
    try {
      recipeName = JSON.parse(rawRecipe).perfumeName;
    } catch (e) {}
  }

  const savedLogs = localStorage.getItem("perfume_maceration_logs");
  let logs = [];
  if (savedLogs) {
    try {
      logs = JSON.parse(savedLogs);
    } catch (e) {
      logs = [];
    }
  }

  const newLog = { recipeKey, recipeName, days, memo, timestamp: Date.now() };
  logs.unshift(newLog);
  localStorage.setItem("perfume_maceration_logs", JSON.stringify(logs));

  renderMacerationTimeline();
  document.getElementById("macMemo").value = "";
  alert("📝 評価ノートに記録しました！");
};

window.deleteMacerationLog = function (index) {
  if (confirm("この記録を削除しますか？")) {
    const savedLogs = localStorage.getItem("perfume_maceration_logs");
    let logs = [];
    if (savedLogs) {
      try {
        logs = JSON.parse(savedLogs);
      } catch (e) {
        logs = [];
      }
    }
    logs.splice(index, 1);
    localStorage.setItem("perfume_maceration_logs", JSON.stringify(logs));
    renderMacerationTimeline();
  }
};

const originalSwitchTab = window.switchTab;
window.switchTab = function (tabId) {
  originalSwitchTab(tabId);
  if (tabId === "view-maceration") {
    updateMacerationRecipeSelect();
    renderMacerationTimeline();
  }
};

window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    updateMacerationRecipeSelect();
    renderMacerationTimeline();
  }, 200);
});

// ==========================================
// ⚙️ バックアップ＆復元ロジック
// ==========================================
window.exportAllData = function () {
  const backupData = {
    master_ingredients: localStorage.getItem("perfume_master_ingredients"),
    recipe_index: localStorage.getItem("perfume_recipe_index"),
    recipe_favorites: localStorage.getItem("perfume_recipe_favorites"),
    maceration_logs: localStorage.getItem("perfume_maceration_logs"),
    recipes: {},
  };

  const indexSaved = localStorage.getItem("perfume_recipe_index");
  if (indexSaved) {
    try {
      const recipeKeys = JSON.parse(indexSaved);
      recipeKeys.forEach((key) => {
        const data = localStorage.getItem(key);
        if (data) backupData.recipes[key] = data;
      });
    } catch (e) {
      console.error("インデックス解析失敗", e);
    }
  }

  const jsonString = JSON.stringify(backupData, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  const dateStr = new Date().toISOString().split("T")[0];
  a.href = url;
  a.download = `perfume_laboratory_backup_${dateStr}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

window.importAllData = function () {
  const fileInput = document.getElementById("importFile");
  if (!fileInput || !fileInput.files[0]) {
    alert("読み込むバックアップファイルを選択してください。");
    return;
  }

  if (
    confirm(
      "⚠️ 本当にデータを復元しますか？既存データはすべて上書き消去されます。",
    )
  ) {
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      try {
        const backup = JSON.parse(e.target.result);
        if (!backup.master_ingredients && !backup.recipe_index) {
          throw new Error("正しいファイルではありません。");
        }

        const oldIndex = localStorage.getItem("perfume_recipe_index");
        if (oldIndex) {
          try {
            JSON.parse(oldIndex).forEach((key) => localStorage.removeItem(key));
          } catch (err) {}
        }

        if (backup.master_ingredients)
          localStorage.setItem(
            "perfume_master_ingredients",
            backup.master_ingredients,
          );
        if (backup.recipe_index)
          localStorage.setItem("perfume_recipe_index", backup.recipe_index);
        if (backup.recipe_favorites)
          localStorage.setItem(
            "perfume_recipe_favorites",
            backup.recipe_favorites,
          );
        if (backup.maceration_logs)
          localStorage.setItem(
            "perfume_maceration_logs",
            backup.maceration_logs,
          );

        if (backup.recipes) {
          Object.keys(backup.recipes).forEach((key) => {
            localStorage.setItem(key, backup.recipes[key]);
          });
        }

        alert("🎉 復元に成功しました！再リロードします。");
        window.location.reload();
      } catch (err) {
        alert("❌ 復元に失敗しました。ファイルを確認してください。");
      }
    };
    reader.readAsText(file);
  }
};

// ==========================================
// 📢 熟成カウントダウン・アラート判定ロジック
// ==========================================
function checkMacerationAlerts() {
  const indexSaved = localStorage.getItem("perfume_recipe_index");
  if (!indexSaved) return;

  let recipeKeys = [];
  try {
    recipeKeys = JSON.parse(indexSaved);
  } catch (e) {
    return;
  }

  const savedLogs = localStorage.getItem("perfume_maceration_logs");
  let logs = [];
  if (savedLogs) {
    try {
      logs = JSON.parse(savedLogs);
    } catch (e) {
      logs = [];
    }
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let alertMessages = [];

  recipeKeys.forEach((key) => {
    const rawData = localStorage.getItem(key);
    if (!rawData) return;

    try {
      const formula = JSON.parse(rawData);
      if (!formula.createDate) return;

      const createDate = new Date(formula.createDate);
      createDate.setHours(0, 0, 0, 0);

      const diffTime = today.getTime() - createDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) return;

      const milestones = [3, 7, 14, 30];

      milestones.forEach((day) => {
        if (diffDays >= day && diffDays <= day + 3) {
          const hasLog = logs.some(
            (log) =>
              log.recipeKey === key &&
              (log.days.includes(`Day ${day}`) ||
                log.days.includes(`${day}日目`)),
          );

          if (!hasLog) {
            let milestoneName =
              day === 3
                ? "3日目"
                : day === 7
                  ? "1週間後"
                  : day === 14
                    ? "2週間後"
                    : "1ヶ月後（完成）";
            alertMessages.push(
              `⏳ <strong>${formula.perfumeName}</strong> が仕込みから <strong>${diffDays}日目</strong> (${milestoneName}の節目) を迎えました。テイスティングして評価をノートに記録しましょう！`,
            );
          }
        }
      });
    } catch (e) {}
  });

  const banner = document.getElementById("macerationAlertBanner");
  if (banner) {
    if (alertMessages.length > 0) {
      banner.innerHTML = alertMessages
        .map(
          (msg) =>
            `<div style="margin-bottom: 8px; font-size: 13px; line-height: 1.5; display: flex; align-items: center; gap: 5px;">${msg}</div>`,
        )
        .join("");
      banner.style.display = "block";
    } else {
      banner.style.display = "none";
    }
  }
}

// ==========================================
// 🌳【新機能】遺伝子ツリービュー（家系図）制御ロジック
// ==========================================
window.showRecipeTree = function () {
  const select = document.getElementById("recipeLoadSelect");
  const selectedKey = select.value;

  if (!selectedKey) {
    alert("系譜を表示するレシピを履歴から選択してください。");
    return;
  }

  const indexSaved = localStorage.getItem("perfume_recipe_index");
  if (!indexSaved) return;

  let recipeKeys = [];
  try {
    recipeKeys = JSON.parse(indexSaved);
  } catch (e) {
    return;
  }

  // 1. 全履歴データを展開し、高速検索用のマップオブジェクトを生成
  const recipeMap = {};
  recipeKeys.forEach((key) => {
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        const formula = JSON.parse(raw);
        recipeMap[key] = {
          key: key,
          name: formula.perfumeName || "名称未設定",
          date: formula.createDate || "-",
          parent: formula.parentRecipeKey || null,
          children: [],
        };
      } catch (e) {}
    }
  });

  // 2. 親から見た「子供たち（派生先）」のリンク関係を逆引きマッピング
  Object.keys(recipeMap).forEach((key) => {
    const parentKey = recipeMap[key].parent;
    if (parentKey && recipeMap[parentKey]) {
      recipeMap[parentKey].children.push(key);
    }
  });

  // 3. 選択されたノードの親の親の親…と上に向かって遡り、「すべての始祖となるルート」を特定
  let rootKey = selectedKey;
  while (
    recipeMap[rootKey] &&
    recipeMap[rootKey].parent &&
    recipeMap[recipeMap[rootKey].parent]
  ) {
    rootKey = recipeMap[rootKey].parent;
  }

  if (!recipeMap[rootKey]) {
    alert("選択されたレシピの進化系統木を解析できませんでした。");
    return;
  }

  // 4. 始祖からスタートし、子孫に向かって再帰的にHTML（ul/li）の木構造を組み立てるインサイド関数
  function buildTreeHTML(key) {
    const node = recipeMap[key];
    if (!node) return "";

    const isCurrent = key === selectedKey;
    const activeClass = isCurrent ? "current-active" : "";

    // クリックされたら家系図を閉じつつ、その時代のバージョンを瞬間復元ロードするスマートイベントを仕込む
    let html = `<li>`;
    html += `<span class="tree-node ${activeClass}" onclick="window.closeRecipeTree(); document.getElementById('recipeLoadSelect').value='${key}'; window.loadSelectedRecipe();">`;
    html += `${node.name} <span style="font-size: 11px; opacity: 0.5; margin-left: 5px;">(${node.date})</span>`;
    if (isCurrent) html += ` ◀ 稼働中`;
    html += `</span>`;

    // 派生した子供（枝分かれ）がいれば再帰掘り下げ
    if (node.children.length > 0) {
      // 日付順（古い順）に整列させて左から右（上から下）へタイムライン表示
      node.children.sort((a, b) =>
        recipeMap[a].date.localeCompare(recipeMap[b].date),
      );

      html += `<ul>`;
      node.children.forEach((childKey) => {
        html += buildTreeHTML(childKey);
      });
      html += `</ul>`;
    }

    html += `</li>`;
    return html;
  }

  // 5. 生成したDOMを注入してモーダルをアクティブ化
  const container = document.getElementById("recipeTreeContainer");
  if (container) {
    container.innerHTML = `<ul>${buildTreeHTML(rootKey)}</ul>`;
  }

  const modal = document.getElementById("recipeTreeModal");
  if (modal) {
    modal.style.display = "flex";
  }
};

window.closeRecipeTree = function () {
  const modal = document.getElementById("recipeTreeModal");
  if (modal) {
    modal.style.display = "none";
  }
};

// ==========================================
// ☕【新機能】嗅覚受容体飽和タイマー制御ロジック
// ==========================================
let olfactoryTimerInterval = null;

window.startOlfactoryTimer = function () {
  // ブラウザのプッシュ通知許可をあらかじめリクエスト（スマート設計）
  if (window.Notification && Notification.permission === "default") {
    Notification.requestPermission();
  }

  // すでにタイマーが動いている場合は一度クリアして再スタート
  if (olfactoryTimerInterval) {
    clearInterval(olfactoryTimerInterval);
  }

  // 1. 現在の処方から「最大嗅覚疲労度」をスキャンしてタイマーの初期分数を決定
  let maxFatigue = "Low";
  const rows = document.querySelectorAll("#ingredientsBody tr");

  rows.forEach((row) => {
    const note = row.querySelector(".row-note").value; // 行の現在のノート選択（Top/Middle/Base）を取得
    const nameSelect = row.querySelector(".name-select");
    let name = nameSelect.value;
    if (name === "カスタム（手入力）") {
      name = row.querySelector(".custom-name-input").value || "";
    }

    // 不正なing参照を排除し、name変数から正しく識別キーを分離
    const searchName = name.includes("::") ? name.split("::")[0] : name;
    const masterInfo = masterIngredients.find((m) => m.name === searchName);
    let currentItemFatigue = "Low";

    if (masterInfo && masterInfo.olfactoryFatigue) {
      // 在庫マスタにある既存香料なら、設定された疲労度を採用
      currentItemFatigue = masterInfo.olfactoryFatigue;
    } else {
      // マスタにないカスタム素材や未命名の場合は、選択されているノートで安全に自動判定
      currentItemFatigue =
        note === "Base" ? "High" : note === "Middle" ? "Medium" : "Low";
    }

    // 最も高い疲労度をキープ
    if (currentItemFatigue === "High") {
      maxFatigue = "High";
    } else if (currentItemFatigue === "Medium" && maxFatigue !== "High") {
      maxFatigue = "Medium";
    }
  });

  // 疲労度に応じた制限時間（秒数）の設定
  // High: 15分(900秒) / Medium: 25分(1500秒) / Low: 40分(2400秒)
  let totalSeconds =
    maxFatigue === "High" ? 900 : maxFatigue === "Medium" ? 1500 : 2400;

  const displayEl = document.getElementById("olfactoryTimerDisplay");
  const btnEl = document.getElementById("btnStartOlfTimer");

  displayEl.style.display = "inline-block";
  btnEl.innerText = "🔄 リセット";
  btnEl.style.backgroundColor = "#5c2575";

  // 2. カントリーダウンの毎秒駆動開始
  olfactoryTimerInterval = setInterval(() => {
    totalSeconds--;

    if (totalSeconds <= 0) {
      clearInterval(olfactoryTimerInterval);
      displayEl.innerText = "⏱️ 受容体飽和！";
      displayEl.style.color = "#ff1744";
      displayEl.style.backgroundColor = "#3a1217";
      alert(
        "⚠️ 【嗅覚限界アラート】\nあなたの受容体は完全に飽和しました。一度天秤から離れ、外の空気を吸うかコーヒー豆を嗅いでノーズリセットを行ってください。",
      );

      btnEl.innerText = "⏱️ 調香開始";
      btnEl.style.backgroundColor = "#9c27b0";
      return;
    }

    // 分と秒への変換表示処理
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    displayEl.innerText = `⏱️ 飽和まで: ${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

    // 残り5分（300秒）になった瞬間の先回りブロック通知
    if (totalSeconds === 300) {
      const alertMsg =
        "⏳ 【ノーズリreset予告】残り5分であなたの嗅覚受容体が飽和します。そろそろ一度外の空気を吸いましょう。";

      if (window.Notification && Notification.permission === "granted") {
        new Notification("Lab Assistant", {
          body: alertMsg,
          icon: "/favicon.ico",
        });
      } else {
        alert(alertMsg);
      }
    }
  }, 1000);
};

// ==========================================
// 🔮【新機能】ロット・ヴィンテージ追加実行ロジック
// ==========================================
window.addLotToIngredient = function (event) {
  event.preventDefault();

  const targetName = document.getElementById("lotTargetIngredient").value;
  const lotNumber = document.getElementById("lotNumber").value.trim();
  const purchaseDate = document.getElementById("lotPurchaseDate").value;
  const agingMonths =
    parseInt(document.getElementById("lotAging").value, 10) || 0;
  const price = parseFloat(document.getElementById("lotPrice").value) || 0;

  if (!targetName) {
    alert("対象の香料を選択してください。");
    return;
  }

  const master = masterIngredients.find((m) => m.name === targetName);
  if (master) {
    master.lots = master.lots || [];

    // 同一ロット番号の重複チェック
    if (master.lots.some((l) => l.lotNumber === lotNumber)) {
      alert("⚠️ このロット番号は既に登録されています。");
      return;
    }

    // ロットオブジェクトをプッシュ
    master.lots.push({ lotNumber, purchaseDate, agingMonths, price });

    // 保存と各画面の再描画
    localStorage.setItem(
      "perfume_master_ingredients",
      JSON.stringify(masterIngredients),
    );
    renderInventoryTable();
    renderTable(); // フォーミュラ室のプルダウンを即座に更新同期
    calculate();

    document.getElementById("lotForm").reset();
    alert(`🍇 「${targetName}」にロット【${lotNumber}】を紐づけ登録しました！`);
  }
};

// ==========================================
// 🧬【新機能】「マイ・アコード」ワンクリック展開マクロ
// ==========================================
const presetAccords = {
  woody_sea: [
    { name: "Iso E Super", ratio: 5, note: "Base", dilution: 100 },
    { name: "Timbersilk", ratio: 1, note: "Base", dilution: 100 },
  ],
  citrus_skeleton: [
    { name: "ベルガモット（FCF）", ratio: 3, note: "Top", dilution: 100 },
    { name: "マンダリン", ratio: 1, note: "Top", dilution: 100 },
  ],
  cathedral_incense: [
    { name: "フランキンセンス", ratio: 2, note: "Middle", dilution: 100 },
    { name: "シダーウッド", ratio: 2, note: "Middle", dilution: 100 },
    { name: "パチュリ", ratio: 1, note: "Base", dilution: 100 },
  ],
};

window.insertAccord = function () {
  const select = document.getElementById("accordSelect");
  const selectedKey = select.value;

  if (!selectedKey) {
    // alertすらブロックされている可能性を考慮し、選択肢を赤く光らせて警告
    select.style.border = "2px solid #ff5252";
    setTimeout(() => {
      select.style.border = "1px solid #3f4654";
    }, 1000);
    return;
  }

  const accordIngredients = presetAccords[selectedKey];
  if (!accordIngredients) return;

  // 1. アコード全体の比率の合計を算出
  const totalRatio = accordIngredients.reduce((sum, ing) => sum + ing.ratio, 0);

  // 「合計1.0g」の骨格比率として一瞬でドロップする仕様に変更
  const targetWeight = 1.0;

  // 2. 比率から各香料の wet 重量を出して、現在の処方配列にプッシュ
  accordIngredients.forEach((ing) => {
    const calculatedWeight = (ing.ratio / totalRatio) * targetWeight;
    currentFormula.ingredients.push({
      note: ing.note,
      name: ing.name,
      weight: parseFloat(calculatedWeight.toFixed(3)),
      dilution: ing.dilution,
    });
  });

  // 3. システムの再描画・計算・セーブを一斉同期
  renderTable();
  calculate();
  saveData();

  // UIリセット
  select.value = "";
};

// ==========================================
// 🕵️【新機能】嗅覚ブラインド・テイスティング・ランダマイザー
// ==========================================
let isBlindMode = false;
let originalPerfumeName = "";

window.toggleBlindMode = function () {
  const nameInput = document.getElementById("perfumeName");
  const tableBody = document.getElementById("ingredientsBody");
  const btn = document.getElementById("btnBlindMode");
  const conceptArea = document.getElementById("concept");
  const outputSheet = document.getElementById("outputSheet"); // ★追加：出力シートを取得

  if (!nameInput || !tableBody || !btn) return;

  isBlindMode = !isBlindMode;

  if (isBlindMode) {
    originalPerfumeName = nameInput.value;
    const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const randomLetter =
      uppercaseLetters[Math.floor(Math.random() * uppercaseLetters.length)];
    const randomCode = `🕵️ 【BLIND_PROJECT: ${randomLetter}-${Math.floor(Math.random() * 900 + 100)}】`;

    nameInput.value = randomCode;
    nameInput.disabled = true;
    if (conceptArea) conceptArea.style.filter = "blur(8px)";
    if (outputSheet) outputSheet.style.filter = "blur(12px)"; // ★追加：テキストシートも強力ブロック

    tableBody.style.filter = "blur(14px)";
    tableBody.style.pointerEvents = "none";

    btn.innerText = "👁️ 視覚・先入観を復元";
    btn.style.backgroundColor = "#00e676";
    btn.style.color = "#0d0e11";
  } else {
    nameInput.value =
      originalPerfumeName || "No.3.0 / ドライ・インセンスウッド";
    nameInput.disabled = false;
    if (conceptArea) conceptArea.style.filter = "none";
    if (outputSheet) outputSheet.style.filter = "none"; // ★追加：ボカし解除

    tableBody.style.filter = "none";
    tableBody.style.pointerEvents = "auto";

    btn.innerText = "🕵️ ブラインドテストON";
    btn.style.backgroundColor = "#ff5252";
    btn.style.color = "#fff";
  }
};

// ==========================================
// 🏛️【新機能】熟成ノート「香気プロファイル・レーダーチャート」制御
// ==========================================
let macerationRadarChart = null;

// 1. ログ記録時にスライダーの官能データを一緒に吸い上げるように関数を拡張
const originalAddMacerationLog = window.addMacerationLog;
window.addMacerationLog = function (event) {
  event.preventDefault();

  const recipeKey = document.getElementById("macRecipeKey").value;
  const days = document.getElementById("macDays").value;
  const memo = document.getElementById("macMemo").value.trim();

  if (!recipeKey) return alert("対象となるレシピを選択してください。");

  // スライダーから8大要素の値をオブジェクトとして抽出
  const profile = {
    woody: parseInt(document.getElementById("prof_woody").value, 10),
    citrus: parseInt(document.getElementById("prof_citrus").value, 10),
    floral: parseInt(document.getElementById("prof_floral").value, 10),
    spicy: parseInt(document.getElementById("prof_spicy").value, 10),
    balsamic: parseInt(document.getElementById("prof_balsamic").value, 10),
    musky: parseInt(document.getElementById("prof_musky").value, 10),
    amber: parseInt(document.getElementById("prof_amber").value, 10),
    texture: parseInt(document.getElementById("prof_texture").value, 10),
  };

  const rawRecipe = localStorage.getItem(recipeKey);
  let recipeName = "不明なレシピ";
  if (rawRecipe) {
    try {
      recipeName = JSON.parse(rawRecipe).perfumeName;
    } catch (e) {}
  }

  const savedLogs = localStorage.getItem("perfume_maceration_logs");
  let logs = [];
  if (savedLogs) {
    try {
      logs = JSON.parse(savedLogs);
    } catch (e) {
      logs = [];
    }
  }

  // 拡張データ構造でログを先頭に挿入
  const newLog = {
    recipeKey,
    recipeName,
    days,
    memo,
    profile,
    timestamp: Date.now(),
  };
  logs.unshift(newLog);
  localStorage.setItem("perfume_maceration_logs", JSON.stringify(logs));

  // フォーム＆スライダーをリセット
  document.getElementById("macMemo").value = "";
  const sliders = [
    "woody",
    "citrus",
    "floral",
    "spicy",
    "balsamic",
    "musky",
    "amber",
    "texture",
  ];
  sliders.forEach((id) => {
    document.getElementById(`prof_${id}`).value = 0;
  });

  // 画面のタイムラインとレーダーチャートを一斉再描画
  renderMacerationTimeline();
  window.updateMacerationRadar();
  alert("📝 香気プロファイルと共に評価ノートに記録しました！");
};

// 2. レシピに紐づく過去の全官能ログを1つのチャートに重ね合わせる描画コア
window.updateMacerationRadar = function () {
  const recipeKey = document.getElementById("macRecipeKey").value;
  const card = document.getElementById("radarChartCard");
  const ctx = document.getElementById("macerationRadarChart");

  if (!recipeKey || !ctx) {
    if (card) card.style.display = "none";
    return;
  }

  const rawRecipe = localStorage.getItem(recipeKey);
  if (!rawRecipe) return;
  const targetRecipeName = JSON.parse(rawRecipe).perfumeName;

  const savedLogs = localStorage.getItem("perfume_maceration_logs");
  let logs = [];
  if (savedLogs) {
    try {
      logs = JSON.parse(savedLogs);
    } catch (e) {}
  }

  // このレシピに対するログだけを抽出（古い順にソートしてタイムライン化）
  const myLogs = logs
    .filter((log) => log.recipeName === targetRecipeName)
    .reverse();
  // プロファイル（官能データ）を持っているログだけに絞り込む
  const validLogs = myLogs.filter((log) => log.profile);

  if (validLogs.length === 0) {
    card.style.display = "none";
    return;
  }
  card.style.display = "block"; // データがあればチャートカードを展開

  // 経過日数（Day）ごとのエモいネオンカラーパレット定義
  const colorMap = {
    "Day 0 (調香直後)": { border: "#00e5ff", bg: "rgba(0, 229, 255, 0.15)" },
    "Day 3 (3日目)": { border: "#ffce56", bg: "rgba(255, 206, 86, 0.15)" },
    "Day 7 (1週間後)": { border: "#ff9800", bg: "rgba(255, 152, 0, 0.15)" },
    "Day 14 (2週間後)": { border: "#e91e63", bg: "rgba(233, 30, 99, 0.15)" },
    "Day 30 (1ヶ月後)": { border: "#00e676", bg: "rgba(0, 230, 118, 0.15)" },
    その他: { border: "#9c27b0", bg: "rgba(156, 39, 176, 0.15)" },
  };

  // ログからChart.js用のデータセット（レイヤー）を動的生成
  const datasets = validLogs.map((log) => {
    const colors = colorMap[log.days] || colorMap["その他"];
    return {
      label: log.days,
      data: [
        log.profile.woody,
        log.profile.citrus,
        log.profile.floral,
        log.profile.spicy,
        log.profile.balsamic,
        log.profile.musky,
        log.profile.amber,
        log.profile.texture,
      ],
      borderColor: colors.border,
      backgroundColor: colors.bg,
      borderWidth: 2,
      pointBackgroundColor: colors.border,
      lineTension: 0.2,
    };
  });

  if (macerationRadarChart) {
    macerationRadarChart.data.datasets = datasets;
    macerationRadarChart.update();
  } else {
    macerationRadarChart = new Chart(ctx, {
      type: "radar",
      data: {
        labels: [
          "Woody 🌲",
          "Citrus 🍋",
          "Floral 🌹",
          "Spicy 🌶️",
          "Balsamic 🪵",
          "Musky 🧼",
          "Amber  Whale",
          "Texture ✨",
        ],
        datasets: datasets,
      },
      options: {
        responsive: true,
        scales: {
          r: {
            min: 0,
            max: 5,
            ticks: { stepSize: 1, display: false },
            grid: { color: "rgba(255, 255, 255, 0.05)" },
            angleLines: { color: "rgba(255, 255, 255, 0.1)" },
            pointLabels: {
              color: "#818b9d",
              font: { size: 11, weight: "bold" },
            },
          },
        },
        plugins: {
          legend: {
            position: "bottom",
            labels: { color: "#d8dee9", font: { size: 11 } },
          },
        },
      },
    });
  }
};

// 3. 熟成ノートのプルダウン選択が変わったときや、タブが切り替わったときに自動更新連動
document
  .getElementById("macRecipeKey")
  .addEventListener("change", window.updateMacerationRadar);
const finalOriginalSwitchTab = window.switchTab;
window.switchTab = function (tabId) {
  finalOriginalSwitchTab(tabId);
  if (tabId === "view-maceration") {
    setTimeout(window.updateMacerationRadar, 50);
  }
};

// ==========================================
// 🎙️【新機能】音声ナビゲーション調香モード（Voice Lab Assistant）
// ==========================================
let isVoiceNavActive = false;
let voiceNavIndex = 0;
let voiceRecognition = null;

// 音声合成（喋る）ショートカット
function labSpeak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel(); // 前の音声を強制カットして割り込む
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ja-JP";
  utterance.rate = 1.0; // 落ち着いたプロの速度
  utterance.pitch = 1.0;

  // ⭕ 追加：画面のスライダーから音量（0.0 〜 1.0）を動的に取得して適用
  const volEl = document.getElementById("voiceVolume");
  if (volEl) {
    utterance.volume = parseFloat(volEl.value);
  }

  window.speechSynthesis.speak(utterance);
}

// 現在のターゲット香料を画面に映し、パフューマーに伝える
function announceCurrentIngredient() {
  const ingredients = currentFormula.ingredients || [];
  if (ingredients.length === 0 || voiceNavIndex >= ingredients.length) {
    document.getElementById("voiceNavStatus").innerText =
      "✨ すべての計量が完了しました！";
    document.getElementById("voiceNavTarget").style.display = "none";
    labSpeak(
      "すべての素材の計量が完了しました。処方シートをクローズします。お疲れ様でした。",
    );
    window.stopVoiceNavEngine();
    return;
  }

  const ing = ingredients[voiceNavIndex];

  // 画面上のテーブルの該当行をネオンハイライトして視覚的にも迷子防止
  const rows = document.querySelectorAll("#ingredientsBody tr");
  rows.forEach((row, idx) => {
    row.style.backgroundColor =
      idx === voiceNavIndex ? "rgba(156, 39, 176, 0.15)" : "";
    row.style.border = idx === voiceNavIndex ? "1px solid #9c27b0" : "";
  });

  // モニター表示の更新
  document.getElementById("voiceNavStatus").innerText =
    `🧪 【STEP ${voiceNavIndex + 1} / ${ingredients.length}】 計量してください`;
  const targetText = `${ing.name} ➔ 【 ${ing.weight.toFixed(3)} g 】 (${ing.note} / ${ing.dilution}%溶液)`;
  const monitorTarget = document.getElementById("voiceNavTarget");
  monitorTarget.innerText = targetText;
  monitorTarget.style.display = "block";

  // 音声ガイダンス再生
  labSpeak(`${ing.name}。狙う重量は、${ing.weight.toFixed(3)} グラムです。`);
}

window.toggleVoiceNav = function () {
  if (isVoiceNavActive) {
    window.stopVoiceNavEngine();
    labSpeak("ボイスナビゲーションを終了します。");
  } else {
    window.startVoiceNavEngine();
  }
};

// ★追加：音量スライダーを動かした瞬間に現在ターゲットを新音量で再コールする
document.addEventListener("DOMContentLoaded", () => {
  const volEl = document.getElementById("voiceVolume");
  if (volEl) {
    volEl.addEventListener("input", () => {
      if (isVoiceNavActive) {
        announceCurrentIngredient(); // スライダー操作時に即座に新しい音量でコールし直す
      }
    });
  }
});

window.startVoiceNavEngine = function () {
  const ingredients = currentFormula.ingredients || [];
  if (ingredients.length === 0) {
    alert("処方に香料が登録されていません。");
    return;
  }

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("お使いのブラウザは音声認識に対応していません。Chromeを推奨します。");
    return;
  }

  isVoiceNavActive = true;
  voiceNavIndex = 0;

  const btn = document.getElementById("btnVoiceNav");
  btn.innerText = "🛑 ナビを停止";
  btn.style.backgroundColor = "#ff5252";

  voiceRecognition = new SpeechRecognition();
  voiceRecognition.lang = "ja-JP";
  voiceRecognition.continuous = true;
  voiceRecognition.interimResults = false;

  // 表記ゆれを網羅した高精度な音声判定コマンド
  voiceRecognition.onresult = function (event) {
    const rawText =
      event.results[event.results.length - 1][0].transcript.trim();
    const text = rawText.toLowerCase();
    console.log("🎙️ 認識された声:", rawText);

    // 1. 次へ (つぎ / 次 / チェック / next)
    if (
      text.includes("つぎ") ||
      text.includes("次") ||
      text.includes("チェック") ||
      text.includes("ちぇっく") ||
      text.includes("next")
    ) {
      voiceNavIndex++;
      announceCurrentIngredient();
    }
    // 2. 戻る (もどる / 戻る / バック / back)
    else if (
      text.includes("もどる") ||
      text.includes("戻る") ||
      text.includes("バック") ||
      text.includes("back")
    ) {
      if (voiceNavIndex > 0) {
        voiceNavIndex--;
        announceCurrentIngredient();
      } else {
        labSpeak("これ以上は戻れません。最初の一行目です。");
      }
    }
    // 3. もう一回 (もう一回 / もういっかい / もう1回 / もうかい / リピート / repeat)
    else if (
      text.includes("もう一回") ||
      text.includes("もういっかい") ||
      text.includes("もう1回") ||
      text.includes("もうかい") ||
      text.includes("リピート") ||
      text.includes("repeat")
    ) {
      announceCurrentIngredient();
    }
    // 4. 終了・停止 (ストップ / stop / 終了 / しゅうりょう / おわり / 終わり / end)
    else if (
      text.includes("ストップ") ||
      text.includes("stop") ||
      text.includes("終了") ||
      text.includes("しゅうりょう") ||
      text.includes("おわり") ||
      text.includes("終わり") ||
      text.includes("end")
    ) {
      window.toggleVoiceNav();
    }
  };

  voiceRecognition.onend = function () {
    if (isVoiceNavActive && voiceRecognition) {
      voiceRecognition.start();
    }
  };

  voiceRecognition.start();
  announceCurrentIngredient();
};

window.stopVoiceNavEngine = function () {
  isVoiceNavActive = false;

  const btn = document.getElementById("btnVoiceNav");
  if (btn) {
    btn.innerText = "🎙️ ボイスナビを開始する";
    btn.style.backgroundColor = "#9c27b0";
  }

  document.getElementById("voiceNavStatus").innerText =
    "スタンバイ中... ボタンを押すと最初の香料を読み上げます。";
  document.getElementById("voiceNavTarget").style.display = "none";

  // テーブルのハイライトを全解除
  const rows = document.querySelectorAll("#ingredientsBody tr");
  rows.forEach((row) => {
    row.style.backgroundColor = "";
    row.style.border = "";
  });

  if (voiceRecognition) {
    voiceRecognition.onend = null; // 自動再起動のループを断ち切る
    voiceRecognition.stop();
    voiceRecognition = null;
  }
};
