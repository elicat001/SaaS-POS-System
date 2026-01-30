# AGENTS.md - SaaS POS System Development Guide

This document provides essential information for AI agents working on this SaaS POS System project.

## Project Overview

This is a modern restaurant SaaS POS system built with:
- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: FastAPI + Python + SQLAlchemy + SQLite
- **Testing**: Jest + React Testing Library
- **Architecture**: Context API for state management, modular component structure
- **Styling**: Tailwind CSS utility classes (no separate config found)

## Build, Lint, and Test Commands

### Development
```bash
npm run dev              # Start frontend dev server (port 3000)
npm run backend          # Start backend server (port 8000)
```

### Building
```bash
npm run build            # Build production version
npm run preview          # Preview build results
```

### Code Quality
```bash
npm run type-check       # TypeScript type checking (tsc --noEmit)
npm run lint             # ESLint check (no warnings allowed)
```

### Testing
```bash
npm run test             # Run all tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report (min 50% coverage required)

# Run single test file
npx jest tests/components/Login.test.tsx

# Run tests matching pattern
npx jest --testNamePattern="Login Component"

# Run tests in specific directory
npx jest tests/components/

# Run with verbose output for debugging
npx jest tests/components/Login.test.tsx --verbose

# Run specific test case
npx jest -t "should handle successful login"
```

### Backend (Python)
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Code Style Guidelines

### TypeScript/React Conventions

#### Imports Order
1. React imports
2. Third-party libraries
3. Internal modules (types, constants, services)
4. Local components/contexts
5. CSS/asset imports

Example:
```typescript
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import { Order } from '../types';
import { authApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Loading from './ui/Loading';
```

#### Naming Conventions
- **Components**: PascalCase (e.g., `Dashboard.tsx`, `ProductList.tsx`)
- **Functions/Variables**: camelCase (e.g., `calculateTotal`, `userData`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `ORDER_STATUS`, `API_URL`)
- **Types/Interfaces**: PascalCase (e.g., `Order`, `Product`, `UserData`)
- **Files**: kebab-case for non-component files (e.g., `api.ts`, `types.ts`)

#### Component Structure
1. Import statements
2. Type/interface definitions
3. Helper components (if small and component-specific)
4. Main component definition
5. Export default

Example:
```typescript
import React from 'react';
import { Product } from '../types';

interface ProductListProps {
  products: Product[];
  onSelect?: (product: Product) => void;
}

const ProductItem = ({ product }: { product: Product }) => (
  <div>{product.name}</div>
);

const ProductList: React.FC<ProductListProps> = ({ products, onSelect }) => {
  // Component logic here
  return (
    <div>
      {products.map(product => (
        <ProductItem key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
```

#### TypeScript Usage
- Always define prop types with interfaces
- Use `React.FC<Props>` for functional components
- Prefer `interface` over `type` for object definitions
- Use optional chaining (`?.`) and nullish coalescing (`??`)
- Define enum values in `types.ts` for shared types
- **NO** `as any`, `@ts-ignore`, or `@ts-expect-error` allowed

#### Error Handling
- Use try-catch blocks for async operations
- Handle loading and error states in components
- Display user-friendly error messages
- Log errors to console for debugging

Example:
```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const fetchData = async () => {
  setLoading(true);
  setError(null);
  try {
    const data = await api.getData();
    setData(data);
  } catch (err) {
    setError(err instanceof Error ? err.message : '请求失败');
    console.error('Fetch error:', err);
  } finally {
    setLoading(false);
  }
};
```

### Styling (Tailwind CSS)
- Use Tailwind utility classes directly in JSX
- Keep custom CSS to minimum (no separate CSS files found)
- Use responsive prefixes (sm:, md:, lg:)
- Follow color scheme from design system
- Use consistent spacing scale (p-4, m-2, etc.)

### Context API Patterns
- Create contexts in `contexts/` directory
- Provide clear interfaces for context values
- Use custom hooks for context consumption (e.g., `useAuth()`)
- Handle loading states in contexts

### Testing Guidelines

#### Test Structure
- Tests located in `tests/` mirroring source structure
- Use `describe` blocks for component/function grouping
- Use `it` or `test` for individual test cases
- Mock external dependencies (API, localStorage, etc.)

