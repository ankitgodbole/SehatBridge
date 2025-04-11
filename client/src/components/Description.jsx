import { useState } from 'react';

const Description = ({ dark, children }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getLimitedText = (text, wordLimit) =>
    text.split(' ').slice(0, wordLimit).join(' ') + '...';

  const toggleReadMore = () => setIsExpanded(!isExpanded);

  return (
    <div style={{ color: dark ? 'white' : 'black' }}>
      {typeof children === 'string' ? (
        <>
          {isExpanded ? children : getLimitedText(children, 20)}
          <span
            onClick={toggleReadMore}
            style={{ color: 'blue', cursor: 'pointer', marginLeft: 5 }}
          >
            {isExpanded ? 'Read Less' : 'Read More'}
          </span>
        </>
      ) : (
        children
      )}
    </div>
  );
};

export default Description;
