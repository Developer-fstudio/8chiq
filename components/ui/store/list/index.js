

export default function StoreList({memes, children}) {
    return (
      <section className="grid px-8 pt-2 pb-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-w-7xl mx-auto">
        { memes.map(meme => 
            children(meme)
        )}

      </section>
    )
  }