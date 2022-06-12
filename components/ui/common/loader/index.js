export default function Loader({size = "md"}) {

    const SIZES = {
        sm: "w-6 h-6",
        md: "w-8 h-8",
        lg: "w-12 h-12"
      }

    return (
      <div className={`sk-chase ${SIZES[size]} bg-color-purple-500`}>
        { Array.from({length: 12}).map((_, i) =>
          <div
            key={`dot-${i}`}
            className={`sk-chase-dot`}
          />
        )}
      </div>
    )
  }

