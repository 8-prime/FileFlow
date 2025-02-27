import { JSX } from "react";
import { NavLink } from "react-router";

const NoMatch = (): JSX.Element => {
    return (
        <div className="w-full grow flex flex-col justify-center items-center gap-4">
            <p className="text-3xl">You lost?</p>
            <NavLink className="h-9 px-4 py-2 bg-neutral-50 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50 rounded-lg shadow-lg" to="/" >Go home</NavLink>
        </div>
    );
}

export default NoMatch;