import Link from "next/link"
import { useRouter } from "next/router"
import React from "react"

export default function ActiveLinkNav({children, activeLinkClass, ...props}) {

  const { pathname } = useRouter()
  let className = children.props.className || ""

  if (pathname === "/" && pathname === props.href) {

    className = `${className} ${activeLinkClass ? activeLinkClass : "py-4 border-white border-b-4 text-white font-semibold transition duration-300"}`

  } else if (pathname.includes(props.href) && props.href !=="/") {

    className = `${className} ${activeLinkClass ? activeLinkClass : "py-4 border-white border-b-4 text-white font-semibold transition duration-300"}`

  }

  return (
    <Link {...props}>
      {
        React.cloneElement(children, {className})
      }
    </Link>
  )
}