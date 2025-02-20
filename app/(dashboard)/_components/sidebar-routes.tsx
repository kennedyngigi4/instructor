"use client"

import { Award, Compass, GraduationCap, Layout, LibraryBig, MessageCircleCode, MessageCircleMore, MessagesSquare, TvMinimalPlay, UserRoundPen } from 'lucide-react'
import React from 'react'
import SidebarItem from './sidebar-item'

const guestRoutes = [
    {
        icon: Layout,
        label: "Dashboard",
        href: "/",
    },
    {
        icon: LibraryBig,
        label: "Courses",
        href: "/courses",
    },
    {
        icon: GraduationCap,
        label: "Students",
        href: "/students",
    },
    {
        icon: TvMinimalPlay,
        label: "Meetings",
        href: "/meetings",
    },
    // {
    //     icon: MessageCircleMore,
    //     label: "Messages",
    //     href: "/messages",
    // },
    {
        icon: Award,
        label: "Awards",
        href: "/awards",
    },
    {
        icon: MessagesSquare,
        label: "Reviews",
        href: "/reviews",
    }
]

const SidebarRoutes = () => {
    const routes = guestRoutes;

    return (
        <div className="flex flex-col w-full">
            {routes.map((route) => (
                <SidebarItem
                    key={route.href}
                    icon={route.icon}
                    label={route.label}
                    href={route.href}
                />
            ))}
        </div>
    )
}

export default SidebarRoutes