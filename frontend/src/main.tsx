import { BrowserRouter, Routes, Route } from "react-router";
import { createRoot } from 'react-dom/client'
import './index.css'
import Upload from "./pages/Upload.tsx";
import Admin from "./pages/Admin.tsx";
import NoMatch from "./pages/NoMatch.tsx";
import FileView from "./pages/FileView.tsx";
import NavHeader from "./components/NavHeader.tsx";

createRoot(document.getElementById('root')!).render(
  <div className="w-screen h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50">
    <BrowserRouter>
      <NavHeader />
      <Routes>
        <Route index element={<Upload />} />
        <Route path="admin" element={<Admin />} />
        <Route path="files/:uploadId" element={<FileView />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </BrowserRouter>
  </div>
)
