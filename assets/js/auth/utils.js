let MMDP_BASE_URL;
if (
  window.location.host.includes('127.0.0.1') ||
  window.location.host.includes('localhost')
) {
  MMDP_BASE_URL = 'http://0.0.0.0:3000';
} else {
  MMDP_BASE_URL = 'http://cms-staging.mmdp.ng:3000';
}

(function() {
  try {
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
  } catch (error) {
    return;
  }
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

function setToken(token) {
  localStorage.setItem('userToken', token);
}

function logout() {
  setToken('');
  redirectTo('/coordination-matrix.html');
}

function activateLogoutBtn() {
  const logoutButton = document.querySelectorAll('button#logout__btn');
  logoutButton[0].addEventListener('click', logout, false);
}

function redirectUnAuthUser(url){
  if (!localStorage.getItem('userToken')) {
    redirectTo(url);
  }
}
