type CarouselDotsProps = {
  activeIndex: number;
  onDotClick: (index: number) => void;
  totalSlides: number;
};

export const CarouselDots = ({
  activeIndex,
  onDotClick,
  totalSlides,
}: CarouselDotsProps) => {
  return (
    <div className="flex mt-4">
      <div className="flex gap-2 bg-gray-700 p-2 rounded-full">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <span
            key={index}
            className={`w-3 h-3 rounded-full cursor-pointer block ${
              activeIndex === index ? "bg-blue-500" : "bg-gray-200"
            }`}
            onClick={() => onDotClick(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};
