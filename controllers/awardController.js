/* AI USAGE COMMENT BLOCK
 * AI was used as a coding assistant for general application logic in this file.
 * It helped with drafting/refactoring code, naming cleanup, and basic validation/error-handling patterns.
 * A developer reviewed and finalized the implementation for project-specific behavior.
 */
const { objDb } = require('../db/database');

const createAward = async (objReq, objRes) => {
    try {
        const { userID: intUserId, awardTitle: strAwardTitle, dateReceived: strDateReceived = null } = objReq.body;

        if (!intUserId || !strAwardTitle) {
            return objRes.status(400).json({ error: 'userID and awardTitle are required.' });
        }

        const objInsertResult = await objDb.runAsync(
            'INSERT INTO tblAwards (userID, awardTitle, dateReceived) VALUES (?, ?, ?)',
            [intUserId, strAwardTitle.trim(), strDateReceived]
        );

        return objRes.status(201).json({ awardId: objInsertResult.lastID });
    } catch (objError) {
        return objRes.status(500).json({ error: 'Failed to create award.', details: objError.message });
    }
};

const getAwardsByUser = async (objReq, objRes) => {
    try {
        const intUserId = Number(objReq.query.userID);
        if (!intUserId) {
            return objRes.status(400).json({ error: 'userID query parameter is required.' });
        }

        const aAwards = await objDb.allAsync('SELECT * FROM tblAwards WHERE userID = ? ORDER BY awardID DESC', [intUserId]);
        return objRes.status(200).json(aAwards);
    } catch (objError) {
        return objRes.status(500).json({ error: 'Failed to fetch awards.', details: objError.message });
    }
};

module.exports = {
    createAward,
    getAwardsByUser
};
