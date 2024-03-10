const apiRemove = (state) => ({
  remove: (selection) => {
    const { context } = state;
    const _remove = (d) => {
      d.primary.on('change.comparison-' + d.id, null);
      d.secondary.on('change.comparison-' + d.id, null);
      context.on('change.comparison-' + d.id, null);
      context.on('focus.comparison-' + d.id, null);
    };

    selection.on('mousemove.comparison', null).on('mouseout.comparison', null);
    selection.selectAll('canvas').each(_remove).remove();

    selection.selectAll('.title,.value').remove();
  },
});

export default apiRemove;
