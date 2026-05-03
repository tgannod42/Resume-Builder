const aState = {
    activeRoute: 'builder', // Defaulting to builder for development
    resumeData: {}          // Object to collect data across the wizard steps
};

const aDom = {
    routeButtons: Array.from(document.querySelectorAll('.routeButton')),
    appViews: Array.from(document.querySelectorAll('.appView')),
    mainContent: document.getElementById('mainContent'),
    
    // Resume Builder Specific Elements
    divProgressBar: document.getElementById('divProgressBar'),
    divStepUserInfo: document.getElementById('divStepUserInfo'),
    divStepJobs: document.getElementById('divStepJobs'),
    frmUserInfo: document.getElementById('frmUserInfo'),
    btnBackToUserInfo: document.getElementById('btnBackToUserInfo')
};

/**
 * Updates the styling of the sidebar navigation buttons based on the active route.
 */
const updateRouteStyles = (sActiveRoute) => {
    aDom.routeButtons.forEach((oButton) => {
        const bIsActive = oButton.dataset.route === sActiveRoute;
        
        oButton.setAttribute('aria-current', bIsActive ? 'page' : 'false');
        oButton.classList.toggle('btn-info', bIsActive);
        oButton.classList.toggle('text-dark', bIsActive);
        oButton.classList.toggle('btn-outline-light', !bIsActive);
    });
};

/**
 * Toggles the visibility of the main application views (Dashboard, Builder, Settings).
 */
const showView = (sRouteName) => {
    aDom.appViews.forEach((oView) => {
        const bShouldShow = oView.dataset.view === sRouteName;
        if (bShouldShow) {
            oView.style.display = 'block';
            oView.classList.remove('d-none');
        } else {
            oView.style.display = 'none';
        }
    });

    aState.activeRoute = sRouteName;
    updateRouteStyles(sRouteName);
    aDom.mainContent.focus();
};

/**
 * Handles the transition between steps within the Resume Builder wizard.
 */
const showBuilderStep = (oStepToShow, oStepToHide, iProgressPercentage) => {
    if (oStepToHide) oStepToHide.style.display = 'none';
    if (oStepToShow) oStepToShow.style.display = 'block';
    
    // Update the progress bar ARIA values and visual width
    if (aDom.divProgressBar) {
        aDom.divProgressBar.style.width = `${iProgressPercentage}%`;
        aDom.divProgressBar.setAttribute('aria-valuenow', iProgressPercentage);
    }
};

/**
 * Processes the Step 1 form submission.
 * Uses async/await as per AGENTS.md guidelines.
 */
const handleUserInfoSubmit = async (oEvent) => {
    oEvent.preventDefault();
    
    const oForm = oEvent.target;
    
    // HTML5 Input Validation check
    if (!oForm.checkValidity()) {
        oForm.classList.add('was-validated');
        return;
    }

    const oFormData = new FormData(oForm);
    
    // Extracting data using Hungarian Notation
    const sFirstName = oFormData.get('firstName');
    const sLastName = oFormData.get('lastName');
    const sEmail = oFormData.get('email');
    const sTargetRole = oFormData.get('targetRoleTitle');

    // Store data in local state for final submission later
    aState.resumeData.user = {
        firstName: sFirstName,
        lastName: sLastName,
        email: sEmail,
        targetRoleTitle: sTargetRole
    };

    console.log('Step 1 Validated & Saved:', aState.resumeData.user);

    // Transition from Step 1 to Step 2, updating progress to 40%
    showBuilderStep(aDom.divStepJobs, aDom.divStepUserInfo, 40);
};

/**
 * Handles returning to Step 1 from Step 2.
 */
const handleBackToUserInfo = () => {
    showBuilderStep(aDom.divStepUserInfo, aDom.divStepJobs, 20);
};

/**
 * Binds sidebar navigation events.
 */
const bindNavigation = () => {
    aDom.routeButtons.forEach((oButton) => {
        oButton.addEventListener('click', () => {
            const sRouteName = oButton.dataset.route;
            showView(sRouteName);
        });
    });
};

/**
 * Binds internal Resume Builder events.
 */
const bindBuilderEvents = () => {
    if (aDom.frmUserInfo) {
        aDom.frmUserInfo.addEventListener('submit', handleUserInfoSubmit);
    }
    
    if (aDom.btnBackToUserInfo) {
        aDom.btnBackToUserInfo.addEventListener('click', handleBackToUserInfo);
    }
};

/**
 * Application Entry Point
 */
const initializeApplication = () => {
    bindNavigation();
    bindBuilderEvents();
    
    // Show the initial view based on state
    showView(aState.activeRoute);
};

// Start the app
initializeApplication();