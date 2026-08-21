# HR SaaS

> A modern Human Resource Management System built to simplify employee management, attendance, leave management, payroll, and organizational workflows.

HR SaaS is a full-stack HR management platform designed around real-world business workflows rather than simple CRUD operations.

The system provides a centralized platform for managing employees, departments, positions, shifts, attendance, leave requests, payroll, announcements, notifications, roles, and permissions.

The project was built with a strong focus on **business logic, authorization, maintainability, testing, and real-world HR workflows**.

---

## ✨ Features

### 👥 Employee Management

- Employee profile management
- Department and position assignment
- Shift assignment
- Employee status management
- Personal and employment information
- Role-based access to employee data

### 🏢 Organization Management

- Departments
- Positions
- Organizational structure
- Configurable employee assignments
- Manager-oriented dashboards

### 🔐 Authentication & Authorization

- ASP.NET Core Identity
- Secure authentication
- Role-based authorization
- Permission-based access control
- Custom roles and permissions
- Protected API endpoints
- Employee and management access separation

The authorization system is designed around granular permissions such as:

```text
Users_view
Users_post
Users_edit
Users_delete
```

This allows the system to control access at the feature/action level rather than relying only on predefined roles.

### ⏰ Attendance Management

- Daily attendance management
- Check-in / check-out
- Present and absent status
- Shift-based working hours
- Late arrival tracking
- Overtime calculation
- Worked-hours calculation
- Attendance history
- Manager-controlled attendance
- Attendance correction

The attendance module is designed around employee shifts and working schedules instead of treating attendance as simple check-in records.

### 🕐 Shift Management

- Shift creation and management
- Employee shift assignment
- Daily working schedules
- Start/end time configuration
- Shift-aware attendance calculations
- Late and overtime calculation

### 🏖️ Leave Management

- Leave type management
- Leave requests
- Leave approval workflow
- Leave rejection
- Leave balances
- Annual leave limits
- Date-range leave requests
- Leave history
- Monthly leave reporting

The system calculates remaining leave based on approved requests and configured annual limits.

### 💰 Payroll Management

- Employee salary definitions
- Salary components
- Payroll periods
- Payroll payments
- Salary history
- Allowances and deductions
- Base salary
- Housing allowance
- Food allowance
- Transportation allowance
- Child allowance
- Seniority allowance
- Overtime
- Late deductions
- Absence deductions
- Tax
- Insurance

Payroll is designed as a separate workflow consisting of salary definitions, payroll periods, calculations, and payment records.

### 📢 Announcements

- Organization announcements
- Department-targeted announcements
- Announcement management
- Employee notifications

### 🔔 Notifications

- User notifications
- Notification history
- Read/unread state
- Event-based notifications
- Notification management

### 📊 Dashboards & Reports

- Employee dashboard
- Management dashboard
- Attendance reports
- Leave reports
- Payroll information
- Monthly HR data
- Employee-specific information

---

# 🛠️ What Has Been Built

This project is more than a collection of CRUD endpoints.

The main goal was to model several interconnected HR workflows and make them work together as a coherent system.

### Backend

The backend was developed using ASP.NET Core with a focus on:

- RESTful API design
- Entity Framework Core
- ASP.NET Core Identity
- SQL Server
- Role and permission authorization
- Business-rule validation
- Entity relationships
- Auditable entities
- Date and time handling
- Payroll calculations
- Attendance calculations
- Leave balance calculations

### Frontend

The frontend provides a modern management interface built around reusable components and data-driven screens.

Major frontend work includes:

- React application architecture
- TypeScript
- React Hook Form
- Zod validation
- TanStack Table
- reusable dialogs
- reusable forms
- API hooks
- protected routes
- role/permission-aware navigation
- responsive management dashboards
- Shadcn UI components

---

# 🧠 Main Engineering Challenges

One of the main purposes of this project was to solve problems that appear in real business applications.

## 1. Modeling HR Business Rules

HR systems contain many rules that cannot be represented by simple CRUD operations.

For example:

```text
Shift
   ↓
Attendance
   ↓
Worked Hours
   ↓
Late / Overtime
   ↓
Payroll
```

A change in one part of the system can affect another part.

The project therefore required careful modeling of relationships between employees, shifts, attendance, leave, salary, payroll periods, and payments.

---

## 2. Attendance Calculation

Attendance is not simply a `CheckIn` and `CheckOut` record.

The system needs to consider:

- Employee shift
- Working day
- Shift start time
- Shift end time
- Check-in time
- Check-out time
- Late arrival
- Overtime
- Missing attendance
- Working hours

This required separating raw attendance data from calculated business information.

---

## 3. Payroll Modeling

Payroll was another major challenge because salary information changes over time.

The system separates:

```text
Employee Salary
        ↓
Payroll Period
        ↓
Payroll Calculation
        ↓
Payroll Payment
```

This makes it possible to keep salary definitions and monthly payroll/payment records separate.

Salary history can therefore be preserved instead of overwriting previous salary configurations.

---

## 4. Persian Calendar Support

Because the application targets organizations that may operate using the Persian calendar, date handling required additional consideration.

The system uses:

- `DateOnly`
- `DateTime`
- `PersianCalendar`

to convert and process Persian year/month values while keeping the underlying database model consistent.

This becomes particularly important for:

- payroll periods
- monthly reports
- leave reports
- salary effective dates
- attendance reports

---

## 5. Dynamic Authorization

A predefined `Admin / Manager / Employee` role structure is often insufficient for real organizations.

