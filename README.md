# Fintrack - Personal Finance Manager

Fintrack is a personal finance management web application built with Angular. It helps you track your income, expenses, investments, and view all your transactions in one place with visual charts and analytics.

## Features

- User authentication with email verification
- Income and expense tracking
- Investment monitoring
- Transaction history with charts
- Dashboard overview
- Responsive design for all devices

## Tech Stack

- Angular 19
- TypeScript
- Supabase (Backend & Database)
- Chart.js (Data visualization)
- CSS3
- RxJS

## Prerequisites

- Node.js v18 or higher
- npm v9 or higher

Check your versions:
```bash
node --version
npm --version
```

## Installation

1. Extract the project folder or clone from GitHub:
```bash
git clone https://github.com/Pavanupadhyay27/Fintrack.git
cd Fintrack
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open at http://localhost:4200

## How to Use

1. Sign up with your email
2. Verify your email address
3. Log in to your account
4. Add income and expense entries
5. View your dashboard for financial overview
6. Track investments and view all transactions

## Available Commands

```bash
npm start          - Run development server
npm run build      - Build for production
npm run watch      - Watch mode for development
npm test           - Run unit tests
```

## Troubleshooting

If port 4200 is in use, run on a different port:
```bash
ng serve --port 5000
```

To fix dependency issues:
```bash
rm -rf node_modules package-lock.json
npm install
```

## License

MIT License - Open source and free to use
