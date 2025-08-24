# DogMATEs (ImabariOne) - AI Coding Agent Instructions

## Project Overview
DogMATEs is a comprehensive dog care management system built with Next.js 15 that bridges service providers and dog owners. The app operates in dual-mode architecture with mock data during development and FastAPI backend integration for production.

## Architecture & Key Patterns

### Dual-Mode API Architecture
- **Development**: Uses mock data from `lib/mock-data/` via `USE_MOCK_DATA` flag
- **Production**: Connects to FastAPI backend via `lib/api-services.ts`
- **Switch controlled by**: `NEXT_PUBLIC_USE_MOCK_DATA` environment variable and `lib/api-config.ts`

### Authentication & Authorization
- **Context**: `contexts/auth-context.tsx` manages user state with role-based permissions
- **Roles**: `user`, `admin`, `super_admin` with hierarchical permissions
- **Mock users**: Available in auth context for development (email/password pairs documented)
- **Real auth**: JWT token-based via `lib/api-client.ts` TokenManager

### Component Organization
- **Layouts**: `components/main-layout.tsx` for user pages, `app/admin/layout.tsx` for admin
- **Theming**: Extensive theme system via `contexts/theme-context.tsx` with PANTONE brand colors
- **UI**: Radix UI components in `components/ui/` with custom styling
- **Navigation**: Bottom navigation for mobile-first UX

### Data Management
- **Types**: Centralized in `lib/types.ts` - mirrors FastAPI backend schema
- **API Services**: Layer in `lib/api-services.ts` with consistent error handling
- **Mock Data**: Realistic datasets in `lib/mock-data/` for development
- **State**: React Context patterns for auth, profile, and theme

## Development Workflow

### Environment Setup
```bash
# Development with mocks
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_USE_MOCK_DATA=true

# Production
NEXT_PUBLIC_API_URL=https://your-fastapi-backend.azurewebsites.net
NEXT_PUBLIC_USE_MOCK_DATA=false
```

### Build & Deploy Commands
- **Build**: `npm run build` (includes copy-static.js for Azure)
- **Dev**: `npm run dev`
- **Production**: `npm run azure:start` for Azure App Service
- **Deploy**: Custom scripts for Azure (`startup.cmd`, `startup.sh`)

### Testing API Connections
- Use `checkApiHealth()` from `lib/api-client.ts`
- Mock mode always returns healthy
- Real API requires backend health endpoint

## Project-Specific Conventions

### Japanese Language Support
- All UI text in Japanese
- Database fields use Japanese values ('有効', '無効', '保育園', etc.)
- Date formatting with Japanese locale

### File Organization Patterns
- **Pages**: App Router structure in `app/` with nested layouts
- **Admin**: Separate layout and guard in `app/admin/`
- **Components**: Shared in `components/`, UI primitives in `components/ui/`
- **Business Logic**: Services in `lib/`, hooks in `hooks/`

### Styling Approach
- **Tailwind**: Custom config with PANTONE brand colors and Japanese typography
- **CSS Variables**: Extensive theme variables in `styles/globals.css`
- **Mobile-first**: Responsive design with bottom navigation
- **Animations**: Custom keyframes for smooth UX

### Data Relationships
- **Core entities**: User → Owner → Dog → Bookings/Diary/Health records
- **Profile pattern**: AuthContext provides complete user profile with related data
- **Search patterns**: Consistent pagination and filtering across all list views

## Integration Points

### Azure Deployment
- **Target**: Azure App Service with Node.js 18+
- **Configuration**: Environment variables in Azure Portal Application Settings
- **Static files**: Special handling via `copy-static.js` and `web.config`
- **Monitoring**: Azure Portal Log stream for debugging

### FastAPI Backend (Future)
- **Endpoints**: RESTful API defined in `API_ARCHITECTURE.md`
- **Authentication**: JWT with Bearer tokens
- **Database**: MySQL with Japanese text support
- **Error handling**: Consistent ApiResponse<T> pattern

## Common Tasks

### Adding New Features
1. Define types in `lib/types.ts`
2. Add mock data in `lib/mock-data/`
3. Implement service in `lib/api-services.ts`
4. Create React hook in `hooks/use-api.ts`
5. Build UI components following existing patterns

### Admin Features
- Use `AdminGuard` component for protection
- Follow admin layout structure
- Implement role-based access via `useAuth().hasPermission()`

### Mobile Optimization
- Always test with bottom navigation space (`pb-16`)
- Use responsive breakpoints defined in tailwind config
- Consider touch targets and thumb navigation

## Critical Files to Understand
- `lib/api-config.ts` - API endpoints and environment switching
- `contexts/auth-context.tsx` - Authentication and user state
- `lib/types.ts` - Complete data model
- `components/main-layout.tsx` - Core app structure
- `next.config.mjs` - Azure deployment optimizations
