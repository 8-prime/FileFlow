import { SearchIcon } from "lucide-react";
import { JSX } from "react";

type FileInfo = {
    name: string,
    size: string,
    expires: string,
    id: string
}

const files: FileInfo[] = [
    {
        id: "1",
        name: 'Document.pdf',
        size: '2.5 MB',
        expires: '2024-03-15',
    },
    {
        id: "2",
        name: 'Image.jpg',
        size: '1.2 MB',
        expires: '2024-03-20',
    },
    {
        id: "3",
        name: 'Spreadsheet.xlsx',
        size: '800 KB',
        expires: '2024-03-25',
    },
    {
        id: "3",
        name: 'Spreadsheet.xlsx',
        size: '800 KB',
        expires: '2024-03-25',
    },
    {
        id: "3",
        name: 'Spreadsheet.xlsx',
        size: '800 KB',
        expires: '2024-03-25',
    },
    {
        id: "3",
        name: 'Spreadsheet.xlsx',
        size: '800 KB',
        expires: '2024-03-25',
    },
    {
        id: "3",
        name: 'Spreadsheet.xlsx',
        size: '800 KB',
        expires: '2024-03-25',
    },
    {
        id: "3",
        name: 'Spreadsheet.xlsx',
        size: '800 KB',
        expires: '2024-03-25',
    },
    {
        id: "3",
        name: 'Spreadsheet.xlsx',
        size: '800 KB',
        expires: '2024-03-25',
    },
    {
        id: "3",
        name: 'Spreadsheet.xlsx',
        size: '800 KB',
        expires: '2024-03-25',
    },
    {
        id: "3",
        name: 'Spreadsheet.xlsx',
        size: '800 KB',
        expires: '2024-03-25',
    },
    {
        id: "3",
        name: 'Spreadsheet.xlsx',
        size: '800 KB',
        expires: '2024-03-25',
    },
];

const FileList = (): JSX.Element => {
    return (
        <div className="overflow-x-auto">
            <div className="rounded-lg bg-neutral-800 shadow-lg">
                <table className="min-w-full divide-y divide-neutral-500">
                    <thead>
                        <tr>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                            >
                                Name
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider"
                            >
                                Size
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                            >
                                Expires
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                            >
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className=" divide-y divide-neutral-600">
                        {files.map((file) => (
                            <tr key={file.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {file.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {file.size}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {file.expires}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <button
                                        className="text-neutral-300 underline font-bold py-2 px-4 rounded"
                                        onClick={() => alert(`View ${file.name}`)}
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}


const Search = (): JSX.Element => {
    return (
        <div className="relative shadow-lg px-4 rounded-lg bg-neutral-800">
            <label htmlFor="Search" className="sr-only"> Search </label>

            <input
                type="text"
                id="Search"
                placeholder="Search for..."
                className="w-full rounded-md border-gray-200 py-2.5 pe-10 shadow-xs sm:text-sm"
            />

            <span className="absolute inset-y-0 end-0 grid w-10 place-content-center">
                <button type="button" className="text-gray-600 hover:text-gray-700">
                    <span className="sr-only">Search</span>
                    <SearchIcon />
                </button>
            </span>
        </div>
    );
}

const Admin = (): JSX.Element => {
    return (
        <div className="w-full h-full overflow-hidden grid grid-rows-[auto_auto_auto_1fr] px-2 md:px-5 lg:px-40 gap-4 py-20">
            <h1 className="text-4xl font-semibold">Uploaded files</h1>
            <p className="text-neutral-400">There have been 25 uploaded files (2.5GB) in the last 30 days</p>
            <Search />
            <FileList />
        </div>
    )
}

export default Admin;