The system therefore supports configurable roles and granular permissions.

For example:

```text
Users_view
Users_post
Users_edit
Users_delete
```

This allows administrators to create roles based on actual organizational responsibilities.

---

## 6. Database Relationships

The HR domain contains many interconnected entities:

```text
User
 ├── Department
 ├── Position
 ├── Shift
 ├── Attendance
 ├── Leave Requests
 ├── Salary
 ├── Payroll
 └── Notifications
```

Designing these relationships while avoiding unwanted cascade behaviors, circular dependencies, and data integrity issues was an important part of the project.

---

# 🧪 Testing

Testing is an important part of the project's development process.

The test strategy is intended to cover different levels of the application:

### Unit Tests

Focused on isolated business logic such as:

- payroll calculations
- leave calculations
- attendance calculations
- validation rules
- utility functions

### Integration Tests

Focused on interactions between:

- API endpoints
- Entity Framework Core
- SQL Server
- authentication
- authorization
- database operations

### API Tests

Focused on complete HTTP workflows including:

- authentication
- authorization
- CRUD operations
- validation
- HTTP responses
- business rules

The project also uses test-specific database infrastructure to make integration tests reproducible and isolated.

---

# 🏗️ Architecture

The application follows a client/server architecture:

```text
┌─────────────────────────────┐
│        React Frontend       │
│       TypeScript / Vite     │
└──────────────┬──────────────┘
               │ HTTP / REST
               ▼
┌─────────────────────────────┐
│       ASP.NET Core API      │
│                             │
│ Authentication              │
│ Authorization               │
│ Business Logic              │
│ Validation                  │
│ Controllers                 │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│        Entity Framework     │
│             Core            │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│          SQL Server         │
└─────────────────────────────┘
```

The frontend and backend are intentionally separated so that the API can be consumed by other clients in the future.

---

# 🧰 Tech Stack

## Backend

- **ASP.NET Core**
- **.NET 10**
- **Entity Framework Core**
- **ASP.NET Core Identity**
- **SQL Server**
- REST API

## Frontend

- **React**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **Shadcn UI**
- **Radix UI**
- **TanStack Table**
- **React Hook Form**
- **Zod**

## Development & Infrastructure

- Git
- GitHub
- Docker
- SQL Server
- API testing tools
- Automated testing

---
<!-- 
# 📚 Documentation

The documentation is intentionally divided into smaller sections so that each part of the system can be understood independently.

## Core Documentation

- [ ] Architecture
- [ ] Project Structure
- [ ] Database Design
- [ ] Authentication
- [ ] Authorization & Permissions
- [ ] API Conventions
- [ ] Error Handling
- [ ] Validation
- [ ] Testing Strategy

## HR Modules

- [ ] Employee Management
- [ ] Departments
- [ ] Positions
- [ ] Shifts
- [ ] Attendance
- [ ] Leave Management
- [ ] Payroll
- [Announcements
- [ ] Notifications

## Frontend Documentation

- [ ] Frontend Architecture
- [ ] Routing
- [ ] Authentication State
- [ ] API Hooks
- [ ] Forms & Validation
- [ ] Tables
- [ ] Reusable Components
- [ ] Permission-Based UI

## Backend Documentation

- [ ] API Architecture
- [ ] Controllers
- [ ] Entity Framework Core
- [ ] Identity
- [ ] Authorization
- [ ] Business Rules
- [ ] Database Relationships
- [ ] Testing Infrastructure

## Deployment

- [ ] Local Development
- [ ] Environment Variables
- [ ] Docker
- [ ] SQL Server Configuration
- [ ] Production Deployment

---

# 🗺️ Roadmap

The project is continuously evolving.

Potential future improvements include:

- [ ] Advanced reporting and analytics
- [ ] More payroll automation
- [ ] Payroll export
- [ ] Payslip generation
- [ ] Attendance machine integration
- [ ] QR-based attendance
- [ ] Geolocation-based attendance
- [ ] Email notifications
- [ ] Real-time notifications
- [ ] Employee self-service improvements
- [ ] Performance management
- [ ] Recruitment module
- [ ] Document management
- [ ] Audit logging improvements
- [ ] More comprehensive automated tests
- [ ] CI/CD pipeline
- [ ] Multi-tenant architecture

--- -->

# 🎯 Project Goals

HR SaaS was built with several goals in mind:

1. Build a realistic HR management system rather than a simple CRUD application.
2. Practice designing business-heavy backend systems.
3. Implement authentication and fine-grained authorization.
4. Work with complex relational data using Entity Framework Core.
5. Model real HR workflows such as attendance, leave, and payroll.
6. Build a maintainable React + ASP.NET Core architecture.
7. Introduce automated testing for critical business logic.
8. Create documentation that explains both the technical and business sides of the system.

---

# 🚀 Why This Project?

The project demonstrates experience with a business domain where correctness matters more than simply displaying data.

Instead of focusing only on creating pages and endpoints, HR SaaS focuses on:

- Business rules
- Data integrity
- Authorization
- Workflow design
- Relational database modeling
- Date and time complexity
- Financial calculations
- API design
- Frontend architecture
- Automated testing
- Maintainability

This makes HR SaaS a practical full-stack project demonstrating how a real-world management platform can be designed and implemented.

---

## 📌 Project Status

**Status:** Active Development

The core HR workflows are implemented, while additional modules, testing coverage, documentation, and infrastructure improvements are being developed incrementally.
