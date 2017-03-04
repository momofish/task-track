# push to git
git checkout master && git pull && git push

# build
export NODE_ENV=production
gulp build

# publish
REMOTE_SH='cd task-track && git pull && cnpm i && pm2 restart all'

REMOTE=working@10.201.76.114
ssh $REMOTE $REMOTE_SH
scp public/js/*.js $REMOTE:~/task-track/public/js/
scp public/css/*.css $REMOTE:~/task-track/public/css/

REMOTE=nginx@10.201.78.208
ssh $REMOTE $REMOTE_SH
scp public/js/*.js $REMOTE:~/task-track/public/js/
scp public/css/*.css $REMOTE:~/task-track/public/css/

git checkout develop