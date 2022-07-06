


export default function CommentList({comments, children}) {
    return (
      <section className="content-start grid p-10 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-5 max-w-4xl mx-auto">
        { comments.map(comment => children(comment))}
      </section>
    )
  }