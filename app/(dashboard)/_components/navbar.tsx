"use client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const Navbar = () => {
    const { data: session } = useSession();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut();
        router.push('/signin');
    }

    return(
        <div className="flex p-4 border-b h-full w-full justify-between  items-center bg-white shadow-sm">
            {/* <MobileSidebar /> */}

            <div className='flex justify-center items-center'>
                {/* <p className='text-white font-semibold'>K</p> */}
            </div>


            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className="bg-isky_orange h-[30px] w-[30px] rounded-full flex items-center justify-center cursor-pointer">
                        <p className="font-bold text-white">{session?.user?.name?.slice(0, 1)}</p>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white shadow-md p-6 space-y-5">
                    <DropdownMenuLabel className="cursor-pointer">My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator className='bg-slate-600' />
                    <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>Log Out</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>


        </div>
    );
}


export default Navbar;


