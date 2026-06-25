const Skeleton = ({ rows = 5, cols = 4 }) => {
    return (
      <div className="space-y-4 animate-pulse">
        {[...Array(rows)].map((_, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(cols)].map((_, colIndex) => (
              <div key={colIndex} className="h-4 bg-gray-300 rounded"></div>
            ))}
          </div>
        ))}
      </div>
    );
  };
  
  export default Skeleton;
  