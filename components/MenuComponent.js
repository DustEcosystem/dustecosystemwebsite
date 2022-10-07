// Components And Hooks
import Image from 'next/image'
import { useSession, signOut, signIn } from "next-auth/react"
import { Menu, Transition } from '@headlessui/react'
import { Fragment} from 'react'
import { UserCircleIcon } from "@heroicons/react/24/solid"

const MenuComponent = () => {
    const  {data: session} = useSession();

    return (
        <>
            <div className="flex justify-center items-center text-right sm:p-0">
                <Menu as='div' className='relative inline-block text-left'>
                    <div>
                        {session ? (
                            <Menu.Button className='flex justify-center items-center rounded-full overflow-hidden'>
                                <Image 
                                    src={session.user.image}
                                    alt={`${session.user.name} | Dust Ecosystem`}
                                    width={40}
                                    height={40}
                                />
                            </Menu.Button>
                        ):(
                            <Menu.Button className='flex justify-center items-center rounded-full overflow-hidden'>
                                <UserCircleIcon className="w-11 h-11" />
                            </Menu.Button>
                        )}
                    </div>
                    <Transition
                        as={Fragment}
                        enter='transition ease-out duration-100'
                        enterFrom='transform opacity-0 scale-95'
                        enterTo='transform opacity-100 scale-100'
                        leave='transition ease-in duration-75'
                        leaveFrom='transform opacity-100 scale-100'
                        leaveTo='transform opacity-0 scale-95'
                    >
                        <Menu.Items className='origin-top-right absolute right-0 mt-4 w-40 rounded-md bg-[#242424] text-white focus:outline-none z-10 px-7 py-6 text-base'>
                            {session ? (
                                <Menu.Item>
                                    {({ active }) => (
                                        <div className="flex justify-center">
                                            <button
                                                className="text-base md:text-lg hover:text-[#90B578]"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    signOut({redirect: false})
                                                }}
                                            >
                                                Sign Out
                                            </button>
                                        </div>
                                    
                                    )}
                                </Menu.Item>
                            ):(
                                <Menu.Item>
                                    {({ active }) => (
                                        <div className="flex justify-center">
                                            <button
                                                className="text-base md:text-lg hover:text-[#90B578]"
                                                onClick={() => window.open(`${window.location.origin}/auth/signin`,"popup", "width=350, height=350, left=600,top=250")}
                                            >
                                                Sign In
                                            </button>
                                        </div>
                                    
                                    )}
                                </Menu.Item>
                            )}
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
        </>
    )
}

export default MenuComponent;