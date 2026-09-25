import { BrowserRouter, Route, Routes } from "react-router"
import "./App.css";
import Chat from "@/pages/Chat.jsx";
import ChatHome from "@/pages/ChatHome.jsx";
import EnterpriseLayout from "./components/layout/EnterpriseLayout.jsx";

function Layout({ children }) {
  return <div>{children}</div>;
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <EnterpriseLayout>
        <Routes>
          <Route path="/" element={<ChatHome />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
        </EnterpriseLayout>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
