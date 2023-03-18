import { toast, Slide } from "react-toastify";

const DEFAULT_ERROR_MESSAGE =
  "Oops! Something went wrong. Please try again later.";
const DEFAULT_SUCCESS_MESSAGE = "Success!";

export const displayInfoToast = (message = DEFAULT_ERROR_MESSAGE) => {
  sendToastNotification(toast.info, message);
};

export const displayErrorToast = (message = DEFAULT_ERROR_MESSAGE) => {
  sendToastNotification(toast.error, message);
};

export const displaySuccessToast = (
  message = DEFAULT_SUCCESS_MESSAGE
) => {
  sendToastNotification(toast.success, message);
};

export const sendToastNotification = (
  toastNotifcation,
  message
) => {
  toastNotifcation(message, {
    theme: "colored",
    transition: Slide,
    position: "top-center",
    autoClose: 2000 /* 2 seconds */,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};