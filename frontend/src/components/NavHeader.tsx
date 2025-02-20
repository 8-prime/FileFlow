import { Settings } from "lucide-react";
import { JSX } from "react";
import { NavLink } from "react-router";

const NavHeader = (): JSX.Element => {
    return (
        <nav className="w-full flex flex-row justify-between items-center px-4 py-4">
            <NavLink to="/">
                <p className="text-4xl font-bold">FileFlow</p>
            </NavLink>
            <NavLink to="admin">
                <Settings size={36} strokeWidth={1.6} />
            </NavLink>
        </nav>
    )
}

export default NavHeader;