// MEMBER 2: OS command injection / in-band output.
const { Router } = require('express');
const { exec, execFile } = require('node:child_process');
const { isIP } = require('node:net');

module.exports = function networkModule(config) {
  const router = Router();
  router.get('/', (req, res) => res.render('network', { host: '127.0.0.1', output: null, error: null }));
  router.post('/', (req, res) => {
    const host = String(req.body.host || '').trim().slice(0, 200);
    if (!host || (config.commandInjection && !isIP(host))) {
      return res.status(400).render('network', { host, output: null, error: 'Enter a valid IPv4 or IPv6 address. Extra command text is not accepted.' });
    }
    const windows = process.platform === 'win32';
    const args = windows ? ['-n', '1', '-w', '1000', host] : ['-c', '1', '-W', '1', host];
    const done = (error, stdout, stderr) => {
      res.render('network', {
        host, output: `${stdout || ''}${stderr || ''}` || '(No output returned.)',
        error: error ? 'The network check did not finish successfully. Check the output below.' : null,
      });
    };
    const options = { timeout: 5000, maxBuffer: 32 * 1024, windowsHide: true };
    if (config.commandInjection) {
      // FIX: no shell interprets the input; IP validation also rejects options.
      execFile('ping', args, options, done);
    } else {
      // VULNERABILITY: the shell can interpret separators supplied in host.
      exec(`ping ${windows ? '-n 1 -w 1000' : '-c 1 -W 1'} ${host}`, options, done);
    }
  });
  return router;
};
