import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DefaultLayout from "./layouts/user";
import DefaultAdminLayout from "./layouts/admin";
import Login from "./pages/users/Auth/Login";
import { useLayoutEffect, useState } from "react";
import { history } from "./routes/history";
import LoginAdmin from "./pages/admin/Auth/Login";

const CustomRouter = ({ history, ...props }: any) => {
  const [state, setState] = useState({
    action: history.action,
    location: history.location,
  });

  useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <Router
      {...props}
      location={state.location}
      navigationType={state.action}
      navigator={history}
    />
  );
};

function App() {
  return (
    <CustomRouter history={history}>
      <Routes>
        <Route path="/*" element={<DefaultLayout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<LoginAdmin />} />
        <Route path="/admin/*" element={<DefaultAdminLayout />} />
      </Routes>
    </CustomRouter>
  );
}

export default App;
