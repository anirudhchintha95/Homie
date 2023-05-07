import { useContext } from "react";
import ToastContext from "./ToastContext";

const useToast = () => useContext(ToastContext);

export default useToast;
