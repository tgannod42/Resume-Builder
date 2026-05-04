const aState = {
    activeRoute: 'builder',
    currentUserId: null,
    currentResumeId: null,
    aJobs: [],
    aResponsibilities: []
};

const aDom = {
    divStepUserInfo: document.getElementById('divStepUserInfo'),
    divStepJobs: document.getElementById('divStepJobs'),
    divStepResponsibilities: document.getElementById('divStepResponsibilities'),
    divStepCredentials: document.getElementById('divStepCredentials'),
    frmUserInfo: document.getElementById('frmUserInfo'),
    btnUserSubmit: document.getElementById('btnUserSubmit'),
    divUserFormErrors: document.getElementById('divUserFormErrors'),
    frmJobs: document.getElementById('frmJobs'),
    btnAddJob: document.getElementById('btnAddJob'),
    divJobsContainer: document.getElementById('divJobsContainer'),
    frmResponsibilities: document.getElementById('frmResponsibilities'),
    divResponsibilitiesContainer: document.getElementById('divResponsibilitiesContainer'),
    frmCredentials: document.getElementById('frmCredentials'),
    divSkillsContainer: document.getElementById('divSkillsContainer'),
    divCertificationsContainer: document.getElementById('divCertificationsContainer'),
    divAwardsContainer: document.getElementById('divAwardsContainer'),
    btnAddSkill: document.getElementById('btnAddSkill'),
    btnAddCertification: document.getElementById('btnAddCertification'),
    btnAddAward: document.getElementById('btnAddAward'),
    divProgressBar: document.getElementById('divProgressBar')
};

const setProgress = (intPercent) => {
    aDom.divProgressBar.style.width = `${intPercent}%`;
    aDom.divProgressBar.setAttribute('aria-valuenow', String(intPercent));
};

const showStep = (strStepId) => {
    [aDom.divStepUserInfo, aDom.divStepJobs, aDom.divStepResponsibilities, aDom.divStepCredentials].forEach((objCard) => {
        objCard.classList.toggle('d-none', objCard.id !== strStepId);
    });
};

const setInputErrorState = (strFieldName, strMessage) => {
    const objInput = aDom.frmUserInfo.querySelector(`[name="${strFieldName}"]`);
    if (!objInput) return;
    objInput.classList.add('is-invalid');
    objInput.setAttribute('aria-invalid', 'true');
    let objFeedback = document.getElementById(`err_${strFieldName}`);
    if (!objFeedback) {
        objFeedback = document.createElement('div');
        objFeedback.id = `err_${strFieldName}`;
        objFeedback.className = 'invalid-feedback';
        objInput.insertAdjacentElement('afterend', objFeedback);
    }
    objFeedback.textContent = strMessage;
    objInput.setAttribute('aria-describedby', objFeedback.id);
};

const resetUserFormErrors = () => {
    aDom.divUserFormErrors.textContent = '';
    aDom.divUserFormErrors.classList.add('d-none');
    aDom.frmUserInfo.querySelectorAll('.is-invalid').forEach((objInput) => {
        objInput.classList.remove('is-invalid');
        objInput.removeAttribute('aria-invalid');
    });
};

const validateUserForm = () => {
    resetUserFormErrors();
    const objFormData = new FormData(aDom.frmUserInfo);
    const objPayload = {
        firstName: (objFormData.get('firstName') || '').trim(),
        lastName: (objFormData.get('lastName') || '').trim(),
        email: (objFormData.get('email') || '').trim(),
        geminiApiKey: (objFormData.get('geminiApiKey') || '').trim(),
        desiredRole: (objFormData.get('desiredRole') || '').trim()
    };

    const aErrors = [];
    if (!objPayload.firstName) aErrors.push({ field: 'firstName', message: 'First name is required.' });
    if (!objPayload.lastName) aErrors.push({ field: 'lastName', message: 'Last name is required.' });
    if (!objPayload.email) aErrors.push({ field: 'email', message: 'Email is required.' });
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(objPayload.email)) aErrors.push({ field: 'email', message: 'Email format is invalid.' });
    if (!objPayload.desiredRole) aErrors.push({ field: 'desiredRole', message: 'Desired role is required.' });
    aErrors.forEach((objErr) => setInputErrorState(objErr.field, objErr.message));

    if (aErrors.length > 0) {
        aDom.divUserFormErrors.textContent = 'Please fix the highlighted fields before continuing.';
        aDom.divUserFormErrors.classList.remove('d-none');
    }

    return { objPayload, isValid: aErrors.length === 0 };
};

