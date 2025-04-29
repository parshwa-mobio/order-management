import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "./components/ui/Toaster";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <AppRoutes />
          <Toaster />
        </AuthProvider>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
