const sqlite3 = require('sqlite3').verbose();
const { promisify } = require('util');
const path = require('path');

const strDatabasePath = path.join(__dirname, '..', 'dbResumes.db');
const objDb = new sqlite3.Database(strDatabasePath);

objDb.runAsync = (strSql, aParams = []) => new Promise((resolve, reject) => {
    objDb.run(strSql, aParams, function onRun(objError) {
        if (objError) {
            reject(objError);
            return;
        }
        resolve(this);
    });
});
objDb.getAsync = promisify(objDb.get.bind(objDb));
objDb.allAsync = promisify(objDb.all.bind(objDb));

const initializeDatabase = async () => {
    await objDb.runAsync('PRAGMA foreign_keys = ON');

    await objDb.runAsync(`CREATE TABLE IF NOT EXISTS tblUsers (
        UserID INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        geminiKey TEXT UNIQUE
    )`);

    await objDb.runAsync(`CREATE TABLE IF NOT EXISTS tblJobs (
        jobID INTEGER PRIMARY KEY AUTOINCREMENT,
        userID INTEGER NOT NULL,
        companyName TEXT NOT NULL,
        jobTitle TEXT NOT NULL,
        startDate TEXT NOT NULL,
        endDate TEXT,
        FOREIGN KEY (userID) REFERENCES tblUsers(UserID) ON DELETE CASCADE
    )`);

    await objDb.runAsync(`CREATE TABLE IF NOT EXISTS tblRes (
        resID INTEGER PRIMARY KEY AUTOINCREMENT,
        jobID INTEGER NOT NULL,
        originalText TEXT NOT NULL,
        aiText TEXT,
        isApproved BOOLEAN DEFAULT 0,
        FOREIGN KEY (jobID) REFERENCES tblJobs(jobID) ON DELETE CASCADE
    )`);

    await objDb.runAsync(`CREATE TABLE IF NOT EXISTS tblSkills (
        skillID INTEGER PRIMARY KEY AUTOINCREMENT,
        userID INTEGER NOT NULL,
        categoryName TEXT NOT NULL,
        skillName TEXT NOT NULL,
        FOREIGN KEY (userID) REFERENCES tblUsers(UserID) ON DELETE CASCADE
    )`);

    await objDb.runAsync(`CREATE TABLE IF NOT EXISTS tblCertifications (
        certID INTEGER PRIMARY KEY AUTOINCREMENT,
        userID INTEGER NOT NULL,
        certName TEXT NOT NULL,
        issuerName TEXT NOT NULL,
        dateEarned TEXT,
        FOREIGN KEY (userID) REFERENCES tblUsers(UserID) ON DELETE CASCADE
    )`);

    await objDb.runAsync(`CREATE TABLE IF NOT EXISTS tblAwards (
        awardID INTEGER PRIMARY KEY AUTOINCREMENT,
        userID INTEGER NOT NULL,
        awardTitle TEXT NOT NULL,
        dateReceived TEXT,
        FOREIGN KEY (userID) REFERENCES tblUsers(UserID) ON DELETE CASCADE
    )`);

    await objDb.runAsync(`CREATE TABLE IF NOT EXISTS tblResumes (
        resumeID INTEGER PRIMARY KEY AUTOINCREMENT,
        userID INTEGER NOT NULL,
        targetRoleTitle TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userID) REFERENCES tblUsers(UserID) ON DELETE CASCADE
    )`);

    await objDb.runAsync(`CREATE TABLE IF NOT EXISTS tblResumeRes (
        resumeID INTEGER NOT NULL,
        resID INTEGER NOT NULL,
        PRIMARY KEY (resumeID, resID),
        FOREIGN KEY (resumeID) REFERENCES tblResumes(resumeID) ON DELETE CASCADE,
        FOREIGN KEY (resID) REFERENCES tblRes(resID) ON DELETE CASCADE
    )`);

    await objDb.runAsync(`CREATE TABLE IF NOT EXISTS tblResumeSkills (
        resumeID INTEGER NOT NULL,
        skillID INTEGER NOT NULL,
        PRIMARY KEY (resumeID, skillID),
        FOREIGN KEY (resumeID) REFERENCES tblResumes(resumeID) ON DELETE CASCADE,
        FOREIGN KEY (skillID) REFERENCES tblSkills(skillID) ON DELETE CASCADE
    )`);

    await objDb.runAsync(`CREATE TABLE IF NOT EXISTS tblResumeCerts (
        resumeID INTEGER NOT NULL,
        certID INTEGER NOT NULL,
        PRIMARY KEY (resumeID, certID),
        FOREIGN KEY (resumeID) REFERENCES tblResumes(resumeID) ON DELETE CASCADE,
        FOREIGN KEY (certID) REFERENCES tblCertifications(certID) ON DELETE CASCADE
    )`);

    await objDb.runAsync(`CREATE TABLE IF NOT EXISTS tblResumeAwards (
        resumeID INTEGER NOT NULL,
        awardID INTEGER NOT NULL,
        PRIMARY KEY (resumeID, awardID),
        FOREIGN KEY (resumeID) REFERENCES tblResumes(resumeID) ON DELETE CASCADE,
        FOREIGN KEY (awardID) REFERENCES tblAwards(awardID) ON DELETE CASCADE
    )`);
};

module.exports = {
    objDb,
    initializeDatabase
};
