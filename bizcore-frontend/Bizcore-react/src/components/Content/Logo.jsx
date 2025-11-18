import React from 'react'

const Logo = () => {
    return (
        <div>
            <h1
                style={{
                    fontFamily: '"Lexend", sans-serif',  // Apply Google font
                    fontWeight: 600,                    // Apply bold weight
                    fontOpticalSizing: 'auto',           // Apply optical sizing
                }}
                className="text-white text-3xl"     // Tailwind: Red color and large font size
            >
                BizCore.
            </h1>
        </div>
    )
}

export default Logo
