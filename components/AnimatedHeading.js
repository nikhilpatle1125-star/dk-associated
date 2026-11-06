// Words rise into place one after another. Screen readers get the plain text.
export default function AnimatedHeading({ text, as: Tag = 'h1', className = '', baseDelay = 0 }) {
  const words = String(text || '').split(' ');
  return (
    <Tag className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden="true" className="inline-block overflow-hidden align-bottom pb-1">
          <span className="inline-block word-rise" style={{ animationDelay: `${baseDelay + i * 90}ms` }}>
            {w}&nbsp;
          </span>
        </span>
      ))}
    </Tag>
  );
}
