


export default function List({memes, children}) {
    return (
      <section className="grid p-10 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-5 max-w-3xl mx-auto">
        { memes.map(meme => children(meme))}
      </section>
    )
  }