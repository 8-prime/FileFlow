import { JSX } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import Admin from "./pages/Admin";
import FileView from "./pages/FileView";
import NoMatch from "./pages/NoMatch";
import Upload from "./pages/Upload";
import Success from "./pages/Success";

const App = (): JSX.Element => {
    return (
        <div className="w-full min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50">

            <BrowserRouter>
                <Routes>
                    <Route index element={<Upload />} />
                    <Route path="admin" element={<Admin />} />
                    <Route path="files/:uploadId" element={<FileView />} />
                    <Route path="success/:uploadId" element={<Success />} />
                    <Route path="*" element={<NoMatch />} />
                </Routes>
            </BrowserRouter>
            <footer className="border-t py-6 md:py-0">
                <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left px-4">
                        © {new Date().getFullYear()} FileFlow. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}

export default App;