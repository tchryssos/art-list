# Troy's Art List - Development Guide

This is a **Next.js application** using **pnpm** as the package manager. The repository is a photo-blog style application for tracking art that resonates with the user, featuring Spotify integration for music context.

## Key Technologies

Follow the best practices and idiomatic patterns for the following technologies:

- **Frontend**: React, Next.js, TypeScript
- **Styling**: TailwindCSS with custom color palette, CSS modules
- **Database**: PostgreSQL with Prisma ORM
- **State Management**: React Query (@tanstack/react-query), React Context
- **UI Components**: Material-UI (@mui/material), MDI icons
- **Authentication**: JWT with Argon2 password hashing
- **External APIs**: Spotify integration for "listening to" features
- **Testing**: Jest
- **Package Manager**: pnpm (enforced via preinstall script)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── buttons/        # Button variants (Button, SubmitButton)
│   ├── form/           # Form components (Form, Input, AutoComplete, ArtForm)
│   ├── meta/           # Layout and metadata components
│   └── typography/     # Text components (Body, Title)
├── constants/          # Application constants (auth, regex, routing, etc.)
├── logic/
│   ├── api/           # API client functions
│   ├── contexts/      # React contexts (authContext)
│   └── util/          # Utility functions
├── pages/             # Next.js pages and API routes
│   ├── api/          # API endpoints
│   ├── art/          # Art-related pages
│   ├── artists/      # Artist pages
│   └── locations/    # Location pages
└── typings/          # TypeScript type definitions
```

## Code Standards

- Follow TypeScript strict mode configuration
- Use the tilde (`~/*`) path alias for src imports: `import { helper } from '~/logic/util/date'`
- Maintain existing code structure and component organization
- Prioritize changes that reduce complexity and improve readability
- Keep API surface areas small
- Never use `console.log()` in production code - `console.warn` and `console.error` are allowed
- Document public APIs and complex logic
- Avoid adding new dependencies except as a last resort

### Required Before Each Commit

Run these commands to ensure code quality:

```bash
pnpm run lint          # ESLint + Stylelint + Knip pruning
pnpm run test          # Jest tests
pnpm run build         # TypeScript compilation + Prisma generate
```

The project uses Husky with lint-staged for automatic formatting:

- TypeScript/TSX files: Prettier + ESLint
- CSS files: Stylelint
- Markdown files: Prettier

### Import Conventions

```typescript
// ✅ Correct - Use tilde alias for internal imports
import { formatDate } from '~/logic/util/date';
import { ArtForm } from '~/components/form/ArtForm';
import { ROUTES } from '~/constants/routing';

// ✅ Correct - Direct imports for external packages
import { useQuery } from '@tanstack/react-query';
import { Box, Typography } from '@mui/material';

// ❌ Incorrect - Avoid relative paths for internal imports
import { formatDate } from '../../../logic/util/date';
```

### Component Standards

- Use TypeScript interfaces for props (defined in `types.d.ts` files where applicable)
- Follow existing component patterns (see `~/components/buttons/Button.tsx` for reference)
- Use TailwindCSS for styling with the custom color palette from `tailwind.config.ts`
- Export components as named exports (not default exports per ESLint rules)

### Database & API Standards

- Use Prisma for all database operations
- API routes follow REST conventions under `~/pages/api/`
- Database models: `Art`, `Artist`, `Location`, `ListeningTo`
- All models include `createdOn` and `lastModifiedOn` timestamps
- Use cuid() for IDs

### Authentication

- JWT-based authentication with Argon2 password hashing
- Auth context provides user state across the application
- Protected routes should check authentication status

### Spotify Integration

- "Listening To" feature tracks what music was playing when art was encountered
- Spotify data is stored in the `ListeningTo` model
- External URLs and metadata are preserved for reference

### Security

- Validate all user inputs and sanitize data
- Use environment variables for sensitive configuration (see `~/typings/env.d.ts`)
- JWT tokens for API authentication
- Argon2 for password hashing (never plain text)

### Performance

- Use React Query for API state management and caching
- Implement proper loading states with `LoadingSpinner` component
- Pagination is available via the `Pagination` component
- Images are optimized through the custom `Image` and `ArtImg` components

### Scripts Reference

```bash
# Development
pnpm run dev                    # Start development server
pnpm run build                  # Production build
pnpm run build:serve           # Build and serve on port 3003

# Quality Assurance
pnpm run lint                  # Run all linting (ESLint + Stylelint + Knip)
pnpm run test                  # Run Jest tests

# Database
pnpm run prisma:regenerate     # Regenerate Prisma client

# Setup
pnpm run setup                 # Initial project setup (run once)
```

### Pull Request Standards

- Include brief description of changes and how to test locally
- Ensure all linting and tests pass
- Consider impact on existing art, artist, and location data
- Test Spotify integration if modified
- Verify responsive design on different screen sizes
