import { JSX } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import NavHeader from "./components/NavHeader";
import Admin from "./pages/Admin";
import FileView from "./pages/FileView";
import NoMatch from "./pages/NoMatch";
import Upload from "./pages/Upload";


const App = (): JSX.Element => {
    return (
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
}

export default App;