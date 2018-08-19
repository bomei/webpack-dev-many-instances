'use strict';

module.exports = function reporter(middlewareOptions, options) {
  var log = options.log,
      state = options.state,
      stats = options.stats;


  if (state) {
    var displayStats = middlewareOptions.stats !== false;

    if (displayStats) {
      if (stats.hasErrors()) {
        log.error(stats.toString(middlewareOptions.stats));
      } else if (stats.hasWarnings()) {
        log.warn(stats.toString(middlewareOptions.stats));
      } else {
        log.info(stats.toString(middlewareOptions.stats));
      }
    }

    var message = 'Compiled successfully.';

    if (stats.hasErrors()) {
      message = 'Failed to compile.';
    } else if (stats.hasWarnings()) {
      message = 'Compiled with warnings.';
    }
    log.info(message);
  } else {
    log.info('Compiling...');
  }
};