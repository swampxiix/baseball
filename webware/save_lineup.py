from WebKit.HTTPContent import HTTPContent

import json

class save_lineup (HTTPContent):

    def defaultAction(self):
        wr = self.writeln
        qs = self.request().fields()
        dict = qs.get('stuff')
        pyobj = json.loads(dict)
        filename = save_lineup_html(pyobj)
        r = self.response()
        r.setHeader('Content-type', 'text/plain')
        self.write(json.dumps({'filename': filename}))

import time, os.path

DIR = '/var/www/html/baseball/'

def save_lineup_html (qs):
    today = time.localtime(time.time())
    m, d, y = str(today.tm_mon), str(today.tm_mday), str(today.tm_year)
    htmltxt = '''
<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<link rel="stylesheet" type="text/css" href="lineup.css">
<script src="jquery-3.1.0.min.js"></script>
<script src="static.js"></script>
</head><body>
<h1>Mudcats Lineup for %s</h1>
<div id="batting" class="in"><p><h2>Batting</h2>@@bat@@</p></div>
<div id="in1" class="in"><p><h2 class="h2" id="1">Inning 1</h2><div id="i1">@@in1@@</div></p></div>
<div id="in2" class="in"><p><h2 class="h2" id="2">Inning 2</h2><div id="i2">@@in2@@</div></p></div>
<div id="in3" class="in"><p><h2 class="h2" id="3">Inning 3</h2><div id="i3">@@in3@@</div></p></div>
<div id="in4" class="in"><p><h2 class="h2" id="4">Inning 4</h2><div id="i4">@@in4@@</div></p></div>
<div id="in5" class="in"><p><h2 class="h2" id="5">Inning 5</h2><div id="i5">@@in5@@</div></p></div>
<div id="in6" class="in"><p><h2 class="h2" id="6">Inning 6</h2><div id="i6">@@in6@@</div></p></div>
</body></html>
    ''' % ('%s-%s-%s' % (m, d, y))
    bat = qs.get('batting', [])
    battxt = ''
    for player in bat:
        battxt += '<label for="%s"><input type="radio" name="next" id="%s"> %s</label><br>' % (player, player, player)
    htmltxt = htmltxt.replace('@@bat@@', battxt)
    posns = ['P', 'C', '1B', '2B', 'SS', '3B', 'RF', 'CF', 'LF', 'RCF', 'LCF', 'OF']
    for i in range(1, 7):
        qskey = 'inning' + str(i)
        replacekey = '@@in%s@@' % (str(i))
        inningdict = qs.get(qskey, {})
        inningtxt = ''
        for posn in posns:
            if inningdict.has_key(posn):
                inningtxt += posn + ': ' + inningdict.get(posn, '') + '<br>'
        htmltxt = htmltxt.replace(replacekey, inningtxt)

    filename = '%s-%s-%s.html' % (y, m, d)
    filepath = os.path.join(DIR, filename)
    file = open(filepath, 'w')
    file.write(htmltxt)
    file.close()
    return filename
