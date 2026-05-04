const { objDb } = require('../db/database');

const validateProfileInput = (objPayload) => {
    const aValidationErrors = [];

    const strFirstName = (objPayload.firstName || '').trim();
    const strLastName = (objPayload.lastName || '').trim();
    const strEmail = (objPayload.email || '').trim().toLowerCase();
    const strGeminiApiKey = (objPayload.geminiApiKey || '').trim();
    const strDesiredRole = (objPayload.desiredRole || '').trim();

    if (!strFirstName) aValidationErrors.push({ field: 'firstName', message: 'First name is required.' });
    if (!strLastName) aValidationErrors.push({ field: 'lastName', message: 'Last name is required.' });
    if (!strEmail) {
        aValidationErrors.push({ field: 'email', message: 'Email is required.' });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(strEmail)) {
        aValidationErrors.push({ field: 'email', message: 'Email format is invalid.' });
    }
    if (!strDesiredRole) aValidationErrors.push({ field: 'desiredRole', message: 'Desired role is required.' });

    return {
        aValidationErrors,
        strFirstName,
        strLastName,
        strEmail,
        strGeminiApiKey,
        strDesiredRole
    };
};

const createProfile = async (objReq, objRes) => {
    const {
        aValidationErrors,
        strFirstName,
        strLastName,
        strEmail,
        strGeminiApiKey,
        strDesiredRole
    } = validateProfileInput(objReq.body);

    if (aValidationErrors.length > 0) {
        return objRes.status(400).json({ error: 'Validation failed.', aValidationErrors });
    }

    try {
        await objDb.runAsync('BEGIN TRANSACTION');

        let objUser = await objDb.getAsync('SELECT UserID FROM tblUsers WHERE email = ?', [strEmail]);

        if (!objUser) {
            const objInsertUserResult = await objDb.runAsync(
                'INSERT INTO tblUsers (firstName, lastName, email, geminiKey) VALUES (?, ?, ?, ?)',
                [strFirstName, strLastName, strEmail, strGeminiApiKey || null]
            );
            objUser = { UserID: objInsertUserResult.lastID };
        }

        const objInsertResumeResult = await objDb.runAsync(
            'INSERT INTO tblResumes (userID, targetRoleTitle) VALUES (?, ?)',
            [objUser.UserID, strDesiredRole]
        );

        await objDb.runAsync('COMMIT');
        return objRes.status(201).json({ userId: objUser.UserID, resumeId: objInsertResumeResult.lastID });
    } catch (objError) {
        await objDb.runAsync('ROLLBACK');
        return objRes.status(500).json({ error: 'Failed to save profile.', details: objError.message });
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
    createProfile,
    getUsers
};
