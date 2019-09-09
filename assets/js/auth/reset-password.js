(function() {
  async function resetPassword(data) {
    try {
      const rawResponse = await fetch(`${MMDP_BASE_URL}/api/v1/auth/reset-password`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      const response = await rawResponse.json();
      if (response.status === 'success') {
        toastr.success(response.message)
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
    toggleSubmitBtn('Processing...', true);
    const data = {
      email: $('#reset-password').val(),
      baseUrl: window.location.origin,
    };
    await resetPassword(data);
    toggleSubmitBtn('Reset Password', false);
  }

  function loaded() {
    const forms = document.querySelectorAll('form.reset-password');
    forms[0].addEventListener('submit', handleSubmit, false);
  }
  document.addEventListener('DOMContentLoaded', loaded, false);
})();
