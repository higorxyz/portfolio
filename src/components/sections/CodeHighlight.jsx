// Realce de sintaxe minimalista pra blocos tipo "const x = {...}" mostrados
// como texto (não vem de um parser real, é regex por linha — o bastante
// pra dar contraste visual sem puxar uma lib de highlight só pra isso).
// Retorna um array de <span> com token, nunca HTML bruto.
const TOKEN_PATTERNS = [
  { type: 'string', regex: /"[^"]*"/g },
  { type: 'key', regex: /^(\s*)([a-zA-Z0-9_]+)(:)/ },
];

let keyCounter = 0;

const highlightLine = (line) => {
  const nodes = [];
  const keyMatch = line.match(TOKEN_PATTERNS[1].regex);
  let rest = line;
  let prefix = '';

  if (keyMatch) {
    prefix = keyMatch[1];
    nodes.push(
      <span key={`k-${keyCounter++}`} className="text-accent-trace-text">
        {keyMatch[2]}
      </span>
    );
    nodes.push(<span key={`c-${keyCounter++}`} className="text-text-secondary">:</span>);
    rest = line.slice(keyMatch[0].length);
  }

  const stringRegex = /"[^"]*"/g;
  let lastIndex = 0;
  let match;
  const restNodes = [];
  while ((match = stringRegex.exec(rest)) !== null) {
    if (match.index > lastIndex) {
      restNodes.push(
        <span key={`t-${keyCounter++}`} className="text-text-secondary">
          {rest.slice(lastIndex, match.index)}
        </span>
      );
    }
    restNodes.push(
      <span key={`s-${keyCounter++}`} className="text-accent-signal-text">
        {match[0]}
      </span>
    );
    lastIndex = stringRegex.lastIndex;
  }
  if (lastIndex < rest.length) {
    restNodes.push(
      <span key={`t-${keyCounter++}`} className="text-text-secondary">
        {rest.slice(lastIndex)}
      </span>
    );
  }

  return (
    <>
      {prefix}
      {nodes}
      {restNodes}
    </>
  );
};

export const CodeHighlight = ({ code }) => (
  <>
    {code.split('\n').map((line, index) => (
      <div key={index}>{line.trim() === '' ? '\u00A0' : highlightLine(line)}</div>
    ))}
  </>
);
