# Contributing to BaseRush Arena

Thank you for your interest in contributing to BaseRush Arena! This document provides guidelines and information for contributors.

## Code of Conduct

This project follows a code of conduct to ensure a welcoming environment for all contributors.

## How to Contribute

### Reporting Bugs
- Use the GitHub issue tracker
- Provide detailed steps to reproduce
- Include browser/console logs if applicable
- Specify your environment (OS, browser, wallet)

### Suggesting Features
- Check if the feature already exists or is planned
- Provide detailed use cases and benefits
- Consider implementation complexity

### Code Contributions

#### Development Setup
```bash
# Clone the repository
git clone https://github.com/AdekunleBamz/BaseRush-Arena.git
cd BaseRush-Arena

# Install dependencies
npm install

# Start development server
npm run dev
```

#### Code Style
- Use descriptive variable and function names
- Add comments for complex logic
- Follow React best practices
- Use consistent formatting

#### Commit Messages
- Use conventional commit format: `type(scope): description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Keep messages concise but descriptive

#### Pull Requests
- Create a feature branch from `main`
- Ensure tests pass (if applicable)
- Update documentation as needed
- Provide clear description of changes

### Testing
- Test on multiple browsers
- Test with different wallet types
- Verify on Base network testnet before mainnet

### Documentation
- Update README for new features
- Add inline comments for complex code
- Update CHANGELOG.md for significant changes

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── globals.css     # Global styles
│   ├── layout.js       # Root layout
│   └── page.js         # Main page
├── components/         # Reusable components
└── lib/               # Utilities and providers
```

## Smart Contracts

The app interacts with contracts on Base mainnet:
- GamePool: Handles prediction rounds
- RewardVault: Manages staking and rewards
- AchievementNFT: Badge system

Contract addresses are in `src/lib/contracts.js`

## Deployment

The app is designed to deploy to Vercel with minimal configuration.

## Questions?

Feel free to open an issue or discussion on GitHub for questions or clarifications.