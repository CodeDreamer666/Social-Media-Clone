import Link from "next/link"
import type { JSX } from "react"

export default function NavigationLink({
    path,
    icon,
    displayText,
    isMobile
}: {
    path: string,
    icon: JSX.Element,
    displayText: string,
    isMobile: boolean
}) {
    const desktopNavigationLinkStyle = `
        cursor-pointer text-md font-medium flex gap-1 
        items-center justify-center text-neutral-400 
        hover:text-white hover:border-b hover:pb-1 transition-all duration-200
    `

    const mobileNavigationLinkStyle = `
        flex items-center justify-center gap-2 rounded-xl 
        bg-sky-500 px-4 py-2 font-medium text-white transition-colors 
        duration-200 hover:bg-sky-400
    `

    return (
        <Link
            href={path}
            className={isMobile ? mobileNavigationLinkStyle : desktopNavigationLinkStyle}
        >
            {icon}
            {displayText}
        </Link>
    )
}