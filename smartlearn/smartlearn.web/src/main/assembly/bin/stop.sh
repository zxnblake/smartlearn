#!/usr/bin/env bash
PIDFILE="./start$1.pid"
echo $PIDFILE
if [ ! -f "$PIDFILE" ]
then
    echo "no service to stop (could not find file $PIDFILE)"
else
    kill $(cat "$PIDFILE")
    rm -f "$PIDFILE"
    echo STOPPED
fi
exit 0