const createJobRow = (intIndex) => {
    aDom.divJobsContainer.insertAdjacentHTML('beforeend', `<div class="border rounded p-3 mb-3" data-job-index="${intIndex}">
        <div class="mb-2"><label class="form-label">Company</label><input aria-label="Company Name" class="form-control" name="companyName" required /></div>
        <div class="mb-2"><label class="form-label">Title</label><input aria-label="Job Title" class="form-control" name="jobTitle" required /></div>
        <div class="mb-2"><label class="form-label">Start Date</label><input aria-label="Start Date" class="form-control" name="startDate" type="date" required /></div>
        <div><label class="form-label">End Date</label><input aria-label="End Date" class="form-control" name="endDate" type="date" /></div>
    </div>`);
};

const createSkillRow = () => {
    aDom.divSkillsContainer.insertAdjacentHTML('beforeend', `<div class="border rounded p-3 mb-3" data-skill-row>
        <div class="mb-2"><label class="form-label">Skill Category</label><input aria-label="Skill Category" class="form-control" name="categoryName" required /></div>
        <div><label class="form-label">Skill Name</label><input aria-label="Skill Name" class="form-control" name="skillName" required /></div>
    </div>`);
};

const createCertificationRow = () => {
    aDom.divCertificationsContainer.insertAdjacentHTML('beforeend', `<div class="border rounded p-3 mb-3" data-cert-row>
        <div class="mb-2"><label class="form-label">Certification Name</label><input aria-label="Certification Name" class="form-control" name="certName" /></div>
        <div class="mb-2"><label class="form-label">Issuer Name</label><input aria-label="Certification Issuer" class="form-control" name="issuerName" /></div>
        <div><label class="form-label">Date Earned</label><input aria-label="Certification Date Earned" class="form-control" name="dateEarned" type="date" /></div>
    </div>`);
};

const createAwardRow = () => {
    aDom.divAwardsContainer.insertAdjacentHTML('beforeend', `<div class="border rounded p-3 mb-3" data-award-row>
        <div class="mb-2"><label class="form-label">Award Title</label><input aria-label="Award Title" class="form-control" name="awardTitle" /></div>
        <div><label class="form-label">Date Received</label><input aria-label="Award Date Received" class="form-control" name="dateReceived" type="date" /></div>
    </div>`);
};

const handleUserSubmit = async (objEvent) => { objEvent.preventDefault(); const { objPayload, isValid } = validateUserForm(); if (!isValid) return;
    try {
        aDom.btnUserSubmit.disabled = true;
        const objUserResponse = await fetch('/api/users/profile', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(objPayload) });
        const objResult = await objUserResponse.json();
        if (!objUserResponse.ok) { aDom.divUserFormErrors.textContent = objResult.error || 'Unable to save your profile.'; aDom.divUserFormErrors.classList.remove('d-none'); return; }
        aState.currentUserId = objResult.userId; aState.currentResumeId = objResult.resumeId; showStep('divStepJobs'); setProgress(50);
    } catch (objError) { aDom.divUserFormErrors.textContent = 'Network error while saving profile. Please try again.'; aDom.divUserFormErrors.classList.remove('d-none'); }
    finally { aDom.btnUserSubmit.disabled = false; }
};

const handleJobsSubmit = async (objEvent) => {
    objEvent.preventDefault();
    const aJobBlocks = Array.from(aDom.divJobsContainer.querySelectorAll('[data-job-index]'));
    for (const objJobBlock of aJobBlocks) {
        const objJobPayload = { userID: aState.currentUserId, companyName: objJobBlock.querySelector('[name="companyName"]').value, jobTitle: objJobBlock.querySelector('[name="jobTitle"]').value, startDate: objJobBlock.querySelector('[name="startDate"]').value, endDate: objJobBlock.querySelector('[name="endDate"]').value };
        const objResponse = await fetch('/api/jobs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(objJobPayload) });
        const objResult = await objResponse.json();
        aState.aJobs.push({ ...objJobPayload, jobID: objResult.jobId });
    }
    renderResponsibilities(); showStep('divStepResponsibilities'); setProgress(75);
};

const renderResponsibilities = () => {
    aDom.divResponsibilitiesContainer.innerHTML = '';
    aState.aJobs.forEach((objJob, intJobIndex) => {
        aDom.divResponsibilitiesContainer.insertAdjacentHTML('beforeend', `<div class="border rounded p-3 mb-3" data-res-job-index="${intJobIndex}">
            <h4 class="h6">${objJob.companyName} - ${objJob.jobTitle}</h4>
            <textarea aria-label="Responsibility Text" class="form-control mb-2" name="originalText" required></textarea>
            <button type="button" class="btn btn-outline-primary btn-sm mb-2" data-action="ai">AI Suggest</button>
            <div class="small text-success" data-ai-output></div>
        </div>`);
    });
};

const handleResponsibilitiesSubmit = async (objEvent) => {
    objEvent.preventDefault();
    const aResBlocks = Array.from(aDom.divResponsibilitiesContainer.querySelectorAll('[data-res-job-index]'));
    for (const objResBlock of aResBlocks) {
        const intJobIndex = Number(objResBlock.dataset.resJobIndex);
        const strOriginalText = objResBlock.querySelector('[name="originalText"]').value;
        const strAiText = objResBlock.querySelector('[data-ai-output]').textContent || null;
        await fetch('/api/responsibilities', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jobID: aState.aJobs[intJobIndex].jobID, resumeID: aState.currentResumeId, originalText: strOriginalText, aiText: strAiText, isApproved: strAiText ? 1 : 0 }) });
    }
    showStep('divStepCredentials');
    setProgress(100);
};

