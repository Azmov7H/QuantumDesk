import React from 'react'
import Logo from './Logo'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
const Links = [
    { id: 1, title: "Home", href: "/" },
    { id: 2, title: "Features", href: "/features" },
    { id: 3, title: "Pricing", href: "/pricing" },
    { id: 4, title: "Support", href: "/support" },
]

export default function Navbar() {
    return (
        <div className='flex items-center justify-between p-2.5 shadow-accent shadow-sm'>
            <div className="logo">
                <Logo />
            </div>
            {/*Links Desktop*/}
            <div className="links flex items-center gap-4">

                {
                    Links.map((link) => (
                        <Link key={link.id} href={link.href}>
                            {link.title}

                        </Link>
                    ))
                }
                <div className="login">
                    <Button className="bg-[#1A8CE5] text-white" variant={"ghost"}><Link href={'/auth/login'}>Get Started</Link></Button>
                </div>

            </div>

        </div>
    )
}
