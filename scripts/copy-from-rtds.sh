#!/bin/sh

#  Created on Mon Jul 04 2025
#
#  Copyright (c) 2025 Smart DCC Limited
#
#  This program is free software: you can redistribute it and/or modify
#  it under the terms of the GNU General Public License as published by
#  the Free Software Foundation, either version 3 of the License, or
#  (at your option) any later version.
#
#  This program is distributed in the hope that it will be useful,
#  but WITHOUT ANY WARRANTY; without even the implied warranty of
#  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#  GNU General Public License for more details.
#
#  You should have received a copy of the GNU General Public License
#  along with this program.  If not, see <http://www.gnu.org/licenses/>.

set -e

if test "$#" -ne "2" -o ! -d "${1}" -o ! -d "${2}"; then
  echo "usage: ${0} RTDS_DIRECTORY DEST_DIR" 2>&1
  exit 1
fi

RTDS="${1}"
DEST="${2}"

rm -v "${DEST}"/*.XML

C=0
for f in $(find "${RTDS}" -name \*_REQUEST_DUIS.XML -type f -not -path "*/CV5/*" -not -path "*/CV6/*" -not -path "*/CV7/*" -not -path "*/CV3/*" -not -iname "*_ERROR_*" -not -iname "*_NOT_FOUND_*"); do
  BN="$(basename "$f")"
  cp -v $f ${DEST}/${BN}
  C=$(($C + 1))
done

echo "[*] copied ${C} files"
