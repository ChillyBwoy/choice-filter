export default function (data, delimiter = ';') {
  let rows = data.map(row => {
    let colls = Object.keys(row).map(key => row.attrs[key]);
    return colls.join(delimiter);
  });
  return rows.join('\n');
}
