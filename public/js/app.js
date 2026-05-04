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
    frmUserInfo: document.getElementById('frmUserInfo'),
    btnUserSubmit: document.getElementById('btnUserSubmit'),
    divUserFormErrors: document.getElementById('divUserFormErrors'),
    frmJobs: document.getElementById('frmJobs'),
    btnAddJob: document.getElementById('btnAddJob'),
    divJobsContainer: document.getElementById('divJobsContainer'),
    frmResponsibilities: document.getElementById('frmResponsibilities'),
    divResponsibilitiesContainer: document.getElementById('divResponsibilitiesContainer'),
    divProgressBar: document.getElementById('divProgressBar')
};

const setProgress = (intPercent) => {
    aDom.divProgressBar.style.width = `${intPercent}%`;
    aDom.divProgressBar.setAttribute('aria-valuenow', String(intPercent));
};

const showStep = (strStepId) => {
    [aDom.divStepUserInfo, aDom.divStepJobs, aDom.divStepResponsibilities].forEach((objCard) => {
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
    if (!objPayload.email) {
        aErrors.push({ field: 'email', message: 'Email is required.' });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(objPayload.email)) {
        aErrors.push({ field: 'email', message: 'Email format is invalid.' });
    }
    if (!objPayload.desiredRole) aErrors.push({ field: 'desiredRole', message: 'Desired role is required.' });

    aErrors.forEach((objErr) => setInputErrorState(objErr.field, objErr.message));

    if (aErrors.length > 0) {
        aDom.divUserFormErrors.textContent = 'Please fix the highlighted fields before continuing.';
        aDom.divUserFormErrors.classList.remove('d-none');
    }

    return { objPayload, isValid: aErrors.length === 0 };
};

const createJobRow = (intIndex) => {
    const strJobHtml = `<div class="border rounded p-3 mb-3" data-job-index="${intIndex}">
        <div class="mb-2"><label class="form-label">Company</label><input aria-label="Company Name" class="form-control" name="companyName" required /></div>
        <div class="mb-2"><label class="form-label">Title</label><input aria-label="Job Title" class="form-control" name="jobTitle" required /></div>
        <div class="mb-2"><label class="form-label">Start Date</label><input aria-label="Start Date" class="form-control" name="startDate" type="date" required /></div>
        <div><label class="form-label">End Date</label><input aria-label="End Date" class="form-control" name="endDate" type="date" /></div>
    </div>`;
    aDom.divJobsContainer.insertAdjacentHTML('beforeend', strJobHtml);
};

const handleUserSubmit = async (objEvent) => {
    objEvent.preventDefault();
    const { objPayload, isValid } = validateUserForm();
    if (!isValid) return;

    try {
        aDom.btnUserSubmit.disabled = true;
        const objUserResponse = await fetch('/api/users/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(objPayload)
        });

        const objResult = await objUserResponse.json();
        if (!objUserResponse.ok) {
            aDom.divUserFormErrors.textContent = objResult.error || 'Unable to save your profile.';
            aDom.divUserFormErrors.classList.remove('d-none');
            return;
        }

        aState.currentUserId = objResult.userId;
        aState.currentResumeId = objResult.resumeId;
        showStep('divStepJobs');
        setProgress(66);
    } catch (objError) {
        aDom.divUserFormErrors.textContent = 'Network error while saving profile. Please try again.';
        aDom.divUserFormErrors.classList.remove('d-none');
    } finally {
        aDom.btnUserSubmit.disabled = false;
    }
};

// Remaining flow stays the same and uses the IDs returned by the new profile endpoint.
const handleJobsSubmit = async (objEvent) => {
    objEvent.preventDefault();
    const aJobBlocks = Array.from(aDom.divJobsContainer.querySelectorAll('[data-job-index]'));
    for (const objJobBlock of aJobBlocks) {
        const objJobPayload = {
            userID: aState.currentUserId,
            companyName: objJobBlock.querySelector('[name="companyName"]').value,
            jobTitle: objJobBlock.querySelector('[name="jobTitle"]').value,
            startDate: objJobBlock.querySelector('[name="startDate"]').value,
            endDate: objJobBlock.querySelector('[name="endDate"]').value
        };
        const objResponse = await fetch('/api/jobs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(objJobPayload) });
        const objResult = await objResponse.json();
        aState.aJobs.push({ ...objJobPayload, jobID: objResult.jobId });
    }

    renderResponsibilities();
    showStep('divStepResponsibilities');
    setProgress(100);
};

const renderResponsibilities = () => {
    aDom.divResponsibilitiesContainer.innerHTML = '';
    aState.aJobs.forEach((objJob, intJobIndex) => {
        const strCardHtml = `<div class="border rounded p-3 mb-3" data-res-job-index="${intJobIndex}">
            <h4 class="h6">${objJob.companyName} - ${objJob.jobTitle}</h4>
            <textarea aria-label="Responsibility Text" class="form-control mb-2" name="originalText" required></textarea>
            <button type="button" class="btn btn-outline-primary btn-sm mb-2" data-action="ai">AI Suggest</button>
            <div class="small text-success" data-ai-output></div>
        </div>`;
        aDom.divResponsibilitiesContainer.insertAdjacentHTML('beforeend', strCardHtml);
    });
};

const handleResponsibilitiesSubmit = async (objEvent) => {
    objEvent.preventDefault();
    const aResBlocks = Array.from(aDom.divResponsibilitiesContainer.querySelectorAll('[data-res-job-index]'));
    for (const objResBlock of aResBlocks) {
        const intJobIndex = Number(objResBlock.dataset.resJobIndex);
        const strOriginalText = objResBlock.querySelector('[name="originalText"]').value;
        const strAiText = objResBlock.querySelector('[data-ai-output]').textContent || null;
        await fetch('/api/responsibilities', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jobID: aState.aJobs[intJobIndex].jobID, resumeID: aState.currentResumeId, originalText: strOriginalText, aiText: strAiText, isApproved: strAiText ? 1 : 0 })
        });
    }
};

const handleAiSuggestClick = async (objEvent) => {
    const objButton = objEvent.target.closest('[data-action="ai"]');
    if (!objButton) return;
    const objResBlock = objButton.closest('[data-res-job-index]');
    const strOriginalText = objResBlock.querySelector('[name="originalText"]').value;
    const strGeminiKey = new FormData(aDom.frmUserInfo).get('geminiApiKey');
    const objResponse = await fetch('/api/ai/suggest', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: strOriginalText, geminiKey: strGeminiKey })
    });
    const objResult = await objResponse.json();
    objResBlock.querySelector('[data-ai-output]').textContent = objResult.aiText;
};

const initialize = () => {
    createJobRow(0);
    aDom.frmUserInfo.addEventListener('submit', handleUserSubmit);
    aDom.frmJobs.addEventListener('submit', handleJobsSubmit);
    aDom.frmResponsibilities.addEventListener('submit', handleResponsibilitiesSubmit);
    aDom.btnAddJob.addEventListener('click', () => createJobRow(aDom.divJobsContainer.querySelectorAll('[data-job-index]').length));
    aDom.divResponsibilitiesContainer.addEventListener('click', handleAiSuggestClick);
};

initialize();
