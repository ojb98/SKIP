import { useRef } from "react";

const CustomAccordion = ({ title, children, isOpen, onClick }) => {
  const contentRef = useRef(null);
  const maxHeight = isOpen ? `${contentRef.current?.scrollHeight}px` : "0px";

  return (
    <div className="custom-accordion">
      <div className="custom-accordion-header" onClick={onClick}>
        <span>{title}</span>
        <span className="arrow">{isOpen ? "▲" : "▼"}</span>
      </div>
      <div
        ref={contentRef}
        className="custom-accordion-body"
        style={{ maxHeight }}
      >
        {children}
      </div>
    </div>
  );
};

export default CustomAccordion;
