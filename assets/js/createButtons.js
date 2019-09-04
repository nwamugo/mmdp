createButtons = () => {
  $('#stakeholder-mobile-table-container').unbind('click');
  $('#stakeholder-mobile-table-container').on(
    'click',
    '.btn-single-table-card',
    function(event) {
      const panel = $(this).next();
      panel.slideToggle();
    }
  );
};


