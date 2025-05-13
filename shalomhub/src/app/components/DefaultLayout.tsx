import React from "react"

interface DefaultLayoutProps {
    children: React.ReactNode;
  }

function DefaultLayout(props: DefaultLayoutProps) {
    return (
        <div>
            <div className="content bg-white">{props.children}</div>
        </div>
    )
}

export default DefaultLayout