module.exports = {
  apps: [
    {
      name: 'mdt',
      script: 'yarn start-windows',
      // this will kill the server for a few seconds while it builds, look into a softer refresh alter
      // watch: ['.next'],
      // Delay between restart
      // watch_delay: 1000,
      // ignore_watch: ['node_modules'],
    },
  ],
};
