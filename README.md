# OWCA Exam Planner Frontend

[![PR Checks](https://github.com/O-W-C-A/owca-exam-planner-frontend/actions/workflows/pr-checks.yml/badge.svg)](https://github.com/O-W-C-A/owca-exam-planner-frontend/actions/workflows/pr-checks.yml)

## Overview

OWCA Exam Planner is a web application for managing university exam schedules. It supports multiple user roles (students, professors, student leaders) and provides features for exam scheduling, request management, and calendar views.

## Features

- 🔐 Role-based authentication
- 📅 Interactive calendar interface
- 📝 Exam request management
- 👥 Multiple user roles (Professor, Student, Student Leader)
- 📱 Responsive design
- 🌐 Real-time updates

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- React Big Calendar
- Axios for API calls
- Context API for state management

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

## Getting Started

1. **Clone the repository**
```bash
git clone https://github.com/O-W-C-A/owca-exam-planner-frontend
cd owca-exam-planner-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
# For development with Azure backend
npm run dev

# For development with localhost backend
npm run dev:localhost
```

4. **Build for production**
```bash
npm run build
```

## Environment Setup

Create a `.env` file in the root directory:

```env
NEXT_PUBLIC_BASE_URL=https://owca-exam-planner.azurewebsites.net/
```

For local development:
```env
NEXT_PUBLIC_BASE_URL=https://localhost:7267/
```

## Project Structure

```
owca-exam-planner-frontend/
├── app/
│   ├── components/     # Shared components
│   ├── dashboard/      # Dashboard pages
│   │   ├── professor/
│   │   ├── student/
│   │   └── studentleader/
│   └── contexts/       # React contexts
├── utils/             # Utility functions
├── hooks/             # Custom React hooks
└── public/            # Static assets
```

## Contributing

1. Create a new branch
2. Make your changes
3. Submit a pull request

## License

This project is licensed under the MIT License.

---
![](https://m.media-amazon.com/images/I/71ZjnV1eQYL.__AC_SX300_SY300_QL70_FMwebp_.jpg)
![](https://m.media-amazon.com/images/I/71ZjnV1eQYL.__AC_SX300_SY300_QL70_FMwebp_.jpg)
![](https://m.media-amazon.com/images/I/71ZjnV1eQYL.__AC_SX300_SY300_QL70_FMwebp_.jpg)
![](https://m.media-amazon.com/images/I/71ZjnV1eQYL.__AC_SX300_SY300_QL70_FMwebp_.jpg)
