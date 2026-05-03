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
    const objFormData = new FormData(aDom.frmUserInfo);
    const objUserPayload = {
        firstName: objFormData.get('firstName'),
        lastName: objFormData.get('lastName'),
        email: objFormData.get('email'),
        geminiKey: objFormData.get('geminiKey')
    };
    const strTargetRoleTitle = objFormData.get('targetRoleTitle');

    const objUserResponse = await fetch('/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(objUserPayload) });
    const objUserResult = await objUserResponse.json();
    aState.currentUserId = objUserResult.userId;

    const objResumeResponse = await fetch('/api/resumes', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userID: aState.currentUserId, targetRoleTitle: strTargetRoleTitle })
    });
    const objResumeResult = await objResumeResponse.json();
    aState.currentResumeId = objResumeResult.resumeId;

    showStep('divStepJobs');
    setProgress(66);
};

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
    const strGeminiKey = new FormData(aDom.frmUserInfo).get('geminiKey');
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
