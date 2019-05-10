(function() {
  function setToken(token) {
    localStorage.setItem('userToken', token);
  }

  function logout() {
    setToken('');
    redirectTo('/coordination-matrix.html');
  }

  function loaded() {
    const logoutButton = document.querySelectorAll('button.logout__btn');
    logoutButton[0].addEventListener('click', logout, false);
  }
  document.addEventListener('DOMContentLoaded', loaded, false);
})();
