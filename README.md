# Nearverse - Location-Based Social Media App

## Overview
Nearverse is a social media application that connects people based on their geographic location and shared skills. The application features a modern, elegant UI with glassmorphism effects, smooth animations, and intuitive user experience.

## Key Features

### Authentication
- **Email/Password**: Traditional sign up and sign in functionality
- **Google OAuth**: One-tap sign in with Google accounts
- **Secure**: All authentication handled by Supabase with industry-standard security measures

### Profile Management
- Customizable profiles with name, skills (as tags), bio, and location
- Automatic location detection via browser geolocation (with user permission)
- Skills displayed as interactive tags for easy visualization

### Discovery & Connection
- Location-based user discovery with adjustable search radius (10km, 20km, 50km)
- Distance calculation using the Haversine formula for accurate measurements
- Shared skills highlighting to identify common interests
- Connect/follow functionality to build your network

### User Experience
- **Modern Design**: Glassmorphism effects with blurred backgrounds
- **Subtle 3D Effects**: Transform animations on hover and interaction
- **Smooth Transitions**: All state changes feature elegant animations
- **Responsive Layout**: Works seamlessly on mobile and desktop devices
- **Loading States**: Elegant spinners and skeleton loaders
- **Error Handling**: User-friendly error messages and recovery options

## Technology Stack

### Frontend
- **React 19**: Latest React features with hooks
- **Vite**: Fast build tool and development server
- **TypeScript**: Type safety and improved developer experience
- **Tailwind CSS**: Utility-first styling for rapid UI development
- **React Router v6**: Client-side routing with proper auth handling
- **Lucide React**: Beautiful, consistent icon set
- **Zustand**: Lightweight state management

### Backend & Infrastructure
- **Supabase**: 
  - Authentication (email/password, Google OAuth)
  - PostgreSQL database for user profiles
  - Row Level Security (RLS) for data protection
- **Vercel**: Production deployment and hosting

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd nearverse
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Supabase:
   - Create a project at [supabase.com](https://supabase.com)
   - Enable Google authentication in Settings > Auth > Providers
   - Configure your Google OAuth credentials
   - Copy your project URL and anon key

4. Create environment file:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. Set up the database:
   ```sql
   -- Copy and paste this into your Supabase SQL editor
   create table profiles (
     id uuid references auth.users not null primary key,
     full_name text,
     skills text[],
     bio text,
     latitude decimal,
     longitude decimal,
     updated_at timestamp with time zone default timezone('utc'::text, now()) not null
   );

   alter table publications enable row level security;

   create policy "Public profiles are viewable by everyone"
     on profiles for select
     using (true);

   create policy "Users can insert their own profile"
     on profiles for insert
     with check (auth.uid() = id);

   create policy "Users can update own profile"
     on profiles for update
     using (auth.uid() = id);
   ```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at http://localhost:5173

### Building for Production

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

### Deployment

#### Vercel Deployment
1. Install Vercel CLI (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy to Vercel:
   ```bash
   npm run deploy
   ```
   Or directly with Vercel:
   ```bash
   vercel --prod
   ```

Make sure to set the environment variables in your Vercel project settings:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Database Schema

```sql
create table profiles (
  id uuid references auth.users not null primary key,
  full_name text,
  skills text[],
  bio text,
  latitude decimal,
  longitude decimal,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table publications enable row level security;

create policy "Public profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);
```

## API Routes

The application uses Supabase for all backend operations:
- Authentication: `/auth/*` (handled by Supabase)
- Profile data: Direct Supabase queries from client
- Real-time updates: Supabase Realtime (if implemented)

## Component Structure

```
src/
├── components/
│   ├── SignInForm.tsx      # Authentication form (email/password + Google)
│   ├── ProfileSetup.tsx    # Profile creation/editing form
│   └── UserCard.tsx        # Individual user display card
├── pages/
│   └── Home.tsx           # Main discovery page with nearby users
├── lib/
│   └── supabase.ts        # Supabase client initialization
└── App.tsx                # Main application component with routing
```

## Design Principles

### Visual Design
- **Glassmorphism**: Semi-transparent backgrounds with blur effects
- **Color Scheme**: Indigo-purple gradients for primary actions
- **Typography**: Clear hierarchy with appropriate font weights
- **Spacing**: Consistent 4px grid system for precise layout
- **Shadows**: Subtle elevation for depth perception

### Interaction Design
- **Hover States**: Interactive elements respond to user input
- **Focus States**: Accessible keyboard navigation support
- **Loading States**: Visual feedback during asynchronous operations
- **Error States**: Clear messaging with recovery options
- **Transitions**: Smooth animations between states (200ms default)

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: ≥ 640px
- Desktop: ≥ 1024px
- Large Desktop: ≥ 1280px

## Security Considerations

### Authentication Security
- Passwords hashed using industry-standard bcrypt
- Google OAuth using secure OAuth 2.0 flows
- Session management handled by Supabase
- Protection against common web vulnerabilities (XSS, CSRF)

### Data Protection
- Row Level Security (RLS) policies restrict data access
- Public profiles readable by all, private data protected
- Input sanitization and validation on all user-submitted data
- Environment variables keep secrets out of codebase

### Privacy Controls
- Users control what information appears in their profile
- Location sharing requires explicit user permission
- No personal data shared without consent

## Performance Optimization

### Code Splitting
- Dynamic imports for route-based code splitting
- Vite's built-in optimization for production builds

### Asset Optimization
- Tailwind CSS purging removes unused styles in production
- Image optimization through modern formats
- Efficient bundling with Rollup (via Vite)

### Runtime Performance
- Efficient re-renders with React.memo where appropriate
- Memoized expensive calculations
- Virtual scrolling considerations for large lists (if implemented)

## Testing & Quality Assurance

### Type Safety
- End-to-end TypeScript coverage
- Strict compiler options for early error detection
- Interface definitions for all props and state

### Code Quality
- ESLint with React-specific plugins
- Prettier for consistent code formatting
- Regular dependency updates for security patches

### Responsive Testing
- Manual testing across device sizes
- Browser developer tools responsive design mode
- Consideration for touch vs. cursor interactions

## Future Enhancements

### Planned Features
- Real-time chat between connected users
- Event creation and discovery based on location
- Advanced filtering by skills and interests
- Achievements and gamification elements
- Enhanced profile customization options

### Technical Improvements
- Service workers for offline capabilities
- Progressive Web App (PWA) features
- Server-side rendering for improved SEO
- Internationalization (i18n) support
- Dark/light theme toggle

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Supabase for the excellent open-source Firebase alternative
- Vercel for seamless deployment experience
- Tailwind CSS for utility-first styling approach
- Lucide icons for beautiful, consistent iconography
- The open-source community for inspiration and support

---

Built with ❤️ for connecting people through location and shared interests.