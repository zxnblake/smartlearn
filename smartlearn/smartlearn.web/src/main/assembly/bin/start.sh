#!/usr/bin/env bash
#userdir
SHDIR=$(cd "$(dirname "$0")"; pwd)
echo current path:$SHDIR

#
PIDFILE="./start.pid"
if [ -f $PIDFILE ]; then
    if kill -0 `cat $PIDFILE` > /dev/null 2>&1; then
        echo server already running as process `cat $PIDFILE`. 
        exit 0
    fi
fi


if [ -z "$JAVA_OPTS" ]; then
    JAVA_OPTS="-server -Xms1g -Xmx1g -Xmn300m"
fi

if [ -z "$JAVA_CMD" ]; then
    JAVA_CMD="java"
fi

# exec 
nohup $JAVA_CMD  $JAVA_OPTS -classpath ../conf/:../lib/* com.tiglabs.graph.studio.startup.GraphStudio > /dev/null 2>&1 &

# wirte pid to file
if [ $? -eq 0 ] 
then
    if /bin/echo -n $! > "$PIDFILE"
    then
        sleep 1
        echo CBGraph Studio : STARTED SUCCESS
    else
        echo FAILED TO WRITE PID
        exit 1
    fi
else
    echo SERVER DID NOT START
    exit 1
fi
