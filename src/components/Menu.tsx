import React, { useState } from 'react'
import * as Icons from "@heroicons/react/24/solid";
import { useAuthenticationActions } from '@/hooks/useAuthenticationActions';
import { useRouter } from 'next/navigation';

export default function menu() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { signOut } = useAuthenticationActions();
  const router = useRouter()

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    signOut();
  };

  const goToLanding = () => {
    router.replace("/landing")
  }
  const goToHisotry = () => {
    router.replace("/history")
  }
  
  return (
    <div className='bg-[#0D1117] p-5 shadow border-b-1 border-[#6B7280] justify-between flex'>
      <div className="flex items-center gap-2 cursor-pointer" onClick={goToLanding}>
        <Icons.DocumentTextIcon className="h-7 w-7 text-[#D1D5DB]"/>
        <h1 className="text-xl font-bold text-[#D1D5DB]">PDFLearn</h1>
      </div>

      <div className='flex gap-6'>
        <h1 className="text-xl font-bold text-[#D1D5DB] cursor-pointer" onClick={goToHisotry}>History</h1>
        
        <div className="relative">
          <div onClick={toggleDropdown} className="cursor-pointer">
            {isDropdownOpen ? (
              <Icons.XMarkIcon className="h-7 w-7 text-[#D1D5DB]"/>
            ) : (
              <Icons.Bars3Icon className="h-7 w-7 text-[#D1D5DB]"/>
            )}
          </div>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-[#D1D5DB] rounded-lg shadow-lg z-10">
              <div className="py-2">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-[#0D1117] flex items-center gap-2 cursor-pointer"
                >
                  <Icons.ArrowLeftStartOnRectangleIcon className="h-5 w-5"/>
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
