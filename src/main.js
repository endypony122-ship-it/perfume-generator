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
  },
  {
    name: "ジャスミン Abs.",
    defaultDilution: 25,
    defaultNote: "Middle",
    price: 529,
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
  },
  { name: "Iso E Super", defaultDilution: 100, defaultNote: "Base", price: 48 },
  { name: "Timbersilk", defaultDilution: 100, defaultNote: "Base", price: 48 },
  { name: "Sylvamber", defaultDilution: 100, defaultNote: "Base", price: 79 },
  { name: "Ambroxan", defaultDilution: 10, defaultNote: "Base", price: 440 },
  { name: "Habanolide", defaultDilution: 100, defaultNote: "Base", price: 74 },
  { name: "Galaxolide", defaultDilution: 100, defaultNote: "Base", price: 66 },
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
  } catch (e) {
    masterIngredients = [...defaultMasterIngredients];
  }
} else {
  masterIngredients = [...defaultMasterIngredients];
}

// ★追加：データ自体を常に「T → M → Base → 名前順」に美しく並び替える関数
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
    const selected = ing.name === master.name ? "selected" : "";
    if (ing.name === master.name) isCustom = false;
    masterOptions += `<option value="${master.name}" ${selected}>${master.name}</option>`;
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
  const selectedName = selectElement.value;
  const customInput = tr.querySelector(".custom-name-input");

  if (selectedName === "カスタム（手入力）") {
    customInput.style.display = "block";
    customInput.value = "";
  } else {
    customInput.style.display = "none";
    const master = masterIngredients.find((m) => m.name === selectedName);
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

  // ★追加：コスト集計用の箱
  let totalCost = 0;
  const ETHANOL_PRICE_PER_GRAM = 3; // 無水エタノール1gの単価（約3円と仮定）

  // ★グラフ用：各ノートの純分を個別に集計する箱
  let topTotal = 0;
  let middleTotal = 0;
  let baseTotal = 0;

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

    // ★追加：マスタから単価を探してコストを計算（カスタム等で見つからなければ0円）
    const masterInfo = masterIngredients.find((m) => m.name === name);
    const unitPrice = masterInfo ? masterInfo.price : 0;
    totalCost += weight * unitPrice; // 実測重量 × 1g単価

    row.querySelector(".dry-weight-span").innerText = dryWeight.toFixed(3);

    row.querySelector(".dry-weight-span").innerText = dryWeight.toFixed(3);

    totalDryWeight += dryWeight;
    totalDiluentWeight += diluentWeight;

    // ★グラフ用：ノートに合わせて個別の箱に足し算
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

  // ★追加：エタノールの原価を足して、四捨五入して画面に表示
  totalCost += addedEthanolOutput * ETHANOL_PRICE_PER_GRAM;
  document.getElementById("resTotalCost").innerText =
    Math.round(totalCost).toLocaleString();

  document.getElementById("resConcentration").innerText =
    finalConcentration.toFixed(1);

  generateSheetText(
    updatedIngredients,
    addedEthanolOutput,
    totalEthanol,
    finalConcentration,
    finalTotalWeight,
  );

  // ★グラフの表示を更新
  if (typeof window.updatePyramidChart === "function") {
    window.updatePyramidChart(topTotal, middleTotal, baseTotal);
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
        text += `  - ${ing.name}${dilutionStr}： ${ing.wetWeight.toFixed(3)}g\n`;
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

    tr.innerHTML = `
      <td class="center">${ing.dilution === 100 ? "原液" : "希釈 " + ing.dilution + "%"}</td>
      <td style="font-weight: bold;">${ing.name}</td>
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

  // 4. 熟成ログの自動流し込み（文字サイズも拡大）
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
        <!-- ★メモ本体の文字サイズを 13pt にし、色を真っ黒(#000)にして読みやすく！ -->
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
  // 1. 現在の総重量と、目標の総重量を取得
  const currentTotalStr = document.getElementById("resTotalWeight").innerText;
  const currentTotal = parseFloat(currentTotalStr);
  const targetTotal = parseFloat(
    document.getElementById("targetScaleWeight").value,
  );

  // エラーチェック
  if (isNaN(targetTotal) || targetTotal <= 0) {
    alert("目標の重量を正しく入力してください。");
    return;
  }
  if (currentTotal <= 0) {
    alert("現在の総重量が0のため、スケールアップできません。");
    return;
  }

  // 2. 変換倍率（比率）を計算
  const ratio = targetTotal / currentTotal;

  // 3. 各香料の重量を一括で掛け算して更新
  const rows = document.querySelectorAll("#ingredientsBody tr");
  rows.forEach((row) => {
    const weightInput = row.querySelector(".weight-input");
    const currentWeight = parseFloat(weightInput.value) || 0;
    // 小数点第3位まで計算して入力欄にセット
    weightInput.value = (currentWeight * ratio).toFixed(3);
  });

  // 4. 手動エタノールモードの場合は、エタノール量もスケールアップ
  const solventMode = document.getElementById("solventMode").value;
  if (solventMode === "manual") {
    const ethanolInput = document.getElementById("addedEthanol");
    const currentEthanol = parseFloat(ethanolInput.value) || 0;
    ethanolInput.value = (currentEthanol * ratio).toFixed(2);
  }
  // ※自動計算モードの場合は、香料がスケールアップされれば賦香率に合わせて勝手にエタノールも計算されるため不要

  // 5. 画面全体を再計算＆ローカルストレージに保存
  window.onRowValueChange();

  // 6. 完了メッセージ
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

  // データが0の場合はグレーのダミーを表示
  const dataValues =
    total === 0 ? [1, 1, 1] : [topWeight, middleWeight, baseWeight];
  const bgColors =
    total === 0
      ? ["#333333", "#333333", "#333333"]
      : ["#4bc0c0", "#ffce56", "#ff6384"]; // Top(青緑), Middle(黄), Base(赤紫)

  // 100%丸め誤差をなくす最大剰余方式
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
    // 既にグラフがあればデータを更新
    pyramidChart.data.datasets[0].data = dataValues;
    pyramidChart.data.datasets[0].backgroundColor = bgColors;
    // ★修正：クロージャ問題を回避するため、データセット内に直接最新の情報を保存
    pyramidChart.data.datasets[0].customPercentages = displayPercentages;
    pyramidChart.data.datasets[0].isEmpty = total === 0;
    pyramidChart.update();
  } else {
    // 初回のみグラフを新規作成
    pyramidChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Top", "Middle", "Base"],
        datasets: [
          {
            data: dataValues,
            backgroundColor: bgColors,
            borderWidth: 0,
            customPercentages: displayPercentages, // 最新％データを格納
            isEmpty: total === 0, // 空かどうかの最新フラグ
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
            labels: { color: "#e0e0e0" }, // ダークテーマ用の文字色
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                // ★修正：古い記憶(total変数)には頼らず、常に最新のdatasetから情報を取得する
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
// 🌟 新機能：📂 過去レシピの読み込み・手動保存・管理ロジック
// ==========================================

// 現在の作業状態を「新しい履歴」として手動保存する関数
window.saveCurrentRecipe = function () {
  const perfumeName =
    document.getElementById("perfumeName").value || "名称未設定";
  const createDate = document.getElementById("createDate").value || "no-date";
  const safeName = perfumeName.replace(/[\/\\?%*:|"<>]/g, "_");
  // タイムスタンプをつけて完全に一意にする
  const uniqueKey = `recipe_archive_${safeName}_${Date.now()}`;

  // アーカイブ用として保存
  localStorage.setItem(uniqueKey, JSON.stringify(currentFormula));

  // 履歴インデックス一覧を取得して更新する
  const indexSaved = localStorage.getItem("perfume_recipe_index");
  let recipeList = [];
  if (indexSaved) {
    try {
      recipeList = JSON.parse(indexSaved);
    } catch (e) {
      recipeList = [];
    }
  }

  recipeList.unshift(uniqueKey); // 先頭（一番上）に追加
  localStorage.setItem("perfume_recipe_index", JSON.stringify(recipeList));

  updateRecipeSelectDropdown();
  document.getElementById("recipeLoadSelect").value = uniqueKey; // 保存したものを選択状態に

  alert(`💾 「${perfumeName}」を履歴に保存しました！`);
};

// 画面のプルダウンに保存済みレシピ一覧を表示する関数
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

  // ★お気に入りをプルダウンの一番上に持ってくる並び替え
  recipeList.sort((a, b) => {
    const aFav = favList.includes(a);
    const bFav = favList.includes(b);
    if (aFav && !bFav) return -1;
    if (!aFav && bFav) return 1;
    return 0; // どちらも同じなら元の順序
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

  // 選択状態を復元
  if (currentSelection && recipeList.includes(currentSelection)) {
    select.value = currentSelection;
  }
}

// 選択した過去レシピを画面に完全復元する関数
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

// お気に入り登録/解除機能
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
    favList = favList.filter((k) => k !== selectedKey); // 解除
  } else {
    favList.push(selectedKey); // 登録
  }

  localStorage.setItem("perfume_recipe_favorites", JSON.stringify(favList));
  updateRecipeSelectDropdown();
};

// レシピ削除機能
window.deleteSelectedRecipe = function () {
  const select = document.getElementById("recipeLoadSelect");
  const selectedKey = select.value;
  if (!selectedKey) {
    alert("削除するレシピを選択してください。");
    return;
  }

  if (confirm("本当にこのレシピを削除しますか？（※復元できません）")) {
    // インデックスから削除
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

    // お気に入りリストからも削除
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

    // 本体データを削除
    localStorage.removeItem(selectedKey);

    updateRecipeSelectDropdown();
    alert("🗑️ レシピを削除しました。");
  }
};

// 初期化時にプルダウンを読み込むようにDOMContentLoadedに追記
window.addEventListener("DOMContentLoaded", () => {
  setTimeout(updateRecipeSelectDropdown, 100);
});

// ==========================================
// 🌟 新機能：🌐 タブ画面切り替えロジック（SPA）
// ==========================================
window.switchTab = function (tabId) {
  // 1. すべての部屋（コンテンツ）をいったん非表示にする
  const contents = document.querySelectorAll(".tab-content");
  contents.forEach((content) => {
    content.classList.remove("active");
  });

  // 2. すべてのメニューボタンの「選択中カラー」を解除する
  const buttons = document.querySelectorAll(".nav-btn");
  buttons.forEach((btn) => {
    btn.classList.remove("active");
  });

  // 3. クリックされた特定の部屋とボタンだけを「アクティブ状態」にする
  const targetContent = document.getElementById(tabId);
  if (targetContent) {
    targetContent.classList.add("active");
  }

  // ボタンのアクティブ化（クリックされたボタンを探してクラス付与）
  const clickedBtn = Array.from(buttons).find((btn) =>
    btn.getAttribute("onclick").includes(tabId),
  );
  if (clickedBtn) {
    clickedBtn.classList.add("active");
  }
};

// ==========================================
// 🌟 新機能：📦 インベントリ（香料在庫）管理ロジック
// ==========================================

// 在庫一覧テーブルを描画する関数
function renderInventoryTable() {
  const tbody = document.getElementById("inventoryBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  masterIngredients.forEach((ing, index) => {
    if (ing.name === "カスタム（手入力）") return;

    const tr = document.createElement("tr");
    const noteClass = ing.defaultNote.toLowerCase();

    tr.innerHTML = `
      <td><span class="note-badge ${noteClass}">${ing.defaultNote}</span></td>
      <td style="font-weight: bold; color: #fff;">${ing.name}</td>
      <td>${ing.defaultDilution}% 溶液</td>
      <td style="color: #81c784;">${ing.price.toLocaleString()} 円 / g</td>
      <td>
        <button type="button" class="btn-delete" onclick="window.deleteMasterIngredient(${index})">削除</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// 新しい香料をマスタに登録する関数
window.addMasterIngredient = function (event) {
  event.preventDefault();

  const name = document.getElementById("invName").value.trim();
  const defaultNote = document.getElementById("invNote").value;
  const defaultDilution =
    parseFloat(document.getElementById("invDilution").value) || 100;
  const price = parseFloat(document.getElementById("invPrice").value) || 0;

  if (masterIngredients.some((ing) => ing.name === name)) {
    alert("⚠️ その香料名は既に登録されています。");
    return;
  }

  // 1. 純粋に配列の末尾に一度追加する
  masterIngredients.push({ name, defaultDilution, defaultNote, price });

  // 2. 追加した瞬間に自動ソート関数を呼び出して綺麗に並び替える
  sortMasterIngredients();

  // 保存と画面更新
  localStorage.setItem(
    "perfume_master_ingredients",
    JSON.stringify(masterIngredients),
  );
  renderInventoryTable();
  renderTable(); // フォーミュラ室のプルダウンも自動でT/M/B順に同期
  calculate();

  document.getElementById("inventoryForm").reset();
  alert(`✅ 「${name}」を新しく在庫マスタに登録しました！`);
};

// 在庫マスタから香料を削除する関数
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

// 初期化時に在庫テーブルも描画させる
window.addEventListener("DOMContentLoaded", () => {
  setTimeout(renderInventoryTable, 150);
});

// ==========================================
// 🌟 新機能：📓 熟成・評価ノート管理ロジック
// ==========================================

// 熟成ノート用の選択肢（保存済みレシピ）を更新する関数
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

// タイムラインを描画する関数
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

  // タイムスタンプの新しい順（降順）で表示
  logs.forEach((log, index) => {
    const div = document.createElement("div");
    div.className = "timeline-item";

    // 記録された日付のフォーマット
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

// 新しい経過記録を追加する関数
window.addMacerationLog = function (event) {
  event.preventDefault();

  const recipeKey = document.getElementById("macRecipeKey").value;
  const days = document.getElementById("macDays").value;
  const memo = document.getElementById("macMemo").value.trim();

  if (!recipeKey) {
    alert("対象となるレシピを選択してください。");
    return;
  }

  // 選択されたレシピの現在の名前を取得
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

  // 新しいログオブジェクトを作成
  const newLog = {
    recipeKey,
    recipeName,
    days,
    memo,
    timestamp: Date.now(),
  };

  logs.unshift(newLog); // 先頭に追加
  localStorage.setItem("perfume_maceration_logs", JSON.stringify(logs));

  // 画面更新とフォームリセット
  renderMacerationTimeline();
  document.getElementById("macMemo").value = "";
  alert("📝 評価ノートに記録しました！");
};

// ログを削除する関数
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

// ページ表示時やタブ切り替え時に選択肢を最新にするためのフック
const originalSwitchTab = window.switchTab;
window.switchTab = function (tabId) {
  originalSwitchTab(tabId);
  if (tabId === "view-maceration") {
    updateMacerationRecipeSelect();
    renderMacerationTimeline();
  }
};

// 初期ロード時の実行
window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    updateMacerationRecipeSelect();
    renderMacerationTimeline();
  }, 200);
});

