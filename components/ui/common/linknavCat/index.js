import Link from "next/link"
import { useRouter } from "next/router"
import React from "react"

export default function ActiveLinkNavCat({children, activeLinkClass, ...props}) {

  const { asPath } = useRouter()
  let className = children.props.className || ""
  let classNameEnclosure = "p-2 lg:text-base text-sm text-purple-500 font-semibold hover:text-purple transition duration-300 bg-white-500 rounded-xl mx-2 border-purple-500 border-2"

  console.log("ActiveLinkNavCat pathname")
  console.log(asPath)

  if (asPath === "/" && asPath === props.href) {

    className = `${className} ${activeLinkClass ? activeLinkClass : "py-4 border-white border-b-4 text-white font-semibold transition duration-300"}`
    classNameEnclosure = "p-2 lg:text-base text-sm text-gray-200 font-semibold hover:text-white transition duration-300 bg-purple-500 rounded-xl mx-2"

  } else if (asPath.includes(props.href) && props.href !=="/") {

    className = `${className} ${activeLinkClass ? activeLinkClass : "py-4 border-white border-b-4 text-white font-semibold transition duration-300"}`
    classNameEnclosure = "p-2 lg:text-base text-sm text-gray-200 font-semibold hover:text-white transition duration-300 bg-purple-500 rounded-xl mx-2"

  }

  return (
    <div className={classNameEnclosure}>
        <Link {...props}>
        {
            React.cloneElement(children, {className})
        }
        </Link>
    </div>

  )
}