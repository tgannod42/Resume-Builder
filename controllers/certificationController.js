const { objDb } = require('../db/database');

const createCertification = async (objReq, objRes) => {
    try {
        const { userID: intUserId, certName: strCertName, issuerName: strIssuerName, dateEarned: strDateEarned = null } = objReq.body;

        if (!intUserId || !strCertName || !strIssuerName) {
            return objRes.status(400).json({ error: 'userID, certName, and issuerName are required.' });
        }

        const objInsertResult = await objDb.runAsync(
            'INSERT INTO tblCertifications (userID, certName, issuerName, dateEarned) VALUES (?, ?, ?, ?)',
            [intUserId, strCertName.trim(), strIssuerName.trim(), strDateEarned]
        );

        return objRes.status(201).json({ certId: objInsertResult.lastID });
    } catch (objError) {
        return objRes.status(500).json({ error: 'Failed to create certification.', details: objError.message });
    }
};

const getCertificationsByUser = async (objReq, objRes) => {
    try {
        const intUserId = Number(objReq.query.userID);
        if (!intUserId) {
            return objRes.status(400).json({ error: 'userID query parameter is required.' });
        }

        const aCertifications = await objDb.allAsync('SELECT * FROM tblCertifications WHERE userID = ? ORDER BY certID DESC', [intUserId]);
        return objRes.status(200).json(aCertifications);
    } catch (objError) {
        return objRes.status(500).json({ error: 'Failed to fetch certifications.', details: objError.message });
    }
};

module.exports = {
    createCertification,
    getCertificationsByUser
};
