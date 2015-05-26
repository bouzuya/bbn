var Fs = require('fs');
var Path = require('path');
var Commander = require('commander-b');
var Moment = require('moment');

var getWeekendTemplate = function(m, options) {
  var posts = [1, 2, 3, 4, 5, 6, 7].map(function(i) {
    return { date: Moment(m).subtract(i, 'days').format('YYYY-MM-DD') };
  }).map(function(post) {
    var directory = options.directory;
    var file = post.date + '-diary.markdown';
    var path = Path.join(directory, 'src/_posts', file);
    var data = Fs.readFileSync(path, { encoding: 'utf8' });
    post.title = data.match(/^title: (.*)$/m)[1];
    return post;
  });
  return [
    // '- [yyyy-mm-dd title][yyyy-mm-dd]'
    posts.map(function(post) {
      return '- [' + post.date + ' ' + post.title + '][' + post.date + ']';
    }).join('\n'),
    '',
    // '[yyyy-mm-dd]: http://blog.bouzuya.net/yyyy/mm/dd/'
    posts.map(function(post) {
      var baseUrl = 'http://blog.bouzuya.net';
      var url = baseUrl + '/' + post.date.replace(/-/g, '/') + '/';
      return '[' + post.date + ']: ' + url;
    }).join('\n')
  ].join('\n');
};

var getTemplate = function(m, options) {
  var time = m.format();
  return [
    '---',
    'layout: post',
    'pubdate: "' + time + '"',
    'title: ',
    'tags: []',
    'minutes: ',
    'pagetype: posts',
    '---',
    '',
    (options.weekend ? getWeekendTemplate(m, options) : '')
  ].join('\n');
};

var program = Commander('bbn').version(require('../package.json').version);
// new command
program
.command('new', 'create a new post')
.option('-d, --date <date>')
.option('-w, --weekend')
.action(function(options) {
  options = options || {};

  var config = {};
  var configFile = Path.join(process.env.HOME, '.bbn.json');
  if (Fs.existsSync(configFile)) {
    config = require(configFile);
  }
  options.directory = config.directory || '/home/bouzuya/blog.bouzuya.net';

  var timeString = options.date ? options.date + 'T23:59:59+09:00' : null;
  var m = timeString ? Moment(timeString, 'YYYY-MM-DDThh:mm:ssZ') : Moment();
  var date = m.format('YYYY-MM-DD');
  var template = getTemplate(m, options);
  var directory = options.directory;
  var file = date + '-diary.markdown';
  var path = Path.join(directory, 'src/_posts', file);
  if (!Fs.existsSync(path)) {
    Fs.writeFileSync(path, template, { encoding: 'utf8' });
    console.log('create a new post ' + file);
    return 0;
  } else {
    console.error('the post ' + file + ' already exists');
    return 1;
  }
});
program.execute();