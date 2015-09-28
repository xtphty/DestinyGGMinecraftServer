@echo off

java -Xdebug -Xnoagent -Djava.compiler=NONE -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005 -Xms2g -Xmx4g -XX:MaxPermSize=128M -jar spigot-1.8.8.jar
pause