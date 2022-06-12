import { Web3Provider } from "@components/provider";
import { Navbar } from "@components/ui/common";


export default function BaseLayout({children}) {
    return (
        <Web3Provider>
            <Navbar/>
            {children}
        </Web3Provider>
    )
}