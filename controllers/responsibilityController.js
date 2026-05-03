const { objDb } = require('../db/database');

const createResponsibility = async (objReq, objRes) => {
    try {
        const { jobID: intJobId, originalText: strOriginalText, aiText: strAiText = null, isApproved: intIsApproved = 0, resumeID: intResumeId = null } = objReq.body;
        if (!intJobId || !strOriginalText) {
            return objRes.status(400).json({ error: 'jobID and originalText are required.' });
        }

        const objInsertResult = await objDb.runAsync(
            'INSERT INTO tblRes (jobID, originalText, aiText, isApproved) VALUES (?, ?, ?, ?)',
            [intJobId, strOriginalText.trim(), strAiText, intIsApproved ? 1 : 0]
        );

        if (intResumeId) {
            await objDb.runAsync('INSERT OR IGNORE INTO tblResumeRes (resumeID, resID) VALUES (?, ?)', [intResumeId, objInsertResult.lastID]);
        }

        return objRes.status(201).json({ resId: objInsertResult.lastID });
    } catch (objError) {
        return objRes.status(500).json({ error: 'Failed to create responsibility.', details: objError.message });
    }
};

const getResponsibilitiesByJob = async (objReq, objRes) => {
    try {
        const intJobId = Number(objReq.query.jobID);
        if (!intJobId) {
            return objRes.status(400).json({ error: 'jobID query parameter is required.' });
        }

        const aResponsibilities = await objDb.allAsync('SELECT * FROM tblRes WHERE jobID = ? ORDER BY resID DESC', [intJobId]);
        return objRes.status(200).json(aResponsibilities);
    } catch (objError) {
        return objRes.status(500).json({ error: 'Failed to fetch responsibilities.', details: objError.message });
    }
};

module.exports = {
    createResponsibility,
    getResponsibilitiesByJob
};