// ==========================================
// 🌟 新機能：⚙️ 設定・データ一括バックアップ＆復元ロジック
// ==========================================

// 全データを1つのJSONファイルとしてエクスポート（ダウンロード）する関数
window.exportAllData = function () {
  // 1. 保存するデータの詰め合わせ箱を作る
  const backupData = {
    master_ingredients: localStorage.getItem("perfume_master_ingredients"),
    recipe_index: localStorage.getItem("perfume_recipe_index"),
    recipe_favorites: localStorage.getItem("perfume_recipe_favorites"),
    maceration_logs: localStorage.getItem("perfume_maceration_logs"),
    recipes: {}, // 個別のレシピデータを格納する部屋
  };

  // 2. インデックスを元に、ローカルストレージにある全レシピの本体データを集約
  const indexSaved = localStorage.getItem("perfume_recipe_index");
  if (indexSaved) {
    try {
      const recipeKeys = JSON.parse(indexSaved);
      recipeKeys.forEach((key) => {
        const data = localStorage.getItem(key);
        if (data) {
          backupData.recipes[key] = data;
        }
      });
    } catch (e) {
      console.error("レシピインデックスの解析に失敗しました", e);
    }
  }

  // 3. データを文字列にして、隠しリンクを作ってダウンロードを発火させる
  const jsonString = JSON.stringify(backupData, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  const dateStr = new Date().toISOString().split("T")[0]; // 「2026-07-29」のような文字列
  a.href = url;
  a.download = `perfume_laboratory_backup_${dateStr}.json`;
  a.click();

  // メモリ解放
  URL.revokeObjectURL(url);
};

// バックアップファイルを読み込んでローカルストレージを上書き復元する関数
window.importAllData = function () {
  const fileInput = document.getElementById("importFile");
  if (!fileInput || !fileInput.files[0]) {
    alert("読み込むバックアップファイルを選択してください。");
    return;
  }

  if (
    confirm(
      "⚠️ 本当にデータを復元しますか？\n現在ブラウザにあるレシピや在庫マスタはすべて消去され、ファイルの内容に置き換わります。",
    )
  ) {
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      try {
        const backup = JSON.parse(e.target.result);

        // 簡易的なデータ整合性チェック（主要なキーがあるか）
        if (!backup.master_ingredients && !backup.recipe_index) {
          throw new Error("正しいバックアップファイルではありません。");
        }

        // 1. 既存の古い個別レシピデータをブラウザから綺麗に削除する（ゴミ残りを防ぐ）
        const oldIndex = localStorage.getItem("perfume_recipe_index");
        if (oldIndex) {
          try {
            JSON.parse(oldIndex).forEach((key) => localStorage.removeItem(key));
          } catch (err) {}
        }

        // 2. 新しいデータをローカルストレージに流し込む
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

        // 3. 個別レシピの本体データを一挙に復元
        if (backup.recipes) {
          Object.keys(backup.recipes).forEach((key) => {
            localStorage.setItem(key, backup.recipes[key]);
          });
        }

        alert(
          "🎉 データの復元が完全に成功しました！\n最新の状態をシステムに適用するため、ページを自動リロードします。",
        );
        window.location.reload(); // ページを強制リロードして全画面を最新化
      } catch (err) {
        alert(
          "❌ データの復元に失敗しました。ファイルが破損しているか、調香ラボのバックアップではない可能性があります。",
        );
      }
    };

    reader.readAsText(file);
  }
};
