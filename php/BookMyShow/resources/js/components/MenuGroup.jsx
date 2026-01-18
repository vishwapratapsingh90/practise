import React, { useEffect, useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../ThemeContext';
import { validateAuthentication, getAuthenticatedUser, clearAuthData } from '../utils/authentication';

function MenuGroup() {
    const [user, setUser] = useState(null);
    const theme = useTheme();
    const navigate = useNavigate();
    const [isOpen1, setIsOpen1] = useState(false);
    const [isNestedOpen1, setIsNestedOpen1] = useState(false);
    const [isOpen2, setIsOpen2] = useState(false);
    const [isNestedOpen2, setIsNestedOpen2] = useState(false);
    const [isOpen3, setIsOpen3] = useState(false);
    const [isNestedOpen3, setIsNestedOpen3] = useState(false);

    useEffect(() => {
        setUser(getAuthenticatedUser());
    }, [navigate]);

    if (!user) return <> </>;

    return (
        <div className={`flex gap-4 ${theme.classes.bgHeader} ${theme.classes.p.md} shadow-sm bg-gradient-to-r from-[#667eea] to-[#764ba2]`}>
        {/* Dropdown 1 */}
        <div className="relative">
            <button
                id="accessControl"
                onClick={() => setIsOpen1(!isOpen1)}
                className={`inline-flex items-center justify-center ${theme.classes.textLight} bg-gradient-to-br from-[#667eea] to-[#764ba2] box-border border border-transparent hover:opacity-90 focus:ring-4 focus:ring-purple-300 ${theme.classes.shadow.md} font-medium leading-5 rounded-lg text-sm px-4 py-2.5 focus:outline-none`}
                type="button"
            >
                Access Control
                <svg className="w-4 h-4 ms-1.5 -me-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7"/>
                </svg>
            </button>

            <div id="accessControl" className={`absolute mt-2 z-10 ${isOpen1 ? 'block' : 'hidden'} ${theme.classes.bgWhite} border border-gray-200 rounded-lg ${theme.classes.shadow.lg} w-44`}>
                <ul className={`${theme.classes.p.sm} ${theme.classes.text.sm} ${theme.classes.textSecondary} font-medium`} aria-labelledby="accessControl">
                    <li>
                        <Link to="/admin/roles" className={`inline-flex items-center w-full ${theme.classes.p.sm} hover:bg-gray-100 ${theme.classes.textPrimary} rounded`}>Manage Roles</Link>
                    </li>

                    <li>
                        <a href="/admin/view-permissions" className={`inline-flex items-center w-full ${theme.classes.p.sm} hover:bg-gray-100 ${theme.classes.textPrimary} rounded`}>Manage Permissions</a>
                    </li>

                    <li>
                        <a href="#" className={`inline-flex items-center w-full ${theme.classes.p.sm} hover:bg-gray-100 ${theme.classes.textPrimary} rounded`}>Manage Role Access</a>
                    </li>

                    {/* <li>
                        <button
                            id="doubleDropdownButton1"
                            onClick={() => setIsNestedOpen1(!isNestedOpen1)}
                            type="button"
                            className={`inline-flex items-center w-full ${theme.classes.p.sm} hover:bg-gray-100 ${theme.classes.textPrimary} rounded`}
                        >
                            More Options
                            <svg className="h-4 w-4 ms-auto rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7"/>
                            </svg>
                        </button>
                        <div id="doubleDropdown1" className={`ml-2 ${isNestedOpen1 ? 'block' : 'hidden'} ${theme.classes.bgWhite} border border-gray-200 rounded-lg ${theme.classes.shadow.lg} w-40`}>
                            <ul className={`${theme.classes.p.sm} ${theme.classes.text.sm} ${theme.classes.textSecondary} font-medium`} aria-labelledby="doubleDropdownButton1">
                            <li>
                                <a href="#" className={`inline-flex items-center w-full ${theme.classes.p.sm} hover:bg-gray-100 ${theme.classes.textPrimary} rounded`}>Overview</a>
                            </li>
                            <li>
                                <a href="#" className={`inline-flex items-center w-full ${theme.classes.p.sm} hover:bg-gray-100 ${theme.classes.textPrimary} rounded`}>My downloads</a>
                            </li>
                            <li>
                                <a href="#" className={`inline-flex items-center w-full ${theme.classes.p.sm} hover:bg-gray-100 ${theme.classes.textPrimary} rounded`}>Billing</a>
                            </li>
                            <li>
                                <a href="#" className={`inline-flex items-center w-full ${theme.classes.p.sm} hover:bg-gray-100 ${theme.classes.textPrimary} rounded`}>Rewards</a>
                            </li>
                            </ul>
                        </div>
                    </li> */}
                </ul>
            </div>
        </div>

        {/* Dropdown 2 */}
        <div className="relative">
            <button
                id="multiLevelDropdownButton2"
                onClick={() => setIsOpen2(!isOpen2)}
                className={`inline-flex items-center justify-center ${theme.classes.textLight} bg-gradient-to-br from-[#667eea] to-[#764ba2] box-border border border-transparent hover:opacity-90 focus:ring-4 focus:ring-purple-300 ${theme.classes.shadow.md} font-medium leading-5 rounded-lg text-sm px-4 py-2.5 focus:outline-none`}
                type="button"
            >
                Dropdown 2
                <svg className="w-4 h-4 ms-1.5 -me-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7"/>
                </svg>
            </button>

            <div id="multi-dropdown2" className={`absolute mt-2 z-10 ${isOpen2 ? 'block' : 'hidden'} ${theme.classes.bgWhite} border border-gray-200 rounded-lg ${theme.classes.shadow.lg} w-44`}>
                <ul className={`${theme.classes.p.sm} ${theme.classes.text.sm} ${theme.classes.textSecondary} font-medium`} aria-labelledby="multiLevelDropdownButton2">
                <li>
                    <a href="#" className={`inline-flex items-center w-full ${theme.classes.p.sm} hover:bg-gray-100 ${theme.classes.textPrimary} rounded`}>Dashboard</a>
                </li>
                <li>
                    <button
                        id="doubleDropdownButton2"
                        onClick={() => setIsNestedOpen2(!isNestedOpen2)}
                        type="button"
                        className={`inline-flex items-center w-full ${theme.classes.p.sm} hover:bg-gray-100 ${theme.classes.textPrimary} rounded`}
                    >
                        More Options
                        <svg className="h-4 w-4 ms-auto rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7"/>
                        </svg>
                    </button>
                    <div id="doubleDropdown2" className={`ml-2 ${isNestedOpen2 ? 'block' : 'hidden'} ${theme.classes.bgWhite} border border-gray-200 rounded-lg ${theme.classes.shadow.lg} w-40`}>
                        <ul className={`${theme.classes.p.sm} ${theme.classes.text.sm} ${theme.classes.textSecondary} font-medium`} aria-labelledby="doubleDropdownButton2">
                        <li>
                            <a href="#" className={`inline-flex items-center w-full ${theme.classes.p.sm} hover:bg-gray-100 ${theme.classes.textPrimary} rounded`}>Overview</a>
                        </li>
                        <li>
                            <a href="#" className={`inline-flex items-center w-full ${theme.classes.p.sm} hover:bg-gray-100 ${theme.classes.textPrimary} rounded`}>My downloads</a>
                        </li>
                        <li>
                            <a href="#" className={`inline-flex items-center w-full ${theme.classes.p.sm} hover:bg-gray-100 ${theme.classes.textPrimary} rounded`}>Billing</a>
                        </li>
                        <li>
                            <a href="#" className={`inline-flex items-center w-full ${theme.classes.p.sm} hover:bg-gray-100 ${theme.classes.textPrimary} rounded`}>Rewards</a>
                        </li>
                        </ul>
                    </div>
                </li>
                <li>
                    <a href="#" className={`inline-flex items-center w-full ${theme.classes.p.sm} hover:bg-gray-100 ${theme.classes.textPrimary} rounded`}>Earnings</a>
                </li>
                <li>
                    <a href="#" className={`inline-flex items-center w-full ${theme.classes.p.sm} hover:bg-gray-100 ${theme.classes.textPrimary} rounded`}>Sign out</a>
                </li>
                </ul>
            </div>
        </div>

        {/* Dropdown 3 */}
        <div className="relative">
            <button
                id="multiLevelDropdownButton3"
                onClick={() => setIsOpen3(!isOpen3)}
                className={`inline-flex items-center justify-center ${theme.classes.textLight} bg-gradient-to-br from-[#667eea] to-[#764ba2] box-border border border-transparent hover:opacity-90 focus:ring-4 focus:ring-purple-300 ${theme.classes.shadow.md} font-medium leading-5 rounded-lg text-sm px-4 py-2.5 focus:outline-none`}
                type="button"
            >
                Dropdown 3
                <svg className="w-4 h-4 ms-1.5 -me-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7"/>
                </svg>
            </button>

            <div id="multi-dropdown3" className={`absolute mt-2 z-10 ${isOpen3 ? 'block' : 'hidden'} ${theme.classes.bgWhite} border border-gray-200 rounded-lg ${theme.classes.shadow.lg} w-44`}>
                <ul className={`${theme.classes.p.sm} ${theme.classes.text.sm} ${theme.classes.textSecondary} font-medium`} aria-labelledby="multiLevelDropdownButton3">
                <li>
                    <a href="#" className={`inline-flex items-center w-full ${theme.classes.p.sm} hover:bg-gray-100 ${theme.classes.textPrimary} rounded`}>Dashboard</a>
                </li>
                <li>
                    <button
                        id="doubleDropdownButton3"
                        onClick={() => setIsNestedOpen3(!isNestedOpen3)}
                        type="button"
                        className={`inline-flex items-center w-full ${theme.classes.p.sm} hover:bg-gray-100 ${theme.classes.textPrimary} rounded`}
                    >
                        More Options
                        <svg className="h-4 w-4 ms-auto rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7"/>
                        </svg>
                    </button>
                    <div id="doubleDropdown3" className={`ml-2 ${isNestedOpen3 ? 'block' : 'hidden'} ${theme.classes.bgWhite} border border-gray-200 rounded-lg ${theme.classes.shadow.lg} w-40`}>
                        <ul className={`${theme.classes.p.sm} ${theme.classes.text.sm} ${theme.classes.textSecondary} font-medium`} aria-labelledby="doubleDropdownButton3">
                        <li>
                            <a href="#" className={`inline-flex items-center w-full ${theme.classes.p.sm} hover:bg-gray-100 ${theme.classes.textPrimary} rounded`}>Overview</a>
                        </li>
                        <li>
                            <a href="#" className={`inline-flex items-center w-full ${theme.classes.p.sm} hover:bg-gray-100 ${theme.classes.textPrimary} rounded`}>My downloads</a>
                        </li>
                        <li>
                            <a href="#" className={`inline-flex items-center w-full ${theme.classes.p.sm} hover:bg-gray-100 ${theme.classes.textPrimary} rounded`}>Billing</a>
                        </li>
                        <li>
                            <a href="#" className={`inline-flex items-center w-full ${theme.classes.p.sm} hover:bg-gray-100 ${theme.classes.textPrimary} rounded`}>Rewards</a>
                        </li>
                        </ul>
                    </div>
                </li>
                <li>
                    <a href="#" className={`inline-flex items-center w-full ${theme.classes.p.sm} hover:bg-gray-100 ${theme.classes.textPrimary} rounded`}>Earnings</a>
                </li>
                <li>
                    <a href="#" className={`inline-flex items-center w-full ${theme.classes.p.sm} hover:bg-gray-100 ${theme.classes.textPrimary} rounded`}>Sign out</a>
                </li>
                </ul>
            </div>
        </div>
        </div>
    );
}

export default MenuGroup;
