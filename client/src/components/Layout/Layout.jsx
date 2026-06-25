import React from 'react'
import HeaderComponents from './HeaderComponents'
import FooterComponents from './FooterComponents'

const LayoutComponents = ({ children }) => {
  return (
    <>
      <HeaderComponents />
      <main className="relative bg-black min-h-screen overflow-hidden">
        {/* Grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(34,211,238,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.07) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Ambient glow accents */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Content */}
        <div className="relative z-10">{children}</div>
      </main>
      <FooterComponents />
    </>
  )
}

export default LayoutComponents