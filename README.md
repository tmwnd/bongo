# bongo

trading gui for waifu list dumps from bongo discord bot:<br>
<https://top.gg/bot/339926969548275722>

always running web application:<br>
<https://bongo.tmwnd.de>

with beta version:<br>
<https://beta.bongo.tmwnd.de>

---

init cloned repo:
```console
git clone git@github.com:tmwnd/bongo.git
npm init
npm install
```

start express on port 3000 (with nodemon):
```console
npm run watch
```
or (without nodemon):
```console
node .
```

---

uberspace init:
```console
mkdir /var/www/virtual/tmwnd/beta.bongo.tmwnd.de
uberspace web domain add beta.bongo.tmwnd.de
uberspace web backend set bongo.tmwnd.de --http --port 3000

nano ~/etc/service.d/bongo.ini

supervisorctl reread
supervisorctl update
supervisorctl start bongo
```

~/etc/service.d/bongo.ini:
```ini
[program:bongo]
command=/usr/bin/node /var/www/virtual/tmwnd/bongo.tmwnd.de/app.js
```