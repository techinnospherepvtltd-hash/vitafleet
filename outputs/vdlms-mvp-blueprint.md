# Vehicle Digital Life Cycle Management System

## Product Name

Working name: **Vehicle Digital Passport**

Positioning:

> A permanent digital identity and lifecycle record for every vehicle, from purchase to disposal.

This is not a GPS tracker or a normal fleet management app. It is the system of record for vehicle ownership, compliance, documents, finance, repairs, parts, accidents, drivers, GPS devices, and resale/scrap history.

## Target Customers

Initial best-fit customers:

- Ambulance fleet operators
- Logistics companies
- Taxi and car rental fleets
- School bus operators
- Corporate fleets
- Construction and mining fleets
- Government departments
- Police, fire, and emergency services

Best first market:

**Ambulance fleets and logistics fleets**, because they have high compliance pressure, high repair cost, GPS dependency, driver rotation, insurance claims, downtime loss, and large document burden.

## MVP Goal

Build a usable enterprise SaaS MVP that can manage 100 to 10,000 vehicles for one or more companies.

The MVP should answer these questions:

- What vehicles do we own?
- Where is each vehicle assigned?
- What documents are expiring?
- What repairs happened?
- What parts were replaced?
- Which vehicles are under repair, accident, idle, active, or due for compliance?
- What is the full timeline of a vehicle?
- Can field staff scan a QR code and open the vehicle record?

## MVP Modules

### 1. Company and Branch Management

Purpose:
Support multiple companies, branches, departments, and users.

Features:

- Company master
- Branch master
- Department master
- Role-based access
- User invitation
- Activity audit log

### 2. Vehicle Master

Purpose:
Create one permanent record per vehicle.

Fields:

- VIN
- Chassis number
- Engine number
- Registration number
- Make
- Model
- Variant
- Color
- Fuel type
- Vehicle category
- Purchase date
- Purchase cost
- Vendor
- Current branch
- Current department
- Current status
- QR code

Statuses:

- Active
- Idle
- Under repair
- Accident
- Sold
- Scrapped
- Transferred

### 3. Vehicle Timeline

Purpose:
Show every event in chronological order.

Timeline event types:

- Purchase
- Registration
- Document uploaded
- Insurance renewed
- Permit renewed
- Driver assigned
- GPS installed
- GPS removed
- Repair opened
- Repair closed
- Part installed
- Part removed
- Accident reported
- Claim opened
- Claim settled
- Branch transfer
- Vehicle sold
- Vehicle scrapped

This timeline is the core product.

### 4. Document Vault

Purpose:
Store all vehicle documents with expiry reminders.

Document types:

- RC
- Insurance
- PUC
- Fitness
- Permit
- Tax
- Invoice
- Warranty
- Loan paper
- NOC
- Challan
- Accident photo
- FIR
- Survey report
- Repair invoice

MVP features:

- Upload document
- Link document to vehicle
- Expiry date
- Reminder date
- Document status
- Version history
- Search by vehicle/document type

Later:

- OCR extraction
- OCR search
- Digital signatures
- Verified document status

### 5. Compliance and Alerts

Purpose:
Automatically warn users before expiry and compliance risk.

MVP alert types:

- Insurance due
- Fitness due
- Permit due
- PUC due
- Tax due
- GPS SIM renewal due
- Battery warranty due
- Tyre replacement due
- Loan/EMI due

Alert channels:

- Dashboard
- Email
- WhatsApp/SMS later

### 6. Repair and Workshop Management

Purpose:
Track repair cost, downtime, complaints, invoices, and warranty.

Core records:

- Repair job card
- Complaint
- Workshop
- Mechanic/vendor
- Labour cost
- Parts cost
- Total cost
- Start date
- Completion date
- Downtime
- Invoice
- Quality check status

MVP repair statuses:

- Open
- Estimate received
- Approved
- Work in progress
- Completed
- Rejected
- Warranty claim

### 7. Parts History

Purpose:
Give major parts their own lifecycle.

Initial supported parts:

- Battery
- Tyre
- Alternator
- Starter
- Clutch
- Brake pads
- Radiator
- ECU
- Engine
- Gearbox

MVP fields:

- Part type
- Serial number
- Brand
- Installed date
- Removed date
- Warranty expiry
- Cost
- Vendor
- Linked repair
- Status

Tyre-specific:

- Position
- Rotation history
- Retread history
- Scrap value

Battery-specific:

- Installation date
- Warranty expiry
- Health status

### 8. Accident and Insurance Claims

Purpose:
Track every accident and its financial/operational impact.

Fields:

