const toggleChevron = chevronIcon => {
  if (chevronIcon.hasClass('fa-times')) {
    chevronIcon.removeClass('fa-times').addClass('fa-chevron-down');
  } else {
    chevronIcon.removeClass('fa-chevron-down').addClass('fa-times');
  }
};

$(document).on(
  'click',
  '.btn-accordion-table, .btn-single-table-card',
  function() {
    const chevronIcon = $(this).find(
      '[class*="fa-chevron"], [class*="fa-times"]'
    );
    const panel = $(this).next('.panel');
    panel.slideToggle({
      start: () => {
        $(this).toggleClass('active');
        toggleChevron(chevronIcon);
      }
    });
  }
);

$(document).on('click', '.responsive-filters-panel .dropbtn', function() {
  const chevronIcon = $(this).find(
    '[class*="fa-chevron"], [class*="fa-times"]'
  );
  toggleChevron(chevronIcon);
});

$(document).on(
  'click',
  '.responsive-filters-panel .applyFilter_btn',
  function() {
    const chevronIcon = $(this)
      .parents('.responsive-filters-panel')
      .find('[class*="fa-chevron"], [class*="fa-times"]');
    toggleChevron(chevronIcon);
    $('.btn-accordion-table, .btn-single-table-card').off('click');
  }
);
