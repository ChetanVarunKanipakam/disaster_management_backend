import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './models/index.js';

// Import route functions
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import incidentRoutes from './routes/incident.routes.js';
import adminRoutes from './routes/admin.routes.js';
import volunteerRoutes from './routes/volunteer.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import reportsRoutes from './routes/reports.routes.js';          // New
import announcementRoutes from './routes/announcement.routes.js';// New
import auditLogRoutes from './routes/auditLog.routes.js';        // New
import settingsRoutes from './routes/settings.routes.js';        // New
// Replicate __dirname functionality
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Simple route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Community Disaster Response API (ESM Version).' });
});

authRoutes(app);
userRoutes(app);
incidentRoutes(app);
adminRoutes(app);
volunteerRoutes(app);
notificationRoutes(app);
dashboardRoutes(app);
reportsRoutes(app);          // New
announcementRoutes(app);     // New
auditLogRoutes(app);         // New
settingsRoutes(app);         // New

const PORT = process.env.PORT || 8080;

db.sequelize.sync({ alter: true }).then(() => { // Using alter: true during development helps apply model changes
  console.log('Database synced successfully.');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
}).catch(err => {
  console.error('Failed to sync database:', err);
});