const handleCredentialsSubmit = async (objEvent) => {
    objEvent.preventDefault();

    const aSkillRows = Array.from(aDom.divSkillsContainer.querySelectorAll('[data-skill-row]'));
    for (const objSkillRow of aSkillRows) {
        const strCategoryName = (objSkillRow.querySelector('[name="categoryName"]').value || '').trim();
        const strSkillName = (objSkillRow.querySelector('[name="skillName"]').value || '').trim();
        if (!strCategoryName || !strSkillName) continue;
        await fetch('/api/skills', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userID: aState.currentUserId, categoryName: strCategoryName, skillName: strSkillName }) });
    }

    const aCertRows = Array.from(aDom.divCertificationsContainer.querySelectorAll('[data-cert-row]'));
    for (const objCertRow of aCertRows) {
        const strCertName = (objCertRow.querySelector('[name="certName"]').value || '').trim();
        const strIssuerName = (objCertRow.querySelector('[name="issuerName"]').value || '').trim();
        if (!strCertName || !strIssuerName) continue;
        await fetch('/api/certifications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userID: aState.currentUserId, certName: strCertName, issuerName: strIssuerName, dateEarned: objCertRow.querySelector('[name="dateEarned"]').value || null }) });
    }

    const aAwardRows = Array.from(aDom.divAwardsContainer.querySelectorAll('[data-award-row]'));
    for (const objAwardRow of aAwardRows) {
        const strAwardTitle = (objAwardRow.querySelector('[name="awardTitle"]').value || '').trim();
        if (!strAwardTitle) continue;
        await fetch('/api/awards', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userID: aState.currentUserId, awardTitle: strAwardTitle, dateReceived: objAwardRow.querySelector('[name="dateReceived"]').value || null }) });
    }

    const objExportResponse = await fetch(`/api/resumes/export?resumeID=${encodeURIComponent(aState.currentResumeId)}`);
    const objExportResult = await objExportResponse.json();
    if (!objExportResponse.ok) {
        alert(objExportResult.error || 'Failed to export resume.');
        return;
    }

    const strExportContent = JSON.stringify(objExportResult, null, 2);
    const objBlob = new Blob([strExportContent], { type: 'application/json' });
    const strUrl = URL.createObjectURL(objBlob);
    const objDownloadLink = document.createElement('a');
    objDownloadLink.href = strUrl;
    objDownloadLink.download = `resume_${aState.currentResumeId}.json`;
    objDownloadLink.click();
    URL.revokeObjectURL(strUrl);
};

const handleAiSuggestClick = async (objEvent) => {
    const objButton = objEvent.target.closest('[data-action="ai"]'); if (!objButton) return;
    const objResBlock = objButton.closest('[data-res-job-index]');
    const strOriginalText = objResBlock.querySelector('[name="originalText"]').value;
    const strGeminiKey = new FormData(aDom.frmUserInfo).get('geminiApiKey');
    const objResponse = await fetch('/api/ai/suggest', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: strOriginalText, geminiKey: strGeminiKey, sectionType: 'responsibility' }) });
    const objResult = await objResponse.json();
    objResBlock.querySelector('[data-ai-output]').textContent = objResult.aiText || objResult.error || '';
};

const initialize = () => {
    createJobRow(0);
    createSkillRow();
    createCertificationRow();
    createAwardRow();
    aDom.frmUserInfo.addEventListener('submit', handleUserSubmit);
    aDom.frmJobs.addEventListener('submit', handleJobsSubmit);
    aDom.frmResponsibilities.addEventListener('submit', handleResponsibilitiesSubmit);
    aDom.frmCredentials.addEventListener('submit', handleCredentialsSubmit);
    aDom.btnAddJob.addEventListener('click', () => createJobRow(aDom.divJobsContainer.querySelectorAll('[data-job-index]').length));
    aDom.btnAddSkill.addEventListener('click', createSkillRow);
    aDom.btnAddCertification.addEventListener('click', createCertificationRow);
    aDom.btnAddAward.addEventListener('click', createAwardRow);
    aDom.divResponsibilitiesContainer.addEventListener('click', handleAiSuggestClick);
};

initialize();
