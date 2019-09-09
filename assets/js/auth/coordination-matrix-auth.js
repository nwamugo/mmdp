(function() {
  async function login(data) {
    try {
      const rawResponse = await fetch(`${MMDP_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      const response = await rawResponse.json();
      if (response.status === 'success') {
        const { token } = response.data.user;
        setToken(token);
        redirectTo('/index-cordination-matrix.html');
      } else {
        toastr.error(response.message || 'Operation not successful!');
      }
    } catch (error) {
      const message = error.message;
      toastr.error(message);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    toggleSubmitBtn();
    const data = {
      email: $('#email').val(),
      password: $('#password').val()
    };
    await login(data);
    toggleSubmitBtn('Sign in', false);
  }

  function loaded() {
    const forms = document.querySelectorAll('form.coordination-login__form');
    forms[0].addEventListener('submit', handleSubmit, false);
    if (localStorage.getItem('userToken')) {
      redirectTo('/index-cordination-matrix.html');
    }
  }
  document.addEventListener('DOMContentLoaded', loaded, false);
})();
