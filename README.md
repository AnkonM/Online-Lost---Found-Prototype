# Lost & Found Portal

An online lost and found portal for institutions like college campuses. This project consists of a Django REST API backend and a React.js frontend.

## 🚀 GitHub Pages Deployment

This project's frontend is configured for deployment to GitHub Pages. The frontend can be hosted as a static site, while the backend requires a separate hosting solution.

📖 **For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)**

### Quick Start

The repository includes a GitHub Actions workflow that automatically deploys the frontend to GitHub Pages when you push to the `main` branch.

**To enable GitHub Pages:**

1. Go to your repository on GitHub
2. Click on **Settings** → **Pages**
3. Under "Build and deployment":
   - Set **Source** to "GitHub Actions"
4. Push to the `main` branch or manually trigger the workflow from the **Actions** tab
5. Your site will be available at: `https://AnkonM.github.io/Online-Lost---Found-Prototype`

### Manual Deployment

You can also deploy manually using the gh-pages package:

```bash
cd frontend
npm install
npm run deploy
```

### Important Notes

- **Frontend Only**: GitHub Pages hosts static files, so only the React frontend can be deployed this way
- **Backend Hosting**: The Django backend requires a server environment (see [DEPLOYMENT.md](DEPLOYMENT.md) for options)
- **API Configuration**: After deploying, update the API endpoint in the frontend to point to your hosted backend

## Features

- **User Registration and Authentication**: Basic user registration and login with JWT tokens
- **Post Items**: Users can post lost or found items with details, location, date, and images
- **Search and Filter**: Search items by keywords, filter by type (lost/found) and date range
- **Admin Moderation**: Admins can approve or reject posted items
- **User Dashboard**: Users can view and manage their posted items
- **Responsive Design**: Works on desktop and mobile devices

## Project Structure

```
OOSE Prototype/
├── backend/          # Django REST API
│   ├── lostfound/   # Main Django project
│   ├── users/       # User management app
│   ├── items/       # Items management app
│   └── manage.py
└── frontend/        # React.js frontend
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── context/
    │   └── services/
    └── public/
```

## Prerequisites

- Python 3.8+
- Node.js 14+ and npm
- SQLite (default) or PostgreSQL

## Backend Setup

### Quick Setup (Recommended)

1. Navigate to the backend directory:
```bash
cd backend
```

2. Run the setup script:
```bash
./setup.sh
```

This will:
- Create a virtual environment (if it doesn't exist)
- Install all dependencies
- Run database migrations
- Create necessary directories

3. Start the server using the run script:
```bash
./run.sh
```

Or manually:
```bash
source venv/bin/activate
python manage.py runserver
```

### Manual Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

5. Create media directory:
```bash
mkdir -p media/items
```

6. Create a superuser (optional, for admin panel):
```bash
python manage.py createsuperuser
```

7. **IMPORTANT**: Always activate the virtual environment before running commands:
```bash
source venv/bin/activate  # Must run this first!
python manage.py runserver
```

The backend will be available at `http://localhost:8000`

**Note**: If you get `ModuleNotFoundError: No module named 'rest_framework'`, make sure you've activated the virtual environment first using `source venv/bin/activate`.

## Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register/` - Register a new user
- `POST /api/auth/login/` - Login and get JWT tokens

### Items
- `GET /api/items/` - List all approved items (or all items for admins)
- `POST /api/items/` - Create a new item (requires authentication)
- `GET /api/items/{id}/` - Get item details
- `PATCH /api/items/{id}/update_status/` - Update item status (admin only)
- `GET /api/items/my_items/` - Get current user's items
- `GET /api/items/pending_items/` - Get pending items (admin only)

### Search and Filter
- `GET /api/items/?search=keyword` - Search by keywords
- `GET /api/items/?type=lost` - Filter by type (lost/found)
- `GET /api/items/?date_from=YYYY-MM-DD&date_to=YYYY-MM-DD` - Filter by date range

## Creating Admin Users

To create an admin user, you can:

1. Use Django admin panel:
   - Access `http://localhost:8000/admin/`
   - Log in with superuser credentials
   - Go to Users and change the role to "Admin"

2. Use Django shell:
```bash
python manage.py shell
>>> from users.models import User
>>> user = User.objects.get(email='user@example.com')
>>> user.role = 'admin'
>>> user.save()
```

## Default Database

The project uses SQLite by default (`db.sqlite3`). For production, consider switching to PostgreSQL by updating `settings.py`.

## Notes

- This is a demonstration project. Security features are implemented at a basic level.
- Images are stored locally in the `backend/media/items/` directory.
- JWT tokens expire after 24 hours (configurable in `settings.py`).
- Only approved items are visible to non-admin users.

## Troubleshooting

- **CORS errors**: Ensure the backend CORS settings include `http://localhost:3000`
- **Image upload fails**: Make sure the `media/` directory exists and has write permissions
- **Database errors**: Run migrations again: `python manage.py migrate`

## License

This project is for demonstration purposes.

