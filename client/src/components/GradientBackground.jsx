export function GradientBackground({ 
  theme = "dark", 
  backgroundImage,
  backgroundSize = "contain",
  backgroundPosition = "center",
  children,
  className = ""
}) {
  const isDark = theme === "dark";
  const useBackgroundImage = Boolean(backgroundImage);

  return (
    <div 
      className={`${isDark ? "dark" : ""} h-screen w-full overflow-hidden ${className}`}
      style={{ 
        backgroundColor: isDark ? "#0a0a1a" : "#f8f9fa",
        ...(useBackgroundImage ? {
          backgroundImage: `url('${backgroundImage}')`,
          backgroundSize,
          backgroundPosition,
          backgroundRepeat: "no-repeat"
        } : {})
      }}
    >
      {/* Background Gradient Effects - Only show if no background image */}
      {!useBackgroundImage && (
        <div className="absolute inset-0 overflow-hidden">
          {isDark ? (
            <>
              <div className="absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/30 blur-3xl" />
              <div className="absolute right-1/4 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-purple-600/20 blur-3xl" />
              <div className="absolute left-1/3 bottom-1/4 h-72 w-72 rounded-full bg-pink-600/20 blur-3xl" />
            </>
          ) : (
            <>
              <div className="absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-400/20 blur-3xl" />
              <div className="absolute right-1/4 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-purple-400/15 blur-3xl" />
              <div className="absolute left-1/3 bottom-1/4 h-72 w-72 rounded-full bg-pink-400/15 blur-3xl" />
            </>
          )}
        </div>
      )}
      
      {/* Content */}
      {children && (
        <div className="relative z-10 h-full w-full">
          {children}
        </div>
      )}
    </div>
  );
}
