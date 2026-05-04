const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const { initializeDatabase } = require('./db/database');

const objUserRoutes = require('./routes/userRoutes');
const objJobRoutes = require('./routes/jobRoutes');
const objResponsibilityRoutes = require('./routes/responsibilityRoutes');
const objResumeRoutes = require('./routes/resumeRoutes');
const objAiRoutes = require('./routes/aiRoutes');
const objCertificationRoutes = require('./routes/certificationRoutes');
const objAwardRoutes = require('./routes/awardRoutes');
const objSkillRoutes = require('./routes/skillRoutes');

dotenv.config();

const numPort = process.env.PORT || 3000;
const objApp = express();

objApp.use(express.json());
objApp.use('/public', express.static(path.join(__dirname, 'public')));
objApp.get('/', (objReq, objRes) => {
    objRes.sendFile(path.join(__dirname, 'index.html'));
});

objApp.use('/api/users', objUserRoutes);
objApp.use('/api/jobs', objJobRoutes);
objApp.use('/api/responsibilities', objResponsibilityRoutes);
objApp.use('/api/resumes', objResumeRoutes);
objApp.use('/api/ai', objAiRoutes);
objApp.use('/api/certifications', objCertificationRoutes);
objApp.use('/api/awards', objAwardRoutes);
objApp.use('/api/skills', objSkillRoutes);

objApp.use((objReq, objRes) => {
    objRes.status(404).json({ error: 'Route not found.' });
});

const startServer = async () => {
    try {
        await initializeDatabase();
        objApp.listen(numPort, () => {
            console.log(`Resume Builder running on http://localhost:${numPort}`);
        });
    } catch (objError) {
        console.error('Failed to start server:', objError);
        process.exit(1);
    }
};

startServer();
