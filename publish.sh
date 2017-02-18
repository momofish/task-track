git checkout master && git push && git checkout develop
REMOTE_SH='export NODE_ENV=production && cd task-track && git pull && cnpm i && pm2 restart all'
ssh working@10.201.76.114 $REMOTE_SH
ssh nginx@10.201.78.208 $REMOTE_SH
