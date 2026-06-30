const http = require("http");
const fs = require("fs");
const path = require("path");

const port = Number(process.env.PORT || 5000);
const root = path.resolve(__dirname, "..");
const frontendRoot = path.join(root, "frontend");
const dbPath = path.join(root, "database", "seed-data.json");

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg"
};

function readDb() {
  return JSON.parse(fs.readFileSync(dbPath, "utf8"));
}

function writeDb(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Request body too large"));
      }
    });
    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
  });
}

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function dashboard(data) {
  const vehicles = data.vehicles;
  const byStatus = status => vehicles.filter(vehicle => vehicle.status === status).length;
  const sold = data.soldVehicles;
  const soldValue = sold.reduce((total, item) => total + item.saleValue, 0);
  const assetBelongsTo = type => vehicles.filter(vehicle => vehicle.assetBelongsTo === type).length;

  return {
    totalVehicles: vehicles.length + sold.length,
    activeVehicles: byStatus("Active"),
    idleVehicles: byStatus("Idle"),
    underRepair: byStatus("Under Repair"),
    accidentVehicles: byStatus("Accident"),
    insuranceDue: data.documents.filter(document => document.type === "Insurance" && document.status !== "Valid").length,
    fitnessDue: data.documents.filter(document => document.type === "Fitness" && document.status !== "Valid").length,
    pendingApprovals: data.approvals.filter(approval => approval.status === "Pending").length,
    soldTillNow: sold.length,
    totalSaleValue: soldValue,
    accidentRepairs: data.repairs.filter(repair => repair.repairType === "Accident Vehicle").length,
    serviceCenterRepairs: data.repairs.filter(repair => repair.repairType === "Authorized Service Centre").length,
    ownAssets: assetBelongsTo("Own Asset"),
    thirdPartyVendorAssets: assetBelongsTo("Third Party Vendor Asset"),
    governmentAssets: assetBelongsTo("Government Asset")
  };
}

async function handleApi(req, res, pathname) {
  const data = readDb();

  if (req.method === "GET" && pathname === "/api/dashboard") {
    sendJson(res, 200, dashboard(data));
    return;
  }

  const collectionRoutes = {
    "/api/vehicles": "vehicles",
    "/api/documents": "documents",
    "/api/repairs": "repairs",
    "/api/approvals": "approvals",
    "/api/insurance": "insurance",
    "/api/sold-vehicles": "soldVehicles",
    "/api/alerts": "alerts"
  };

  const collection = collectionRoutes[pathname];
  if (collection && req.method === "GET") {
    sendJson(res, 200, data[collection]);
    return;
  }

  if (collection && req.method === "POST") {
    try {
      const payload = await readBody(req);
      const idPrefix = collection.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`).toUpperCase();
      const record = {
        id: createId(idPrefix),
        ...payload,
        createdAt: new Date().toISOString()
      };
      data[collection].unshift(record);
      writeDb(data);
      sendJson(res, 201, record);
    } catch (error) {
      sendJson(res, 400, { error: "Invalid request body" });
    }
    return;
  }

  if (req.method === "GET" && pathname.startsWith("/api/timeline/")) {
    const vehicleId = decodeURIComponent(pathname.split("/").pop());
    sendJson(res, 200, data.timeline.filter(event => event.vehicleId === vehicleId));
    return;
  }

  sendJson(res, 404, { error: "API route not found" });
}

function serveStatic(res, pathname) {
  const requested = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.normalize(path.join(frontendRoot, requested));

  if (!filePath.startsWith(frontendRoot)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    res.writeHead(200, {
      "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream"
    });
    res.end(content);
  });
}

const server = http.createServer(async (req, res) => {
  const { pathname } = new URL(req.url, `http://127.0.0.1:${port}`);

  if (pathname.startsWith("/api/")) {
    await handleApi(req, res, pathname);
    return;
  }

  serveStatic(res, pathname);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Vehicle Digital Passport running at http://127.0.0.1:${port}`);
});
