module.exports = {
  name: 'stats',
  description: 'get server bus listeners',
  args: [],
  handler: async (req, res, { bus }) => {
    await res.systemMessage(
      Object.entries(bus.getListeners())
        .map(([event, count]) => ({ line: [{ bold: { text: `${event}: ` } }, { text: `${count}` }] })),
    );
    res.ok({});
  },
};
