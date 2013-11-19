/*
  Language: terminal console
  Author: Josh Bode <joshbode@gmail.com>
*/

hljs.LANGUAGES.terminal = {
  contains: [
    {
      className: 'string',
      //begin: '^([\\w.]+)@([\\w.]+)'
		begin: '^\\$'
    },
    {
      className: 'constant',
      begin: ' (.*) \\$ '
    },
    {
      className: 'ansi',
      begin: '<span style\\="([^"]+)">',
      end: '<\\/span>'
    }
  ]
};