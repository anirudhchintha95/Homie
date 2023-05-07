import { AuthProvider, ToastProvider } from "./components";
import Routes from "./routes";

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
