/* AI USAGE COMMENT BLOCK
 * AI was used as a coding assistant for general application logic in this file.
 * It helped with drafting/refactoring code, naming cleanup, and basic validation/error-handling patterns.
 * A developer reviewed and finalized the implementation for project-specific behavior.
 */
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


const exportResume = async (objReq, objRes) => {
    try {
        const intResumeId = Number(objReq.query.resumeID);
        if (!intResumeId) {
            return objRes.status(400).json({ error: 'resumeID query parameter is required.' });
        }

        const objResume = await objDb.getAsync(`SELECT r.resumeID, r.targetRoleTitle, u.UserID, u.firstName, u.lastName, u.email
            FROM tblResumes r
            INNER JOIN tblUsers u ON u.UserID = r.userID
            WHERE r.resumeID = ?`, [intResumeId]);
        if (!objResume) {
            return objRes.status(404).json({ error: 'Resume not found.' });
        }

        const aJobs = await objDb.allAsync('SELECT companyName, jobTitle, startDate, endDate, jobID FROM tblJobs WHERE userID = ? ORDER BY jobID ASC', [objResume.UserID]);
        const aResponsibilities = await objDb.allAsync(`SELECT rr.jobID, rr.originalText, rr.aiText
            FROM tblRes rr
            INNER JOIN tblResumeRes rrr ON rrr.resID = rr.resID
            WHERE rrr.resumeID = ?`, [intResumeId]);
        const aSkills = await objDb.allAsync('SELECT categoryName, skillName FROM tblSkills WHERE userID = ? ORDER BY skillID ASC', [objResume.UserID]);
        const aCertifications = await objDb.allAsync('SELECT certName, issuerName, dateEarned FROM tblCertifications WHERE userID = ? ORDER BY certID ASC', [objResume.UserID]);
        const aAwards = await objDb.allAsync('SELECT awardTitle, dateReceived FROM tblAwards WHERE userID = ? ORDER BY awardID ASC', [objResume.UserID]);

        return objRes.status(200).json({
            resume: objResume,
            jobs: aJobs,
            responsibilities: aResponsibilities,
            skills: aSkills,
            certifications: aCertifications,
            awards: aAwards
        });
    } catch (objError) {
        return objRes.status(500).json({ error: 'Failed to export resume.', details: objError.message });
    }
};

module.exports = {
    createResume,
    getResumesByUser,
    exportResume
};
