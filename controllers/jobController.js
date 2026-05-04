/* AI USAGE COMMENT BLOCK
 * AI was used as a coding assistant for general application logic in this file.
 * It helped with drafting/refactoring code, naming cleanup, and basic validation/error-handling patterns.
 * A developer reviewed and finalized the implementation for project-specific behavior.
 */
const { objDb } = require('../db/database');

const createJob = async (objReq, objRes) => {
    try {
        const { userID: intUserId, companyName: strCompanyName, jobTitle: strJobTitle, startDate: strStartDate, endDate: strEndDate = null } = objReq.body;

        if (!intUserId || !strCompanyName || !strJobTitle || !strStartDate) {
            return objRes.status(400).json({ error: 'userID, companyName, jobTitle, and startDate are required.' });
        }

        const objInsertResult = await objDb.runAsync(
            'INSERT INTO tblJobs (userID, companyName, jobTitle, startDate, endDate) VALUES (?, ?, ?, ?, ?)',
            [intUserId, strCompanyName.trim(), strJobTitle.trim(), strStartDate, strEndDate]
        );

        return objRes.status(201).json({ jobId: objInsertResult.lastID });
    } catch (objError) {
        return objRes.status(500).json({ error: 'Failed to create job.', details: objError.message });
    }
};

const getJobsByUser = async (objReq, objRes) => {
    try {
        const intUserId = Number(objReq.query.userID);
        if (!intUserId) {
            return objRes.status(400).json({ error: 'userID query parameter is required.' });
        }

        const aJobs = await objDb.allAsync('SELECT * FROM tblJobs WHERE userID = ? ORDER BY jobID DESC', [intUserId]);
        return objRes.status(200).json(aJobs);
    } catch (objError) {
        return objRes.status(500).json({ error: 'Failed to fetch jobs.', details: objError.message });
    }
};

module.exports = {
    createJob,
    getJobsByUser
};
