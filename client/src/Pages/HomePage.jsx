import React, { useContext, useState } from 'react'
import Sidebar from '../Components/Sidebar'
import ChatContainer from '../Components/ChatContainer'
import RightSidebar from '../Components/RightSidebar'
import { ChatContext } from '../../context/ChatContext'

const HomePage = () => {

  const {selectedUser} = useContext(ChatContext);

  return (
    <div className='border w-full h-[100vh] sm:px-[15%] sm:py-[5%]'> {/* bg-[#2c2c54] */}

        <div className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-full grid grid-cols-1 relative 
            ${selectedUser ? 'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]' : 'md:grid-cols-2'}`}>
            <Sidebar />
            <ChatContainer />
            <RightSidebar />
        </div>
      
    </div>
  )
}

export default HomePage
