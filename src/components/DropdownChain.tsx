import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react' 
import { IoChevronDownCircleOutline } from 'react-icons/io5'

export default function DropdownChain({ supportedChains, setChainId, chainId }: { supportedChains: any, setChainId: any, chainId: any }) {
  return (
    <Menu as="div" className="relative w-full flex justify-between">
      <div>
        <MenuButton className="flex max-w-xs  w-full cursor-pointer justify-between  rounded-md bg-gray-900 px-3 py-2 text-sm text-green-500 ring-1 shadow-xs ring-green-500 ring-inset hover:bg-gray-700">
        <span className='text-green-500'>{chainId ? chainId.name : 'Select Chain'}</span>
          <IoChevronDownCircleOutline aria-hidden="true" className="-mr-1 size-5 text-green-500" />
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-10 top-10  border border-green-500 w-full origin-top-right rounded-md bg-gray-900 ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
        style={{ maxHeight: '200px', overflowY: 'auto' }}
      >
        <div className="py-1">
            {supportedChains.map((chain: any) => (
                <MenuItem key={chain.id}>
                    <button 
                        onClick={() => setChainId({id: chain.id, name: chain.name})}
                        className="w-full cursor-pointer block px-4 py-2 text-sm text-green-500 data-focus:bg-gray-700 data-focus:text-green-300 data-focus:outline-hidden"
                    >
                        {chain.name}
                    </button>
                </MenuItem>
            ))}
        </div>
      </MenuItems>
    </Menu>
  )
}
