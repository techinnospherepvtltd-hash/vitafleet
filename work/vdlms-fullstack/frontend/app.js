const titles = {
  dashboard: ["Fleet Command Dashboard", "Single source of truth for every vehicle lifecycle record."],
  vehicles: ["Vehicle Master", "Create and manage permanent digital identities for vehicles."],
  documents: ["Document Uploadation", "Upload, classify, track expiry, and verify every vehicle document."],
  repairs: ["Repair Problems and Cost Bifurcation", "Track problems, service center type, accident repair, and cost breakup."],
  approvals: ["Approval Matrix", "Authority levels for repair, insurance, compliance, and vehicle sale decisions."],
  insurance: ["Insurance", "Policies, IDV, claims, FIR, survey report, and settlement tracking."],
  sold: ["Sold Vehicles", "How many vehicles were sold till now, buyer details, and sale recovery."],
  alerts: ["Alerts", "Renewal, approval, repair, and claim reminders."]
};

const money = value => `INR ${Number(value || 0).toLocaleString("en-IN")}`;

function badge(value) {
  const text = String(value || "");
  const lower = text.toLowerCase();
  let cls = "info";
  if (["active", "valid", "completed", "closed", "no claim", "verified"].some(word => lower.includes(word))) cls = "ok";
  if (["due", "pending", "estimate", "idle"].some(word => lower.includes(word))) cls = "warn";
  if (["accident", "open", "repair", "high", "survey"].some(word => lower.includes(word))) cls = "bad";
  return `<span class="badge ${cls}">${text}</span>`;
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options
  });
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json();
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(screen => screen.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  document.querySelectorAll(".nav-item").forEach(item => item.classList.toggle("active", item.dataset.screen === id));
  document.getElementById("pageTitle").textContent = titles[id][0];
  document.getElementById("pageSubtitle").textContent = titles[id][1];
}

function renderStats(target, stats) {
  document.getElementById(target).innerHTML = stats.map(item => `
    <div class="stat">
      <span>${item.label}</span>
      <strong>${item.value}</strong>
    </div>
  `).join("");
}

function renderSummary(target, rows) {
  document.getElementById(target).innerHTML = rows.map(row => `
    <div class="summary-row">
      <span>${row.label}</span>
      <strong>${row.value}</strong>
    </div>
  `).join("");
}

async function loadDashboard() {
  const [dashboard, vehicles, timeline] = await Promise.all([
    api("/api/dashboard"),
    api("/api/vehicles"),
    api("/api/timeline/veh-1")
  ]);

  renderStats("dashboardStats", [
    { label: "Total vehicles", value: dashboard.totalVehicles },
    { label: "Active", value: dashboard.activeVehicles },
    { label: "Under repair", value: dashboard.underRepair },
    { label: "Accident vehicles", value: dashboard.accidentVehicles },
    { label: "Insurance due", value: dashboard.insuranceDue },
    { label: "Fitness due", value: dashboard.fitnessDue },
    { label: "Approvals pending", value: dashboard.pendingApprovals },
    { label: "Sold till now", value: dashboard.soldTillNow },
    { label: "Sale recovery", value: money(dashboard.totalSaleValue) },
    { label: "Accident repairs", value: dashboard.accidentRepairs },
    { label: "Authorized repairs", value: dashboard.serviceCenterRepairs },
    { label: "Own assets", value: dashboard.ownAssets },
    { label: "Third party vendor assets", value: dashboard.thirdPartyVendorAssets },
    { label: "Government assets", value: dashboard.governmentAssets }
  ]);

  document.getElementById("watchlistRows").innerHTML = vehicles
    .filter(vehicle => vehicle.status !== "Active")
    .map(vehicle => `
      <tr>
        <td>${vehicle.registrationNumber}</td>
        <td>${badge(vehicle.assetBelongsTo || "Own Asset")}</td>
        <td>${vehicle.branch}</td>
        <td>${badge(vehicle.status)}</td>
        <td>${vehicle.risk}</td>
        <td>${vehicle.nextAction}</td>
      </tr>
    `).join("");

  document.getElementById("recentTimeline").innerHTML = timeline.map(event => `
    <div class="event">
      <strong>${event.title}</strong>
      <span>${event.date} - ${event.description}</span>
    </div>
  `).join("");
}

async function loadVehicles() {
  const vehicles = await api("/api/vehicles");
  document.getElementById("vehicleRows").innerHTML = vehicles.map(vehicle => `
      <tr>
      <td>${vehicle.registrationNumber}</td>
      <td>${vehicle.make} ${vehicle.model}</td>
      <td>${badge(vehicle.assetBelongsTo || "Own Asset")}</td>
      <td>${vehicle.branch}</td>
      <td>${badge(vehicle.status)}</td>
      <td>${vehicle.timelineCount} events</td>
    </tr>
  `).join("");
}

async function loadDocuments() {
  const documents = await api("/api/documents");
  document.getElementById("documentRows").innerHTML = documents.map(document => `
    <tr>
      <td>${document.vehicle}</td>
      <td>${document.type}</td>
      <td>${document.number}</td>
      <td>${document.expiryDate || "-"}</td>
      <td>${badge(document.status)}</td>
    </tr>
  `).join("");
}