#### Test File Pattern
```typescript
describe('ComponentName', () => {
  beforeEach(() => {
    // Reset mocks and setup
  });

  describe('Rendering', () => {
    it('should render basic elements', () => {});
  });

  describe('Interactions', () => {
    it('should handle user input', () => {});
  });

  describe('API Integration', () => {
    it('should call API on action', () => {});
  });
});
```

#### Mocking Guidelines
- Mock API calls using `jest.mock()`
- Mock React Router hooks
- Mock localStorage and other browser APIs
- Use `jest.clearAllMocks()` in `beforeEach`

### Backend (Python/FastAPI) Guidelines

#### File Structure
- Models in `backend/app/models.py`
- Schemas in `backend/app/schemas.py`
- CRUD operations in `backend/app/crud.py`
- API routes in `backend/app/routers/`

#### Naming Conventions
- **Functions**: snake_case
- **Classes**: PascalCase
- **Variables**: snake_case
- **Constants**: UPPER_SNAKE_CASE

#### API Design
- Use Pydantic models for request/response validation
- Include proper error handling with HTTP status codes
- Document endpoints with docstrings
- Use dependency injection for authentication

## Project-Specific Patterns

### State Management
- Use Context API for global state (Auth, App, Notification)
- Keep component state local when possible
- Use `useMemo` and `useCallback` for performance optimization

### API Integration
- All API calls go through `services/api.ts`
- Handle token refresh automatically
- Implement request/response interceptors
- Use typed API responses

### Component Organization
- Page components in root of `components/`
- UI components in `components/ui/`
- Config components prefixed with `Config`
- Reusable helper components defined within files if small

### Data Flow
1. Context providers wrap application
2. Components consume context via hooks
3. API calls triggered by user actions
4. State updates propagate through context
5. UI re-renders automatically

## Quality Requirements

### Before Committing
1. Run `npm run type-check` - must pass
2. Run `npm run lint` - must pass with zero warnings
3. Run `npm run test` - all tests must pass
4. Ensure test coverage meets 50% minimum

### Code Review Checklist
- [ ] TypeScript types are correct and complete
- [ ] No console.log statements in production code
- [ ] Error handling is implemented
- [ ] Loading states are handled
- [ ] Tests are added/updated
- [ ] Code follows existing patterns
- [ ] No security issues (secrets, XSS, etc.)

## Common Tasks Reference

### Adding a New Component
1. Create file in `components/` with PascalCase name
2. Define interface for props
3. Implement component logic
4. Add to appropriate route in `App.tsx`
5. Create tests in `tests/components/`

### Adding a New API Endpoint
1. Add route in appropriate backend router
2. Define Pydantic schemas
3. Implement CRUD operations
4. Add frontend API service method
5. Update TypeScript types if needed

### Adding Tests
1. Create test file mirroring source structure
2. Mock external dependencies
3. Test rendering, interactions, and edge cases
4. Ensure async operations are properly tested

## Environment Setup

### Required
- Node.js >= 18
- Python >= 3.10
- SQLite (included)

### Environment Variables
- Frontend: `.env.local` with `VITE_API_URL`
- Backend: Optional `GEMINI_API_KEY` for AI features

## Troubleshooting

### Common Issues
- **Type errors**: Run `npm run type-check` for details
- **Test failures**: Check mock implementations
- **Build errors**: Ensure all imports are correct
- **Backend errors**: Check database connection and models

### Debug Commands
```bash
# Check TypeScript errors
npx tsc --noEmit

# Run specific test with debug output
npx jest tests/components/Login.test.tsx --verbose

# Check lint issues
npx eslint . --ext ts,tsx

# Check test coverage
npm run test:coverage
```

## Agent-Specific Notes

### For AI Agents (Sisyphus, etc.)
- This project uses **Context API** not Redux
- **NO ESLint config file found** - uses default ESLint rules
- **NO Tailwind config found** - uses default Tailwind
- Backend uses **FastAPI with SQLAlchemy ORM**
- Frontend uses **Vite** not Create React App
- Tests use **Jest with React Testing Library**
- Always run `npm run type-check` before committing
- Never use `as any` or TypeScript error suppression

---

*Last updated: 2026-01-28*
*Based on analysis of existing codebase patterns*