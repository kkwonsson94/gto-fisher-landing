const product = document.querySelector('#solver-product');
const dialog = document.querySelector('#solver-image-dialog');

if (product && dialog) {
  const tabs = [...product.querySelectorAll('[data-solver-tab]')];
  const panels = [...product.querySelectorAll('.solver-view')];
  const dialogImage = dialog.querySelector('#solver-dialog-image');
  const dialogTitle = dialog.querySelector('#solver-image-title');
  const closeButton = dialog.querySelector('.solver-dialog-close');
  const solverNav = document.querySelector('.site-header nav a[href="#solver-product"]');
  const homeNav = document.querySelector('.site-header nav a[href="#home"]');
  const images = {
    strategy: ['Strategy workspace', 'Strategy matrix, action frequencies, poker table and individual hand combinations.'],
    equity: ['Range & equity analysis', 'Both ranges, EV, equity, equity realization, distribution curves and blocker effects.'],
    groups: ['Strategy groups', 'Strategy organized by hand strength, draws and filtered combinations.'],
    reports: ['Aggregate reports', 'Board-by-board comparisons of checking and betting frequencies.'],
    'node-lock': ['Node Lock controls', 'Editable hand matrix, action-frequency sliders and grouped hand controls.'],
    'ai-lock': ['AI node locking', 'Natural-language AI lock dialog. Review the proposed changes before applying them.'],
  };
  let imageOpener = null;

  const navigationObserver = new IntersectionObserver(([entry]) => {
    solverNav?.classList.toggle('nav-active', entry.isIntersecting);
    homeNav?.classList.toggle('nav-active', !entry.isIntersecting);
    if (entry.isIntersecting) solverNav?.setAttribute('aria-current', 'location');
    else solverNav?.removeAttribute('aria-current');
  }, { rootMargin: '-80px 0px -65% 0px' });
  navigationObserver.observe(product);

  function selectTab(tab, focus = false) {
    const selected = tab.dataset.solverTab;
    tabs.forEach(item => {
      const active = item === tab;
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
    });
    panels.forEach(panel => { panel.hidden = panel.id !== `solver-view-${selected}`; });
    if (focus) tab.focus({ preventScroll: true });
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', event => {
      let next = index;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      selectTab(tabs[next], true);
    });
  });

  product.addEventListener('click', event => {
    const opener = event.target.closest('[data-solver-image]');
    if (!opener) return;
    const id = opener.dataset.solverImage;
    const information = images[id];
    if (!information) return;
    imageOpener = opener;
    dialogTitle.textContent = information[0];
    dialogImage.alt = information[1];
    dialogImage.src = `assets/solver/${id}-1920.webp`;
    document.documentElement.classList.add('solver-dialog-open');
    dialog.showModal();
    dialog.querySelector('.solver-dialog-image-wrap').scrollLeft = 0;
    closeButton.focus({ preventScroll: true });
  });

  function restorePageFocus() {
    document.documentElement.classList.remove('solver-dialog-open');
    imageOpener?.focus({ preventScroll: true });
  }
  function closeDialog() {
    dialog.close();
    restorePageFocus();
  }
  closeButton.addEventListener('click', closeDialog);
  dialog.addEventListener('cancel', event => {
    event.preventDefault();
    closeDialog();
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) closeDialog();
  });
  dialog.addEventListener('close', () => {
    if (!dialog.open) restorePageFocus();
  });
}
