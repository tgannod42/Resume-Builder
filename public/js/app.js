const aState = {
  activeRoute: 'dashboard',
};

const aDom = {
  routeButtons: Array.from(document.querySelectorAll('.routeButton')),
  appViews: Array.from(document.querySelectorAll('.appView')),
  mainContent: document.getElementById('mainContent'),
};

const updateRouteStyles = (sActiveRoute) => {
  aDom.routeButtons.forEach((oButton) => {
    const bIsActive = oButton.dataset.route === sActiveRoute;

    oButton.setAttribute('aria-current', bIsActive ? 'page' : 'false');
    oButton.classList.toggle('bg-indigo-200', bIsActive);
    oButton.classList.toggle('text-slate-900', bIsActive);
    oButton.classList.toggle('font-semibold', bIsActive);
    oButton.classList.toggle('text-slate-100', !bIsActive);
  });
};

const showView = (sRouteName) => {
  aDom.appViews.forEach((oView) => {
    const bShouldShow = oView.dataset.view === sRouteName;
    oView.classList.toggle('hidden', !bShouldShow);
  });

  aState.activeRoute = sRouteName;
  updateRouteStyles(sRouteName);
  aDom.mainContent.focus();
};

const bindNavigation = () => {
  aDom.routeButtons.forEach((oButton) => {
    oButton.addEventListener('click', () => {
      const sRouteName = oButton.dataset.route;
      showView(sRouteName);
    });
  });
};

const initializeApplication = () => {
  bindNavigation();
  showView(aState.activeRoute);
};

initializeApplication();
