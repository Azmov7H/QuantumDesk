import React from 'react'
import "./globals.css"
export default function home({children}) {
  return (
    <html>
        <body>
            <div>{children}</div>
        </body>
    </html>
  )
}
