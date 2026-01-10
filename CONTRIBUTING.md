# Contributing to Trove 💎

First off, thank you for considering contributing to Trove! It's people like you who make Trove a better tool for everyone.

## 🌈 Code of Conduct

By participating in this project, you agree to abide by the same standards of respect and professionalism expected in any open-source community.

## 🚀 How Can I Contribute?

### Reporting Bugs

- Use the GitHub issue tracker.
- Check if the bug has already been reported.
- If not, create a new issue with a clear title and a detailed description, including steps to reproduce.

### Suggesting Enhancements

- Open a new issue with the tag `enhancement`.
- Describe the feature you'd like to see and why it would be useful for Trove users.

### Pull Requests

1. **Fork the repo** and create your branch from `main`.
2. **Setup your environment** using `pnpm install`.
3. **Make your changes**. If you've added code that should be tested, add tests.
4. **Ensure the project builds** with `pnpm build`.
5. **Issue a pull request!**

## 💻 Development Workflow

Trove uses **pnpm** as its package manager. Please ensure you use it for all dependency related tasks.

```bash
# Install dependencies
pnpm install

# Start the dev server
pnpm dev

# Check for lint issues
npx next lint
```

## 🎨 Coding Standards

- **TypeScript**: All new code should be written in TypeScript.
- **Tailwind CSS**: Use Tailwind CSS v4 utility classes. Follow the canonical syntax (e.g., use `class!` for important modifiers).
- **Icons**: Use [Lucide React](https://lucide.dev/) icons.
- **Git Hooks**: Please ensure your commit messages are descriptive.

## 📬 Pull Request Process

1. Update the README.md with details of changes to the interface, if applicable.
2. The PR will be reviewed by the maintainers. They might suggest some changes or improvements.
3. Once approved, your PR will be merged!

---

Thank you for your contribution! ✨
