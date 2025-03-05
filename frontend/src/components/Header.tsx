import { JSX } from "react"
import { NavLink } from "react-router"

export const Header = (): JSX.Element => {
    return (
        <header className="border-b">
            <div className="w-full flex h-16 items-center px-4 sm:px-6 lg:px-8">
                <NavLink to="/" className="font-bold text-4xl">
                    FileFlow
                </NavLink>
                <nav className="ml-auto flex gap-4 sm:gap-6">
                    <NavLink to="/" className="text-sm font-medium">
                        Upload
                    </NavLink>
                    <NavLink to="/admin" className="text-sm font-medium text-primary">
                        Admin
                    </NavLink>
                </nav>
            </div>
        </header>
    )
}