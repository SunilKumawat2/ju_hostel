import React, { useState, useRef, useEffect } from 'react';
import { MdExpandMore, MdExpandLess } from 'react-icons/md';

const ReadMore = ({ text, maxLines }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    const lineHeight = parseInt(window.getComputedStyle(textRef.current).lineHeight, 10);
    const maxHeight = lineHeight * maxLines;
    if (textRef.current.scrollHeight > maxHeight) {
      setIsTruncated(true);
    }
  }, [maxLines]);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <div
        ref={textRef}
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: isExpanded ? 'none' : maxLines,
          overflow: 'hidden',
        }}
      >
        {text}
      </div>
      {isTruncated && (
        <button onClick={toggleReadMore} className="read-more-button btn btn-primary">
          {isExpanded ? <MdExpandLess /> : <MdExpandMore />}
        </button>
      )}
    </div>
  );
};

export default ReadMore;
