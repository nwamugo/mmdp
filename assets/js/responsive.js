responsiveTable = () => {
  if ($(window).width() <= 600) {
    $('.table-lg, .table__footer, .reportButton').hide();
    $('.table-sm, .responsive_table__footer').show();
  } else {
    $('.table-sm, .responsive_table__footer').hide();
    $('.table-lg')
      .show()
      .css({ display: 'block' });
  }
};

$(document).ready(() => {
  responsiveTable();
});
