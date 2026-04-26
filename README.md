# 💰 Fintrack - Personal Finance Manager

Hey! Welcome to **Fintrack** - a web app I built to help you track your money! Whether you're trying to understand where your money goes or planning your investments, this app's got your back.

## 🎯 What is Fintrack?

Fintrack is a personal finance management application that helps you:
- 💳 Track your income and expenses
- 📊 See where your money is going with beautiful charts
- 📈 Monitor your investments
- 🔍 View all your transactions in one place
- 🔐 Keep everything secure with authentication

Basically, it's like having a personal accountant in your pocket (but free and way cooler 😎).

## ✨ Features

### 🔐 Authentication
- Secure login system powered by Supabase
- Verify your email before accessing your finances
- Your data is yours and yours alone

### 📊 Dashboard
- Get a quick overview of your financial health
- See your total income, expenses, and savings
- Visual charts to understand your finances better

### 💵 Income Tracking
- Add your income from different sources
- Track salary, freelance work, side hustles - anything!
- See how much you're earning over time

### 💸 Expense Tracking
- Log every expense you make
- Categorize your spending
- Find out what's eating your budget

### 📈 Investments
- Keep track of your investments
- Monitor your portfolio
- See how your money is growing

### 📋 Transactions
- View all your transactions in a clean list
- Search and filter transactions
- Export your data (future feature 👀)

### 📱 Responsive Design
- Works on desktop, tablet, and mobile
- Beautiful UI that doesn't hurt your eyes
- Smooth animations and transitions

## 🛠️ Tech Stack

I used these awesome technologies:

- **Angular 19** - The frontend framework (JavaScript on steroids)
- **TypeScript** - Makes JavaScript less chaotic
- **Supabase** - Backend and database (it's like Firebase's cool cousin)
- **Chart.js** - For making pretty graphs
- **CSS3** - For styling (yes, I wrote the CSS by hand! 😅)
- **RxJS** - For handling asynchronous stuff smoothly

## 📦 Prerequisites

Before you run this, make sure you have:

1. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
2. **npm** (usually comes with Node.js)
3. **Git** (optional but recommended) - [Download here](https://git-scm.com/)

### How to check if you have them:
```bash
node --version
npm --version
git --version
```

## 🚀 Installation & Setup

### Step 1: Clone or Download the Project
```bash
# If you have git:
git clone https://github.com/Pavanupadhyay27/Fintrack.git
cd Fintrack

# Or just extract the ZIP file and open the folder
```

### Step 2: Install Dependencies
This downloads all the packages the app needs:
```bash
npm install
```
*This might take a few minutes, go grab some coffee ☕*

### Step 3: Start the Development Server
```bash
npm start
```

That's it! Your browser should automatically open to `http://localhost:4200`

If it doesn't, manually go to: **http://localhost:4200**

## 💻 How to Use

1. **Sign Up** - Create an account (email verification required)
2. **Verify Your Email** - Check your inbox and click the verification link
3. **Start Tracking** - Add your income and expenses
4. **Check Your Dashboard** - See your financial overview
5. **Explore** - Check out investments, transactions, and more!

## 📁 Project Structure

```
Fintrack/
├── src/
│   ├── app/
│   │   ├── auth/                 # Login & verification pages
│   │   ├── dashboard/            # Dashboard overview
│   │   ├── expense/              # Expense tracking
│   │   ├── income/               # Income tracking
│   │   ├── investments/          # Investment tracking
│   │   ├── transactions/         # Transaction history
│   │   ├── shared/               # Navbar & sidebar (reusable components)
│   │   ├── app.component.ts      # Main app component
│   │   ├── auth.service.ts       # Authentication logic
│   │   ├── supabase.service.ts   # Database connection
│   │   └── storage.service.ts    # Local storage handling
│   ├── environments/             # Environment configuration
│   ├── main.ts                   # App entry point
│   └── styles.css                # Global styles
├── package.json                  # Project dependencies
├── angular.json                  # Angular configuration
└── README.md                     # This file!
```

## 🎨 Available Commands

```bash
npm start          # Run development server (http://localhost:4200)
npm run build      # Build for production
npm run watch      # Watch mode for development
npm test           # Run unit tests
```

## ⚙️ Configuration

The app is already configured to work with my Supabase backend. If you want to set up your own:

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your API URL and API key
4. Update `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  supabase: {
    url: 'YOUR_SUPABASE_URL',
    key: 'YOUR_SUPABASE_KEY'
  }
};
```

## 🐛 Troubleshooting

### Problem: "npm: command not found"
**Solution:** Node.js isn't installed. Download it from [nodejs.org](https://nodejs.org/)

### Problem: Port 4200 is already in use
**Solution:** Use a different port
```bash
ng serve --port 5000
```

### Problem: "Cannot find module" errors
**Solution:** Reinstall dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

### Problem: The app won't load
**Solution:** Check your internet connection and Supabase credentials

### Problem: Styles look weird
**Solution:** Try clearing your browser cache (Ctrl+Shift+Delete on Chrome)

## 🚀 Building for Production

When you're ready to deploy:

```bash
npm run build
```

This creates an optimized version in the `dist/` folder that you can upload to:
- Netlify
- Vercel
- GitHub Pages
- Any static hosting

## 🎓 What I Learned

Building this project taught me:
- How to work with Angular components
- Authentication and security basics
- Database design with Supabase
- CSS layouts and responsive design
- Git and version control
- How to handle real-world requirements

## 🤔 Known Issues & Limitations

- 📱 Mobile UI could use more polish (future update!)
- 🔄 No real-time sync across multiple devices (yet)
- 💾 Data is stored in Supabase (so no offline mode currently)
- 📊 Export to CSV coming soon!

## 🔮 Future Ideas

Things I want to add:
- 📱 Mobile app version
- 🤖 AI-powered expense categorization
- 💸 Budget planning and alerts
- 👥 Multi-user/family budgeting
- 📊 Advanced analytics and reports
- 🌙 Dark mode
- 💱 Multi-currency support
- 📈 Investment recommendations

## 💡 Tips & Tricks

- Click on charts to see detailed breakdowns
- Use the sidebar to navigate between sections
- Your data is saved automatically
- Check the dashboard regularly to stay on top of your finances!

## 🤝 Contributing

Found a bug? Have a cool idea? Feel free to:
1. Fork the repository
2. Create a branch for your feature
3. Make your changes
4. Submit a pull request!

## 📞 Contact & Support

- **GitHub:** [Pavanupadhyay27](https://github.com/Pavanupadhyay27)
- **Issues:** Found a bug? [Report it here](https://github.com/Pavanupadhyay27/Fintrack/issues)
- **Email:** Feel free to reach out with questions!

## 📄 License

This project is open source and available under the MIT License - basically, do whatever you want with it!

## 🙏 Acknowledgments

- Angular team for the amazing framework
- Supabase for the backend services
- Chart.js for the beautiful charts
- You for checking out this project! 🙌

---

## 🎉 Final Words

I built this project because I wanted to understand my finances better, and I hope it helps you too! Personal finance can be boring, but with the right tools, it doesn't have to be.

If you like Fintrack, please give it a ⭐ on GitHub! It means a lot to me.

**Happy tracking! 💪**

---

*Last updated: April 2026*
*Built with ❤️ by a student who loves coding*
