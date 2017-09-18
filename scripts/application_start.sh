#!/bin/bash

supervisorctl start surveygizmo-dashboard

# restart nginx, needed on frist deploy
sudo service nginx restart
