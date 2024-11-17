import log from 'loglevel';
import prefix from 'loglevel-plugin-prefix';

// Register and apply the prefix plugin
prefix.reg(log);
prefix.apply(log, {
  template: "%t %l %n", // Timestamp, Level, Message
  timestampFormatter: (date) => date.toLocaleTimeString(),
});

const isDevelopment: boolean = process.env.NODE_ENV !== 'production';

if (isDevelopment) {
  log.setLevel('debug');
} else {
  log.setLevel('warn');
}

export default log;