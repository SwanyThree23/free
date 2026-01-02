# Contributing to SwanyThree Ultimate Edition

Thank you for your interest in contributing to SwanyThree!

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/swanythree.git`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test thoroughly
6. Commit with clear messages
7. Push to your fork
8. Create a Pull Request

## Development Setup

### Prerequisites
- Docker & Docker Compose
- Node.js 20+
- Git
- API keys (EVMux, Anthropic, OpenRouter)

### Local Development

```bash
# Setup environment
cp .env.example .env
# Edit .env with your API keys

# Start infrastructure
docker-compose up -d postgres redis

# Backend development
cd backend
npm install
npm start

# Frontend development (in another terminal)
cd frontend
npm install
npm run dev
```

## Code Style

### JavaScript/JSX
- Use ES6+ features
- Async/await over callbacks
- Descriptive variable names
- Comments for complex logic
- No console.log in production code

### React Components
- Functional components with hooks
- Props validation
- Meaningful component names
- Keep components focused and small

### Backend
- RESTful API design
- Proper HTTP status codes
- Error handling on all routes
- Input validation
- Parameterized SQL queries

## Testing

### Manual Testing Checklist
- [ ] Authentication works (register/login)
- [ ] Streams can be created
- [ ] Streams can be started/stopped
- [ ] WebSocket connection stable
- [ ] AI moderation analyzes messages
- [ ] AI tools respond correctly
- [ ] No console errors
- [ ] Responsive design works

## Database Migrations

When adding database changes:

1. Create new migration file: `migrations/00X_description.sql`
2. Test migration on clean database
3. Document schema changes in CHANGELOG.md
4. Update README.md schema section

## Pull Request Guidelines

### PR Title Format
- `feat: Add new feature`
- `fix: Fix bug in component`
- `docs: Update documentation`
- `style: Format code`
- `refactor: Refactor service`
- `test: Add tests`
- `chore: Update dependencies`

### PR Description Should Include
- What changed
- Why it changed
- How to test
- Screenshots (for UI changes)
- Breaking changes (if any)

### Before Submitting
- [ ] Code follows project style
- [ ] All tests pass
- [ ] Documentation updated
- [ ] No console errors
- [ ] Tested in Docker environment
- [ ] CHANGELOG.md updated

## Areas for Contribution

### High Priority
- Unit tests for backend services
- Integration tests
- E2E tests with Cypress/Playwright
- Performance optimization
- Security enhancements
- Accessibility improvements

### Features
- Stream recording management
- User profile customization
- Advanced moderation rules
- Stream analytics
- Multi-language support
- Mobile app

### Documentation
- Video tutorials
- API examples
- Deployment guides
- Troubleshooting additions

## Bug Reports

Use GitHub Issues with:
- Clear description
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots/logs
- Environment details

## Feature Requests

Use GitHub Issues with:
- Use case description
- Proposed solution
- Alternative solutions
- Additional context

## Questions?

- Open a GitHub Issue
- Tag with `question` label
- We'll respond ASAP

## Code of Conduct

- Be respectful
- Be constructive
- Focus on the code, not the person
- Welcome newcomers
- Help others learn

Thank you for contributing!