async function loadRepairs() {
  const repairs = await api("/api/repairs");
  document.getElementById("repairRows").innerHTML = repairs.map(repair => `
    <tr>
      <td>${repair.vehicle}</td>
      <td>${repair.problem}</td>
      <td>${badge(repair.repairType)}</td>
      <td>${repair.serviceCentre}</td>
      <td>${badge(repair.status)}</td>
      <td>${money(repair.totalCost)}</td>
    </tr>
  `).join("");

  const selected = repairs[0];
  renderSummary("costBreakup", [
    { label: "Vehicle", value: selected.vehicle },
    { label: "Labour", value: money(selected.costBreakup.labour) },
    { label: "Parts", value: money(selected.costBreakup.parts) },
    { label: "Towing / Field Visit", value: money(selected.costBreakup.towing) },
    { label: "GST", value: money(selected.costBreakup.gst) },
    { label: "Total", value: money(selected.totalCost) },
    { label: "Approval Required", value: selected.approvalRequired }
  ]);
}

async function loadApprovals() {
  const approvals = await api("/api/approvals");
  document.getElementById("approvalRows").innerHTML = approvals.map(approval => `
    <tr>
      <td>${approval.requestType}</td>
      <td>${approval.condition}</td>
      <td>${approval.level1}</td>
      <td>${approval.level2}</td>
      <td>${approval.level3 || "-"}</td>
      <td>${approval.sla}</td>
    </tr>
  `).join("");

  renderSummary("pendingApprovals", approvals.filter(item => item.status === "Pending").map(item => ({
    label: item.requestType,
    value: item.pendingItem
  })));
}

async function loadInsurance() {
  const insurance = await api("/api/insurance");
  document.getElementById("insuranceRows").innerHTML = insurance.map(policy => `
    <tr>
      <td>${policy.vehicle}</td>
      <td>${policy.insurer}</td>
      <td>${policy.policyNumber}</td>
      <td>${money(policy.idv)}</td>
      <td>${policy.expiryDate}</td>
      <td>${badge(policy.claimStatus)}</td>
    </tr>
  `).join("");

  const claim = insurance.find(policy => policy.claimStatus !== "No Claim") || insurance[0];
  renderSummary("claimSummary", [
    { label: "Vehicle", value: claim.vehicle },
    { label: "Claim Status", value: claim.claimStatus },
    { label: "FIR", value: claim.firStatus || "-" },
    { label: "Survey Report", value: claim.surveyStatus || "-" },
    { label: "Repair Estimate", value: money(claim.repairEstimate) },
    { label: "Expected Settlement", value: money(claim.expectedSettlement) }
  ]);
}

async function loadSold() {
  const [dashboard, sold] = await Promise.all([api("/api/dashboard"), api("/api/sold-vehicles")]);
  renderStats("soldStats", [
    { label: "Sold till now", value: dashboard.soldTillNow },
    { label: "Total sale value", value: money(dashboard.totalSaleValue) },
    { label: "This year sold", value: sold.filter(item => item.soldDate.startsWith("2026")).length },
    { label: "Pending transfer", value: sold.filter(item => item.transferStatus !== "Completed").length }
  ]);

  document.getElementById("soldRows").innerHTML = sold.map(item => `
    <tr>
      <td>${item.vehicle}</td>
      <td>${money(item.purchaseCost)}</td>
      <td>${item.soldDate}</td>
      <td>${item.buyer}</td>
      <td>${money(item.saleValue)}</td>
      <td>${badge(item.transferStatus)}</td>
    </tr>
  `).join("");
}

async function loadAlerts() {
  const alerts = await api("/api/alerts");
  document.getElementById("alertRows").innerHTML = alerts.map(alert => `
    <tr>
      <td>${alert.dueDate}</td>
      <td>${alert.vehicle}</td>
      <td>${alert.title}</td>
      <td>${badge(alert.priority)}</td>
      <td>${badge(alert.status)}</td>
    </tr>
  `).join("");
}

async function loadAll() {
  await Promise.all([
    loadDashboard(),
    loadVehicles(),
    loadDocuments(),
    loadRepairs(),
    loadApprovals(),
    loadInsurance(),
    loadSold(),
    loadAlerts()
  ]);
}

function formToJson(form) {
  const data = new FormData(form);
  const payload = {};
  for (const [key, value] of data.entries()) {
    payload[key] = value instanceof File ? value.name : value;
  }
  return payload;
}

document.getElementById("nav").addEventListener("click", event => {
  const button = event.target.closest("[data-screen]");
  if (button) showScreen(button.dataset.screen);
});

document.querySelectorAll("[data-screen]").forEach(button => {
  button.addEventListener("click", () => showScreen(button.dataset.screen));
});

document.getElementById("refreshBtn").addEventListener("click", loadAll);

document.getElementById("vehicleForm").addEventListener("submit", async event => {
  event.preventDefault();
  const payload = {
    ...formToJson(event.currentTarget),
    risk: "New vehicle setup",
    nextAction: "Upload RC and insurance",
    timelineCount: 1
  };
  await api("/api/vehicles", { method: "POST", body: JSON.stringify(payload) });
  await loadAll();
});

document.getElementById("documentForm").addEventListener("submit", async event => {
  event.preventDefault();
  const payload = {
    ...formToJson(event.currentTarget),
    status: "Uploaded"
  };
  await api("/api/documents", { method: "POST", body: JSON.stringify(payload) });
  await loadAll();
});

loadAll().catch(error => {
  console.error(error);
  alert("Unable to load application data. Please check the backend server.");
});
