const options = (name, defaultValues = null) => {
  const options = location.search.substring(1).split('&'),
    values = [],
    n = options.length;

  let i = -1,
    o;
  while (++i < n) {
    if ((o = options[i].split('='))[0] === name) {
      values.push(decodeURIComponent(o[1]));
    }
  }
  return values.length || !defaultValues ? values : defaultValues;
};

const option = (name, defaultValue) => {
  const values = options(name);
  return values.length ? values[0] : defaultValue;
};

export { options, option };
