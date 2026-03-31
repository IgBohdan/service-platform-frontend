import { useEffect } from "react";
import Layout from "../components/Layout";
import { useAuthStore } from "../features/auth/auth.store";

function App() {
  const fetchProfile = useAuthStore((state) => state.fetchProfile);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <div className="App">
      {/* <Layout /> */}
    </div>
  );
}

export default App;
