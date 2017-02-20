git checkout master && git pull && git push && git checkout develop
REMOTE_SH='export NODE_ENV=production && pm2 stop all && cd task-track && git pull && cnpm i && pm2 start all'
ssh working@10.201.76.114 $REMOTE_SH
ssh nginx@10.201.78.208 $REMOTE_SH
