// Components And Hooks
import Image from 'next/image'
import { useSession, signOut } from "next-auth/react"
import { Menu, Transition } from '@headlessui/react'
import { Fragment} from 'react'

const MenuComponent = () => {
    const  {data: session} = useSession();

    return (
        <>
            <div className="flex justify-center items-center text-right sm:p-0">
                <Menu as='div' className='relative inline-block text-left'>
                    <div>
                        <Menu.Button className='flex justify-center items-center rounded-full overflow-hidden'>
                            <Image 
                                src={session.user.image}
                                alt={`${session.user.name} | Dust Ecosystem`}
                                width={40}
                                height={40}
                            />
                        </Menu.Button>
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
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
        </>
    )
}

export default MenuComponent;