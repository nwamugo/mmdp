// https://stackoverflow.com/questions/45425169/intercept-fetch-api-responses-and-request-in-javascript/45889043
// intercept fetch api calls and check for network errors
const constantMock = window.fetch;
window.fetch = function() {
  return new Promise((resolve, reject) => {
    constantMock
      .apply(this, arguments)
      .then(response => {
        resolve(response);
      })
      .catch(() => {
        const errorMessage =
          'There is currently no connection to the application. Please check your internet connection or try again later';
        try {
          toastr.options = {
            preventDuplicates: true,
            timeOut: "7000",
          };
          toastr.error(errorMessage);
        } catch (error) {
          alert(errorMessage);
        }
        reject(response);
      });
  });
};
