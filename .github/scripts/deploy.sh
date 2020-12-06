#! /bin/bash

set -eux

git config git-ftp.url ${FTP_URL}
git config git-ftp.user ${FTP_USER}
git config git-ftp.password ${FTP_PASSWORD}
git config git-ftp.syncroot .

git ftp catchup
git ftp push -a