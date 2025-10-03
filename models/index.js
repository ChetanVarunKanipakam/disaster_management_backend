import { Sequelize } from 'sequelize';
import sequelize from '../config/sequelize.js';

// Import model definition functions
import UserModel from './user.model.js';
import IncidentModel from './incident.model.js';
import VolunteerModel from './volunteer.model.js';
import NotificationModel from './notification.model.js';
import AnnouncementModel from './announcement.model.js';
import AuditLogModel from './auditLog.model.js';
import SettingModel from './setting.model.js';

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Initialize models
db.User = UserModel(sequelize);
db.Incident = IncidentModel(sequelize);
db.Volunteer = VolunteerModel(sequelize);
db.Notification = NotificationModel(sequelize);
db.Announcement = AnnouncementModel(sequelize);
db.AuditLog = AuditLogModel(sequelize);
db.Setting = SettingModel(sequelize);

// --- Define Associations ---
db.User.hasMany(db.Incident, { foreignKey: 'reportedById', as: 'reportedIncidents' });
db.Incident.belongsTo(db.User, { foreignKey: 'reportedById', as: 'reporter' });

db.User.hasOne(db.Volunteer, { foreignKey: 'userId', as: 'volunteerProfile' });
db.Volunteer.belongsTo(db.User, { foreignKey: 'userId', as: 'userProfile' });

db.User.hasMany(db.Incident, { foreignKey: 'assignedToId', as: 'assignedIncidents' });
db.Incident.belongsTo(db.User, { foreignKey: 'assignedToId', as: 'assignedVolunteer' });

db.User.hasMany(db.Notification, { foreignKey: 'userId' });
db.Notification.belongsTo(db.User, { foreignKey: 'userId' });

db.Incident.hasMany(db.Notification, { foreignKey: 'incidentId' });
db.Notification.belongsTo(db.Incident, { foreignKey: 'incidentId' });

db.User.hasMany(db.Announcement, { foreignKey: 'createdById' });
db.Announcement.belongsTo(db.User, { as: 'creator', foreignKey: 'createdById' });

db.User.hasMany(db.AuditLog, { foreignKey: 'adminId' });
db.AuditLog.belongsTo(db.User, { as: 'admin', foreignKey: 'adminId' });

export default db;