- Accident date
- Driver
- Location
- Description
- Photos/videos
- FIR details
- Insurance policy
- Claim number
- Survey report
- Repair estimate
- Approved claim amount
- Settlement amount
- Downtime
- Final repair cost

### 9. Driver Assignment History

Purpose:
Know who drove which vehicle and when.

Fields:

- Driver master
- License number
- License expiry
- Medical fitness expiry
- Assigned vehicle
- Assignment start
- Assignment end
- Accident count
- Penalties/rewards

### 10. Dashboard

MVP dashboard widgets:

- Total vehicles
- Active vehicles
- Idle vehicles
- Under repair
- Accident vehicles
- Insurance due
- Fitness due
- Permit due
- High repair cost vehicles
- Upcoming expiries
- Recent timeline events

## Suggested Technology Stack

Recommended stack for fast enterprise SaaS development:

- Frontend: Next.js or React
- Backend: NestJS, Express, Django, or Laravel
- Database: PostgreSQL
- File storage: S3-compatible object storage
- Background jobs: BullMQ/Redis or Celery
- Search: PostgreSQL full-text search first, Elasticsearch/OpenSearch later
- Authentication: Email/password plus SSO-ready architecture
- Mobile app later: React Native or Flutter

Recommended first implementation:

**Next.js + PostgreSQL + Prisma + object storage**

Reason:
Fast MVP development, strong admin/dashboard UI support, good API routes, good ecosystem, and easy path to multi-tenant SaaS.

## Multi-Tenant Data Model

Every business record should belong to a tenant/company.

Minimum tenant hierarchy:

- Tenant
- Company
- Branch
- Department
- User
- Role
- Permission

Vehicle belongs to tenant and optionally company, branch, department.

## Core Database Entities

Core tables:

- tenants
- companies
- branches
- departments
- users
- roles
- user_roles
- vehicles
- vehicle_status_history
- vehicle_timeline_events
- documents
- document_versions
- compliance_items
- alerts
- workshops
- repair_orders
- repair_order_items
- parts
- part_events
- drivers
- driver_assignments
- gps_devices
- gps_device_events
- insurance_policies
- insurance_claims
- accidents
- finance_contracts
- ownership_events
- audit_logs

## First 90-Day Build Plan

### Days 1-10: Product and Technical Foundation

- Finalize MVP scope
- Create clickable UI prototype
- Finalize database schema
- Define roles and permissions
- Prepare development environment
- Create project repository

### Days 11-30: Core System

- Authentication
- Tenant/company/branch setup
- Vehicle master
- Vehicle list and detail page
- Vehicle timeline
- Basic audit log
- QR code generation

### Days 31-50: Documents and Alerts

- Document upload
- Document expiry tracking
- Compliance item setup
- Alert dashboard
- Email reminder jobs

### Days 51-70: Repairs and Parts

- Workshop master
- Repair order flow
- Repair cost tracking
- Parts installation/removal
- Tyre and battery history

### Days 71-90: Claims, Drivers, Dashboard

- Accident record
- Insurance claim record
- Driver master
- Driver assignment timeline
- Executive dashboard
- Import vehicles from Excel/CSV
- Basic reports

## Roles

Initial roles:

- Super Admin
- Tenant Admin
- Fleet Manager
- Compliance Manager
- Workshop Manager
- Finance Manager
- Field Staff
- Driver
- Read-only Auditor

## Key Reports

MVP reports:

- Vehicle master report
- Document expiry report
- Compliance due report
- Repair cost report
- Vehicle downtime report
- Accident report
- Tyre replacement report
- Battery warranty report
- Driver assignment report
- Vehicle lifecycle timeline export

## AI Features for Later

Do after the core data is reliable:

- OCR document reading
- Predictive maintenance
- Tyre replacement prediction
- Battery failure prediction
- Repair cost anomaly detection
- Vehicle replacement suggestion
- Insurance risk scoring
- Natural language search: "Show vehicles with insurance expiring next month"

## Business Model

Pricing options:

- Per vehicle per month
- Per tenant annual license
- Enterprise custom pricing
- OCR/document processing add-on
- GPS/fuel/ERP integration add-on
- Workshop/vendor portal add-on
- AI analytics add-on
- Digital passport verification report fee

Indicative pricing:

- Small fleet: INR 30-100 per vehicle/month
- Enterprise: custom annual contract
- Government/tender: platform license plus support

## Immediate Next Build Step

The first software milestone should be:

**A working web app with login, vehicle master, document vault, expiry alerts, and vehicle timeline.**

This creates the foundation on which every other module can be added.

