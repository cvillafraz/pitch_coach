import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
}

const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ text = "Button", className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "group relative w-64 cursor-pointer overflow-hidden rounded-full border border-white bg-transparent px-8 py-3 font-semibold text-white",
        className
      )}
      {...props}
    >
      {/* Contenedor para el estado normal */}
      <div className="relative z-20 flex items-center justify-center transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
        <span>{text}</span>
      </div>

      {/* Contenido del hover que aparece desde la derecha */}
      <div className="absolute inset-0 z-30 flex translate-x-full items-center justify-center gap-3 text-black opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
        <span>{text}</span>
        <ArrowRight className="h-5 w-5" />
      </div>

      {/* Círculo negro que se expande desde la esquina izquierda */}
      <div className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-white transition-all duration-300 group-hover:left-0 group-hover:top-0 group-hover:h-full group-hover:w-full group-hover:translate-y-0 group-hover:scale-150"></div>
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";

export { InteractiveHoverButton };