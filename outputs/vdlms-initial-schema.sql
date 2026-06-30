-- Vehicle Digital Passport / VDLMS initial PostgreSQL schema
-- This is an MVP-oriented schema. It is designed to evolve into a multi-tenant enterprise SaaS.

create extension if not exists "uuid-ossp";

create table tenants (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  legal_name text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table companies (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  name text not null,
  gst_number text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table branches (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  company_id uuid references companies(id),
  name text not null,
  state text,
  city text,
  address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table departments (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  branch_id uuid references branches(id),
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table users (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid references tenants(id),
  full_name text not null,
  email text not null unique,
  phone text,
  password_hash text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table roles (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid references tenants(id),
  name text not null,
  created_at timestamptz not null default now()
);

create table user_roles (
  user_id uuid not null references users(id),
  role_id uuid not null references roles(id),
  primary key (user_id, role_id)
);

create table vehicles (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  company_id uuid references companies(id),
  branch_id uuid references branches(id),
  department_id uuid references departments(id),
  vin text,
  chassis_number text not null,
  engine_number text,
  registration_number text,
  make text,
  model text,
  variant text,
  color text,
  fuel_type text,
  vehicle_category text,
  purchase_date date,
  purchase_cost numeric(14,2),
  vendor_name text,
  status text not null default 'active',
  qr_code_value text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, chassis_number),
  unique (tenant_id, registration_number)
);

create table vehicle_timeline_events (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  vehicle_id uuid not null references vehicles(id),
  event_type text not null,
  event_title text not null,
  event_description text,
  event_date timestamptz not null default now(),
  related_entity_type text,
  related_entity_id uuid,
  created_by uuid references users(id),
  created_at timestamptz not null default now()
);

create index idx_vehicle_timeline_vehicle_date
  on vehicle_timeline_events(vehicle_id, event_date desc);

create table documents (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  vehicle_id uuid references vehicles(id),
  document_type text not null,
  title text not null,
  document_number text,
  issue_date date,
  expiry_date date,
  status text not null default 'active',
  storage_url text,
  created_by uuid references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_documents_expiry
  on documents(tenant_id, expiry_date);

create table document_versions (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  document_id uuid not null references documents(id),
  version_number integer not null,
  storage_url text not null,
  uploaded_by uuid references users(id),
  created_at timestamptz not null default now(),
  unique (document_id, version_number)
);

create table compliance_items (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  vehicle_id uuid not null references vehicles(id),
  compliance_type text not null,
  due_date date not null,
  status text not null default 'pending',
  related_document_id uuid references documents(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_compliance_due
  on compliance_items(tenant_id, due_date, status);

create table alerts (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  vehicle_id uuid references vehicles(id),
  alert_type text not null,
  title text not null,
  message text,
  due_date date,
  status text not null default 'open',
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table workshops (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  name text not null,
  workshop_type text not null default 'external',
  phone text,
  address text,
  gst_number text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table repair_orders (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  vehicle_id uuid not null references vehicles(id),
  workshop_id uuid references workshops(id),
  job_card_number text,
  complaint text not null,
  diagnosis text,
  status text not null default 'open',
  opened_at timestamptz not null default now(),
  completed_at timestamptz,
  labour_cost numeric(14,2) default 0,
  parts_cost numeric(14,2) default 0,
  total_cost numeric(14,2) default 0,
  invoice_document_id uuid references documents(id),
  created_by uuid references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table parts (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  vehicle_id uuid references vehicles(id),
  part_type text not null,
  serial_number text,
  brand text,
  model text,
  installed_date date,
  removed_date date,
  warranty_expiry date,
  status text not null default 'installed',
  cost numeric(14,2),
  vendor_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table part_events (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  part_id uuid not null references parts(id),
  vehicle_id uuid references vehicles(id),
  repair_order_id uuid references repair_orders(id),
  event_type text not null,
  event_date timestamptz not null default now(),
  notes text,
  created_by uuid references users(id),
  created_at timestamptz not null default now()
);

create table repair_order_items (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  repair_order_id uuid not null references repair_orders(id),
  part_id uuid references parts(id),
  item_name text not null,
  quantity numeric(12,2) not null default 1,
  unit_cost numeric(14,2) not null default 0,
  total_cost numeric(14,2) not null default 0,
  created_at timestamptz not null default now()
);

create table drivers (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  full_name text not null,
  phone text,
  license_number text,
  license_expiry date,
  medical_fitness_expiry date,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table driver_assignments (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  vehicle_id uuid not null references vehicles(id),
  driver_id uuid not null references drivers(id),
  assigned_from timestamptz not null,
  assigned_to timestamptz,
  notes text,
  created_by uuid references users(id),
  created_at timestamptz not null default now()
);

create table gps_devices (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  vehicle_id uuid references vehicles(id),
  vendor_name text,
  device_imei text,
  sim_number text,
  installed_date date,
  removed_date date,
  warranty_expiry date,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table gps_device_events (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  gps_device_id uuid not null references gps_devices(id),
  vehicle_id uuid references vehicles(id),
  event_type text not null,
  event_date timestamptz not null default now(),
  notes text,
  created_by uuid references users(id),
  created_at timestamptz not null default now()
);

create table insurance_policies (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  vehicle_id uuid not null references vehicles(id),
  insurer_name text not null,
  policy_number text not null,
  policy_type text,
  idv numeric(14,2),
  premium numeric(14,2),
  start_date date,
  end_date date,
  document_id uuid references documents(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table accidents (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  vehicle_id uuid not null references vehicles(id),
  driver_id uuid references drivers(id),
  accident_date timestamptz not null,
  location text,
  description text,
  fir_number text,
  downtime_days integer,
  estimated_repair_cost numeric(14,2),
  final_repair_cost numeric(14,2),
  status text not null default 'reported',
  created_by uuid references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table insurance_claims (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  vehicle_id uuid not null references vehicles(id),
  accident_id uuid references accidents(id),
  insurance_policy_id uuid references insurance_policies(id),
  claim_number text,
  surveyor_name text,
  claimed_amount numeric(14,2),
  approved_amount numeric(14,2),
  settled_amount numeric(14,2),
  status text not null default 'open',
  survey_report_document_id uuid references documents(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table finance_contracts (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  vehicle_id uuid not null references vehicles(id),
  finance_type text not null,
  finance_company text,
  loan_account_number text,
  principal_amount numeric(14,2),
  emi_amount numeric(14,2),
  interest_rate numeric(8,4),
  start_date date,
  end_date date,
  noc_received boolean not null default false,
  hypothecation_removed boolean not null default false,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table ownership_events (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  vehicle_id uuid not null references vehicles(id),
  event_type text not null,
  event_date date not null,
  from_party text,
  to_party text,
  amount numeric(14,2),
  document_id uuid references documents(id),
  notes text,
  created_by uuid references users(id),
  created_at timestamptz not null default now()
);

create table audit_logs (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid references tenants(id),
  actor_user_id uuid references users(id),
  entity_type text not null,
  entity_id uuid,
  action text not null,
  old_values jsonb,
  new_values jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index idx_audit_entity
  on audit_logs(entity_type, entity_id, created_at desc);

