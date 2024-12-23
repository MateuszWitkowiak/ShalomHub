import React from "react"

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