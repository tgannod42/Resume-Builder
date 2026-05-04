/* AI USAGE COMMENT BLOCK
 * AI was used as a coding assistant for general application logic in this file.
 * It helped with drafting/refactoring code, naming cleanup, and basic validation/error-handling patterns.
 * A developer reviewed and finalized the implementation for project-specific behavior.
 */
const { objDb } = require('../db/database');

const createSkill = async (objReq, objRes) => {
    try {
        const { userID: intUserId, categoryName: strCategoryName, skillName: strSkillName } = objReq.body;

        if (!intUserId || !strCategoryName || !strSkillName) {
            return objRes.status(400).json({ error: 'userID, categoryName, and skillName are required.' });
        }

        const objInsertResult = await objDb.runAsync(
            'INSERT INTO tblSkills (userID, categoryName, skillName) VALUES (?, ?, ?)',
            [intUserId, strCategoryName.trim(), strSkillName.trim()]
        );

        return objRes.status(201).json({ skillId: objInsertResult.lastID });
    } catch (objError) {
        return objRes.status(500).json({ error: 'Failed to create skill.', details: objError.message });
    }
};

const getSkillsByUser = async (objReq, objRes) => {
    try {
        const intUserId = Number(objReq.query.userID);
        if (!intUserId) {
            return objRes.status(400).json({ error: 'userID query parameter is required.' });
        }

        const aSkills = await objDb.allAsync('SELECT * FROM tblSkills WHERE userID = ? ORDER BY skillID DESC', [intUserId]);
        return objRes.status(200).json(aSkills);
    } catch (objError) {
        return objRes.status(500).json({ error: 'Failed to fetch skills.', details: objError.message });
    }
};

module.exports = {
    createSkill,
    getSkillsByUser
};
