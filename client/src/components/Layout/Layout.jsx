import React from 'react'
import HeaderComponents from './HeaderComponents'
import FooterComponents from './FooterComponents'


const LayoutComponents = ({children}) => {
  return (
    <>
      <HeaderComponents />
      <main className=" bg-[#111] min-h-screen ">
      {children}</main>
      <FooterComponents />
    </>
  )
}

export default LayoutComponents
