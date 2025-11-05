import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Pages/Login";
import Layout from "./components/Layout";
import { useAppContext } from "./Context/AppContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import Dashboard from "./components/Dashboard";
import MarketPlace from "./Pages/MarketPlace";
import RequestsPage from "./Pages/Requests";

function App() {
  const { user } = useAppContext();
  const router = createBrowserRouter([
    {
      path: "/auth",
      element: (
        <ProtectedRoute user={!user} redirect="/">
          <Login />
        </ProtectedRoute>
      ),
    },
    {
      path: "/",
      element: (
        <ProtectedRoute user={user}>
          <Layout />
        </ProtectedRoute>
      ),
      children:[
        {
          path:'/',
          element:<Dashboard/>
        },
        {
          path:'/marketplace',
          element:<MarketPlace/>
        },
        {
          path:'/requests',
          element:<RequestsPage/>
        },

      ]
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
