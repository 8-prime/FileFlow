import { JSX } from "react";
import { NavLink } from "react-router";

const NoMatch = (): JSX.Element => {
    return (
        <div className="w-screen h-screen bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50">
            <p className="text-3xl">You lost?</p>
            <NavLink to="/" >Go home</NavLink>
        </div>
    );
}

export default NoMatch;