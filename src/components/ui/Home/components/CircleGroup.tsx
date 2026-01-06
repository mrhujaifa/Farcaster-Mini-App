export default function CircleGroup({ totalCount }: { totalCount: any }) {
  const displayCount = totalCount > 3 ? totalCount - 3 : 0;

  return (
    <div className="flex -space-x-1.5">
      {Array(3)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className="w-6 h-6 rounded-full border-2 border-[#05080f] bg-gradient-to-tr from-gray-700 to-gray-900"
          />
        ))}
      {displayCount > 0 && (
        <div className="w-6 h-6 rounded-full border-2 border-[#05080f] bg-blue-600 flex items-center justify-center text-[8px] font-bold text-white">
          +{displayCount}
        </div>
      )}
    </div>
  );
}
