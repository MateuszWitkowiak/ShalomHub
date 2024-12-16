import React from "react"
import Header from "./Header"

interface DefaultLayoutProps {
    children: React.ReactNode;
  }

function DefaultLayout(props: DefaultLayoutProps) {
    return (
        <div>
            <div className="content">{props.children}</div>
        </div>
    )
}

export default DefaultLayout