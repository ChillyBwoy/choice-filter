const format = (v, f) => f ? f.call(f, v) : v;

function DOMNodeData ($el, fields = [], handleValue = (x) => x) {
  let attrs = fields.reduce((acc, field) => {
    acc[field] = handleValue($el.getAttribute(`data-${field}`), field);
    return acc;
  }, {});

  return {
    attrs: attrs,
    '$': $el
  };
}

export default function (fields, nodes) {
  let nodeList = Array.prototype.slice.call(nodes, 0);

  return nodeList.map($el => {
    return DOMNodeData($el, Object.keys(fields), (v, f) => {
      return format(v, fields[f].formatter);
    });
  });
}
