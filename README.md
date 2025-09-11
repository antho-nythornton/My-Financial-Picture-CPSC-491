# My Financial Picture

This project aims to develop a modern personal finance management platform, providing users with a centralized hub for tracking financial accounts, budgeting and expense categorization. Initially, the new platform will rely on user inputs tied to a secure database that will offer synchronization of bank accounts, investments, cryptocurrency, and any financial data that users decide to add. Unlike its predecessor, which has been discontinued, this project seeks to improve upon Mint.com’s original features by incorporating AI-driven insights. 

The platform will be designed for **web** use, ensuring accessibility and convenience for users seeking a comprehensive financial dashboard. Documentation provided outlines the proposed scope, architecture, and roadmap for developing this project as a senior capstone project that covers the breadth of computer science.

## Architecture Overview

### Microservices-Inspired Modular Monolith
**Logical Modules**
- User Authentication and Authorization
- Settings / Profile Management
- Financial Account Management
- Financial Dashboard
- Financial Risk Assistant** (AI-powered)

### Frontend
- **Framework:** React.js (SPA)
- **Features:**
  - Responsive UI with dashboard layout
  - Dynamic dashboard updates
  - Mobile-friendly version

### Backend
- **Framework:** FastAPI, Flask, or Django
- **Responsibilities:**
  - Serve endpoints for users and financial data
  - Authenticate and authorize users (JWT or session-based)
  - Interact with external APIs

### Database Layer
- **Database:** MySQL (users, accounts, transactions)
- **Schema Design:** User, Accounts, Transactions tables with relationships

### External Integrations
- **AWS Bedrock:** Integration with AI foundational modules hosted on AWS
- **Email Service:** For alerts or account verification

### Authentication & Security
- **Auth:** OAuth2 / JWT support with FastAPI
- **Security:** Password hashing, secure session management

### DevOps
- **Containerization:** Docker
- **Deployment:** AWS
- **CI/CD:** GitHub Actions with automated testing