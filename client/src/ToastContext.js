import { createContext } from "react";

const ToastContext = createContext({
  showToast: () => {},
  hideToast: () => {},
});

export default ToastContext;
