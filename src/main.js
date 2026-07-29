// ==========================================
// Perfume Formula Generator v2 - main.js
// ==========================================

// ==========================================
// Perfume Formula Generator v2 - main.js
// ==========================================

// 1. 素材マスタデータ（選択肢）
const masterIngredients = [
  // --- Top Notes ---
  { name: "ベルガモット（FCF）", defaultDilution: 100, defaultNote: "Top" },
  { name: "ブラックペッパー", defaultDilution: 100, defaultNote: "Top" },
  { name: "マンダリン", defaultDilution: 100, defaultNote: "Top" },
  { name: "ライム", defaultDilution: 100, defaultNote: "Top" },
  { name: "カルダモン", defaultDilution: 100, defaultNote: "Top" },

  // --- Middle Notes ---
  { name: "シダーウッド", defaultDilution: 100, defaultNote: "Middle" },
  { name: "サンダルウッド", defaultDilution: 100, defaultNote: "Middle" },
  { name: "フランキンセンス", defaultDilution: 100, defaultNote: "Middle" },
  { name: "ゼラニウム", defaultDilution: 100, defaultNote: "Middle" },
  { name: "ローズ・ダマスク", defaultDilution: 100, defaultNote: "Middle" },
  { name: "ジャスミン Abs.", defaultDilution: 25, defaultNote: "Middle" },
  { name: "Hedione", defaultDilution: 100, defaultNote: "Middle" },

  // --- Base Notes ---
  { name: "パチュリ", defaultDilution: 100, defaultNote: "Base" },
  { name: "ベチバー", defaultDilution: 100, defaultNote: "Base" },
  { name: "ガイアックウッド", defaultDilution: 100, defaultNote: "Base" },
  { name: "アンブレットシード", defaultDilution: 100, defaultNote: "Base" },
  { name: "ベンゾイン", defaultDilution: 100, defaultNote: "Base" },
  { name: "Iso E Super", defaultDilution: 100, defaultNote: "Base" },
  { name: "Timbersilk", defaultDilution: 100, defaultNote: "Base" },
  { name: "Ambroxan", defaultDilution: 10, defaultNote: "Base" }, // 10%希釈設定
  { name: "Habanolide", defaultDilution: 100, defaultNote: "Base" },
  { name: "Galaxolide", defaultDilution: 100, defaultNote: "Base" },
  { name: "Ambrettolide", defaultDilution: 100, defaultNote: "Base" },
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

    row.querySelector(".dry-weight-span").innerText = dryWeight.toFixed(3);

    totalDryWeight += dryWeight;
    totalDiluentWeight += diluentWeight;

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
  document.getElementById("resTotalDry").innerText = totalDryWeight.toFixed(4); // ★小数点第4位まで表示
  document.getElementById("resTotalWeight").innerText =
    finalTotalWeight.toFixed(2);
  document.getElementById("resConcentration").innerText =
    finalConcentration.toFixed(1);

  generateSheetText(
    updatedIngredients,
    addedEthanolOutput,
    totalEthanol,
    finalConcentration,
    finalTotalWeight,
  );
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
// 🌟 新機能：⚡ PDF発行ロジック
// ==========================================
window.generatePDF = function () {
  const perfumeName = document.getElementById("perfumeName").value;
  const createDate = document.getElementById("createDate").value;
  const concept = document.getElementById("concept").value;

  const resAddedEthanol = document.getElementById("resAddedEthanol").innerText;
  const resTotalDry = document.getElementById("resTotalDry").innerText;
  const resTotalWeight = document.getElementById("resTotalWeight").innerText;
  const resConcentration =
    document.getElementById("resConcentration").innerText;

  // テンプレートへの流し込み
  document.getElementById("pdfTargetName").innerText =
    perfumeName || "名称未設定";
  document.getElementById("pdfTargetDate").innerText = createDate || "-";
  document.getElementById("pdfTargetConc").innerText = resConcentration + "%";
  document.getElementById("pdfTargetConcept").innerText = concept || "-";

  const pdfFormulaBody = document.getElementById("pdfFormulaBody");
  pdfFormulaBody.innerHTML = "";

  let totalWetWeight = 0;

  // 画面のテキストから取得するのをやめ、裏側で正確な純分合計を事前計算する
  let exactTotalDryWeight = 0;
  currentFormula.ingredients.forEach((ing) => {
    exactTotalDryWeight += ing.weight * (ing.dilution / 100);
  });

  // 各香料行の生成
  currentFormula.ingredients.forEach((ing) => {
    const tr = document.createElement("tr");
    const dilutionStr = ing.dilution === 100 ? "原液" : `希釈 ${ing.dilution}%`;
    const dryWeight = ing.weight * (ing.dilution / 100);
    totalWetWeight += ing.weight;

    // 正確な合計値（exactTotalDryWeight）を使って純分比%を計算する
    const ratio =
      exactTotalDryWeight > 0
        ? ((dryWeight / exactTotalDryWeight) * 100).toFixed(2) + "%"
        : "0.00%";

    tr.innerHTML = `
      <td class="center">${dilutionStr}</td>
      <td>${ing.name || "未命名"}</td>
      <td class="num">${ratio}</td>
      <td class="num">${ing.weight.toFixed(3)}g</td>
      <td class="num">${dryWeight.toFixed(4)}g</td>
    `;
    pdfFormulaBody.appendChild(tr);
  });

  // [香料液合計] 行の追加
  const trTotalIng = document.createElement("tr");
  trTotalIng.className = "total-row";
  trTotalIng.innerHTML = `
    <td class="center">-</td>
    <td>[香料液合計]</td>
    <td class="num">100.00%</td>
    <td class="num">${totalWetWeight.toFixed(3)}g</td>
    <td class="num">${exactTotalDryWeight.toFixed(4)}g</td> <!-- ★修正箇所：正確な合計値を出力 -->
  `;
  pdfFormulaBody.appendChild(trTotalIng);

  // 無水エタノール行の追加
  const trEthanol = document.createElement("tr");
  trEthanol.className = "solvent-row";
  trEthanol.innerHTML = `
    <td class="center">原液</td>
    <td>無水エタノール</td>
    <td class="num">-</td>
    <td class="num">${parseFloat(resAddedEthanol).toFixed(3)}g</td>
    <td class="num">-</td>
  `;
  pdfFormulaBody.appendChild(trEthanol);

  // [総重量/最終着地] 行の追加
  const trFinal = document.createElement("tr");
  trFinal.className = "total-row";
  trFinal.innerHTML = `
    <td class="center">-</td>
    <td>[総重量/最終着地]</td>
    <td colspan="2">実質賦香率: ${resConcentration}%</td>
    <td class="num">${parseFloat(resTotalWeight).toFixed(3)}g</td>
  `;
  pdfFormulaBody.appendChild(trFinal);

  // ========================================================
  // 確実なPDFレンダリングのための処理
  // ========================================================
  const renderArea = document.getElementById("pdf-render-area");

  // 画面の左上にピン留めして背面に隠す
  renderArea.style.position = "absolute";
  renderArea.style.top = "0";
  renderArea.style.left = "0";
  renderArea.style.zIndex = "-9999";
  renderArea.style.display = "block";

  const element = document.getElementById("pdf-content");
  const opt = {
    margin: [15, 15, 15, 15],
    filename: `${perfumeName || "formula"}.pdf`,
    image: { type: "jpeg", quality: 1.0 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      scrollY: 0, // スクロールによる撮影ズレを防止
    },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  // ブラウザに描画させる猶予（300ミリ秒）を与えてからPDF化を実行
  setTimeout(() => {
    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        // 処理が完了したら元の状態に戻す
        renderArea.style.display = "none";
        renderArea.style.position = "";
        renderArea.style.zIndex = "";
      });
  }, 300);
};
