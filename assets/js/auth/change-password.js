(function() {
  const baseUrl = MMDP_BASE_URL;
  let resetToken
  async function changePassword(data) {
    try {
      const rawResponse = await fetch(`${baseUrl}/api/v1/auth/change-password`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          authorization: `Bearer ${resetToken}`,
        },
        Authorization: resetToken,
        body: JSON.stringify(data)
      });
      const response = await rawResponse.json();
      if (response.status === 'success') {
        redirectTo('/coordination-matrix.html');
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
    toggleSubmitBtn('Processing', true);
    const confirmPassword = $('#confirm-password').val();
    const password = $('#password').val();
    if (confirmPassword !== password) {
      toastr.error('Entered Passwords are not the same');
      toggleSubmitBtn('Change Password', false);
      return;
    }
    const data = {
      password,
      confirmPassword
    };
    await changePassword(data);
    toggleSubmitBtn('Change Password', false);
  }

  function loaded() {
    const forms = document.querySelectorAll('form.change-password');
    forms[0].addEventListener('submit', handleSubmit, false);
    resetToken = window.location.search.substring(1).split("=")[1]
  }
  document.addEventListener('DOMContentLoaded', loaded, false);
})();
