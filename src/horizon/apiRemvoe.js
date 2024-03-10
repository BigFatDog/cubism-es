const apiRemove = (context) => ({
  remove: (selection) => {
    selection.on('mousemove.horizon', null).on('mouseout.horizon', null);

    const remove = (d) => {
      d.metric.on('change.horizon-' + d.id, null);
      context.on('change.horizon-' + d.id, null);
      context.on('focus.horizon-' + d.id, null);
    };

    selection.selectAll('canvas').each(remove).remove();

    selection.selectAll('._title,.value').remove();
  },
});

export default apiRemove;
