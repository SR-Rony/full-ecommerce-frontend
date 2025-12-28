// MarkdownPreview.js
import React from 'react';
import ReactMarkdown from 'react-markdown';

const MarkdownPreview = ({ content }) => {
  return (
    <div >
      <ReactMarkdown>{content||""}</ReactMarkdown>
    </div>
  );
};

export default MarkdownPreview;