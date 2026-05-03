const { objDb } = require('../db/database');

const createOrGetUser = async (objReq, objRes) => {
    try {
        const { firstName: strFirstName, lastName: strLastName, email: strEmail, geminiKey: strGeminiKey = null } = objReq.body;

        if (!strFirstName || !strLastName || !strEmail) {
            return objRes.status(400).json({ error: 'firstName, lastName, and email are required.' });
        }

        const objExistingUser = await objDb.getAsync('SELECT * FROM tblUsers WHERE email = ?', [strEmail.trim().toLowerCase()]);
        if (objExistingUser) {
            return objRes.status(200).json({ userId: objExistingUser.UserID, isNew: false });
        }

        const objInsertResult = await objDb.runAsync(
            'INSERT INTO tblUsers (firstName, lastName, email, geminiKey) VALUES (?, ?, ?, ?)',
            [strFirstName.trim(), strLastName.trim(), strEmail.trim().toLowerCase(), strGeminiKey]
        );

        return objRes.status(201).json({ userId: objInsertResult.lastID, isNew: true });
    } catch (objError) {
        return objRes.status(500).json({ error: 'Failed to create or fetch user.', details: objError.message });
    }
};

const getUsers = async (objReq, objRes) => {
    try {
        const aUsers = await objDb.allAsync('SELECT * FROM tblUsers ORDER BY UserID DESC');
        return objRes.status(200).json(aUsers);
    } catch (objError) {
        return objRes.status(500).json({ error: 'Failed to fetch users.', details: objError.message });
    }
};

module.exports = {
    createOrGetUser,
    getUsers
};
