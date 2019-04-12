let MMDP_BASE_URL;
if (
  window.location.host.includes('127.0.0.1') ||
  window.location.host.includes('localhost')
) {
  MMDP_BASE_URL = 'http://0.0.0.0:3000';
} else {
  MMDP_BASE_URL = 'http://54.202.70.86:3000';
}

(function() {
  toastr.options = {
    closeButton: false,
    newestOnTop: true,
    progressBar: true,
    positionClass: 'toast-top-right',
    preventDuplicates: true,
    showDuration: '300',
    hideDuration: '1000',
    timeOut: '7000',
    extendedTimeOut: '2000',
    showEasing: 'swing',
    hideEasing: 'linear',
    showMethod: 'fadeIn',
    hideMethod: 'fadeOut'
  };
})();

function toggleSubmitBtn(text = 'Signing in...', disabled = true) {
  const btn = $('input.btn');
  btn[0].disabled = disabled;
  btn[0].value = text;
}

function setToken(token) {
  localStorage.setItem('userToken', token);
}

function redirectTo(url) {
  window.location.href = url;
}
