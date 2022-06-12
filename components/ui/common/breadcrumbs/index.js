import ActiveLink from "../link"

export default function Breadcrumbs({items}) {

    return (
      <nav aria-label="breadcrumb">
        <ol className="flex leading-none text-indigo-600 divide-x divide-indigo-400">
          {/* <li className="pr-4 font-medium text-gray-500 hover:text-gray-900">
            <a href="#">Buy</a>
          </li>
          <li className="px-4 font-medium text-gray-500 hover:text-gray-900">
            <a href="#">My Memes</a>
          </li>
          <li className="px-4 font-medium text-gray-500 hover:text-gray-900">
            <a href="#">Manage Memes</a>
          </li> */}
          { items.map((item, i) =>
           <li
           key={item.href}
           className={`${i == 0 ? "pr-4" : "px-4"} font-medium text-gray-500 hover:text-gray-900`}
           >
            <ActiveLink href={item.href}>
              <a>
                {item.value}
              </a>
            </ActiveLink>
           </li>
          )}
        </ol>
      </nav>
    )
  }