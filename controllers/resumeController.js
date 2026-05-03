const { objDb } = require('../db/database');

const createResume = async (objReq, objRes) => {
    try {
        const { userID: intUserId, targetRoleTitle: strTargetRoleTitle } = objReq.body;
        if (!intUserId || !strTargetRoleTitle) {
            return objRes.status(400).json({ error: 'userID and targetRoleTitle are required.' });
        }

        const objUser = await objDb.getAsync('SELECT UserID FROM tblUsers WHERE UserID = ?', [intUserId]);
        if (!objUser) {
            return objRes.status(404).json({ error: 'User not found.' });
        }

        const strCreatedAt = new Date().toISOString();
        const objInsertResult = await objDb.runAsync(
            'INSERT INTO tblResumes (userID, targetRoleTitle, createdAt) VALUES (?, ?, ?)',
            [intUserId, strTargetRoleTitle.trim(), strCreatedAt]
        );

        return objRes.status(201).json({ resumeId: objInsertResult.lastID });
    } catch (objError) {
        return objRes.status(500).json({ error: 'Failed to create resume.', details: objError.message });
    }
};

const getResumesByUser = async (objReq, objRes) => {
    try {
        const intUserId = Number(objReq.query.userID);
        if (!intUserId) {
            return objRes.status(400).json({ error: 'userID query parameter is required.' });
        }

        const aResumes = await objDb.allAsync('SELECT * FROM tblResumes WHERE userID = ? ORDER BY resumeID DESC', [intUserId]);
        return objRes.status(200).json(aResumes);
    } catch (objError) {
        return objRes.status(500).json({ error: 'Failed to fetch resumes.', details: objError.message });
    }
};

module.exports = {
    createResume,
    getResumesByUser
};
