create table vehicles (
  id text primary key,
  registration_number text not null unique,
  chassis_number text not null unique,
  make text not null,
  model text not null,
  asset_belongs_to text not null default 'Own Asset',
  branch text not null,
  status text not null,
  risk text,
  next_action text,
  created_at timestamptz not null default now()
);

create table documents (
  id text primary key,
  vehicle_id text references vehicles(id),
  document_type text not null,
  document_number text,
  file_url text,
  expiry_date date,
  status text not null,
  uploaded_by text,
  created_at timestamptz not null default now()
);

create table repair_orders (
  id text primary key,
  vehicle_id text references vehicles(id),
  problem text not null,
  repair_type text not null,
  service_centre text,
  status text not null,
  labour_cost numeric(14, 2) default 0,
  parts_cost numeric(14, 2) default 0,
  towing_cost numeric(14, 2) default 0,
  gst numeric(14, 2) default 0,
  total_cost numeric(14, 2) default 0,
  approval_required text,
  created_at timestamptz not null default now()
);

create table approval_matrix (
  id text primary key,
  request_type text not null,
  condition_text text not null,
  level_1 text not null,
  level_2 text,
  level_3 text,
  sla text,
  status text not null default 'Active'
);

create table insurance_policies (
  id text primary key,
  vehicle_id text references vehicles(id),
  insurer text not null,
  policy_number text not null,
  idv numeric(14, 2),
  expiry_date date,
  claim_status text,
  fir_status text,
  survey_status text,
  repair_estimate numeric(14, 2),
  expected_settlement numeric(14, 2)
);

create table sold_vehicles (
  id text primary key,
  vehicle_registration text not null,
  purchase_cost numeric(14, 2),
  sold_date date not null,
  buyer text not null,
  sale_value numeric(14, 2),
  transfer_status text not null
);

create table alerts (
  id text primary key,
  vehicle_id text references vehicles(id),
  due_date date,
  title text not null,
  priority text not null,
  status text not null default 'Open'
);

create table vehicle_timeline_events (
  id text primary key,
  vehicle_id text references vehicles(id),
  event_date date not null,
  title text not null,
  description text,
  created_at timestamptz not null default now()
);
