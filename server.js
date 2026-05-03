const express = require('express');
const path = require('path');
const { initializeDatabase } = require('./db/database');

const objUserRoutes = require('./routes/userRoutes');
const objResumeRoutes = require('./routes/resumeRoutes');
const objJobRoutes = require('./routes/jobRoutes');
const objResponsibilityRoutes = require('./routes/responsibilityRoutes');
const objAiRoutes = require('./routes/aiRoutes');

const objApp = express();
const intPort = process.env.PORT || 3000;

objApp.use(express.json());
objApp.use('/public', express.static(path.join(__dirname, 'public')));
objApp.use('/', express.static(__dirname));

objApp.use('/api/users', objUserRoutes);
objApp.use('/api/resumes', objResumeRoutes);
objApp.use('/api/jobs', objJobRoutes);
objApp.use('/api/responsibilities', objResponsibilityRoutes);
objApp.use('/api/ai', objAiRoutes);

objApp.get('/api/health', async (objReq, objRes) => {
    return objRes.status(200).json([{ status: 'ok' }]);
});

const startServer = async () => {
    try {
        await initializeDatabase();
        objApp.listen(intPort, () => {
            console.log(`RC Resume Builder server running on http://localhost:${intPort}`);
        });
    } catch (objError) {
        console.error('Failed to start server:', objError.message);
        process.exit(1);
    }
};

startServer();
