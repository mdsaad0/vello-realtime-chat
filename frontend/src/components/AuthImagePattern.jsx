const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 lg:px-10 lg:py-4">
      <div className="max-w-md text-center">
        <div className="grid grid-cols-4 gap-3 mb-4">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`w-26 h-24 gap-x-3 rounded-2xl bg-primary/10 ${
                i % 2 === 0 ? "bg-primary/20" : "bg-primary/10"
              } ${i % 3 === 0 ? "animate-pulse" : ""}`}
            />
          ))}
        </div>
        <h2 className="text-2xl font-bold mb-1">{title}</h2>
        <p className="text-base-content/60">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;