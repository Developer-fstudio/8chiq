import { Breadcrumbs } from "@components/ui/common";
import { EthRates, WalletBar } from "@components/ui/web3";


const LINKS = [{
  href: "/marketplace",
  value: "Buy"
}, {
  href: "/marketplace/memes/owned",
  value: "My Memes"
}, {
  href: "/marketplace/memes/manage",
  value: "Manage Memes"
}]


export default function MarketHeader() {
  return (
    <>
      <WalletBar />
      <EthRates />
      <div className="flex py-4 px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={LINKS} />
      </div>
    </>
  )
}