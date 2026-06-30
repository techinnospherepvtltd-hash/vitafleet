# First Build Roadmap

## Recommended Build Order

### Milestone 1: Foundation App

Goal:
Create the base SaaS application.

Deliverables:

- Login page
- Tenant/company setup
- User roles
- Main dashboard shell
- Audit log foundation
- PostgreSQL database connected

### Milestone 2: Vehicle Master

Goal:
Create and manage vehicle records.

Deliverables:

- Vehicle list
- Vehicle create/edit form
- Vehicle detail page
- Vehicle status
- Vehicle QR code
- CSV/Excel import

### Milestone 3: Vehicle Timeline

Goal:
Every major action appears in one chronological history.

Deliverables:

- Timeline component on vehicle detail page
- Timeline event creation from vehicle updates
- Manual timeline notes
- Filters by event type

### Milestone 4: Document Vault and Expiry Alerts

Goal:
Manage documents and due dates.

Deliverables:

- Document upload
- Document type classification
- Expiry date tracking
- Compliance dashboard
- Upcoming expiry alerts
- Email reminders

### Milestone 5: Repairs and Parts

Goal:
Track maintenance cost and part lifecycle.

Deliverables:

- Workshop master
- Repair job cards
- Repair order status flow
- Parts used in repair
- Battery history
- Tyre history
- Vehicle repair cost summary

### Milestone 6: Accidents, Claims, Drivers

Goal:
Connect accidents, claims, and driver responsibility.

Deliverables:

- Driver master
- Driver assignment timeline
- Accident reporting
- Insurance claim tracking
- FIR/survey/claim document links

### Milestone 7: Executive Dashboard and Reports

Goal:
Make the product useful for management.

Deliverables:

- Fleet status dashboard
- Compliance due report
- Repair cost report
- Downtime report
- High-cost vehicle report
- Vehicle lifecycle export

## First UI Screens to Build

1. Login
2. Dashboard
3. Vehicle list
4. Add vehicle
5. Vehicle detail
6. Vehicle timeline
7. Documents tab
8. Repairs tab
9. Parts tab
10. Alerts page

## Development Recommendation

Use this stack for the first working version:

- Next.js
- TypeScript
- PostgreSQL
- Prisma
- Tailwind CSS or shadcn/ui
- S3-compatible file storage
- Redis-backed background jobs later

## Product Rule

Every important action should create a timeline event and an audit log.

Example:

- Upload insurance document
- Create document record
- Create compliance item for insurance expiry
- Create vehicle timeline event
- Create audit log entry

This makes the system trustworthy and valuable.

